export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorDetails?: Array<{ path: string; message: string }>;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    errorDetails?: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorDetails = errorDetails;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errorDetails?: Array<{ path: string; message: string }>) {
    return new ApiError(400, message, true, errorDetails);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message, false);
  }
}