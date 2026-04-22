import httpClient from './httpClient';

const API_URL = '/reviews';

export const reviewService = {
  getQueue: async () => {
    return httpClient.get(`${API_URL}/queue`);
  },

  submitForReview: async (yearId: string) => {
    return httpClient.post(`${API_URL}/${yearId}/submit`);
  },

  startReview: async (yearId: string) => {
    return httpClient.post(`${API_URL}/${yearId}/start-review`);
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
