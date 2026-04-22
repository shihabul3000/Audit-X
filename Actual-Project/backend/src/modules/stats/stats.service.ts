import { prisma } from "../../config/prismaClient";

export const getSystemStats = async () => {
  const [
    totalUsers,
    totalCompanies,
    totalFinancialYears,
    activeReviews,
    bannedUsers,
    usersByRole
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.company.count({ where: { isDeleted: false } }),
    prisma.financialYear.count(),
    prisma.financialYear.count({
      where: { reviewStatus: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    }),
    prisma.user.count({ where: { status: "BANNED", isDeleted: false } }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
      where: { isDeleted: false },
    }),
  ]);

  const roleStats = usersByRole.reduce((acc, curr) => {
    acc[curr.role.toLowerCase()] = curr._count.role;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalUsers,
    totalCompanies,
    totalFinancialYears,
    activeReviews,
    bannedUsers,
    roleStats: {
      student: roleStats.student || 0,
      admin: roleStats.admin || 0,
      super_admin: roleStats.super_admin || 0,
    },
  };
};

export const getAdminStats = async (adminId: string) => {
  // An Admin might be managing specific students or companies.
  // For now, we return similar stats scoped (or unscoped depending on RBAC design).
  // Following the documentation, Admins oversee workflows.
  const [
    totalReviewsPending,
    recentlyFinalized,
  ] = await Promise.all([
    prisma.financialYear.count({
      where: { reviewStatus: "SUBMITTED" },
    }),
    prisma.financialYear.count({
      where: {
        reviewStatus: "FINALIZED",
        finalizedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      },
    }),
  ]);

  return {
    totalReviewsPending,
    recentlyFinalized,
  };
};
