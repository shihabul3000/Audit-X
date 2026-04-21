import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import { paginate, getPagination } from "../../shared/pagination";
import { Prisma } from "@prisma/client";

export const getAll = async (
  userId: string,
  role: string,
  query: { searchTerm?: string; page?: number; limit?: number }
) => {
  const { page = 1, limit = 10, searchTerm } = query;
  const pagination = getPagination(page, limit);

  const isStudent = role === "STUDENT";

  const where: Prisma.CompanyWhereInput = {
    isDeleted: false,
    ...(isStudent
      ? {
          assignments: {
            some: {
              userId: userId,
            },
          },
        }
      : {}),
    ...(searchTerm && {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { address: { contains: searchTerm, mode: "insensitive" } },
      ],
    }),
  };

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            financialYears: true,
          },
        },
      },
    }),
    prisma.company.count({ where }),
  ]);

  const result = companies.map((company) => ({
    ...company,
    financialYearsCount: company._count.financialYears,
  }));

  return paginate(result, pagination, total);
};

export const getById = async (id: string, userId: string, role: string) => {
  const company = await prisma.company.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      createdByUserId: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          financialYears: true,
        },
      },
    },
  });

  if (!company) {
    throw ApiError.notFound("Company not found");
  }

  if (company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, id);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  return {
    ...company,
    financialYearsCount: company._count.financialYears,
  };
};

export const hasAccess = async (
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

export const create = async (
  name: string,
  address: string | undefined,
  createdByUserId: string
) => {
  const company = await prisma.company.create({
    data: {
      name,
      address,
      createdByUserId,
    },
    select: {
      id: true,
      name: true,
      address: true,
      createdByUserId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await prisma.companyAssignment.create({
    data: {
      userId: createdByUserId,
      companyId: company.id,
      assignedByUserId: createdByUserId,
    },
  });

  return company;
};

export const update = async (
  id: string,
  data: { name?: string; address?: string },
  userId: string,
  role: string
) => {
  const hasAccessResult = await hasAccess(userId, role, id);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  const company = await prisma.company.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return company;
};

export const softDelete = async (id: string, userId: string, role: string) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const hasAccessResult = await hasAccess(userId, role, id);
  if (!hasAccessResult) {
    throw ApiError.forbidden("You don't have access to this company");
  }

  return prisma.company.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true, name: true },
  });
};

export const assign = async (
  companyId: string,
  userId: string,
  assignedByUserId: string
) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.isDeleted) {
    throw ApiError.notFound("User not found");
  }

  const existingAssignment = await prisma.companyAssignment.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (existingAssignment) {
    throw ApiError.conflict("User already assigned to this company");
  }

  await prisma.companyAssignment.create({
    data: {
      userId,
      companyId,
      assignedByUserId,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      type: "ASSIGNMENT",
      title: "Company Assigned",
      message: `You have been assigned to ${company.name}.`,
      relatedCompanyId: companyId,
    },
  });

  return { success: true };
};

export const unassign = async (companyId: string, userId: string) => {
  const assignment = await prisma.companyAssignment.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
    include: {
      company: true,
    },
  });

  if (!assignment) {
    throw ApiError.notFound("Assignment not found");
  }

  await prisma.companyAssignment.delete({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      type: "UNASSIGNMENT",
      title: "Company Unassigned",
      message: `You have been removed from ${assignment.company.name}.`,
      relatedCompanyId: companyId,
    },
  });

  return { success: true };
};

export const getMembers = async (companyId: string) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted) {
    throw ApiError.notFound("Company not found");
  }

  const members = await prisma.companyAssignment.findMany({
    where: { companyId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileImage: true,
        },
      },
    },
    orderBy: { assignedAt: "desc" },
  });

  return members.map((member) => ({
    ...member.user,
    assignedAt: member.assignedAt,
    assignedByUserId: member.assignedByUserId,
  }));
};