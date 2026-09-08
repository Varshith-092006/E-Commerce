/**
 * Edge Hardening & Ingress Protection Pure Utilities
 *
 * Provides deterministic, dependency-free validation functions for:
 * 1. HTTP Security Headers compliance
 * 2. TLS configuration and protocol restriction policies
 * 3. Rate limiting and connection quota semantics (429 vs 503)
 * 4. Access log sanitization and sensitive credential redaction
 * 5. Request payload and URI boundary checking
 * 6. Slow-client and edge timeout validation
 */

/**
 * Standard OWASP-recommended security headers to verify.
 */
export const REQUIRED_SECURITY_HEADERS = [
  { header: 'x-content-type-options', expected: 'nosniff' },
  { header: 'x-frame-options', expected: ['sameorigin', 'deny'] },
  {
    header: 'referrer-policy',
    expected: ['strict-origin-when-cross-origin', 'no-referrer', 'same-origin'],
  },
  { header: 'strict-transport-security', expectedSubstrings: ['max-age='] },
  { header: 'permissions-policy', expectedSubstrings: ['camera=', 'microphone=', 'geolocation='] },
];

/**
 * Validates whether HTTP response headers fulfill security requirements.
 *
 * @param {Record<string, string>} headers - Lowercase or mixed-case header map
 * @param {object} options
 * @param {boolean} [options.isHttps=true] - Whether HTTPS is enforced (requiring HSTS)
 * @returns {{ valid: boolean, missing: string[], violations: string[] }}
 */
export function validateSecurityHeaders(headers = {}, { isHttps = true } = {}) {
  const normalized = {};
  for (const [k, v] of Object.entries(headers)) {
    normalized[k.toLowerCase()] = String(v).trim().toLowerCase();
  }

  const missing = [];
  const violations = [];

  // Check X-Content-Type-Options
  const ctVal = normalized['x-content-type-options'];
  if (!ctVal) {
    missing.push('X-Content-Type-Options');
  } else {
    const parts = ctVal.split(',').map((p) => p.trim());
    if (!parts.every((p) => p === 'nosniff')) {
      violations.push(`X-Content-Type-Options expected 'nosniff', got '${ctVal}'`);
    }
  }

  // Check X-Frame-Options
  const frameVal = normalized['x-frame-options'];
  if (!frameVal) {
    missing.push('X-Frame-Options');
  } else {
    const parts = frameVal.split(',').map((p) => p.trim());
    if (!parts.every((p) => ['sameorigin', 'deny'].includes(p))) {
      violations.push(`X-Frame-Options expected 'SAMEORIGIN' or 'DENY', got '${frameVal}'`);
    }
  }

  // Check Referrer-Policy
  const refVal = normalized['referrer-policy'];
  if (!refVal) {
    missing.push('Referrer-Policy');
  } else {
    const parts = refVal.split(',').map((p) => p.trim());
    const validRefs = [
      'strict-origin-when-cross-origin',
      'no-referrer',
      'same-origin',
      'origin-when-cross-origin',
    ];
    if (!parts.some((p) => validRefs.includes(p))) {
      violations.push(`Referrer-Policy contains weak or invalid policy: '${refVal}'`);
    }
  }

  // Check Strict-Transport-Security (only required for HTTPS)
  if (isHttps) {
    const hstsVal = normalized['strict-transport-security'];
    if (!hstsVal) {
      missing.push('Strict-Transport-Security');
    } else if (!hstsVal.includes('max-age=')) {
      violations.push(`Strict-Transport-Security missing max-age directive: '${hstsVal}'`);
    }
  }

  // Check Permissions-Policy
  if (!normalized['permissions-policy']) {
    missing.push('Permissions-Policy');
  }

  return {
    valid: missing.length === 0 && violations.length === 0,
    missing,
    violations,
  };
}

/**
 * Validates TLS configuration against enterprise security baselines.
 * Enforces TLS 1.2 / TLS 1.3 and rejects obsolete SSLv2, SSLv3, TLS 1.0, TLS 1.1.
 *
 * @param {object} tlsConfig
 * @param {string[]} tlsConfig.protocols - List of supported protocols (e.g. ['TLSv1.2', 'TLSv1.3'])
 * @param {string} [tlsConfig.ciphers] - Cipher suite string
 * @param {boolean} [tlsConfig.preferServerCiphers] - Whether server cipher preference is enforced
 * @returns {{ secure: boolean, errors: string[] }}
 */
export function validateTlsConfiguration(tlsConfig = {}) {
  const errors = [];
  const protocols = (tlsConfig.protocols || []).map((p) => p.toUpperCase());

  const obsoleteProtocols = ['SSLV2', 'SSLV3', 'TLSV1', 'TLSV1.0', 'TLSV1.1'];
  for (const obsolete of obsoleteProtocols) {
    if (protocols.includes(obsolete)) {
      errors.push(`Obsolete and vulnerable protocol '${obsolete}' is permitted. Must disable.`);
    }
  }

  const hasModernTls = protocols.includes('TLSV1.2') || protocols.includes('TLSV1.3');
  if (!hasModernTls) {
    errors.push('TLS configuration must support at least TLSv1.2 or TLSv1.3.');
  }

  return {
    secure: errors.length === 0,
    errors,
  };
}

