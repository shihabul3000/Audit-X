import httpClient from './httpClient';

const API_URL = '/notifications';

export const notificationService = {
  getAll: async (page = 1, limit = 20) => {
    return httpClient.get(`${API_URL}?page=${page}&limit=${limit}`);
  },

  getUnreadCount: async () => {
    return httpClient.get(`${API_URL}/unread-count`);
  },

  markAsRead: async (id: string) => {
    return httpClient.patch(`${API_URL}/${id}/read`);
  },

  markAllAsRead: async () => {
    return httpClient.patch(`${API_URL}/read-all`);
  },
};
