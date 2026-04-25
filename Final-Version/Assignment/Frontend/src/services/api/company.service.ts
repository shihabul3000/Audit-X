import httpClient from '@/lib/axios/httpClient';

export interface Company {
  id: string;
  name: string;
  createdByUserId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { financialYears: number };
}

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    const res = await httpClient.get('/api/v1/companies');
    return res.data.data;
  },

  async createCompany(name: string): Promise<Company> {
    const res = await httpClient.post('/api/v1/companies', { name });
    return res.data.data;
  },

  async updateCompany(id: string, name: string): Promise<Company> {
    const res = await httpClient.patch(`/api/v1/companies/${id}`, { name });
    return res.data.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await httpClient.delete(`/api/v1/companies/${id}`);
  },

  async assignCompany(companyId: string, userId: string) {
    const res = await httpClient.post(`/api/v1/companies/${companyId}/assign`, { userId });
    return res.data.data;
  },

  async unassignCompany(companyId: string, userId: string) {
    const res = await httpClient.post(`/api/v1/companies/${companyId}/unassign`, { userId });
    return res.data.data;
  },
};
