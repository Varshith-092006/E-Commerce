import { jest } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { SecurityHeaders, Roles, generateAccessToken } from '@ecommerce/shared';

describe('Gateway Security & Anti-Spoofing Integration Tests', () => {
  let app;
  let mockRedisClient;

  beforeEach(() => {
    mockRedisClient = {
      multi: jest.fn(() => ({
        incr: jest.fn(),
        ttl: jest.fn(),
        exec: jest.fn().mockResolvedValue([[null, 1], [null, 60]]),
      })),
      status: 'ready',
    };

    app = createApp({
      checkRedisHealth: async () => true,
      getRedisClient: () => mockRedisClient,
    });
  });

  describe('Anti-Spoofing Header Stripping', () => {
    it('should strip client-injected X-User-* headers', async () => {
      // Testing with a request hitting a 404 route
      const res = await request(app)
        .get('/api/v1/unknown-endpoint')
        .set(SecurityHeaders.USER_ID, 'attacker-id')
        .set(SecurityHeaders.USER_ROLE, Roles.ADMIN);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Redis Rate Limiting Fail-Fast Policy', () => {
    it('should return 503 REDIS_UNAVAILABLE when Redis connection fails', async () => {
      const failingRedisClient = {
        multi: jest.fn(() => ({
          incr: jest.fn(),
          ttl: jest.fn(),
          exec: jest.fn().mockRejectedValue(new Error('Connection lost')),
        })),
        status: 'end',
      };

      const brokenApp = createApp({
        checkRedisHealth: async () => false,
        getRedisClient: () => failingRedisClient,
      });

      const res = await request(brokenApp).get('/api/v1/products');

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('REDIS_UNAVAILABLE');
    });
  });
});
