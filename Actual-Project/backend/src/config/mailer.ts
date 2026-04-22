import nodemailer from "nodemailer";
import { config } from "./index";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const createTransport = () => {
  if (!config.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: parseInt(config.SMTP_PORT),
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransport();

  if (!transporter) {
    console.log("=== EMAIL (SMTP not configured) ===");
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Text: ${options.text}`);
    console.log(`HTML: ${options.html || "N/A"}`);
    console.log("===================================");
    return;
  }

  await transporter.sendMail({
    from: config.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};