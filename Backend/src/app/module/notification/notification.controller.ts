import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import { NotificationService } from './notification.service.js';

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getUserNotifications(req.user!.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Notifications retrieved', data: result });
});

const markRead = catchAsync(async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const result = await NotificationService.markNotificationRead(id, req.user!.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Notification marked as read', data: result });
});

const markAllRead = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.markAllNotificationsRead(req.user!.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'All notifications marked as read', data: result });
});

export const NotificationController = { getNotifications, markRead, markAllRead };
