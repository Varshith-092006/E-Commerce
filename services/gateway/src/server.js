import { createLogger, GracefulShutdownHandler } from '@ecommerce/shared';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { getRedisClient } from './lib/redis.js';

const logger = createLogger({ service: 'gateway' });

// Initialize Redis connection
let redisClient = null;
try {
  redisClient = getRedisClient();
} catch (err) {
  logger.warn(
    { err: err.message },
    'Initial Redis connection attempt failed; will retry on first request',
  );
}

const shutdownHandler = new GracefulShutdownHandler({
  serviceName: 'gateway',
  shutdownTimeoutMs: parseInt(process.env.SHUTDOWN_TIMEOUT_MS, 10) || 10000,
  logger,
  redis: redisClient,
});

const app = createApp({
  getIsShuttingDown: () => shutdownHandler.getIsShuttingDown(),
});

const server = app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.env },
    `API Gateway listening on port ${config.port}`,
  );
});

shutdownHandler.setServer(server).registerSignalHandlers();
