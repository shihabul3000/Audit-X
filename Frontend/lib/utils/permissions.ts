import { prisma } from "@/lib/prisma";

export async function hasCompanyAccess(
  userId: string,
  companyId: string,
  allowedRoles?: string[]
): Promise<boolean> {
  if (allowedRoles && allowedRoles.length > 0) {
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        companyId,
        userId,
        role: { in: allowedRoles },
      },
    });
    return !!companyUser;
  }

  const companyUser = await prisma.companyUser.findFirst({
    where: {
      companyId,
      userId,
    },
  });
  return !!companyUser;
}

export async function canAccessFinancialYear(
  userId: string,
  yearId: string,
  requiredRoles?: string[]
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return false;
  }

  if (user.role === "super_admin") {
    return true;
  }

  const financialYear = await prisma.financialYear.findUnique({
    where: { id: yearId },
  });

  if (!financialYear) {
    return false;
  }

  if (user.role === "admin") {
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        companyId: financialYear.companyId,
        userId,
        role: { in: ["admin", "owner"] },
      },
    });
    if (companyUser) {
      return true;
    }

    if (financialYear.assignedAdminIds.includes(userId)) {
      return true;
    }
  }

  if (financialYear.assignedStudentIds.includes(userId)) {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
  }

  return false;
}

export async function canManageFinancialYear(
  userId: string,
  yearId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return false;
  }

  if (user.role === "super_admin" || user.role === "admin") {
    return true;
  }

  const financialYear = await prisma.financialYear.findUnique({
    where: { id: yearId },
  });

  if (!financialYear) {
    return false;
  }

  return financialYear.createdByUserId === userId;
}

export async function canReviewFinancialYear(
  userId: string,
  yearId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return false;
  }

  if (user.role === "super_admin") {
    return true;
  }

  const financialYear = await prisma.financialYear.findUnique({
    where: { id: yearId },
  });

  if (!financialYear) {
    return false;
  }

  if (user.role === "admin" && financialYear.assignedAdminIds.includes(userId)) {
    return true;
  }

  return false;
}