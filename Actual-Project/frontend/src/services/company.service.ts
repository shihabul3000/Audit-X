import httpClient from './httpClient';

const API_URL = '/companies';

export const companyService = {
  getAll: async () => {
    return httpClient.get(API_URL);
  },

  getById: async (id: string) => {
    return httpClient.get(`${API_URL}/${id}`);
  },

  create: async (name: string, address?: string) => {
    return httpClient.post(API_URL, { name, address });
  },

  update: async (id: string, name: string, address?: string) => {
    return httpClient.patch(`${API_URL}/${id}`, { name, address });
  },

  delete: async (id: string) => {
    return httpClient.delete(`${API_URL}/${id}`);
  },
};
