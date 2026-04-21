import { Response, NextFunction } from "express";
import { ApiError } from "../shared/ApiError";
import { AuthenticatedRequest } from "./auth.middleware";

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }

    next();
  };
};