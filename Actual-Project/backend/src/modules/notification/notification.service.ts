import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import { paginate, getPagination } from "../../shared/pagination";

export const getAll = async (userId: string, query: { page?: number; limit?: number }) => {
  const { page = 1, limit = 10 } = query;
  const pagination = getPagination(page, limit);

  const where = { userId };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({ where }),
  ]);

  return paginate(notifications, pagination, total);
};

export const getUnreadCount = async (userId: string) => {
  const count = await prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });

  return { count };
};

export const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }

  if (notification.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};

export const markAllAsRead = async (userId: string) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: { read: true },
  });

  return { count: result.count };
};
