import { Request, Response, NextFunction } from "express";
import { auth } from "../modules/auth/auth.utils";
import { prisma } from "../config/prismaClient";
import { ApiError } from "../shared/ApiError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      throw ApiError.unauthorized("Authentication required");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    if (user.isDeleted) {
      throw ApiError.unauthorized("Account has been deleted");
    }

    if (user.status === "DELETED") {
      throw ApiError.unauthorized("Account has been deleted");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    };

    next();
  } catch (error) {
    next(error);
  }
};