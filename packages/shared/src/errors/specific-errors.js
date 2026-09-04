import { AppError } from './app-error.js';
import { ErrorCodes } from './error-codes.js';

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details = {}) {
    super({
      message,
      statusCode: 400,
      errorCode: ErrorCodes.BAD_REQUEST,
      details,
    });
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = {}) {
    super({
      message,
      statusCode: 422,
      errorCode: ErrorCodes.VALIDATION_ERROR,
      details,
    });
  }
}

export class BusinessRuleError extends AppError {
  constructor(message = 'Business rule violation', details = {}) {
    super({
      message,
      statusCode: 422,
      errorCode: ErrorCodes.BUSINESS_RULE_VIOLATION,
      details,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', details = {}) {
    super({
      message,
      statusCode: 401,
      errorCode: ErrorCodes.UNAUTHORIZED,
      details,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', details = {}) {
    super({
      message,
      statusCode: 403,
      errorCode: ErrorCodes.FORBIDDEN,
      details,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details = {}) {
    super({
      message,
      statusCode: 404,
      errorCode: ErrorCodes.NOT_FOUND,
      details,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details = {}) {
    super({
      message,
      statusCode: 409,
      errorCode: ErrorCodes.CONFLICT,
      details,
    });
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.', details = {}) {
    super({
      message,
      statusCode: 429,
      errorCode: ErrorCodes.RATE_LIMITED,
      details,
      isRetryable: true,
    });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(
    message = 'Service temporarily unavailable',
    errorCode = ErrorCodes.SERVICE_UNAVAILABLE,
    details = {},
  ) {
    super({
      message,
      statusCode: 503,
      errorCode,
      details,
      isRetryable: true,
    });
  }
}
