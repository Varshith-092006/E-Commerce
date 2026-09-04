import { createLogger } from '@ecommerce/shared';

import { createApp } from './app.js';
import { config } from './config/index.js';

const logger = createLogger({ service: config.serviceName });
const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.env },
    `${config.serviceName} listening on port ${config.port}`,
  );
});

function gracefulShutdown(signal) {
  logger.info({ signal }, `Received ${signal}, shutting down ${config.serviceName}...`);
  server.close(() => {
    logger.info('HTTP server closed');
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
