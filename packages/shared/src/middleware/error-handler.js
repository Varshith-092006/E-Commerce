import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';
import { errorResponse } from '../utils/response.js';

/**
 * Standard Express global error-handling middleware conforming to master_prompt §5.4
 */
export function errorHandlerMiddleware(err, req, res, _next) {
  const requestId = req.id || req.requestId || 'unknown';

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      errorResponse({
        code: err.errorCode,
        message: err.message,
        details: err.details,
        requestId,
      }),
    );
  }

  // Handle syntax errors from body-parser
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(
      errorResponse({
        code: ErrorCodes.BAD_REQUEST,
        message: 'Malformed JSON payload in request body',
        details: {},
        requestId,
      }),
    );
  }

  // Unhandled / Internal errors
  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd ? 'Internal Server Error' : err.message || 'Internal Server Error';

  return res.status(500).json(
    errorResponse({
      code: ErrorCodes.INTERNAL_ERROR,
      message,
      details: {},
      requestId,
    }),
  );
}

/**
 * 404 Not Found fallback middleware
 */
export function notFoundHandlerMiddleware(req, res) {
  const requestId = req.id || req.requestId || 'unknown';
  return res.status(404).json(
    errorResponse({
      code: ErrorCodes.NOT_FOUND,
      message: `Route not found: ${req.method} ${req.originalUrl || req.url}`,
      details: {},
      requestId,
    }),
  );
}
