import nodemailer from 'nodemailer';
import { envVars } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: parseInt(envVars.SMTP_PORT),
  secure: false,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  await transporter.sendMail({
    from: envVars.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export const sendOTPEmail = async (to: string, name: string, otp: string) => {
  await sendEmail({
    to,
    subject: 'Verify your Audit-X account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Audit-X Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Your verification code is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #1a1a2e; letter-spacing: 8px; font-size: 36px;">${otp}</h1>
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};
