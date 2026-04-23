import status from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import { prisma } from '../../lib/prisma.js';
import { createNotification } from '../notification/notification.service.js';
import { getDefaultAuditData, getDefaultNotesData, performRollover } from './rollover.js';

export const getFinancialYears = async (companyId: string, userId: string, role: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId, isDeleted: false } });
  if (!company) throw new AppError(status.NOT_FOUND, 'Company not found');

  return prisma.financialYear.findMany({
    where: { companyId, isDeleted: false },
    select: {
      id: true, year: true, reportingDate: true, startDate: true,
      reviewStatus: true, isLocked: true, createdByUserId: true,
      currentReviewerUserId: true, finalizedByUserId: true,
      finalizedAt: true, submittedAt: true, lastEditedByUserId: true,
      createdAt: true, updatedAt: true,
      assignments: { select: { userId: true } },
      reviewEvents: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
    orderBy: { year: 'asc' },
  });
};

export const createFinancialYear = async (
  companyId: string,
  reportingDate: string,
  userId: string,
) => {
  const company = await prisma.company.findUnique({ where: { id: companyId, isDeleted: false } });
  if (!company) throw new AppError(status.NOT_FOUND, 'Company not found');

  const reportingDateObj = new Date(reportingDate);
  if (isNaN(reportingDateObj.getTime())) throw new AppError(status.BAD_REQUEST, 'Invalid reporting date');

  const yearNumber = reportingDateObj.getFullYear();

  const existing = await prisma.financialYear.findFirst({
    where: { companyId, year: yearNumber, isDeleted: false },
  });
  if (existing) throw new AppError(status.CONFLICT, `Financial year ${yearNumber} already exists for this company`);

  // Get previous year for rollover
  const prevYear = await prisma.financialYear.findFirst({
    where: { companyId, isDeleted: false },
    orderBy: { year: 'desc' },
    include: { auditData: true, notesData: true },
  });

  let auditDataPayload: object;
  let notesDataPayload: object;

  if (prevYear && prevYear.auditData && prevYear.notesData) {
    const rolled = performRollover(
      prevYear.auditData.data as Parameters<typeof performRollover>[0],
      prevYear.notesData.data as Parameters<typeof performRollover>[1],
      reportingDate,
      prevYear.reportingDate,
    );
    auditDataPayload = rolled.auditData;
    notesDataPayload = rolled.notesData;
  } else {
    auditDataPayload = getDefaultAuditData(reportingDate, '', company.name, '');
    notesDataPayload = getDefaultNotesData(reportingDate, company.name, '');
  }

  const newYear = await prisma.financialYear.create({
    data: {
      companyId,
      year: yearNumber,
      reportingDate,
      startDate: prevYear ? prevYear.reportingDate : '',
      reviewStatus: 'DRAFT',
      isLocked: false,
      createdByUserId: userId,
      assignments: { create: { userId } },
      auditData: { create: { data: auditDataPayload } },
      notesData: { create: { data: notesDataPayload } },
      reviewEvents: {
        create: {
          actorUserId: userId,
          type: 'created',
        },
      },
    },
  });

  return newYear;
};

