/**
 * Builds a standardized API success envelope conforming to master_prompt §5.4
 *
 * @param {Object} options
 * @param {*} options.data - Payload data
 * @param {string} options.requestId - Correlation/Request ID
 * @param {Object} [options.extraMeta={}] - Additional metadata (e.g. pagination)
 * @returns {Object} Standard success envelope
 */
export function successResponse({ data = {}, requestId, extraMeta = {} }) {
  return {
    success: true,
    data,
    meta: {
      requestId: requestId || 'unknown',
      ...extraMeta,
    },
  };
}

/**
 * Builds a standardized API error envelope conforming to master_prompt §5.4
 *
 * @param {Object} options
 * @param {string} options.code - Machine readable error code
 * @param {string} options.message - User safe error message
 * @param {Object} [options.details={}] - Specific field-level error details
 * @param {string} options.requestId - Correlation/Request ID
 * @returns {Object} Standard error envelope
 */
export function errorResponse({
  code = 'INTERNAL_ERROR',
  message = 'An unexpected error occurred',
  details = {},
  requestId,
}) {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      requestId: requestId || 'unknown',
    },
  };
}
