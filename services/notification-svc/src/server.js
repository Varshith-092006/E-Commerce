import { createLogger } from '@ecommerce/shared';
import { initializeKafkaTopics } from '@ecommerce/shared/kafka';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { notificationKafkaConsumer } from './workers/notification-kafka-consumer.js';
import { kafkaDlqWorker } from './workers/kafka-dlq.worker.js';
import { notificationOutboxWorker } from './workers/notification-outbox.worker.js';

const logger = createLogger({ service: config.serviceName });
const app = createApp();

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

  if (process.env.START_KAFKA_CONSUMERS !== 'false' && process.env.KAFKA_BROKERS) {
    notificationKafkaConsumer.start().catch((err) => {
      logger.error({ err: err.message }, 'Failed to start NotificationKafkaConsumer');
    });
    kafkaDlqWorker.start().catch((err) => {
      logger.error({ err: err.message }, 'Failed to start KafkaDlqWorker');
    });
    logger.info('NotificationKafkaConsumer and KafkaDlqWorker started');
  }

  // ── Notification Outbox Relay Worker ────────────────────────────────────────
  // Starts regardless of Kafka availability — outbox worker uses DB polling,
  // not Kafka. This ensures reliable delivery even in degraded Kafka scenarios.
  if (process.env.START_OUTBOX_WORKERS !== 'false') {
    notificationOutboxWorker.start();
    logger.info('NotificationOutboxWorker started (outbox relay for EMAIL/SMS)');
  }
});

async function gracefulShutdown(signal) {
  logger.info({ signal }, `Received ${signal}, shutting down ${config.serviceName}...`);

  // Stop the outbox worker first (non-critical background job)
  notificationOutboxWorker.stop();

  try {
    await notificationKafkaConsumer.stop();
    await kafkaDlqWorker.stop();
  } catch (err) {
    logger.warn({ err: err.message }, 'Error stopping consumers');
  }

  server.close(() => {
    logger.info('HTTP server closed');
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
