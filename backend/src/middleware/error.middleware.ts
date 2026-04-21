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
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      ...(err.errorDetails && { errorDetails: err.errorDetails }),
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
    statusCode: 500,
  });
};