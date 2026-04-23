import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import { UserService } from './user.service.js';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Users retrieved', data: result });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'User retrieved', data: result });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.user!.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Profile retrieved', data: result });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser(req.params.id, req.body);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'User updated', data: result });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.softDeleteUser(req.params.id);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'User deleted', data: result });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdminUser(req.body, 'ADMIN');
  sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: 'Admin created', data: result });
});

const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdminUser(req.body, 'SUPER_ADMIN');
  sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: 'Super Admin created', data: result });
});

export const UserController = {
  getAllUsers, getUserById, getMe, updateUser, softDeleteUser, createAdmin, createSuperAdmin,
};
