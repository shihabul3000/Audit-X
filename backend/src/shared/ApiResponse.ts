export class ApiResponse {
  statusCode: number;
  data: unknown;
  message: string;

  constructor(statusCode: number, data: unknown, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  static success(data: unknown, message = "Success") {
    return new ApiResponse(200, data, message);
  }

  static created(data: unknown, message = "Created successfully") {
    return new ApiResponse(201, data, message);
  }
}