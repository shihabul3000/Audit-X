import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import { hasAccess } from "../company/company.service";

const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  relatedCompanyId?: string,
  relatedYearId?: string
) => {
  await prisma.notification.create({
    data: {
      userId,
      type: type as any,
      title,
      message,
      relatedCompanyId,
      relatedYearId,
    },
  });
};

const getAssignedStudents = async (companyId: string): Promise<string[]> => {
  const assignments = await prisma.companyAssignment.findMany({
    where: {
      companyId,
      user: {
        role: "STUDENT",
      },
    },
    select: {
      userId: true,
    },
  });

  return assignments.map((a) => a.userId);
};

const getAllAdmins = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "SUPER_ADMIN"],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

const checkUserAccess = async (
  yearId: string,
  userId: string,
  role: string
) => {
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

  return year;
};

export const submit = async (
  yearId: string,
  userId: string,
  role: string
) => {
  const year = await checkUserAccess(yearId, userId, role);

  if (year.reviewStatus !== "DRAFT" && year.reviewStatus !== "CHANGES_REQUESTED") {
    throw ApiError.badRequest("Can only submit draft or changes requested years");
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  await prisma.reviewEvent.create({
    data: {
      yearId,
      type: "SUBMITTED",
      actorUserId: userId,
      actorRole: role,
    },
  });

  const admins = await getAllAdmins();
  for (const admin of admins) {
    await createNotification(
      admin.id,
      "REVIEW_SUBMITTED",
      "Review Submitted",
      `A financial year has been submitted for review (Year: ${year.year})`,
      year.companyId,
      yearId
    );
  }

  return updated;
};

export const startReview = async (
  yearId: string,
  userId: string,
  role: string
) => {
  const year = await checkUserAccess(yearId, userId, role);

  if (year.reviewStatus !== "SUBMITTED") {
    throw ApiError.badRequest("Can only start review for submitted years");
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: "UNDER_REVIEW",
      currentReviewerUserId: userId,
    },
  });

  await prisma.reviewEvent.create({
    data: {
      yearId,
      type: "UNDER_REVIEW",
      actorUserId: userId,
      actorRole: role,
    },
  });

  const studentIds = await getAssignedStudents(year.companyId);
  for (const studentId of studentIds) {
    await createNotification(
      studentId,
      "REVIEW_STARTED",
      "Review Started",
      `Your financial year (Year: ${year.year}) is now under review`,
      year.companyId,
      yearId
    );
  }

  return updated;
};

export const requestChanges = async (
  yearId: string,
  userId: string,
  role: string,
  note?: string
) => {
  const year = await checkUserAccess(yearId, userId, role);

  if (year.reviewStatus !== "UNDER_REVIEW") {
    throw ApiError.badRequest("Can only request changes for years under review");
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: "CHANGES_REQUESTED",
    },
  });

  await prisma.reviewEvent.create({
    data: {
      yearId,
      type: "CHANGES_REQUESTED",
      actorUserId: userId,
      actorRole: role,
      note: note || undefined,
    },
  });

  const studentIds = await getAssignedStudents(year.companyId);
  for (const studentId of studentIds) {
    await createNotification(
      studentId,
      "CHANGES_REQUESTED",
      "Changes Requested",
      `Changes have been requested for your financial year (Year: ${year.year})${note ? `: ${note}` : ""}`,
      year.companyId,
      yearId
    );
  }

  return updated;
};

export const finalize = async (
  yearId: string,
  userId: string,
  role: string,
  note?: string
) => {
  const year = await checkUserAccess(yearId, userId, role);

  if (year.reviewStatus !== "UNDER_REVIEW") {
    throw ApiError.badRequest("Can only finalize years under review");
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: "FINALIZED",
      isLocked: true,
      finalizedByUserId: userId,
      finalizedAt: new Date(),
    },
  });

  await prisma.reviewEvent.create({
    data: {
      yearId,
      type: "FINALIZED",
      actorUserId: userId,
      actorRole: role,
      note: note || undefined,
    },
  });

  const studentIds = await getAssignedStudents(year.companyId);
  for (const studentId of studentIds) {
    await createNotification(
      studentId,
      "FINALIZED",
      "Review Finalized",
      `Your financial year (Year: ${year.year}) has been finalized`,
      year.companyId,
      yearId
    );
  }

  return updated;
};

export const reopen = async (
  yearId: string,
  userId: string,
  role: string,
  note?: string
) => {
  const year = await checkUserAccess(yearId, userId, role);

  if (year.reviewStatus === "DRAFT") {
    throw ApiError.badRequest("Year is already in draft state");
  }

  const updated = await prisma.financialYear.update({
    where: { id: yearId },
    data: {
      reviewStatus: "DRAFT",
      isLocked: false,
      currentReviewerUserId: null,
    },
  });

  await prisma.reviewEvent.create({
    data: {
      yearId,
      type: "REOPENED",
      actorUserId: userId,
      actorRole: role,
      note: note || undefined,
    },
  });

  return updated;
};

export const getQueue = async () => {
  const years = await prisma.financialYear.findMany({
    where: {
      reviewStatus: {
        in: ["SUBMITTED", "UNDER_REVIEW"],
      },
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      currentReviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return years.map((year) => ({
    id: year.id,
    companyId: year.company.id,
    companyName: year.company.name,
    year: year.year,
    reviewStatus: year.reviewStatus,
    submittedAt: year.submittedAt,
    currentReviewer: year.currentReviewer
      ? {
          id: year.currentReviewer.id,
          name: year.currentReviewer.name,
        }
      : null,
  }));
};

export const getEvents = async (
  yearId: string,
  userId: string,
  role: string
) => {
  await checkUserAccess(yearId, userId, role);

  const events = await prisma.reviewEvent.findMany({
    where: { yearId },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return events.map((event) => ({
    id: event.id,
    type: event.type,
    note: event.note,
    createdAt: event.createdAt,
    actor: {
      id: event.actor.id,
      name: event.actor.name,
      role: event.actor.role,
    },
  }));
};