import { Request, Response, NextFunction } from "express";
import { ApiError } from "../shared/ApiError";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    statusCode: 500,
  });
};