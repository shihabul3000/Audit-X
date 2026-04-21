import httpClient from './httpClient';

const API_URL = '/users';

export const userService = {
  getUsers: async (role?: string) => {
    return httpClient.get(API_URL, { params: { role } });
  },

  createStudent: async (data: any) => {
    return httpClient.post(`${API_URL}/student`, data);
  },

  createAdmin: async (data: any) => {
    return httpClient.post(`${API_URL}/admin`, data);
  },

  updateStatus: async (id: string, status: string, reason?: string) => {
    return httpClient.patch(`${API_URL}/${id}/status`, { status, reason });
  },

  delete: async (id: string) => {
    return httpClient.delete(`${API_URL}/${id}`);
  },
};
