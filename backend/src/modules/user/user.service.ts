import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import { hashPassword } from "../auth/auth.utils";
import { paginate, getPagination } from "../../shared/pagination";
import { Prisma } from "@prisma/client";

export const getAll = async (query: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  searchTerm?: string;
}) => {
  const { page = 1, limit = 10, role, status, searchTerm } = query;
  const pagination = getPagination(page, limit);

  const where: Prisma.UserWhereInput = {
    isDeleted: false,
    ...(role && { role: role as Prisma.UserRole }),
    ...(status && { status: status as Prisma.UserStatus }),
    ...(searchTerm && {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        profileImage: true,
        needPasswordChange: true,
        bannedReason: true,
        bannedByUserId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return paginate(users, pagination, total);
};

export const getById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      bannedReason: true,
      bannedByUserId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (user.isDeleted) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role as Prisma.UserRole,
      emailVerified: true,
      needPasswordChange: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const update = async (id: string, data: { name?: string; email?: string }) => {
  if (data.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser && existingUser.id !== id) {
      throw ApiError.conflict("Email already registered");
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const changeRole = async (id: string, role: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { role: role as Prisma.UserRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      bannedReason: true,
      bannedByUserId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const ban = async (
  id: string,
  reason?: string,
  bannedByUserId?: string
) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      status: "BANNED",
      bannedReason: reason || null,
      bannedByUserId: bannedByUserId || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      bannedReason: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: id,
      type: "BAN",
      title: "Account Suspended",
      message: `Your account has been suspended. ${reason ? `Reason: ${reason}` : "Please contact support for more information."}`,
    },
  });

  return user;
};

export const unban = async (id: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      status: "ACTIVE",
      bannedReason: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      bannedReason: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: id,
      type: "UNBAN",
      title: "Account Restored",
      message: "Your account has been restored. You can now access the platform normally.",
    },
  });

  return user;
};

export const softDelete = async (id: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
      status: "DELETED",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return user;
};

export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (user.isDeleted) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

export const updateMyProfile = async (userId: string, data: { name?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const uploadProfileImage = async (userId: string, filename: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      profileImage: `/uploads/profiles/${filename}`,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
