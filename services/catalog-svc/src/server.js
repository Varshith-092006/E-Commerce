import { createLogger } from '@ecommerce/shared';
import { initializeKafkaTopics } from '@ecommerce/shared/kafka';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { CatalogOutboxWorker } from './workers/catalog-outbox.worker.js';
import { reviewConsumer } from './workers/review-consumer.js';

const logger = createLogger({ service: config.serviceName });
const app = createApp();

let outboxWorker = null;

const server = app.listen(config.port, async () => {
  logger.info(
    { port: config.port, env: config.env },
    `${config.serviceName} listening on port ${config.port}`,
  );

  if (process.env.KAFKA_BROKERS) {
    try {
      await initializeKafkaTopics();
    } catch (err) {
      logger.warn({ err: err.message }, 'Kafka topics init check warning');
    }
  }

  if (process.env.START_OUTBOX_WORKERS !== 'false') {
    outboxWorker = new CatalogOutboxWorker();
    outboxWorker.start();
    logger.info('CatalogOutboxWorker started with HTTP server');
  }

  if (process.env.START_KAFKA_CONSUMERS !== 'false' && process.env.KAFKA_BROKERS) {
    reviewConsumer.start().catch((err) => {
      logger.error({ err: err.message }, 'Failed to start ReviewConsumer');
    });
    logger.info('ReviewConsumer started');
  }
});

async function gracefulShutdown(signal) {
  logger.info({ signal }, `Received ${signal}, shutting down ${config.serviceName}...`);
  if (outboxWorker) {
    try {
      await outboxWorker.stop(5000);
    } catch (err) {
      logger.warn({ err: err.message }, 'Error stopping CatalogOutboxWorker');
    }
  }
  try {
    await reviewConsumer.stop();
  } catch (err) {
    logger.warn({ err: err.message }, 'Error stopping ReviewConsumer');
  }

  server.close(() => {
    logger.info('HTTP server closed');
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
