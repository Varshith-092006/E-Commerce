import Redis from 'ioredis';
import { createLogger } from '@ecommerce/shared';

import { config } from '../config/index.js';

const logger = createLogger({ service: 'gateway:redis' });

let redisClient = null;
let isConnected = false;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
      isConnected = true;
    });

    redisClient.on('ready', () => {
      isConnected = true;
    });

    redisClient.on('error', (err) => {
      logger.error({ err: err.message }, 'Redis client error');
      isConnected = false;
    });

    redisClient.on('close', () => {
      isConnected = false;
    });
  }

  return redisClient;
}

export async function checkRedisHealth() {
  try {
    const client = getRedisClient();
    const result = await client.ping();
    return result === 'PONG';
  } catch (_err) {
    return false;
  }
}

export function isRedisConnected() {
  return isConnected;
}

export async function closeRedisClient() {
  if (redisClient) {
    try {
      if (redisClient.status !== 'end') {
        await redisClient.quit();
      }
    } catch {
      redisClient.disconnect();
    } finally {
      redisClient = null;
      isConnected = false;
    }
  }
}
