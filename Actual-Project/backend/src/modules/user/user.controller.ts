import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { ApiError } from "../../shared/ApiError";
import * as userService from "./user.service";

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

export const getAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, role, status, searchTerm } = req.query;
    const result = await userService.getAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      role: role as string | undefined,
      status: status as string | undefined,
      searchTerm: searchTerm as string | undefined,
    });
    sendResponse(res, 200, "Users fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getById(req.params.id);
    sendResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await userService.createUser({ name, email, password, role });
    sendResponse(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    sendResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.body;
    const user = await userService.changeRole(req.params.id, role);
    sendResponse(res, 200, "Role changed successfully", user);
  } catch (error) {
    next(error);
  }
};

export const ban = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reason } = req.body;
    const user = await userService.ban(req.params.id, reason, req.user?.id);
    sendResponse(res, 200, "User banned successfully", user);
  } catch (error) {
    next(error);
  }
};

export const unban = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.unban(req.params.id);
    sendResponse(res, 200, "User unbanned successfully", user);
  } catch (error) {
    next(error);
  }
};

export const softDelete = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.softDelete(req.params.id);
    sendResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getMyProfile(req.user!.id);
    sendResponse(res, 200, "Profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateMyProfile(req.user!.id, req.body);
    sendResponse(res, 200, "Profile updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(ApiError.badRequest("No file uploaded"));
    }

    const user = await userService.uploadProfileImage(req.user!.id, req.file.filename);
    sendResponse(res, 200, "Profile image uploaded successfully", user);
  } catch (error) {
    next(error);
  }
};
