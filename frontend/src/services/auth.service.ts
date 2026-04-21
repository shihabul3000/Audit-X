import httpClient from './httpClient';

const AUTH_URL = '/auth';

export const authService = {
  getMe: async () => {
    return httpClient.get(`${AUTH_URL}/me`);
  },

  register: async (data: any) => {
    return httpClient.post(`${AUTH_URL}/register`, data);
  },

  login: async (data: any) => {
    return httpClient.post(`${AUTH_URL}/login`, data);
  },

  logout: async () => {
    return httpClient.post(`${AUTH_URL}/logout`);
  },

  verifyEmail: async (data: { email: string; otp: string }) => {
    return httpClient.post(`${AUTH_URL}/verify-email`, data);
  },

  resendOtp: async (email: string) => {
    return httpClient.post(`${AUTH_URL}/resend-otp`, { email });
  },

  forgotPassword: async (email: string) => {
    return httpClient.post(`${AUTH_URL}/forgot-password`, { email });
  },

  resetPassword: async (data: any) => {
    return httpClient.post(`${AUTH_URL}/reset-password`, data);
  },

  changePassword: async (data: any) => {
    return httpClient.post(`${AUTH_URL}/change-password`, data);
  },
};
