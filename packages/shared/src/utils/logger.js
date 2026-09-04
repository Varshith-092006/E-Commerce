import pino from 'pino';

const SENSITIVE_PATHS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'cardNumber',
  'card_number',
  'cvv',
  'accountNumber',
  'account_number',
  'ifsc',
  'upiId',
  'upi_id',
  'authorization',
  'cookie',
  'headers.authorization',
  'headers.cookie',
  'headers["x-internal-secret"]',
  'headers["x-internal-gateway-secret"]',
  'body.password',
  'body.token',
  'body.cardNumber',
  'body.accountNumber',
  'apiKey',
  'api_key',
  'keySecret',
  'razorpay_key_secret',
  'DATABASE_URL',
];

/**
 * Creates a structured JSON Pino logger with sensitive field redaction
 *
 * @param {Object} options
 * @param {string} options.service - Name of the service owning this logger
 * @param {string} [options.level='info'] - Log level
 * @returns {pino.Logger}
 */
export function createLogger({
  service = 'ecommerce-service',
  level = process.env.LOG_LEVEL || 'info',
  traceId = undefined,
  spanId = undefined,
  requestId = undefined,
} = {}) {
  const base = {
    service,
    env: process.env.NODE_ENV || 'development',
  };
  if (traceId) {
    base.traceId = traceId;
  }
  if (spanId) {
    base.spanId = spanId;
  }
  if (requestId) {
    base.requestId = requestId;
  }

  const instance = pino({
    level,
    base,
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: SENSITIVE_PATHS,
      censor: '[REDACTED]',
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  });

  instance.withContext = ({ traceId: tId, spanId: sId, requestId: rId } = {}) => {
    const bindings = {};
    if (tId) {
      bindings.traceId = tId;
    }
    if (sId) {
      bindings.spanId = sId;
    }
    if (rId) {
      bindings.requestId = rId;
    }
    return instance.child(bindings);
  };

  return instance;
}

export const logger = createLogger();
