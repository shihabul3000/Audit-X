import httpClient from '@/lib/axios/httpClient';
import type { User } from './auth.service';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const res = await httpClient.get('/api/v1/users');
    return res.data.data;
  },

  async updateUser(id: string, payload: { name?: string; role?: string; status?: string }): Promise<User> {
    const res = await httpClient.patch(`/api/v1/users/${id}`, payload);
    return res.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await httpClient.delete(`/api/v1/users/${id}`);
  },

  async createAdmin(payload: { name: string; email: string; password: string }): Promise<User> {
    const res = await httpClient.post('/api/v1/users/create-admin', payload);
    return res.data.data;
  },

  async createSuperAdmin(payload: { name: string; email: string; password: string }): Promise<User> {
    const res = await httpClient.post('/api/v1/users/create-super-admin', payload);
    return res.data.data;
  },
};
