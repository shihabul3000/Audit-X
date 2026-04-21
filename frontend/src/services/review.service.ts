import httpClient from './httpClient';

const API_URL = '/reviews';

export const reviewService = {
  getPendingReviews: async (page = 1, limit = 10) => {
    return httpClient.get(`${API_URL}/pending?page=${page}&limit=${limit}`);
  },

  submitForReview: async (yearId: string) => {
    return httpClient.post(`${API_URL}/${yearId}/submit`);
  },

  startReview: async (yearId: string) => {
    return httpClient.post(`${API_URL}/${yearId}/start`);
  },

  requestChanges: async (yearId: string, note: string) => {
    return httpClient.post(`${API_URL}/${yearId}/request-changes`, { note });
  },

  finalizeReview: async (yearId: string) => {
    return httpClient.post(`${API_URL}/${yearId}/finalize`);
  },

  getReviewEvents: async (yearId: string) => {
    return httpClient.get(`${API_URL}/${yearId}/events`);
  },
};
