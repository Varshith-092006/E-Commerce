/**
 * Centralized Production Secret Validator
 *
 * Enforces production-grade secret hygiene across all microservices and the API gateway.
 * In production (NODE_ENV === 'production'):
 * - All critical service secrets must be explicitly provided.
 * - Empty or whitespace-only secrets are rejected.
 * - Known development, test, and placeholder default secrets are strictly rejected.
 * - Secrets must satisfy a minimum length constraint (default: 32 characters).
 * - Immediate fail-fast termination (process.exit(1)) is triggered with a sanitized error.
 * - Error messages never print or leak secret values.
 *
 * In non-production (development, test):
 * - Development and test workflows are preserved using safe fallbacks.
 */

export class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Registry of known development, test, and placeholder secrets that must NEVER be used in production.
 */
export const FORBIDDEN_DEV_SECRETS = Object.freeze([
  'ecom_internal_mesh_secret_2026',
  'ecom_default_jwt_secret_dev_only_change_in_prod',
  'ecom_default_refresh_secret_dev_only_change_in_prod',
  'ecom_jwt_secret_dev_2026_test_key_32_chars',
  'ecom_super_secret_jwt_key_development_only_change_in_prod_2026',
  'test_internal_secret_123',
  'test-internal-secret-gateway',
  'test-jwt-secret-32chars-long!!!',
  'test_jwt_secret_for_phase5_e2e_verification_key_32bytes',
  'internal-secret',
  'secret',
  'changeme',
  'password',
  'default_secret',
  'dev_secret',
  'test_secret',
  'REPLACE_WITH_STRONG_SECRET_32_CHARS_MIN',
  'REPLACE_WITH_STRONG_SECRET_MIN_32_CHARS',
  'REPLACE_WITH_STRONG_JWT_SECRET_MIN_32_CHARS',
  'REPLACE_WITH_STRONG_JWT_SECRET_32_CHARS_MIN',
  '<SECRET_INTERNAL_MESH_KEY>',
  '<SECRET_JWT_SIGNING_KEY_MIN_32_CHARS>',
  '<GENERATE_64_CHAR_HEX_SECRET>',
  '<GENERATE_64_CHAR_SECRET>',
]);

/**
 * Validates a single secret for production safety.
 *
 * @param {Object} options
 * @param {string} options.name - Environment variable name (e.g. 'JWT_SECRET')
 * @param {string|undefined} options.value - The resolved secret value
 * @param {string} [options.env=process.env.NODE_ENV] - Current runtime environment
 * @param {number} [options.minLength=32] - Minimum character length for production
 * @param {readonly string[]} [options.forbiddenValues=FORBIDDEN_DEV_SECRETS] - Rejected placeholder secrets
 * @param {boolean} [options.exitOnFailure=true] - Whether to call process.exit(1) on failure
 * @param {Function} [options.exitHandler=process.exit] - Termination function
 * @param {Object} [options.logger=console] - Logger interface
 * @returns {{ valid: boolean }}
 */
export function validateProductionSecret({
  name,
  value,
  env = process.env.NODE_ENV || 'development',
  minLength = 32,
  forbiddenValues = FORBIDDEN_DEV_SECRETS,
  exitOnFailure = true,
  exitHandler = process.exit,
  logger = console,
} = {}) {
  const isProd = env === 'production';

  // In non-production, missing or development values are permissible
  if (!isProd) {
    return { valid: true };
  }

  let errorMessage = null;

  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    errorMessage = `[FATAL CONFIGURATION ERROR] ${name} is required in production and must not be empty.`;
  } else if (typeof value !== 'string') {
    errorMessage = `[FATAL CONFIGURATION ERROR] ${name} must be a valid string in production.`;
  } else {
    const trimmed = value.trim();
    const isForbidden = forbiddenValues.some(
      (forbidden) => forbidden.toLowerCase() === trimmed.toLowerCase(),
    );

    if (isForbidden) {
      errorMessage = `[FATAL CONFIGURATION ERROR] ${name} is configured with a known insecure development or placeholder secret. A strong, cryptographically secure secret must be configured for production.`;
    } else if (trimmed.length < minLength) {
      errorMessage = `[FATAL CONFIGURATION ERROR] ${name} must be at least ${minLength} characters in production (got ${trimmed.length} characters).`;
    }
  }

  if (errorMessage) {
    if (logger && typeof logger.error === 'function') {
      logger.error(errorMessage);
    }
    if (exitOnFailure && typeof exitHandler === 'function') {
      exitHandler(1);
    }
    throw new ConfigurationError(errorMessage);
  }

  return { valid: true };
}

/**
 * Validates a batch of production secrets.
 *
 * @param {Object} options
 * @param {string[]} [options.secrets=['INTERNAL_GATEWAY_SECRET', 'JWT_SECRET']]
 * @param {Record<string, string>} [options.values={}]
 * @param {string} [options.env=process.env.NODE_ENV]
 * @param {number} [options.minLength=32]
 * @param {readonly string[]} [options.forbiddenValues=FORBIDDEN_DEV_SECRETS]
 * @param {boolean} [options.exitOnFailure=true]
 * @param {Function} [options.exitHandler=process.exit]
 * @param {Object} [options.logger=console]
 * @returns {{ valid: boolean }}
 */
export function validateProductionSecrets({
  secrets = ['INTERNAL_GATEWAY_SECRET', 'JWT_SECRET'],
  values = {},
  env = process.env.NODE_ENV || 'development',
  minLength = 32,
  forbiddenValues = FORBIDDEN_DEV_SECRETS,
  exitOnFailure = true,
  exitHandler = process.exit,
  logger = console,
} = {}) {
  for (const secretName of secrets) {
    const val = values[secretName] !== undefined ? values[secretName] : process.env[secretName];
    validateProductionSecret({
      name: secretName,
      value: val,
      env,
      minLength,
      forbiddenValues,
      exitOnFailure,
      exitHandler,
      logger,
    });
  }
  return { valid: true };
}

/**
 * Helper to resolve a secret safely with production fail-fast validation.
 * In production: validates and returns the configured value (or fails fast).
 * In development/test: returns the configured value or the provided fallback.
 *
 * @param {string} name - Secret environment variable name
 * @param {string} devFallback - Default fallback for development/test
 * @param {Object} [options]
 * @param {string} [options.env=process.env.NODE_ENV]
 * @param {number} [options.minLength=32]
 * @param {boolean} [options.exitOnFailure=true]
 * @param {Function} [options.exitHandler=process.exit]
 * @param {Object} [options.logger=console]
 * @returns {string}
 */
export function getRequiredSecret(
  name,
  devFallback = '',
  {
    env = process.env.NODE_ENV || 'development',
    minLength = 32,
    exitOnFailure = true,
    exitHandler = process.exit,
    logger = console,
  } = {},
) {
  const isProd = env === 'production';
  const val = process.env[name];

  if (isProd) {
    validateProductionSecret({
      name,
      value: val,
      env,
      minLength,
      exitOnFailure,
      exitHandler,
      logger,
    });
    return val;
  }

  return val || devFallback;
}
