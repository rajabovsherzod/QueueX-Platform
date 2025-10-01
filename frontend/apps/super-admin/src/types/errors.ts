export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly response?: Record<string, unknown> | Array<unknown> | null;
  public readonly timestamp: string;

  constructor(
    message: string,
    statusCode: number = 500,
    response?: Record<string, unknown> | Array<unknown> | null
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.response = response;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      response: this.response,
      stack: this.stack,
    };
  }
}

export class AuthError extends ApiError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Access forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  public readonly errors: Record<string, string[]>;

  constructor(
    message: string = "Validation failed",
    errors: Record<string, string[]> = {}
  ) {
    super(message, 422);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = "Network error occurred") {
    super(message, 0);
    this.name = "NetworkError";
  }
}
