import { envVars } from '../config/env.js';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';

export const seedSuperAdmin = async () => {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: envVars.SUPER_ADMIN_EMAIL },
    });

    if (existing) {
      console.log('SuperAdmin already exists, skipping seed.');
      return;
    }

    // Create super admin via Better Auth
    await auth.api.signUpEmail({
      body: {
        name: envVars.SUPER_ADMIN_NAME,
        email: envVars.SUPER_ADMIN_EMAIL,
        password: envVars.SUPER_ADMIN_PASSWORD,
      },
    });

    // Update role to SUPER_ADMIN and mark email as verified
    await prisma.user.update({
      where: { email: envVars.SUPER_ADMIN_EMAIL },
      data: {
        role: 'SUPER_ADMIN',
        emailVerified: true,
        status: 'ACTIVE',
      },
    });

    console.log(`SuperAdmin seeded: ${envVars.SUPER_ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Failed to seed SuperAdmin:', error);
  }
};
