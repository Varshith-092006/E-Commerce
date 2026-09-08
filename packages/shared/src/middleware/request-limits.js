import express from 'express';

/**
 * Checks URI length to protect against buffer overflow / URL-based denial of service.
 *
 * @param {number} [maxUriLength=2048] - Maximum permitted URI character length
 * @returns {import('express').RequestHandler}
 */
export function createUriLengthCheck(maxUriLength = 2048) {
  return function uriLengthCheck(req, res, next) {
    const rawUrl = req.originalUrl || req.url || '';
    if (rawUrl.length > maxUriLength) {
      return res.status(414).json({
        success: false,
        error: {
          code: 'URI_TOO_LONG',
          message: `Requested URI exceeds maximum permitted length of ${maxUriLength} characters (received: ${rawUrl.length}).`,
        },
      });
    }
    next();
  };
}

/**
 * Error handler for body-parser entity.too.large errors.
 * Formats oversized body errors to standardized HTTP 413 JSON responses.
 *
 * @returns {import('express').ErrorRequestHandler}
 */
export function requestSizeErrorHandler() {
  return function (err, req, res, next) {
    if (err && (err.type === 'entity.too.large' || err.status === 413 || err.statusCode === 413)) {
      return res.status(413).json({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request payload exceeds permitted size limit.',
          limit: err.limit,
          receivedBytes: err.length || err.expected,
        },
      });
    }
    next(err);
  };
}

/**
 * Creates standard request size bounding middleware.
 *
 * @param {Object} [options]
 * @param {string|number} [options.jsonLimit] - JSON body size limit (default: REQUEST_SIZE_LIMIT_JSON || '1mb')
 * @param {string|number} [options.urlEncodedLimit] - URL-encoded size limit (default: REQUEST_SIZE_LIMIT_URLENCODED || '1mb')
 * @param {number} [options.maxUriLength] - Max URI character length (default: 2048)
 * @returns {import('express').Router}
 */
export function createRequestLimitsMiddleware(options = {}) {
  const router = express.Router();

  const maxUriLength = options.maxUriLength || parseInt(process.env.MAX_URI_LENGTH, 10) || 2048;
  const jsonLimit = options.jsonLimit || process.env.REQUEST_SIZE_LIMIT_JSON || '1mb';
  const urlEncodedLimit =
    options.urlEncodedLimit || process.env.REQUEST_SIZE_LIMIT_URLENCODED || '1mb';

  // 1. Enforce URI Length
  router.use(createUriLengthCheck(maxUriLength));

  // 2. Bounded body parsers
  router.use(express.json({ limit: jsonLimit, verify: options.verify }));
  router.use(express.urlencoded({ extended: true, limit: urlEncodedLimit }));

  // 3. Catch size parser errors
  router.use(requestSizeErrorHandler());

  return router;
}
