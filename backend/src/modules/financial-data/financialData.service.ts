import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import { hasAccess } from "../company/company.service";
import _ from "lodash";

const checkCanEdit = async (
  yearId: string,
  userId: string,
  role: string,
  status: string
): Promise<{ year: any; company: any }> => {
  const year = await prisma.financialYear.findUnique({
    where: { id: yearId },
    include: {
      company: true,
    },
  });

  if (!year) {
    throw ApiError.notFound("Financial year not found");
  }

  const hasAccessResult = await hasAccess(userId, role, year.companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  if (year.isLocked) {
    throw ApiError.forbidden("Financial year is locked");
  }

  if (
    (year.reviewStatus === "SUBMITTED" || year.reviewStatus === "UNDER_REVIEW") &&
    role === "STUDENT"
  ) {
    throw ApiError.forbidden("Cannot edit while review is in progress");
  }

  if (status === "BANNED") {
    throw ApiError.forbidden("Your account has been suspended");
  }

  return { year, company: year.company };
};

const deepMerge = (target: any, source: any): any => {
  return _.merge({}, target, source);
};

export const getFullData = async (
  yearId: string,
  userId: string,
  role: string
) => {
  const year = await prisma.financialYear.findUnique({
    where: { id: yearId },
    include: {
      company: true,
      auditData: true,
    },
  });

  if (!year) {
    throw ApiError.notFound("Financial year not found");
  }

  const hasAccessResult = await hasAccess(userId, role, year.companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  return {
    auditReportData: year.auditData?.auditReportData,
    notesData: year.auditData?.notesData,
    discussionData: year.auditData?.discussionData,
  };
};

export const updateAuditReportData = async (
  yearId: string,
  partial: any,
  userId: string,
  role: string,
  status: string
) => {
  const { year } = await checkCanEdit(yearId, userId, role, status);

  const existingAuditData = await prisma.auditData.findUnique({
    where: { yearId },
  });

  const mergedData = deepMerge(
    existingAuditData?.auditReportData || {},
    partial
  );

  const updated = await prisma.auditData.update({
    where: { yearId },
    data: {
      auditReportData: mergedData as any,
    },
  });

  await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      lastEditedByUserId: userId,
    },
  });

  return updated.auditReportData;
};

export const updateNotesData = async (
  yearId: string,
  partial: any,
  userId: string,
  role: string,
  status: string
) => {
  const { year } = await checkCanEdit(yearId, userId, role, status);

  const existingAuditData = await prisma.auditData.findUnique({
    where: { yearId },
  });

  const mergedData = deepMerge(
    existingAuditData?.notesData || {},
    partial
  );

  const updated = await prisma.auditData.update({
    where: { yearId },
    data: {
      notesData: mergedData as any,
    },
  });

  await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      lastEditedByUserId: userId,
    },
  });

  return updated.notesData;
};

export const updateDiscussionData = async (
  yearId: string,
  partial: any,
  userId: string,
  role: string,
  status: string
) => {
  const { year } = await checkCanEdit(yearId, userId, role, status);

  const existingAuditData = await prisma.auditData.findUnique({
    where: { yearId },
  });

  const existingDiscussionData = (existingAuditData?.discussionData as any) || {
    docStatuses: {},
    values: {},
  };

  const mergedData = deepMerge(existingDiscussionData, {
    docStatuses: partial.docStatuses || {},
    values: partial.values || {},
  });

  const updated = await prisma.auditData.update({
    where: { yearId },
    data: {
      discussionData: mergedData as any,
    },
  });

  await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      lastEditedByUserId: userId,
    },
  });

  return updated.discussionData;
};