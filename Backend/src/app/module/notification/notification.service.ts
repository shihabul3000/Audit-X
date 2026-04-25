import { prisma } from '../../lib/prisma.js';

interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedCompanyId?: string;
  relatedYearId?: string;
}

export const createNotification = async (params: CreateNotificationParams) => {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type as 'ASSIGNMENT' | 'REVIEW_SUBMITTED' | 'CHANGES_REQUESTED' | 'FINALIZED' | 'BLOCKED' | 'UNBLOCKED' | 'SYSTEM',
      title: params.title,
      message: params.message,
      relatedCompanyId: params.relatedCompanyId,
      relatedYearId: params.relatedYearId,
    },
  });
};

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
};

export const markNotificationRead = async (notificationId: string, userId: string) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

export const markAllNotificationsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

export const NotificationService = {
  createNotification, getUserNotifications, markNotificationRead, markAllNotificationsRead,
};