export const deleteFinancialYear = async (yearId: string, userId: string, role: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  if (role === 'STUDENT' && year.createdByUserId !== userId) {
    throw new AppError(status.FORBIDDEN, 'You do not have permission to delete this financial year');
  }

  return prisma.financialYear.update({
    where: { id: yearId },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const assignFinancialYear = async (yearId: string, targetUserId: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  const existing = await prisma.financialYearAssignment.findUnique({
    where: { financialYearId_userId: { financialYearId: yearId, userId: targetUserId } },
  });
  if (existing) throw new AppError(status.CONFLICT, 'User already assigned to this financial year');

  const assignment = await prisma.financialYearAssignment.create({
    data: { financialYearId: yearId, userId: targetUserId },
  });

  await createNotification({
    userId: targetUserId,
    type: 'ASSIGNMENT',
    title: 'New Assignment',
    message: `You have been assigned to a financial year.`,
    relatedYearId: yearId,
    relatedCompanyId: year.companyId,
  });

  return assignment;
};

// Review workflow actions
const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW', 'DRAFT'],
  UNDER_REVIEW: ['CHANGES_REQUESTED', 'FINALIZED'],
  CHANGES_REQUESTED: ['SUBMITTED', 'DRAFT'],
  FINALIZED: ['DRAFT'],
};

export const submitFinancialYear = async (yearId: string, userId: string, note?: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  if (!VALID_TRANSITIONS[year.reviewStatus]?.includes('SUBMITTED')) {
    throw new AppError(status.BAD_REQUEST, `Cannot submit from status: ${year.reviewStatus}`);
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: 'SUBMITTED',
      submittedAt: new Date(),
      reviewEvents: { create: { actorUserId: userId, type: 'submitted', note } },
    },
  });

  // Notify all admins and super admins
  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] }, isDeleted: false, status: 'ACTIVE' },
    select: { id: true },
  });

  await Promise.all(admins.map(admin =>
    createNotification({
      userId: admin.id,
      type: 'REVIEW_SUBMITTED',
      title: 'New Submission for Review',
      message: `A financial year has been submitted for review.`,
      relatedYearId: yearId,
      relatedCompanyId: year.companyId,
    })
  ));

  return updated;
};

export const startReview = async (yearId: string, userId: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  if (!VALID_TRANSITIONS[year.reviewStatus]?.includes('UNDER_REVIEW')) {
    throw new AppError(status.BAD_REQUEST, `Cannot start review from status: ${year.reviewStatus}`);
  }

  return prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: 'UNDER_REVIEW',
      currentReviewerUserId: userId,
      reviewEvents: { create: { actorUserId: userId, type: 'under_review' } },
    },
  });
};

export const requestChanges = async (yearId: string, userId: string, note?: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  if (!VALID_TRANSITIONS[year.reviewStatus]?.includes('CHANGES_REQUESTED')) {
    throw new AppError(status.BAD_REQUEST, `Cannot request changes from status: ${year.reviewStatus}`);
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: 'CHANGES_REQUESTED',
      reviewEvents: { create: { actorUserId: userId, type: 'changes_requested', note } },
    },
  });

  await createNotification({
    userId: year.createdByUserId,
    type: 'CHANGES_REQUESTED',
    title: 'Changes Requested',
    message: note || 'Changes have been requested for your financial year submission.',
    relatedYearId: yearId,
    relatedCompanyId: year.companyId,
  });

  return updated;
};

export const finalizeYear = async (yearId: string, userId: string, note?: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  if (!VALID_TRANSITIONS[year.reviewStatus]?.includes('FINALIZED')) {
    throw new AppError(status.BAD_REQUEST, `Cannot finalize from status: ${year.reviewStatus}`);
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: 'FINALIZED',
      isLocked: true,
      finalizedAt: new Date(),
      finalizedByUserId: userId,
      reviewEvents: { create: { actorUserId: userId, type: 'finalized', note } },
    },
  });

  await createNotification({
    userId: year.createdByUserId,
    type: 'FINALIZED',
    title: 'Financial Year Finalized',
    message: 'Your financial year has been finalized and locked.',
    relatedYearId: yearId,
    relatedCompanyId: year.companyId,
  });

  return updated;
};

export const reopenYear = async (yearId: string, userId: string, note?: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  if (!VALID_TRANSITIONS[year.reviewStatus]?.includes('DRAFT')) {
    throw new AppError(status.BAD_REQUEST, `Cannot reopen from status: ${year.reviewStatus}`);
  }

  return prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: 'DRAFT',
      isLocked: false,
      finalizedAt: null,
      finalizedByUserId: null,
      reviewEvents: { create: { actorUserId: userId, type: 'reopened', note } },
    },
  });
};

export const FinancialYearService = {
  getFinancialYears, createFinancialYear, deleteFinancialYear, assignFinancialYear,
  submitFinancialYear, startReview, requestChanges, finalizeYear, reopenYear,
};
