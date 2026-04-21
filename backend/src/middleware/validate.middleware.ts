import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../shared/ApiError";
import { AuthenticatedRequest } from "./auth.middleware";

type ValidatedRequest = AuthenticatedRequest;

export const validate = (schema: ZodSchema) => {
  return (req: ValidatedRequest, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errorDetails = result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        throw new ApiError(400, "Validation failed", true);
      }

      req.body = result.data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        return next(new ApiError(400, "Validation failed", true));
      }
      next(error);
    }
  };
};