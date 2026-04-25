import { ZodError } from "zod";
import { prisma } from "./prisma";

export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
  }
}

export class ValidationError extends AppError {
  errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    const message = Object.entries(errors)
      .map(([key, value]) => `${key}: ${value.join(", ")}`)
      .join("; ");
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export function handleZodError(error: ZodError): ValidationError {
  const errors: Record<string, string[]> = {};
  error.issues.forEach((err: any) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });
  return new ValidationError(errors);
}

export async function errorHandler(error: unknown) {
  console.error("Error:", error);

  if (error instanceof AppError) {
    return Response.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          ...(error instanceof ValidationError && { errors: error.errors }),
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const validationError = handleZodError(error);
    return Response.json(
      {
        success: false,
        error: {
          message: validationError.message,
          code: validationError.code,
          errors: validationError.errors,
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return Response.json(
      {
        success: false,
        error: {
          message: error.message,
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      success: false,
      error: {
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
    },
    { status: 500 }
  );
}

export function apiResponse<T>(data: T, statusCode = 200) {
  return Response.json({ success: true, data }, { status: statusCode });
}

export function apiError(error: unknown) {
  return errorHandler(error);
}