import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import z from 'zod';
import AppError from '../errorHelpers/AppError.js';
import { TErrorResponse, TErrorSources } from '../interfaces/error.interface.js';

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let stack: string | undefined;

  if (err instanceof z.ZodError) {
    statusCode = status.BAD_REQUEST;
    message = 'Validation Error';
    errorSources = err.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
