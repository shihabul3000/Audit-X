import httpClient from './httpClient';

export const financialYearService = {
  getAllByCompany: async (companyId: string) => {
    return httpClient.get(`/companies/${companyId}/years`);
  },

  create: async (companyId: string, reportingDate: string) => {
    return httpClient.post(`/companies/${companyId}/years`, { reportingDate });
  },

  updateStatus: async (companyId: string, yearId: string, reviewStatus: string) => {
    return httpClient.patch(`/companies/${companyId}/years/${yearId}/status`, { reviewStatus });
  },

  delete: async (companyId: string, yearId: string) => {
    return httpClient.delete(`/companies/${companyId}/years/${yearId}`);
  },
};
