import httpClient from '@/lib/axios/httpClient';

export interface FinancialYear {
  id: string;
  companyId: string;
  year: number;
  reportingDate: string;
  startDate: string;
  reviewStatus: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'FINALIZED';
  isLocked: boolean;
  createdByUserId: string;
  currentReviewerUserId: string | null;
  finalizedByUserId: string | null;
  finalizedAt: string | null;
  submittedAt: string | null;
  lastEditedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  assignments?: { userId: string }[];
  reviewEvents?: ReviewEvent[];
}

export interface ReviewEvent {
  id: string;
  financialYearId: string;
  actorUserId: string;
  type: string;
  note?: string;
  createdAt: string;
}

export const financialYearService = {
  async getFinancialYears(companyId: string): Promise<FinancialYear[]> {
    const res = await httpClient.get(`/api/v1/companies/${companyId}/financial-years`);
    return res.data.data;
  },

  async createFinancialYear(companyId: string, reportingDate: string): Promise<FinancialYear> {
    const res = await httpClient.post(`/api/v1/companies/${companyId}/financial-years`, { reportingDate });
    return res.data.data;
  },

  async deleteFinancialYear(yearId: string): Promise<void> {
    await httpClient.delete(`/api/v1/financial-years/${yearId}`);
  },

  async submitYear(yearId: string, note?: string) {
    const res = await httpClient.post(`/api/v1/financial-years/${yearId}/submit`, { note });
    return res.data.data;
  },

  async reviewAction(yearId: string, action: string, note?: string) {
    const res = await httpClient.post(`/api/v1/financial-years/${yearId}/review-actions`, { action, note });
    return res.data.data;
  },

  async assignYear(yearId: string, userId: string) {
    const res = await httpClient.post(`/api/v1/financial-years/${yearId}/assign`, { userId });
    return res.data.data;
  },
};
