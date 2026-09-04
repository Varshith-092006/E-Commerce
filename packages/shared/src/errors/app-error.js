import { ErrorCodes } from './error-codes.js';

export class AppError extends Error {
  constructor({
    message,
    statusCode = 500,
    errorCode = ErrorCodes.INTERNAL_ERROR,
    details = {},
    isOperational = true,
    isRetryable = false,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;
    this.isRetryable = isRetryable;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.errorCode,
      message: this.message,
      details: this.details,
    };
  }
}
