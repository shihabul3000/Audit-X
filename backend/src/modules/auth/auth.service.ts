import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import {
  hashPassword,
  comparePassword,
  generateOTP,
  generateResetToken,
  auth,
} from "./auth.utils";
import { config } from "../../config";
import { sendEmail } from "../../config/mailer";
import crypto from "crypto";

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      emailVerified: false,
    },
  });

  const otp = generateOTP();
  const expiresAt = new Date(
    Date.now() + config.OTP_EXPIRES_MINUTES * 60 * 1000
  );

  await prisma.oTP.create({
    data: {
      email: user.email,
      otp,
      expiresAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Verify your email — Audit-X",
    text: `Your OTP is: ${otp}. It expires in ${config.OTP_EXPIRES_MINUTES} minutes.`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in ${config.OTP_EXPIRES_MINUTES} minutes.</p>`,
  });

  await prisma.account.create({
    data: {
      id: `acc_${user.id}`,
      accountId: user.id,
      providerId: "email",
      userId: user.id,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
  };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  if (user.isDeleted || user.status === "DELETED") {
    throw ApiError.unauthorized("Account has been deleted");
  }

  if (user.status === "BANNED") {
    throw ApiError.forbidden(
      `Your account has been suspended.${user.bannedReason ? ` Reason: ${user.bannedReason}` : ""}`
    );
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  if (!user.emailVerified) {
    // Still return user info so frontend can redirect to verify page
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: false,
      },
      requiresVerification: true,
    };
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      profileImage: user.profileImage,
      needPasswordChange: user.needPasswordChange,
    },
    requiresVerification: false,
  };
};

export const logout = async (res: any, req?: any) => {
  try {
    if (req) {
      await auth.api.signOut({ headers: req.headers });
    }
  } catch {
    // Ignore Better Auth signout errors
  }
  res.clearCookie("better-auth.session_token");
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const isValidPassword = await comparePassword(oldPassword, user.password);

  if (!isValidPassword) {
    throw ApiError.unauthorized("Invalid old password");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
};

export const verifyEmail = async (email: string, otp: string) => {
  const otpRecord = await prisma.oTP.findFirst({
    where: {
      email,
      otp,
      expiresAt: { gt: new Date() },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw ApiError.badRequest("Invalid or expired OTP");
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  // Clean up all OTPs for this email
  await prisma.oTP.deleteMany({
    where: { email },
  });
};

export const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (user.emailVerified) {
    throw ApiError.badRequest("Email is already verified");
  }

  await prisma.oTP.deleteMany({
    where: { email },
  });

  const otp = generateOTP();
  const expiresAt = new Date(
    Date.now() + config.OTP_EXPIRES_MINUTES * 60 * 1000
  );

  await prisma.oTP.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your new verification code — Audit-X",
    text: `Your OTP is: ${otp}. It expires in ${config.OTP_EXPIRES_MINUTES} minutes.`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in ${config.OTP_EXPIRES_MINUTES} minutes.</p>`,
  });
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Don't reveal whether user exists
  if (!user) {
    return;
  }

  // Invalidate any existing tokens
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const resetToken = generateResetToken();
  // Hash the token before storing
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt,
    },
  });

  const resetUrl = `${config.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password — Audit-X",
    text: `Click here to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p>`,
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  // Hash the incoming token to compare with stored hash
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const tokenRecord = await prisma.passwordResetToken.findFirst({
    where: {
      token: hashedToken,
      used: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!tokenRecord) {
    throw ApiError.badRequest("Invalid or expired token");
  }

  if (tokenRecord.expiresAt < new Date()) {
    throw ApiError.badRequest("Token has expired");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.update({
    where: { id: tokenRecord.id },
    data: { used: true },
  });
};