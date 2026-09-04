import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { generateAccessToken } from '@ecommerce/shared';

import { createApp } from '../../src/app.js';

describe('Gateway IP Rate Limiting', () => {
  it('exceeding IP rate limit returns 429 with RATE_LIMITED error code', async () => {
    const mockRedisClient = {
      multi: () => ({
        incr: () => {},
        ttl: () => {},
        exec: async () => [[null, 150], [null, 45]], // 150 > max 120
      }),
      expire: async () => 1,
    };

    const app = createApp({
      getRedisClient: () => mockRedisClient,
    });

    const res = await request(app).get('/api/v1/any-endpoint');

    expect(res.status).toBe(429);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RATE_LIMITED');
    expect(res.headers['retry-after']).toBeDefined();
    expect(res.headers['x-ratelimit-remaining']).toBe('0');
  });

  it('Redis failure triggers strict 503 fail-fast (no memory fallback)', async () => {
    const failingRedisClient = {
      multi: () => ({
        incr: () => {},
        ttl: () => {},
        exec: async () => {
          throw new Error('Connection lost to Redis');
        },
      }),
    };

    const app = createApp({
      getRedisClient: () => failingRedisClient,
    });

    const res = await request(app).get('/api/v1/any-endpoint');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('REDIS_UNAVAILABLE');
    expect(res.body.error.message).toContain('Rate limiting service is currently unavailable');
  });

  it('/health endpoint is excluded from rate limiting even when Redis is down', async () => {
    const app = createApp({
      checkRedisHealth: async () => false,
      getRedisClient: () => {
        throw new Error('Redis down');
      },
    });

    const res = await request(app).get('/health');

    // Should reach the health route directly without being blocked by rate-limiting middleware
    expect(res.status).toBe(503);
    expect(res.body.data.status).toBe('degraded');
  });

  describe('Reverse Logistics Rate Limiting (POST /api/v1/returns)', () => {
    it('allows normal return creation requests when within 5 req/min limit', async () => {
      let accessedKey = '';
      const mockRedisClient = {
        multi: () => ({
          incr: (key) => {
            accessedKey = key;
          },
          ttl: () => {},
          exec: async () => [[null, 2], [null, 55]], // 2 <= 5
        }),
        expire: async () => 1,
      };

      const app = createApp({
        getRedisClient: () => mockRedisClient,
      });

      const token = generateAccessToken({ sub: 'user-cust-42', role: 'CUSTOMER' });

      const res = await request(app)
        .post('/api/v1/returns')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderId: 'ord-123' });

      // Should not be blocked by rate limiter (reaches proxy or 503 from missing downstream, but not 429)
      expect(res.status).not.toBe(429);
      expect(res.headers['x-ratelimit-limit']).toBe('5');
      expect(res.headers['x-ratelimit-remaining']).toBe('3');
      expect(accessedKey).toBe('ratelimit:returns:user:user-cust-42');
    });

    it('blocks excessive return creation requests with 429 RATE_LIMITED when exceeding 5 req/min', async () => {
      const mockRedisClient = {
        multi: () => ({
          incr: () => {},
          ttl: () => {},
          exec: async () => [[null, 6], [null, 40]], // 6 > 5 limit
        }),
        expire: async () => 1,
      };

      const app = createApp({
        getRedisClient: () => mockRedisClient,
      });

      const res = await request(app)
        .post('/api/v1/returns')
        .set('x-user-id', 'user-spammer-99')
        .send({ orderId: 'ord-spam' });

      expect(res.status).toBe(429);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('RATE_LIMITED');
      expect(res.headers['retry-after']).toBe('40');
      expect(res.headers['x-ratelimit-remaining']).toBe('0');
    });
  });
});
