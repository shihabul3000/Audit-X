import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as statsService from "./stats.service";

const sendResponse = ( res: Response, statusCode: number, message: string, data: unknown ) => {
  res.status(statusCode).json({ success: true, message, statusCode, data });
};

export const getSystemStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await statsService.getSystemStats();
    sendResponse(res, 200, "System stats fetched successfully", stats);
  } catch (error) { next(error); }
};

export const getAdminStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await statsService.getAdminStats(req.user!.id);
    sendResponse(res, 200, "Admin stats fetched successfully", stats);
  } catch (error) { next(error); }
};
