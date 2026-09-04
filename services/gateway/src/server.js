import { createLogger } from '@ecommerce/shared';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { getRedisClient } from './lib/redis.js';

const logger = createLogger({ service: 'gateway' });
const app = createApp();

// Initialize Redis connection
try {
  getRedisClient();
} catch (err) {
  logger.warn(
    { err: err.message },
    'Initial Redis connection attempt failed; will retry on first request',
  );
}

const server = app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.env },
    `API Gateway listening on port ${config.port}`,
  );
});

function gracefulShutdown(signal) {
  logger.info({ signal }, 'Received shutdown signal, closing API Gateway...');
  server.close(() => {
    logger.info('HTTP server closed');
    const redis = getRedisClient();
    redis
      .quit()
      .then(() => {
        logger.info('Redis connection closed');
        // eslint-disable-next-line no-process-exit
        process.exit(0);
      })
      .catch(() => {
        // eslint-disable-next-line no-process-exit
        process.exit(0);
      });
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
