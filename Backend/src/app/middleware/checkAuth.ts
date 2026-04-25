import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import AppError from '../errorHelpers/AppError.js';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';

type AllowedRole = 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';

export const checkAuth = (...authRoles: AllowedRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert Node.js IncomingHttpHeaders to fetch Headers
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      });

      const session = await auth.api.getSession({ headers });

      if (!session || !session.user) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized: No valid session found.');
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } });

      if (!user) throw new AppError(status.UNAUTHORIZED, 'Unauthorized: User not found.');
      if (user.isDeleted || user.status === 'DELETED') throw new AppError(status.UNAUTHORIZED, 'Account has been deleted.');
      if (user.status === 'BLOCKED') throw new AppError(status.FORBIDDEN, 'Your account has been blocked.');

      if (authRoles.length > 0 && !authRoles.includes(user.role as AllowedRole)) {
        throw new AppError(status.FORBIDDEN, 'You do not have permission to access this resource.');
      }

      req.user = { userId: user.id, role: user.role as AllowedRole, email: user.email };
      next();
    } catch (error) {
      next(error);
    }
  };
