import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as notificationService from "./notification.service";

const sendResponse = ( res: Response, statusCode: number, message: string, data: unknown ) => {
  res.status(statusCode).json({ success: true, message, statusCode, data });
};

export const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await notificationService.getAll(req.user!.id, {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    sendResponse(res, 200, "Notifications fetched successfully", notifications);
  } catch (error) { next(error); }
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await notificationService.getUnreadCount(req.user!.id);
    sendResponse(res, 200, "Unread count fetched", data);
  } catch (error) { next(error); }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user!.id);
    sendResponse(res, 200, "Notification marked as read", notification);
  } catch (error) { next(error); }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.markAllAsRead(req.user!.id);
    sendResponse(res, 200, "All notifications marked as read", result);
  } catch (error) { next(error); }
};
