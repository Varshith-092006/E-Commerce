import { logger } from '@ecommerce/shared';

export class ChannelRateLimiter {
  constructor({
    limits = {
      SMS: { maxCount: 5, windowMs: 60 * 60 * 1000 }, // 5 SMS per hour
      EMAIL: { maxCount: 30, windowMs: 60 * 60 * 1000 }, // 30 Emails per hour
      IN_APP: { maxCount: 1000, windowMs: 60 * 60 * 1000 },
    },
    redisClient = null,
    getRedisClient = null,
  } = {}) {
    this.limits = limits;
    this.redisClient = redisClient;
    this.getRedisClient = getRedisClient;
    // Map<`${userId}:${channel}`, number[]> fallback for local test/dev when Redis is unavailable
    this.history = new Map();
  }

  _getRedis() {
    if (this.getRedisClient) {
      return this.getRedisClient();
    }
    return this.redisClient;
  }

  /**
   * Checks if user has exceeded channel rate limit in sliding window (Redis-backed atomic sliding window)
   */
  async checkRateLimit(userId, channel) {
    const config = this.limits[channel];
    if (!config || !userId) {
      return { allowed: true, remaining: 999, resetTimeMs: 0 };
    }

    const redis = this._getRedis();

    // 1. Redis-backed atomic sliding window
    if (redis && typeof redis.multi === 'function') {
      try {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        const redisKey = `ratelimit:notif:${userId}:${channel}`;

        const multi = redis.multi();
        multi.zremrangebyscore(redisKey, 0, windowStart);
        multi.zcard(redisKey);
        multi.zrange(redisKey, 0, 0, 'WITHSCORES');

        const results = await multi.exec();
        if (!results || results.length < 3) {
          throw new Error('Redis transaction returned invalid results');
        }

        const count = results[1][1] || 0;
        const oldestEntries = results[2][1] || [];

        let resetTimeMs = config.windowMs;
        if (oldestEntries && oldestEntries.length >= 2) {
          const oldestTs = parseInt(oldestEntries[1], 10);
          resetTimeMs = Math.max(0, oldestTs + config.windowMs - now);
        }

        if (count >= config.maxCount) {
          return {
            allowed: false,
            remaining: 0,
            resetTimeMs,
          };
        }

        return {
          allowed: true,
          remaining: Math.max(0, config.maxCount - count),
          resetTimeMs,
        };
      } catch (err) {
        logger.warn(
          { err: err.message, userId, channel },
          'Redis rate limit check failed; utilizing local fallback',
        );
      }
    }

    // 2. In-memory fallback
    const key = `${userId}:${channel}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const timestamps = this.history.get(key) || [];
    const validTimestamps = timestamps.filter((t) => t > windowStart);
    this.history.set(key, validTimestamps);

    if (validTimestamps.length >= config.maxCount) {
      const oldestInWindow = validTimestamps[0];
      const resetTimeMs = oldestInWindow + config.windowMs - now;
      return {
        allowed: false,
        remaining: 0,
        resetTimeMs: Math.max(0, resetTimeMs),
      };
    }

    return {
      allowed: true,
      remaining: config.maxCount - validTimestamps.length,
      resetTimeMs: 0,
    };
  }

  /**
   * Records a dispatch timestamp atomically
   */
  async recordDispatch(userId, channel) {
    const config = this.limits[channel];
    if (!config || !userId) {
      return;
    }

    const redis = this._getRedis();

    // 1. Redis-backed record
    if (redis && typeof redis.multi === 'function') {
      try {
        const now = Date.now();
        const redisKey = `ratelimit:notif:${userId}:${channel}`;
        const windowSeconds = Math.ceil(config.windowMs / 1000) + 10;
        const member = `${now}-${Math.random().toString(36).slice(2, 8)}`;

        const multi = redis.multi();
        multi.zadd(redisKey, now, member);
        multi.expire(redisKey, windowSeconds);
        await multi.exec();
        return;
      } catch (err) {
        logger.warn({ err: err.message, userId, channel }, 'Redis recordDispatch failed');
      }
    }

    // 2. In-memory record
    const key = `${userId}:${channel}`;
    const timestamps = this.history.get(key) || [];
    timestamps.push(Date.now());
    this.history.set(key, timestamps);
  }

  /**
   * Clears rate limit history (for testing or administrative reset)
   */
  async reset(userId = null, channel = null) {
    const redis = this._getRedis();

    if (redis && typeof redis.del === 'function') {
      try {
        if (userId && channel) {
          await redis.del(`ratelimit:notif:${userId}:${channel}`);
        } else if (userId) {
          const keys = await redis.keys(`ratelimit:notif:${userId}:*`);
          if (keys.length > 0) {
            await redis.del(...keys);
          }
        }
      } catch (err) {
        logger.warn({ err: err.message }, 'Redis rate limit reset error');
      }
    }

    if (userId && channel) {
      this.history.delete(`${userId}:${channel}`);
    } else if (userId) {
      for (const key of this.history.keys()) {
        if (key.startsWith(`${userId}:`)) {
          this.history.delete(key);
        }
      }
    } else {
      this.history.clear();
    }
  }
}

export const channelRateLimiter = new ChannelRateLimiter();
