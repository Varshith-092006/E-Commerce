import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  ServiceUnavailableError,
  ErrorCodes,
} from '../../src/index.js';

describe('Shared Error Hierarchy', () => {
  it('AppError creates base error with default status 500', () => {
    const err = new AppError({ message: 'Server exploded' });
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(500);
    expect(err.errorCode).toBe(ErrorCodes.INTERNAL_ERROR);
    expect(err.toJSON()).toEqual({
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'Server exploded',
      details: {},
    });
  });

  it('BadRequestError sets 400 and BAD_REQUEST code', () => {
    const err = new BadRequestError('Invalid input', { field: 'name' });
    expect(err.statusCode).toBe(400);
    expect(err.errorCode).toBe(ErrorCodes.BAD_REQUEST);
    expect(err.details).toEqual({ field: 'name' });
  });

  it('ValidationError sets 422 and VALIDATION_ERROR code', () => {
    const err = new ValidationError('Email is invalid', { email: 'bad format' });
    expect(err.statusCode).toBe(422);
    expect(err.errorCode).toBe(ErrorCodes.VALIDATION_ERROR);
  });

  it('UnauthorizedError sets 401 and UNAUTHORIZED code', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.errorCode).toBe(ErrorCodes.UNAUTHORIZED);
  });

  it('ForbiddenError sets 403 and FORBIDDEN code', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.errorCode).toBe(ErrorCodes.FORBIDDEN);
  });

  it('NotFoundError sets 404 and NOT_FOUND code', () => {
    const err = new NotFoundError('Product not found');
    expect(err.statusCode).toBe(404);
    expect(err.errorCode).toBe(ErrorCodes.NOT_FOUND);
  });

  it('ConflictError sets 409 and CONFLICT code', () => {
    const err = new ConflictError('Email already registered');
    expect(err.statusCode).toBe(409);
    expect(err.errorCode).toBe(ErrorCodes.CONFLICT);
  });

  it('RateLimitError sets 429 and isRetryable = true', () => {
    const err = new RateLimitError('Too many requests');
    expect(err.statusCode).toBe(429);
    expect(err.errorCode).toBe(ErrorCodes.RATE_LIMITED);
    expect(err.isRetryable).toBe(true);
  });

  it('ServiceUnavailableError sets 503 and isRetryable = true', () => {
    const err = new ServiceUnavailableError('Redis down', ErrorCodes.REDIS_UNAVAILABLE);
    expect(err.statusCode).toBe(503);
    expect(err.errorCode).toBe(ErrorCodes.REDIS_UNAVAILABLE);
    expect(err.isRetryable).toBe(true);
  });
});
