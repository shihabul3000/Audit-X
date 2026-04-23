import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import AppError from '../errorHelpers/AppError.js';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';

type AllowedRole = 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';

export const checkAuth = (...authRoles: AllowedRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use Better Auth to get the session from the request
      const session = await auth.api.getSession({ headers: req.headers as Headers });

      if (!session || !session.user) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized: No valid session found.');
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized: User not found.');
      }

      if (user.isDeleted || user.status === 'DELETED') {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized: Account has been deleted.');
      }

      if (user.status === 'BLOCKED') {
        throw new AppError(status.FORBIDDEN, 'Forbidden: Your account has been blocked.');
      }

      if (authRoles.length > 0 && !authRoles.includes(user.role as AllowedRole)) {
        throw new AppError(status.FORBIDDEN, 'Forbidden: You do not have permission to access this resource.');
      }

      req.user = {
        userId: user.id,
        role: user.role as AllowedRole,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
