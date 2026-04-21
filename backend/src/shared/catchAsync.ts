import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error) => {
      if (error instanceof ApiError) {
        return next(error);
      }
      return next(ApiError.internal(error.message));
    });
  };
};