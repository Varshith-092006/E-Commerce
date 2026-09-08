import { jest } from '@jest/globals';

import {
  validateProductionSecret,
  validateProductionSecrets,
  getRequiredSecret,
  ConfigurationError,
  FORBIDDEN_DEV_SECRETS,
} from '../../src/utils/secret-validator.js';

describe('Production Secret Validator (Phase 12 Security Gap Remediation)', () => {
  const SECURE_SECRET_A = 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0';
  const SECURE_SECRET_B = 'f0e1d2c3b4a59876543210fedcba9876543210fedcba9876543210fedcba9876';

  let mockExit;
  let mockLogger;

  beforeEach(() => {
    mockExit = jest.fn();
    mockLogger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    };
  });

  // Scenario A: Production + missing JWT_SECRET → startup failure
  describe('Scenario A: Production + missing JWT_SECRET', () => {
    it('should fail startup when JWT_SECRET is undefined in production', () => {
      expect(() => {
        validateProductionSecret({
          name: 'JWT_SECRET',
          value: undefined,
          env: 'production',
          exitHandler: mockExit,
          logger: mockLogger,
        });
      }).toThrow(ConfigurationError);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('JWT_SECRET is required in production and must not be empty'),
      );
    });

    it('should fail startup when JWT_SECRET is empty string in production', () => {
      expect(() => {
        validateProductionSecret({
          name: 'JWT_SECRET',
          value: '   ',
          env: 'production',
          exitHandler: mockExit,
          logger: mockLogger,
        });
      }).toThrow(ConfigurationError);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('JWT_SECRET is required in production and must not be empty'),
      );
    });
  });

  // Scenario B: Production + missing INTERNAL_GATEWAY_SECRET → startup failure
  describe('Scenario B: Production + missing INTERNAL_GATEWAY_SECRET', () => {
    it('should fail startup when INTERNAL_GATEWAY_SECRET is undefined in production', () => {
      expect(() => {
        validateProductionSecret({
          name: 'INTERNAL_GATEWAY_SECRET',
          value: undefined,
          env: 'production',
          exitHandler: mockExit,
          logger: mockLogger,
        });
      }).toThrow(ConfigurationError);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'INTERNAL_GATEWAY_SECRET is required in production and must not be empty',
        ),
      );
    });

    it('should fail startup when INTERNAL_GATEWAY_SECRET is null in production', () => {
      expect(() => {
        validateProductionSecret({
          name: 'INTERNAL_GATEWAY_SECRET',
          value: null,
          env: 'production',
          exitHandler: mockExit,
          logger: mockLogger,
        });
      }).toThrow(ConfigurationError);

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  // Scenario C: Production + known development JWT_SECRET → startup failure
  describe('Scenario C: Production + known development JWT_SECRET', () => {
    const knownDevJwtSecrets = [
      'ecom_default_jwt_secret_dev_only_change_in_prod',
      'ecom_jwt_secret_dev_2026_test_key_32_chars',
      'ecom_super_secret_jwt_key_development_only_change_in_prod_2026',
      'test-jwt-secret-32chars-long!!!',
      'test_jwt_secret_for_phase5_e2e_verification_key_32bytes',
      'REPLACE_WITH_STRONG_JWT_SECRET_MIN_32_CHARS',
      '<SECRET_JWT_SIGNING_KEY_MIN_32_CHARS>',
    ];

    test.each(knownDevJwtSecrets)(
      'should reject known development secret: %s in production',
      (devSecret) => {
        expect(() => {
          validateProductionSecret({
            name: 'JWT_SECRET',
            value: devSecret,
            env: 'production',
            exitHandler: mockExit,
            logger: mockLogger,
          });
        }).toThrow(ConfigurationError);

        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining(
            'JWT_SECRET is configured with a known insecure development or placeholder secret',
          ),
        );
      },
    );
  });

  // Scenario D: Production + known development INTERNAL_GATEWAY_SECRET → startup failure
  describe('Scenario D: Production + known development INTERNAL_GATEWAY_SECRET', () => {
    const knownDevInternalSecrets = [
      'ecom_internal_mesh_secret_2026',
      'test_internal_secret_123',
      'test-internal-secret-gateway',
      'internal-secret',
      'REPLACE_WITH_STRONG_SECRET_32_CHARS_MIN',
      '<SECRET_INTERNAL_MESH_KEY>',
    ];

    test.each(knownDevInternalSecrets)(
      'should reject known development secret: %s in production',
      (devSecret) => {
        expect(() => {
          validateProductionSecret({
            name: 'INTERNAL_GATEWAY_SECRET',
            value: devSecret,
            env: 'production',
            exitHandler: mockExit,
            logger: mockLogger,
          });
        }).toThrow(ConfigurationError);

        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining(
            'INTERNAL_GATEWAY_SECRET is configured with a known insecure development or placeholder secret',
          ),
        );
      },
    );
  });

  // Scenario E: Production + valid configured secrets → startup succeeds
  describe('Scenario E: Production + valid configured secrets', () => {
    it('should allow strong, unique secrets in production', () => {
      const resultA = validateProductionSecret({
        name: 'JWT_SECRET',
        value: SECURE_SECRET_A,
        env: 'production',
        exitHandler: mockExit,
        logger: mockLogger,
      });

      const resultB = validateProductionSecret({
        name: 'INTERNAL_GATEWAY_SECRET',
        value: SECURE_SECRET_B,
        env: 'production',
        exitHandler: mockExit,
        logger: mockLogger,
      });

      expect(resultA.valid).toBe(true);
      expect(resultB.valid).toBe(true);
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should validate multiple secrets simultaneously with validateProductionSecrets', () => {
      const result = validateProductionSecrets({
        secrets: ['JWT_SECRET', 'INTERNAL_GATEWAY_SECRET'],
        values: {
          JWT_SECRET: SECURE_SECRET_A,
          INTERNAL_GATEWAY_SECRET: SECURE_SECRET_B,
        },
        env: 'production',
        exitHandler: mockExit,
        logger: mockLogger,
      });

      expect(result.valid).toBe(true);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });

  // Scenario F: Development/test + existing configuration → existing tests remain functional
  describe('Scenario F: Development and test environment preservation', () => {
    it('should allow missing secrets in test environment', () => {
      const result = validateProductionSecret({
        name: 'JWT_SECRET',
        value: undefined,
        env: 'test',
        exitHandler: mockExit,
        logger: mockLogger,
      });

      expect(result.valid).toBe(true);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should allow development fallback secrets in development environment', () => {
      const result = validateProductionSecret({
        name: 'INTERNAL_GATEWAY_SECRET',
        value: 'ecom_internal_mesh_secret_2026',
        env: 'development',
        exitHandler: mockExit,
        logger: mockLogger,
      });

      expect(result.valid).toBe(true);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should resolve fallback value with getRequiredSecret in non-production', () => {
      const originalEnv = process.env.TEST_TEMP_SECRET;
      delete process.env.TEST_TEMP_SECRET;

      const resolved = getRequiredSecret('TEST_TEMP_SECRET', 'my_dev_fallback_value', {
        env: 'test',
      });

      expect(resolved).toBe('my_dev_fallback_value');
      if (originalEnv !== undefined) {
        process.env.TEST_TEMP_SECRET = originalEnv;
      }
    });

    it('should resolve configured value in production when valid', () => {
      const originalEnv = process.env.TEST_PROD_SECRET;
      process.env.TEST_PROD_SECRET = SECURE_SECRET_A;

      const resolved = getRequiredSecret('TEST_PROD_SECRET', 'fallback', {
        env: 'production',
      });

      expect(resolved).toBe(SECURE_SECRET_A);
      if (originalEnv !== undefined) {
        process.env.TEST_PROD_SECRET = originalEnv;
      } else {
        delete process.env.TEST_PROD_SECRET;
      }
    });
  });

  // Security Hygiene: Error messages must NEVER print or expose secret values
  describe('Security Hygiene: Secret sanitization in logs and errors', () => {
    it('should never include the secret value in error messages or logs', () => {
      const sensitiveInsecureSecret = 'ecom_internal_mesh_secret_2026';

      try {
        validateProductionSecret({
          name: 'INTERNAL_GATEWAY_SECRET',
          value: sensitiveInsecureSecret,
          env: 'production',
          exitHandler: mockExit,
          logger: mockLogger,
        });
      } catch (err) {
        expect(err.message).not.toContain(sensitiveInsecureSecret);
        expect(err.message).toContain('INTERNAL_GATEWAY_SECRET');
      }

      if (mockLogger.error.mock.calls.length > 0) {
        const loggedText = mockLogger.error.mock.calls[0][0];
        expect(loggedText).not.toContain(sensitiveInsecureSecret);
        expect(loggedText).toContain('INTERNAL_GATEWAY_SECRET');
      }
    });

    it('should reject secrets shorter than minLength in production', () => {
      const shortSecret = 'short_secret_123';

      expect(() => {
        validateProductionSecret({
          name: 'JWT_SECRET',
          value: shortSecret,
          minLength: 32,
          env: 'production',
          exitHandler: mockExit,
          logger: mockLogger,
        });
      }).toThrow(ConfigurationError);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('JWT_SECRET must be at least 32 characters in production'),
      );
      // Ensure the short secret value itself is never leaked
      expect(mockLogger.error).not.toHaveBeenCalledWith(expect.stringContaining(shortSecret));
    });
  });
});
