import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, emailOTP } from 'better-auth/plugins';
import { envVars } from '../config/env.js';
import { sendOTPEmail } from '../utils/email.js';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => ({
        role: 'STUDENT',
        status: 'ACTIVE',
        needPasswordChange: false,
        emailVerified: true,
        isDeleted: false,
        deletedAt: null,
      }),
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'STUDENT',
      },
      status: {
        type: 'string',
        required: true,
        defaultValue: 'ACTIVE',
      },
      needPasswordChange: {
        type: 'boolean',
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: 'boolean',
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: 'date',
        required: false,
        defaultValue: null,
      },
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return;
          // Skip OTP for super admins (seeded accounts)
          if (user.role === 'SUPER_ADMIN') return;
          if (!user.emailVerified) {
            await sendOTPEmail(email, user.name, otp);
          }
        } else if (type === 'forget-password') {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            await sendOTPEmail(email, user.name, otp);
          }
        }
      },
      expiresIn: 10 * 60, // 10 minutes
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },

  trustedOrigins: [
    envVars.FRONTEND_URL,
    envVars.BETTER_AUTH_URL,
    'http://localhost:3000',
    'http://localhost:5000',
  ],

  advanced: {
    useSecureCookies: false,
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: 'lax',
          httpOnly: true,
          path: '/',
        },
      },
    },
  },
});
