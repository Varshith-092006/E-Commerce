import { describe, it, expect, beforeEach } from '@jest/globals';

import { ChannelRateLimiter } from '../../src/services/channel-rate-limiter.js';

describe('ChannelRateLimiter Unit Tests', () => {
  let limiter;

  beforeEach(() => {
    limiter = new ChannelRateLimiter({
      limits: {
        SMS: { maxCount: 3, windowMs: 500 }, // 3 SMS per 500ms
        EMAIL: { maxCount: 5, windowMs: 500 },
      },
    });
  });

  it('should allow requests within channel limits and accurately decrement remaining count', async () => {
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

  it('should restore quota after sliding window expires', async () => {
    await limiter.recordDispatch('user-1', 'SMS');
    await limiter.recordDispatch('user-1', 'SMS');
    await limiter.recordDispatch('user-1', 'SMS');

    const checkBefore = await limiter.checkRateLimit('user-1', 'SMS');
    expect(checkBefore.allowed).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 550));

    const check = await limiter.checkRateLimit('user-1', 'SMS');
    expect(check.allowed).toBe(true);
    expect(check.remaining).toBe(3);
  });

  it('should maintain isolated rate limits across different users', async () => {
    await limiter.recordDispatch('user-A', 'SMS');
    await limiter.recordDispatch('user-A', 'SMS');
    await limiter.recordDispatch('user-A', 'SMS');

    const checkA = await limiter.checkRateLimit('user-A', 'SMS');
    const checkB = await limiter.checkRateLimit('user-B', 'SMS');

    expect(checkA.allowed).toBe(false);
    expect(checkB.allowed).toBe(true);
    expect(checkB.remaining).toBe(3);
  });

  it('should clear limits on reset()', async () => {
    await limiter.recordDispatch('user-1', 'SMS');
    await limiter.reset('user-1', 'SMS');

    const check = await limiter.checkRateLimit('user-1', 'SMS');
    expect(check.allowed).toBe(true);
    expect(check.remaining).toBe(3);
  });
});
