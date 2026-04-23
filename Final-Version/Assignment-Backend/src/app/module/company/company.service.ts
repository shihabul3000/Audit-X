import status from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import { prisma } from '../../lib/prisma.js';

export const getCompanies = async (userId: string, role: string) => {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return prisma.company.findMany({
      where: { isDeleted: false },
      include: { _count: { select: { financialYears: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Students see only assigned companies
  return prisma.company.findMany({
    where: {
      isDeleted: false,
      OR: [
        { createdByUserId: userId },
        { assignments: { some: { userId } } },
      ],
    },
    include: { _count: { select: { financialYears: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const createCompany = async (name: string, userId: string) => {
  const company = await prisma.company.create({
    data: {
      name,
      createdByUserId: userId,
      assignments: { create: { userId } },
    },
  });
  return company;
};

export const updateCompany = async (companyId: string, name: string, userId: string, role: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId, isDeleted: false } });
  if (!company) throw new AppError(status.NOT_FOUND, 'Company not found');

  if (role === 'STUDENT' && company.createdByUserId !== userId) {
    throw new AppError(status.FORBIDDEN, 'You do not have permission to update this company');
  }

  return prisma.company.update({ where: { id: companyId }, data: { name } });
};

export const deleteCompany = async (companyId: string, userId: string, role: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId, isDeleted: false } });
  if (!company) throw new AppError(status.NOT_FOUND, 'Company not found');

  if (role === 'STUDENT') {
    throw new AppError(status.FORBIDDEN, 'Students cannot delete companies');
  }

  return prisma.company.update({
    where: { id: companyId },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const assignCompanyToUser = async (companyId: string, targetUserId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId, isDeleted: false } });
  if (!company) throw new AppError(status.NOT_FOUND, 'Company not found');

  const existing = await prisma.companyAssignment.findUnique({
    where: { companyId_userId: { companyId, userId: targetUserId } },
  });
  if (existing) throw new AppError(status.CONFLICT, 'User already assigned to this company');

  return prisma.companyAssignment.create({ data: { companyId, userId: targetUserId } });
};

export const unassignCompanyFromUser = async (companyId: string, targetUserId: string) => {
  return prisma.companyAssignment.deleteMany({ where: { companyId, userId: targetUserId } });
};

export const CompanyService = {
  getCompanies, createCompany, updateCompany, deleteCompany, assignCompanyToUser, unassignCompanyFromUser,
};
