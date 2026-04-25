import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

// Use relative URL so requests go through Next.js proxy (no CORS)
// The proxy at /api/auth/[...all] forwards to the backend
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: 'string' },
        status: { type: 'string' },
        needPasswordChange: { type: 'boolean' },
        isDeleted: { type: 'boolean' },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
