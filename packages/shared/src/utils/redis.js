import { Redis } from 'ioredis';

import { ServiceUnavailableError } from '../errors/specific-errors.js';
import { ErrorCodes } from '../errors/error-codes.js';

import { logger } from './logger.js';

let sharedRedisClient = null;

/**
 * Creates or retrieves a shared Redis client
 * @param {string} [redisUrl]
 * @returns {Redis}
 */
export function getRedisClient(redisUrl = process.env.REDIS_URL || 'redis://localhost:6379') {
  if (sharedRedisClient && sharedRedisClient.status !== 'end') {
    return sharedRedisClient;
  }

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop retrying after 3 attempts
      }
      return Math.min(times * 100, 2000);
    },
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on('error', (err) => {
    logger.warn({ err: err.message }, 'Redis client connection warning');
  });

  sharedRedisClient = client;
  return client;
}

/**
 * Checks if Redis is connected and ready
 * @param {Redis} client
 * @returns {boolean}
 */
export function isRedisReady(client = sharedRedisClient) {
  return client && client.status === 'ready';
}

/**
 * Executes a sliding-window rate limit check in Redis.
 * FAILS FAST if Redis is unavailable (per platform policy: no memory fallback).
 *
 * @param {Redis} client
 * @param {Object} options
 * @param {string} options.key - Redis key for rate limiting
 * @param {number} options.limit - Max allowed hits
 * @param {number} options.windowSeconds - Time window in seconds
 * @returns {Promise<{ allowed: boolean, remaining: number, resetSeconds: number }>}
 */
export async function checkRateLimit(client, { key, limit, windowSeconds }) {
  if (client && client.status === 'wait') {
    try {
      await client.connect();
    } catch (err) {
      logger.warn({ err: err.message }, 'Failed to connect lazy Redis client in checkRateLimit');
    }
  }

  if (!client || (client.status !== 'ready' && client.status !== 'connecting')) {
    throw new ServiceUnavailableError(
      'Rate limiting service temporarily unavailable',
      ErrorCodes.REDIS_UNAVAILABLE,
    );
  }

  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const redisKey = `ratelimit:${key}`;

  try {
    const multi = client.multi();
    // Remove timestamps outside window
    multi.zremrangebyscore(redisKey, 0, windowStart);
    // Add current timestamp
    multi.zadd(redisKey, now, `${now}-${Math.random()}`);
    // Count entries in current window
    multi.zcard(redisKey);
    // Set expiry on key
    multi.expire(redisKey, windowSeconds + 1);

    const results = await multi.exec();
    const count = results[2][1];

    const remaining = Math.max(0, limit - count);
    const allowed = count <= limit;

    return {
      allowed,
      remaining,
      resetSeconds: windowSeconds,
    };
  } catch (error) {
    if (error instanceof ServiceUnavailableError) {
      throw error;
    }
    logger.error({ err: error.message, key }, 'Redis rate limit check failed - failing fast');
    throw new ServiceUnavailableError(
      'Rate limiting service temporarily unavailable',
      ErrorCodes.REDIS_UNAVAILABLE,
    );
  }
}
