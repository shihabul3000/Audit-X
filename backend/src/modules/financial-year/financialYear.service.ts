import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import { getDefaultAuditReportData, getDefaultNotesData } from "./financialYear.validation";

const hasAccess = async (
  userId: string,
  role: string,
  companyId: string
): Promise<boolean> => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return true;
  }

  const assignment = await prisma.companyAssignment.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  return !!assignment;
};

const canModify = async (
  userId: string,
  role: string,
  yearId: string
): Promise<boolean> => {
  const year = await prisma.financialYear.findUnique({
    where: { id: yearId },
    select: { createdByUserId: true, companyId: true },
  });

  if (!year) {
    throw ApiError.notFound("Financial year not found");
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return true;
  }

  return year.createdByUserId === userId;
};

export const getAll = async (
  companyId: string,
  userId: string,
  role: string
) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  const years = await prisma.financialYear.findMany({
    where: { companyId },
    orderBy: { year: "asc" },
    select: {
      id: true,
      companyId: true,
      year: true,
      reportingDate: true,
      reviewStatus: true,
      isLocked: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return years;
};

export const getById = async (
  companyId: string,
  yearId: string,
  userId: string,
  role: string
) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  const year = await prisma.financialYear.findUnique({
    where: { id: yearId },
    include: {
      auditData: true,
    },
  });

  if (!year || year.companyId !== companyId) {
    throw ApiError.notFound("Financial year not found");
  }

  return year;
};

export const create = async (
  companyId: string,
  reportingDate: string,
  userId: string,
  role: string
) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  const yearNum = new Date(reportingDate).getFullYear();

  const existingYear = await prisma.financialYear.findUnique({
    where: {
      companyId_year: {
        companyId,
        year: yearNum,
      },
    },
  });

  if (existingYear) {
    throw ApiError.conflict(`Financial year ${yearNum} already exists for this company`);
  }

  const newYear = await prisma.financialYear.create({
    data: {
      companyId,
      year: yearNum,
      reportingDate,
      reviewStatus: "DRAFT",
      isLocked: false,
      createdByUserId: userId,
    },
  });

  const defaultAuditData = getDefaultAuditReportData(reportingDate);
  const defaultNotesData = getDefaultNotesData(reportingDate);

  await prisma.auditData.create({
    data: {
      yearId: newYear.id,
      auditReportData: defaultAuditData as any,
      notesData: defaultNotesData as any,
    },
  });

  await prisma.reviewEvent.create({
    data: {
      yearId: newYear.id,
      type: "CREATED",
      actorUserId: userId,
      actorRole: role,
    },
  });

  return newYear;
};

export const update = async (
  companyId: string,
  yearId: string,
  data: { reportingDate?: string },
  userId: string,
  role: string
) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  const year = await prisma.financialYear.findUnique({
    where: { id: yearId },
  });

  if (!year || year.companyId !== companyId) {
    throw ApiError.notFound("Financial year not found");
  }

  if (year.reviewStatus === "FINALIZED") {
    throw ApiError.forbidden("Cannot update a finalized financial year");
  }

  const updateData: any = { ...data };
  if (data.reportingDate) {
    const newYearNum = new Date(data.reportingDate).getFullYear();
    if (newYearNum !== year.year) {
      const conflict = await prisma.financialYear.findUnique({
        where: { companyId_year: { companyId, year: newYearNum } },
      });
      if (conflict) {
        throw ApiError.conflict(`Financial year ${newYearNum} already exists for this company`);
      }
    }
    updateData.year = newYearNum;
  }

  const updatedYear = await prisma.financialYear.update({
    where: { id: yearId },
    data: updateData,
  });

  return updatedYear;
};

export const remove = async (
  companyId: string,
  yearId: string,
  userId: string,
  role: string
) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  const canModifyResult = await canModify(userId, role, yearId);
  if (!canModifyResult) {
    throw ApiError.forbidden("Only the creator or ADMIN can delete this financial year");
  }

  const year = await prisma.financialYear.findUnique({
    where: { id: yearId },
  });

  if (!year || year.companyId !== companyId) {
    throw ApiError.notFound("Financial year not found");
  }

  await prisma.$transaction([
    prisma.auditData.delete({ where: { yearId } }),
    prisma.reviewEvent.deleteMany({ where: { yearId } }),
    prisma.notification.deleteMany({ where: { relatedYearId: yearId } }),
    prisma.financialYear.delete({ where: { id: yearId } }),
  ]);

  return { success: true };
};

