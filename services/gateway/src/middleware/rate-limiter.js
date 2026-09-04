import { ServiceUnavailableError, RateLimitError, ErrorCodes } from '@ecommerce/shared';

import { config } from '../config/index.js';
import { getRedisClient as defaultGetRedisClient } from '../lib/redis.js';

/**
 * IP-based Redis rate limiter middleware
 *
 * Rules:
 * 1. Strictly IP-based for Phase 0 (no userId dependency).
 * 2. Excludes /health endpoints.
 * 3. Atomic counter increment in Redis with TTL.
 * 4. Strictly fails fast with 503 if Redis is unreachable (NO in-memory fallback).
 */
export function createIpRateLimiter({
  windowSeconds = config.rateLimit.windowSeconds,
  maxRequests = config.rateLimit.maxRequests,
  keyPrefix = 'ratelimit:ip:',
  keyGenerator,
  getRedisClient = defaultGetRedisClient,
} = {}) {
  return async function ipRateLimiter(req, res, next) {
    // Exclude health endpoints
    if (req.path === '/health' || req.path === '/healthz' || req.path.endsWith('/health')) {
      return next();
    }

    // If a more specific rate limiter already evaluated this request, skip the fallback general limiter
    if (req._rateLimitApplied && keyPrefix === 'ratelimit:general:') {
      return next();
    }

    const clientIp =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const redisKey = keyGenerator ? keyGenerator(req) : `${keyPrefix}${clientIp}`;

    req._rateLimitApplied = true;

    try {
      const redis = getRedisClient();

      // Multi transaction to increment and set TTL if not set
      const multi = redis.multi();
      multi.incr(redisKey);
      multi.ttl(redisKey);

      const results = await multi.exec();
      if (!results || results.length < 2) {
        throw new Error('Redis transaction failed');
      }

      const [incrErr, currentCount] = results[0];
      const [ttlErr, currentTtl] = results[1];

      if (incrErr || ttlErr) {
        throw incrErr || ttlErr;
      }

      // If key is new (TTL is -1), set the expiration window
      if (currentTtl === -1) {
        await redis.expire(redisKey, windowSeconds);
      }

      const remaining = Math.max(0, maxRequests - currentCount);
      const resetTime = currentTtl > 0 ? currentTtl : windowSeconds;

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetTime);

      if (currentCount > maxRequests) {
        res.setHeader('Retry-After', resetTime);
        return next(
          new RateLimitError(
            `Rate limit exceeded for IP: ${clientIp}. Max ${maxRequests} requests per ${windowSeconds}s.`,
            {
              ip: clientIp,
              limit: maxRequests,
              windowSeconds,
              retryAfterSeconds: resetTime,
            },
          ),
        );
      }

      next();
    } catch (err) {
      if (err instanceof RateLimitError) {
        return next(err);
      }

      // Strict fail-fast if Redis is unreachable (NO silent memory fallback)
      return next(
        new ServiceUnavailableError(
          'Rate limiting service is currently unavailable. Request blocked for consistency.',
          ErrorCodes.REDIS_UNAVAILABLE,
          { reason: 'Redis connectivity failed' },
        ),
      );
    }
  };
}
