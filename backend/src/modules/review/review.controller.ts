import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as reviewService from "./review.service";

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

export const submit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const result = await reviewService.submit(yearId, userId, role);
    sendResponse(res, 200, "Review submitted successfully", result);
  } catch (error) {
    next(error);
  }
};

export const startReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const result = await reviewService.startReview(yearId, userId, role);
    sendResponse(res, 200, "Review started successfully", result);
  } catch (error) {
    next(error);
  }
};

export const requestChanges = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const { note } = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const result = await reviewService.requestChanges(yearId, userId, role, note);
    sendResponse(res, 200, "Changes requested successfully", result);
  } catch (error) {
    next(error);
  }
};

export const finalize = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const { note } = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const result = await reviewService.finalize(yearId, userId, role, note);
    sendResponse(res, 200, "Review finalized successfully", result);
  } catch (error) {
    next(error);
  }
};

export const reopen = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const { note } = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const result = await reviewService.reopen(yearId, userId, role, note);
    sendResponse(res, 200, "Review reopened successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getQueue = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const queue = await reviewService.getQueue();
    sendResponse(res, 200, "Queue retrieved successfully", queue);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { yearId } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const events = await reviewService.getEvents(yearId, userId, role);
    sendResponse(res, 200, "Events retrieved successfully", events);
  } catch (error) {
    next(error);
  }
};