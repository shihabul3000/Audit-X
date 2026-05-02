const { execSync } = require('child_process');

const envs = {
  DATABASE_URL: process.env.DATABASE_URL || "YOUR_DATABASE_URL",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "YOUR_BETTER_AUTH_SECRET",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "https://your-backend.vercel.app",
  FRONTEND_URL: process.env.FRONTEND_URL || "https://your-frontend.vercel.app",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: process.env.SMTP_PORT || "587",
  SMTP_USER: process.env.SMTP_USER || "your-email@gmail.com",
  SMTP_PASS: process.env.SMTP_PASS || "YOUR_SMTP_APP_PASSWORD",
  EMAIL_FROM: process.env.EMAIL_FROM || "Audit-X <your-email@gmail.com>",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "https://your-backend.vercel.app/api/auth/callback/google",
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL || "super@auditx.com",
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "YOUR_SUPER_ADMIN_PASSWORD",
  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME || "Super Admin"
};

for (const [key, value] of Object.entries(envs)) {
  console.log(`Adding ${key}...`);
  try {
    execSync(`node -e "process.stdout.write('${value}')" | npx vercel env add ${key} production --force`, { stdio: 'inherit' });
    execSync(`node -e "process.stdout.write('${value}')" | npx vercel env add ${key} preview --force`, { stdio: 'inherit' });
    execSync(`node -e "process.stdout.write('${value}')" | npx vercel env add ${key} development --force`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to add ${key}`);
  }
}
