import { createLogger, GracefulShutdownHandler } from '@ecommerce/shared';
import { initializeKafkaTopics } from '@ecommerce/shared/kafka';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { prisma } from './lib/prisma.js';
import { notificationKafkaConsumer } from './workers/notification-kafka-consumer.js';
import { kafkaDlqWorker } from './workers/kafka-dlq.worker.js';
import { notificationOutboxWorker } from './workers/notification-outbox.worker.js';

const logger = createLogger({ service: config.serviceName });

const shutdownHandler = new GracefulShutdownHandler({
  serviceName: config.serviceName,
  shutdownTimeoutMs: parseInt(process.env.SHUTDOWN_TIMEOUT_MS, 10) || 10000,
  logger,
  prisma,
  workers: [notificationOutboxWorker],
  consumers: [notificationKafkaConsumer, kafkaDlqWorker],
});

const app = createApp({
  getIsShuttingDown: () => shutdownHandler.getIsShuttingDown(),
});

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

shutdownHandler.setServer(server).registerSignalHandlers();
