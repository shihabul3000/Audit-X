import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as financialYearService from "./financialYear.service";

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
    const { cId } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const years = await financialYearService.getAll(cId, userId, role);
    sendResponse(res, 200, "Financial years retrieved successfully", years);
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
    const { cId, yId } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const year = await financialYearService.getById(cId, yId, userId, role);
    sendResponse(res, 200, "Financial year retrieved successfully", year);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cId } = req.params;
    const { reportingDate } = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const year = await financialYearService.create(cId, reportingDate, userId, role);
    sendResponse(res, 201, "Financial year created successfully", year);
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
    const { cId, yId } = req.params;
    const data = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const year = await financialYearService.update(cId, yId, data, userId, role);
    sendResponse(res, 200, "Financial year updated successfully", year);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cId, yId } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    await financialYearService.remove(cId, yId, userId, role);
    sendResponse(res, 200, "Financial year deleted successfully", { success: true });
  } catch (error) {
    next(error);
  }
};

export const rollover = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cId, yId } = req.params;
    const { newReportingDate } = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const year = await financialYearService.rollover(cId, yId, newReportingDate, userId, role);
    sendResponse(res, 201, "Financial year rolled over successfully", year);
  } catch (error) {
    next(error);
  }
};