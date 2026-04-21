import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../shared/ApiError";
import {
  hashPassword,
  comparePassword,
  generateOTP,
  generateResetToken,
} from "./auth.utils";
import { config } from "../../config";
import { sendEmail } from "../../config/mailer";

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
    subject: "Verify your email",
    text: `Your OTP is: ${otp}. It expires in ${config.OTP_EXPIRES_MINUTES} minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in ${config.OTP_EXPIRES_MINUTES} minutes.</p>`,
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  return user;
};

export const logout = async (res: any) => {
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
    data: { password: hashedPassword },
  });
};

export const verifyEmail = async (email: string, otp: string) => {
  const otpRecord = await prisma.oTP.findFirst({
    where: {
      email,
      otp,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw ApiError.badRequest("Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw ApiError.badRequest("OTP has expired");
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  await prisma.oTP.delete({
    where: { id: otpRecord.id },
  });
};

export const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
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
    subject: "Resend OTP",
    text: `Your OTP is: ${otp}. It expires in ${config.OTP_EXPIRES_MINUTES} minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in ${config.OTP_EXPIRES_MINUTES} minutes.</p>`,
  });
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return;
  }

  const resetToken = generateResetToken();
  const hashedToken = resetToken;
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    text: `Use this token to reset your password: ${resetToken}`,
    html: `<p>Use this token to reset your password: <strong>${resetToken}</strong></p>`,
  });
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  const tokenRecord = await prisma.passwordResetToken.findFirst({
    where: {
      token,
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