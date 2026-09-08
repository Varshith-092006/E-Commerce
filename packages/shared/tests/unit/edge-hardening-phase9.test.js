import { describe, it, expect } from '@jest/globals';
import {
  validateSecurityHeaders,
  validateTlsConfiguration,
  validateRateLimitPolicy,
  sanitizeAccessLogEntry,
  isSensitiveKey,
  validateRequestSizeLimit,
  validateEdgeTimeoutConfig,
} from '../../src/utils/edge-hardening-planning.js';

describe('Phase 9 Edge Hardening & Ingress Utilities', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Security Headers Validation
  // ───────────────────────────────────────────────────────────────────────────
  describe('validateSecurityHeaders', () => {
    it('passes when all mandatory security headers are present and valid', () => {
      const headers = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      };

      const result = validateSecurityHeaders(headers, { isHttps: true });
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.violations).toHaveLength(0);
    });

    it('detects missing security headers', () => {
      const incomplete = {
        'X-Content-Type-Options': 'nosniff',
      };

      const result = validateSecurityHeaders(incomplete, { isHttps: true });
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('X-Frame-Options');
      expect(result.missing).toContain('Referrer-Policy');
      expect(result.missing).toContain('Strict-Transport-Security');
    });

    it('flags invalid header values as violations', () => {
      const invalid = {
        'X-Content-Type-Options': 'sniff',
        'X-Frame-Options': 'ALLOW-FROM https://evil.com',
        'Referrer-Policy': 'unsafe-url',
        'Strict-Transport-Security': 'none',
        'Permissions-Policy': 'camera=*',
      };

      const result = validateSecurityHeaders(invalid, { isHttps: true });
      expect(result.valid).toBe(false);
      expect(result.violations.length).toBeGreaterThanOrEqual(3);
    });

    it('relaxes HSTS requirement when isHttps is false', () => {
      const headers = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'geolocation=()',
      };

      const result = validateSecurityHeaders(headers, { isHttps: false });
      expect(result.valid).toBe(true);
      expect(result.missing).not.toContain('Strict-Transport-Security');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. TLS Configuration Validation
  // ───────────────────────────────────────────────────────────────────────────
  describe('validateTlsConfiguration', () => {
    it('accepts modern TLS versions (TLSv1.2, TLSv1.3)', () => {
      const config = {
        protocols: ['TLSv1.2', 'TLSv1.3'],
        preferServerCiphers: true,
      };

      const result = validateTlsConfiguration(config);
      expect(result.secure).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('strictly rejects obsolete protocols (SSLv3, TLSv1.0, TLSv1.1)', () => {
      const vulnerable = {
        protocols: ['SSLv3', 'TLSv1.0', 'TLSv1.1', 'TLSv1.2'],
      };

      const result = validateTlsConfiguration(vulnerable);
      expect(result.secure).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
      expect(result.errors.some((e) => e.includes('SSLV3'))).toBe(true);
      expect(result.errors.some((e) => e.includes('TLSV1.0'))).toBe(true);
      expect(result.errors.some((e) => e.includes('TLSV1.1'))).toBe(true);
    });

    it('rejects configuration missing any modern TLS protocol', () => {
      const empty = { protocols: [] };
      const result = validateTlsConfiguration(empty);
      expect(result.secure).toBe(false);
      expect(result.errors[0]).toMatch(/TLS configuration must support at least/);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Rate Limiting Policy Semantics (429 vs 503)
  // ───────────────────────────────────────────────────────────────────────────
  describe('validateRateLimitPolicy', () => {
    it('accepts compliant policy using HTTP 429', () => {
      const policy = {
        rate: 50,
        burst: 100,
        status: 429,
      };

      const result = validateRateLimitPolicy(policy);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('strictly rejects HTTP 503 for rate limiting to preserve overload semantics', () => {
      const policy = {
        rate: 50,
        burst: 100,
        status: 503,
      };

      const result = validateRateLimitPolicy(policy);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('503 is strictly reserved'))).toBe(true);
    });

    it('rejects invalid rate or burst values', () => {
      const invalid = {
        rate: -5,
        burst: -1,
        status: 429,
      };

      const result = validateRateLimitPolicy(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Sensitive Field Detection & Access Log Redaction
  // ───────────────────────────────────────────────────────────────────────────
  describe('isSensitiveKey and sanitizeAccessLogEntry', () => {
    it('identifies case-insensitive sensitive keys', () => {
      expect(isSensitiveKey('password')).toBe(true);
      expect(isSensitiveKey('PASSWORD')).toBe(true);
      expect(isSensitiveKey('authToken')).toBe(true);
      expect(isSensitiveKey('authorization')).toBe(true);
      expect(isSensitiveKey('client_secret')).toBe(true);
      expect(isSensitiveKey('apiKey')).toBe(true);
      expect(isSensitiveKey('credit_card_number')).toBe(true);
      expect(isSensitiveKey('sessionId')).toBe(true);
      expect(isSensitiveKey('x-internal-gateway-secret')).toBe(true);

      expect(isSensitiveKey('productId')).toBe(false);
      expect(isSensitiveKey('categoryName')).toBe(false);
      expect(isSensitiveKey('orderStatus')).toBe(false);
    });

    it('redacts sensitive fields in nested objects', () => {
      const payload = {
        userId: 'u-123',
        credentials: {
          password: 'superSecret123!',
          token: 'jwt.token.here',
        },
        payment: {
          credit_card: '4111-2222-3333-4444',
          secret: 'razorpay_secret_key',
        },
        publicData: 'hello world',
      };

      const sanitized = sanitizeAccessLogEntry(payload);
      expect(sanitized.userId).toBe('u-123');
      expect(sanitized.publicData).toBe('hello world');
      expect(sanitized.credentials.password).toBe('[REDACTED]');
      expect(sanitized.credentials.token).toBe('[REDACTED]');
      expect(sanitized.payment.credit_card).toBe('[REDACTED]');
      expect(sanitized.payment.secret).toBe('[REDACTED]');
    });

    it('redacts sensitive parameters from URL query strings', () => {
      const url = '/api/v1/checkout?token=abc12345&productId=prod-99&password=myPassword&redirect=/home';
      const sanitized = sanitizeAccessLogEntry(url);

      expect(sanitized).toContain('token=[REDACTED]');
      expect(sanitized).toContain('password=[REDACTED]');
      expect(sanitized).toContain('productId=prod-99');
      expect(sanitized).toContain('redirect=/home');
    });

    it('redacts Bearer authorization tokens from string logs', () => {
      const logLine = 'HTTP Request with Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const sanitized = sanitizeAccessLogEntry(logLine);

      expect(sanitized).toBe('HTTP Request with Authorization: Bearer [REDACTED]');
      expect(sanitized).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Request Size Boundaries
  // ───────────────────────────────────────────────────────────────────────────
  describe('validateRequestSizeLimit', () => {
    it('allows payloads within the configured limit', () => {
      const result = validateRequestSizeLimit(1024 * 1024, 10 * 1024 * 1024); // 1MB <= 10MB
      expect(result.allowed).toBe(true);
      expect(result.statusCode).toBe(200);
    });

    it('rejects oversized payloads with HTTP 413', () => {
      const result = validateRequestSizeLimit(12 * 1024 * 1024, 10 * 1024 * 1024); // 12MB > 10MB
      expect(result.allowed).toBe(false);
      expect(result.statusCode).toBe(413);
      expect(result.reason).toMatch(/exceeds limit/);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Edge Timeout Validation
  // ───────────────────────────────────────────────────────────────────────────
  describe('validateEdgeTimeoutConfig', () => {
    it('passes safe timeout settings', () => {
      const timeouts = {
        clientBodyTimeout: 15,
        clientHeaderTimeout: 15,
        sendTimeout: 15,
        keepaliveTimeout: 65,
      };

      const result = validateEdgeTimeoutConfig(timeouts);
      expect(result.safe).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('warns about excessively long timeouts susceptible to slow-client attacks', () => {
      const slowClientRisk = {
        clientBodyTimeout: 120,
        clientHeaderTimeout: 90,
        keepaliveTimeout: 300,
      };

      const result = validateEdgeTimeoutConfig(slowClientRisk);
      expect(result.safe).toBe(false);
      expect(result.warnings.length).toBeGreaterThanOrEqual(2);
    });
  });
});
