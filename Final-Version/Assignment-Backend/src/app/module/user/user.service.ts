import status from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import { auth } from '../../lib/auth.js';
import { prisma } from '../../lib/prisma.js';
import { createNotification } from '../notification/notification.service.js';

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { isDeleted: false },
    select: {
      id: true, name: true, email: true, role: true,
      status: true, emailVerified: true, image: true,
      createdAt: true, updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true, name: true, email: true, role: true,
      status: true, emailVerified: true, image: true,
      createdAt: true, updatedAt: true,
    },
  });
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found');
  return user;
};

export const updateUser = async (
  userId: string,
  payload: { name?: string; role?: string; status?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(status.NOT_FOUND, 'User not found');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true, name: true, email: true, role: true,
      status: true, emailVerified: true, image: true,
      createdAt: true, updatedAt: true,
    },
  });

  // Notify user if blocked/unblocked
  if (payload.status === 'BLOCKED') {
    await createNotification({
      userId,
      type: 'BLOCKED',
      title: 'Account Blocked',
      message: 'Your account has been blocked by an administrator.',
    });
  } else if (payload.status === 'ACTIVE' && user.status === 'BLOCKED') {
    await createNotification({
      userId,
      type: 'UNBLOCKED',
      title: 'Account Unblocked',
      message: 'Your account has been unblocked.',
    });
  }

  return updated;
};

export const softDeleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found');
  if (user.isDeleted) throw new AppError(status.BAD_REQUEST, 'User already deleted');

  return prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true, deletedAt: new Date(), status: 'DELETED' },
  });
};

export const createAdminUser = async (
  payload: { name: string; email: string; password: string },
  role: 'ADMIN' | 'SUPER_ADMIN'
) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new AppError(status.CONFLICT, 'User with this email already exists');

  await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });

  const created = await prisma.user.update({
    where: { email: payload.email },
    data: { role, emailVerified: true, status: 'ACTIVE' },
    select: {
      id: true, name: true, email: true, role: true,
      status: true, emailVerified: true, createdAt: true,
    },
  });

  return created;
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  createAdminUser,
};
