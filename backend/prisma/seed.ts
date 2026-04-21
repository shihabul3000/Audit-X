import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default Super Admin...');

  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  });

  if (existingSuperAdmin) {
    console.log('Super Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@123456', 12);

  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@audit-x.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      needPasswordChange: false,
    }
  });

  console.log('Super Admin seeded successfully: admin@audit-x.com / Admin@123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
