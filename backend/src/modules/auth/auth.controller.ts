import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as authService from "./auth.service";
import { auth } from "./auth.utils";

const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown
) => {
  res.status(statusCode).json({
    success: true,
    message,
    statusCode,
    data,
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    sendResponse(res, 201, "User registered successfully. Please verify your email.", user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (result.requiresVerification) {
      return sendResponse(res, 200, "Email verification required", {
        user: result.user,
        requiresVerification: true,
      });
    }

    // Attempt to create a Better Auth session for cookie-based auth.
    // This may fail if the user was created via the custom register flow
    // (no Better Auth account record). Fail silently — the custom auth
    // middleware handles session validation independently.
    try {
      const session = await auth.api.signInEmail({
        body: { email, password },
      });

      if (session && 'headers' in session) {
        const setCookieHeader = (session as any).headers?.get?.("set-cookie");
        if (setCookieHeader) {
          res.setHeader("set-cookie", setCookieHeader);
        }
      }
    } catch {
      // Better Auth session creation failed — custom session will be used
    }

    sendResponse(res, 200, "Login successful", {
      user: result.user,
      requiresVerification: false,
    });
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
    await authService.logout(res, req);
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
  req: Request,
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
  req: Request,
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
  req: Request,
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
  req: Request,
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