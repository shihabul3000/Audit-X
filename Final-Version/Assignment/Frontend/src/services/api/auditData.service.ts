import httpClient from '@/lib/axios/httpClient';
import type { AuditReportData } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type N4_13_State = Record<string, any>;

export interface YearData {
  financialYear: {
    id: string;
    year: number;
    reportingDate: string;
    startDate: string;
    reviewStatus: string;
    isLocked: boolean;
    companyId: string;
  };
  auditData: AuditReportData | null;
  notesData: N4_13_State | null;
}

export const auditDataService = {
  async getYearData(yearId: string): Promise<YearData> {
    const res = await httpClient.get(`/api/v1/financial-years/${yearId}/data`);
    return res.data.data;
  },

  async saveAuditData(yearId: string, data: AuditReportData): Promise<void> {
    await httpClient.put(`/api/v1/financial-years/${yearId}/audit-data`, data);
  },

  async saveNotesData(yearId: string, data: N4_13_State): Promise<void> {
    await httpClient.put(`/api/v1/financial-years/${yearId}/notes-data`, data);
  },
};
