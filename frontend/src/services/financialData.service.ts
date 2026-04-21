import httpClient from './httpClient';

const API_URL = '/financial-data';

export const financialDataService = {
  getByYearId: async (yearId: string) => {
    return httpClient.get(`${API_URL}/${yearId}`);
  },

  updateAuditData: async (yearId: string, auditReportData: any) => {
    return httpClient.patch(`${API_URL}/${yearId}/audit`, { auditReportData });
  },

  updateNotesData: async (yearId: string, notesData: any) => {
    return httpClient.patch(`${API_URL}/${yearId}/notes`, { notesData });
  },

  updateDiscussionData: async (yearId: string, discussionData: any) => {
    return httpClient.patch(`${API_URL}/${yearId}/discussion`, { discussionData });
  },
};
