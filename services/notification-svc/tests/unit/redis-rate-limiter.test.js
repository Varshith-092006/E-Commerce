import { jest } from '@jest/globals';

import { ChannelRateLimiter } from '../../src/services/channel-rate-limiter.js';

describe('ChannelRateLimiter (Redis-Backed Sliding Window)', () => {
  let mockRedis;
  let sortedSets;

  beforeEach(() => {
    sortedSets = new Map();

    mockRedis = {
      multi: jest.fn(() => {
        const operations = [];
        return {
          zremrangebyscore: jest.fn((key, min, max) => {
            operations.push(() => {
              const entries = sortedSets.get(key) || [];
              const filtered = entries.filter((e) => e.score > max);
              sortedSets.set(key, filtered);
              return [null, entries.length - filtered.length];
            });
            return this;
          }),
          zcard: jest.fn((key) => {
            operations.push(() => {
              const entries = sortedSets.get(key) || [];
              return [null, entries.length];
            });
            return this;
          }),
          zrange: jest.fn((key, _start, _stop, _withScores) => {
            operations.push(() => {
              const entries = sortedSets.get(key) || [];
              if (entries.length === 0) return [null, []];
              return [null, [entries[0].member, entries[0].score.toString()]];
            });
            return this;
          }),
          zadd: jest.fn((key, score, member) => {
            operations.push(() => {
              const entries = sortedSets.get(key) || [];
              entries.push({ score, member });
              sortedSets.set(key, entries);
              return [null, 1];
            });
            return this;
          }),
          expire: jest.fn((_key, _ttl) => {
            operations.push(() => [null, 1]);
            return this;
          }),
          exec: jest.fn(async () => {
            return operations.map((op) => op());
          }),
        };
      }),
      del: jest.fn(async (key) => {
        sortedSets.delete(key);
        return 1;
      }),
      keys: jest.fn(async () => Array.from(sortedSets.keys())),
    };
  });

  test('allows dispatches within configured limits and returns remaining count', async () => {
    const limiter = new ChannelRateLimiter({
      limits: { SMS: { maxCount: 3, windowMs: 3600000 } },
      redisClient: mockRedis,
    });

    const check1 = await limiter.checkRateLimit('user-1', 'SMS');
    expect(check1.allowed).toBe(true);
    expect(check1.remaining).toBe(3);

    await limiter.recordDispatch('user-1', 'SMS');
    const check2 = await limiter.checkRateLimit('user-1', 'SMS');
    expect(check2.allowed).toBe(true);
    expect(check2.remaining).toBe(2);

    await limiter.recordDispatch('user-1', 'SMS');
    await limiter.recordDispatch('user-1', 'SMS');

    const check3 = await limiter.checkRateLimit('user-1', 'SMS');
    expect(check3.allowed).toBe(false);
    expect(check3.remaining).toBe(0);
    expect(check3.resetTimeMs).toBeGreaterThan(0);
  });

  test('enforces independent rate limits per user and per channel', async () => {
    const limiter = new ChannelRateLimiter({
      limits: {
        SMS: { maxCount: 2, windowMs: 3600000 },
        EMAIL: { maxCount: 5, windowMs: 3600000 },
      },
      redisClient: mockRedis,
    });

    // Exhaust user-1 SMS
    await limiter.recordDispatch('user-1', 'SMS');
    await limiter.recordDispatch('user-1', 'SMS');

    const user1Sms = await limiter.checkRateLimit('user-1', 'SMS');
    const user1Email = await limiter.checkRateLimit('user-1', 'EMAIL');
    const user2Sms = await limiter.checkRateLimit('user-2', 'SMS');

    expect(user1Sms.allowed).toBe(false);
    expect(user1Email.allowed).toBe(true); // User 1 email is independent
    expect(user2Sms.allowed).toBe(true); // User 2 SMS is independent
  });

  test('falls back gracefully to in-memory sliding window if Redis fails', async () => {
    const brokenRedis = {
      multi: jest.fn(() => ({
        zremrangebyscore: jest.fn().mockReturnThis(),
        zcard: jest.fn().mockReturnThis(),
        zrange: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Redis connection timeout')),
      })),
    };

    const limiter = new ChannelRateLimiter({
      limits: { SMS: { maxCount: 2, windowMs: 3600000 } },
      redisClient: brokenRedis,
    });

    const check1 = await limiter.checkRateLimit('user-failover', 'SMS');
    expect(check1.allowed).toBe(true);

    await limiter.recordDispatch('user-failover', 'SMS');
    await limiter.recordDispatch('user-failover', 'SMS');

    const check2 = await limiter.checkRateLimit('user-failover', 'SMS');
    expect(check2.allowed).toBe(false);
  });
});