const deepClone = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj));
};

const applyCarryForwardRules = (notesData: any): any => {
  const cloned = deepClone(notesData);

  if (cloned.sections && Array.isArray(cloned.sections)) {
    for (const section of cloned.sections) {
      if (section.rows && Array.isArray(section.rows)) {
        for (const row of section.rows) {
          row.value_py = row.value_cy;
          row.value_cy = 0;
        }
      }
    }
  }

  if (cloned.ppe) {
    cloned.ppe.costOpening_py = cloned.ppe.costClosing_cy;
    cloned.ppe.depOpening_py = cloned.ppe.depClosing_cy;
    cloned.ppe.costClosing_cy = 0;
    cloned.ppe.depClosing_cy = 0;
  }

  if (cloned.bankAccounts && Array.isArray(cloned.bankAccounts)) {
    for (const account of cloned.bankAccounts) {
      account.value_py = account.value_cy;
      account.value_cy = 0;
    }
  }

  if (cloned.loans && Array.isArray(cloned.loans)) {
    for (const loan of cloned.loans) {
      loan.total_py = (loan.nonCurrent_cy || 0) + (loan.current_cy || 0);
      loan.nonCurrent_cy = 0;
      loan.current_cy = 0;
    }
  }

  if (cloned.upasEntries && Array.isArray(cloned.upasEntries)) {
    for (const upas of cloned.upasEntries) {
      upas.total_py = (upas.nonCurrent_cy || 0) + (upas.current_cy || 0);
      upas.nonCurrent_cy = 0;
      upas.current_cy = 0;
    }
  }

  return cloned;
};

export const rollover = async (
  companyId: string,
  sourceYearId: string,
  newReportingDate: string,
  userId: string,
  role: string
) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, companyId);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  const sourceYear = await prisma.financialYear.findUnique({
    where: { id: sourceYearId },
    include: {
      auditData: true,
    },
  });

  if (!sourceYear || sourceYear.companyId !== companyId) {
    throw ApiError.notFound("Source financial year not found");
  }

  const newYearNum = new Date(newReportingDate).getFullYear();

  const existingYear = await prisma.financialYear.findUnique({
    where: {
      companyId_year: {
        companyId,
        year: newYearNum,
      },
    },
  });

  if (existingYear) {
    throw ApiError.conflict(`Financial year ${newYearNum} already exists for this company`);
  }

  const sourceNotesData = sourceYear.auditData?.notesData as any;
  const sourceAuditData = sourceYear.auditData?.auditReportData as any;

  const carriedNotesData = applyCarryForwardRules(sourceNotesData || getDefaultNotesData(sourceYear.reportingDate));

  carriedNotesData.company.reportingDateLabel = `30 June ${newYearNum}`;
  carriedNotesData.company.priorDateLabel = `30 June ${newYearNum - 1}`;

  const carriedAuditData = deepClone(sourceAuditData || getDefaultAuditReportData(sourceYear.reportingDate));
  carriedAuditData.reportingDate = newReportingDate;
  carriedAuditData.startDate = `${newYearNum - 1}-07-01`;

  if (carriedAuditData.ppe) {
    carriedAuditData.ppe.headerInfo.asAtDate = `30 June ${newYearNum}`;
    carriedAuditData.ppe.headerInfo.yearStart = `01 Jul ${String(newYearNum - 1).slice(2)}`;
    carriedAuditData.ppe.headerInfo.yearEnd = `30 June ${String(newYearNum).slice(2)}`;
  }

  const newYear = await prisma.financialYear.create({
    data: {
      companyId,
      year: newYearNum,
      reportingDate: newReportingDate,
      reviewStatus: "DRAFT",
      isLocked: false,
      createdByUserId: userId,
    },
  });

  await prisma.auditData.create({
    data: {
      yearId: newYear.id,
      auditReportData: carriedAuditData as any,
      notesData: carriedNotesData as any,
    },
  });

  await prisma.reviewEvent.create({
    data: {
      yearId: newYear.id,
      type: "CREATED",
      actorUserId: userId,
      actorRole: role,
      note: `Rollover from year ${sourceYear.year}`,
    },
  });

  return newYear;
};