import { getRedisClient, checkRateLimit } from '../utils/redis.js';
import { RateLimitError } from '../errors/specific-errors.js';

/**
 * Creates an Express rate-limiting middleware backed by Redis sliding-window.
 * Fails fast with 503 REDIS_UNAVAILABLE if Redis is offline.
 *
 * @param {Object} options
 * @param {number} options.limit - Max requests allowed in window
 * @param {number} [options.windowSeconds=60] - Window duration in seconds
 * @param {Function} [options.keyGenerator] - Function returning unique string key (defaults to IP or User ID)
 * @param {Function} [options.skip] - Function returning boolean to skip rate limiting (e.g. for /health)
 * @returns {Function} Express middleware
 */
export function createRateLimiter({ limit, windowSeconds = 60, keyGenerator, skip }) {
  const defaultKeyGen = (req) => {
    const userId = req.headers['x-user-id'] || req.user?.id;
    const ip = req.ip || req.socket?.remoteAddress || '127.0.0.1';
    return userId ? `user:${userId}` : `ip:${ip}`;
  };

  const getKey = keyGenerator || defaultKeyGen;

  return async (req, res, next) => {
    if (skip && skip(req)) {
      return next();
    }

    try {
      const redis = getRedisClient();
      const identifier = getKey(req);
      const endpoint = req.baseUrl || req.path;
      const rateLimitKey = `${endpoint}:${identifier}`;

      const { allowed, remaining, resetSeconds } = await checkRateLimit(redis, {
        key: rateLimitKey,
        limit,
        windowSeconds,
      });

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetSeconds);

      if (!allowed) {
        throw new RateLimitError('Too many requests, please slow down', {
          retryAfter: resetSeconds,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
