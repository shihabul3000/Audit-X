import status from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import { prisma } from '../../lib/prisma.js';

export const getYearData = async (yearId: string) => {
  const year = await prisma.financialYear.findUnique({
    where: { id: yearId, isDeleted: false },
    include: { auditData: true, notesData: true },
  });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');

  return {
    financialYear: {
      id: year.id, year: year.year, reportingDate: year.reportingDate,
      startDate: year.startDate, reviewStatus: year.reviewStatus,
      isLocked: year.isLocked, companyId: year.companyId,
    },
    auditData: year.auditData?.data || null,
    notesData: year.notesData?.data || null,
  };
};

export const saveAuditData = async (yearId: string, data: object, userId: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');
  if (year.isLocked) throw new AppError(status.FORBIDDEN, 'Financial year is locked and cannot be edited');

  const result = await prisma.auditData.upsert({
    where: { financialYearId: yearId },
    update: { data },
    create: { financialYearId: yearId, data },
  });

  await prisma.financialYear.update({
    where: { id: yearId },
    data: { lastEditedByUserId: userId },
  });

  return result;
};

export const saveNotesData = async (yearId: string, data: object, userId: string) => {
  const year = await prisma.financialYear.findUnique({ where: { id: yearId, isDeleted: false } });
  if (!year) throw new AppError(status.NOT_FOUND, 'Financial year not found');
  if (year.isLocked) throw new AppError(status.FORBIDDEN, 'Financial year is locked and cannot be edited');

  const result = await prisma.notesData.upsert({
    where: { financialYearId: yearId },
    update: { data },
    create: { financialYearId: yearId, data },
  });

  await prisma.financialYear.update({
    where: { id: yearId },
    data: { lastEditedByUserId: userId },
  });

  return result;
};

export const AuditDataService = { getYearData, saveAuditData, saveNotesData };
