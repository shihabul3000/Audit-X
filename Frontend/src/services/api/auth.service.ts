import httpClient from '@/lib/axios/httpClient';

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface UserCompanyAssignment {
  companyId: string;
  company: { id: string; name: string; isDeleted: boolean };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  emailVerified: boolean;
  image?: string;
  companyAssignments?: UserCompanyAssignment[];
}

export const authService = {
  async signUp(params: SignUpParams) {
    const res = await httpClient.post('/api/auth/sign-up/email', params);
    return res.data;
  },

  async signIn(params: SignInParams) {
    const res = await httpClient.post('/api/auth/sign-in/email', params);
    return res.data;
  },

  async signOut() {
    await httpClient.post('/api/auth/sign-out');
  },

  async getSession() {
    const res = await httpClient.get('/api/auth/get-session');
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await httpClient.get('/api/v1/users/me');
    return res.data.data;
  },
};
