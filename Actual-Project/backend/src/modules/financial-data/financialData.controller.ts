import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as financialDataService from "./financialData.service";

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

export const getFullData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const data = await financialDataService.getFullData(yearId, userId, role);
    sendResponse(res, 200, "Financial data retrieved successfully", data);
  } catch (error) {
    next(error);
  }
};

export const updateAuditReportData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const partial = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;
    const status = req.user!.status;

    const data = await financialDataService.updateAuditReportData(
      yearId,
      partial,
      userId,
      role,
      status
    );
    sendResponse(res, 200, "Audit report data updated successfully", data);
  } catch (error) {
    next(error);
  }
};

export const updateNotesData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const partial = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;
    const status = req.user!.status;

    const data = await financialDataService.updateNotesData(
      yearId,
      partial,
      userId,
      role,
      status
    );
    sendResponse(res, 200, "Notes data updated successfully", data);
  } catch (error) {
    next(error);
  }
};

export const updateDiscussionData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const partial = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;
    const status = req.user!.status;

    const data = await financialDataService.updateDiscussionData(
      yearId,
      partial,
      userId,
      role,
      status
    );
    sendResponse(res, 200, "Discussion data updated successfully", data);
  } catch (error) {
    next(error);
  }
};