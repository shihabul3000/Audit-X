import { Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../shared/ApiError";
import { AuthenticatedRequest } from "./auth.middleware";

export const validate = (schema: ZodSchema) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorDetails = result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return next(ApiError.badRequest("Validation failed", errorDetails));
    }

    req.body = result.data;
    next();
  };
};