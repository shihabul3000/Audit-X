import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as authService from "./auth.service";

const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown
) => {
  res.status(statusCode).json({
    message,
    statusCode,
    data,
  });
};

export const register = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    sendResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    sendResponse(res, 200, "Login successful", user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.logout(res);
    sendResponse(res, 200, "Logout successful", null);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getMe(req.user!.id);
    sendResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.id, oldPassword, newPassword);
    sendResponse(res, 200, "Password changed successfully", null);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyEmail(email, otp);
    sendResponse(res, 200, "Email verified successfully", null);
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await authService.resendOtp(email);
    sendResponse(res, 200, "OTP resent successfully", null);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    sendResponse(res, 200, "If the email exists, a reset link has been sent", null);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    sendResponse(res, 200, "Password reset successfully", null);
  } catch (error) {
    next(error);
  }
};