/**
 * Validates rate-limiting and connection-limiting semantics.
 * Strict invariant: HTTP 429 must be used for client rate quotas.
 * HTTP 503 must remain reserved for system overload and load shedding.
 *
 * @param {object} policy
 * @param {number} policy.rate - Request rate per second
 * @param {number} policy.burst - Allowed burst capacity
 * @param {number} policy.status - HTTP status code returned upon violation
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateRateLimitPolicy(policy = {}) {
  const errors = [];

  if (typeof policy.rate !== 'number' || policy.rate <= 0) {
    errors.push('Rate limit must be a positive number.');
  }
  if (typeof policy.burst !== 'number' || policy.burst < 0) {
    errors.push('Burst capacity must be a non-negative number.');
  }
  if (policy.status !== 429) {
    if (policy.status === 503) {
      errors.push(
        'HTTP 503 is strictly reserved for backend overload/load shedding; rate limiting must return HTTP 429.',
      );
    } else {
      errors.push(`Rate limit status must be 429 (Too Many Requests), got ${policy.status}.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sensitive field patterns that must always be redacted from access logs, query strings, and payloads.
 */
export const SENSITIVE_KEY_PATTERNS = [
  /pass(word)?/i,
  /token/i,
  /auth(orization)?/i,
  /secret/i,
  /api[_-]?key/i,
  /credit[_-]?card/i,
  /cvv/i,
  /cookie/i,
  /session/i,
  /bearer/i,
  /gateway[_-]?secret/i,
  /private[_-]?key/i,
];

/**
 * Determines if a given key name is sensitive and requires redaction.
 *
 * @param {string} key
 * @returns {boolean}
 */
export function isSensitiveKey(key) {
  if (typeof key !== 'string') {
    return false;
  }
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Sanitizes and redacts sensitive credentials from access log entries, URL queries, or payload objects.
 *
 * @param {object|string} entry - Log record or URL string
 * @returns {object|string} - Redacted copy with secrets masked as [REDACTED]
 */
export function sanitizeAccessLogEntry(entry) {
  if (!entry) {
    return entry;
  }

  // Handle URL string with query parameters
  if (typeof entry === 'string') {
    return redactUrlQueryString(entry);
  }

  // Handle object entries
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    const sanitized = {};
    for (const [k, v] of Object.entries(entry)) {
      if (isSensitiveKey(k)) {
        sanitized[k] = '[REDACTED]';
      } else if (typeof v === 'string') {
        sanitized[k] = redactUrlQueryString(v);
      } else if (typeof v === 'object' && v !== null) {
        sanitized[k] = sanitizeAccessLogEntry(v);
      } else {
        sanitized[k] = v;
      }
    }
    return sanitized;
  }

  if (Array.isArray(entry)) {
    return entry.map((item) => sanitizeAccessLogEntry(item));
  }

  return entry;
}

/**
 * Helper to redact sensitive query parameters from a URL or query string.
 *
 * @param {string} str
 * @returns {string}
 */
function redactUrlQueryString(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }

  // Redact Authorization headers if logged as Bearer ...
  let result = str.replace(/Bearer\s+[A-Za-z0-9-_.]+/gi, 'Bearer [REDACTED]');

  // Redact query parameter patterns: ?key=value or &key=value
  result = result.replace(/([?&])([^=&#\s]+)=([^&#\s]*)/g, (match, prefix, key, _value) => {
    if (isSensitiveKey(key)) {
      return `${prefix}${key}=[REDACTED]`;
    }
    return match;
  });

  return result;
}

/**
 * Validates request payload size against configured body boundaries.
 *
 * @param {number} contentLength - Content length in bytes
 * @param {number} maxAllowedBytes - Maximum allowed payload size in bytes
 * @returns {{ allowed: boolean, statusCode: number, reason?: string }}
 */
export function validateRequestSizeLimit(contentLength, maxAllowedBytes = 10 * 1024 * 1024) {
  if (typeof contentLength !== 'number' || isNaN(contentLength)) {
    return { allowed: true, statusCode: 200 };
  }

  if (contentLength > maxAllowedBytes) {
    return {
      allowed: false,
      statusCode: 413,
      reason: `Payload size ${contentLength} bytes exceeds limit of ${maxAllowedBytes} bytes`,
    };
  }

  return { allowed: true, statusCode: 200 };
}

/**
 * Validates edge timeouts against slow-client resource exhaustion policies.
 *
 * @param {object} timeouts
 * @param {number} timeouts.clientBodyTimeout - In seconds (e.g. 10s - 30s)
 * @param {number} timeouts.clientHeaderTimeout - In seconds (e.g. 5s - 30s)
 * @param {number} timeouts.sendTimeout - In seconds
 * @param {number} timeouts.keepaliveTimeout - In seconds
 * @returns {{ safe: boolean, warnings: string[] }}
 */
export function validateEdgeTimeoutConfig(timeouts = {}) {
  const warnings = [];

  if (timeouts.clientBodyTimeout && timeouts.clientBodyTimeout > 60) {
    warnings.push(
      `clientBodyTimeout of ${timeouts.clientBodyTimeout}s is too high; risks slow-client resource exhaustion.`,
    );
  }
  if (timeouts.clientHeaderTimeout && timeouts.clientHeaderTimeout > 60) {
    warnings.push(
      `clientHeaderTimeout of ${timeouts.clientHeaderTimeout}s is too high; vulnerable to Slowloris attacks.`,
    );
  }
  if (timeouts.keepaliveTimeout && timeouts.keepaliveTimeout > 120) {
    warnings.push(
      `keepaliveTimeout of ${timeouts.keepaliveTimeout}s exceeds recommended 60-120s window.`,
    );
  }

  return {
    safe: warnings.length === 0,
    warnings,
  };
}
