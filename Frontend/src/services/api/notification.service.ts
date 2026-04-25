import httpClient from '@/lib/axios/httpClient';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedCompanyId?: string;
  relatedYearId?: string;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const res = await httpClient.get('/api/v1/notifications');
    return res.data.data;
  },

  async markRead(id: string): Promise<void> {
    await httpClient.patch(`/api/v1/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await httpClient.patch('/api/v1/notifications/read-all');
  },
};
