import { createLogger, GracefulShutdownHandler } from '@ecommerce/shared';
import { initializeKafkaTopics } from '@ecommerce/shared/kafka';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { prisma } from './lib/prisma.js';
import { PaymentOutboxWorker } from './workers/payment-outbox.worker.js';
import { paymentReturnConsumer } from './workers/payment-return-consumer.js';

const logger = createLogger({ service: config.serviceName });

const shutdownHandler = new GracefulShutdownHandler({
  serviceName: config.serviceName,
  shutdownTimeoutMs: parseInt(process.env.SHUTDOWN_TIMEOUT_MS, 10) || 10000,
  logger,
  prisma,
  consumers: [paymentReturnConsumer],
});

const app = createApp({
  getIsShuttingDown: () => shutdownHandler.getIsShuttingDown(),
});

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
    outboxWorker = new PaymentOutboxWorker();
    outboxWorker.start();
    shutdownHandler.addWorker(outboxWorker);
    logger.info('PaymentOutboxWorker started with HTTP server');
  }

  if (process.env.START_KAFKA_CONSUMERS !== 'false' && process.env.KAFKA_BROKERS) {
    paymentReturnConsumer.start().catch((err) => {
      logger.error({ err: err.message }, 'Failed to start PaymentReturnConsumer');
    });
    logger.info('PaymentReturnConsumer started');
  }
});

shutdownHandler.setServer(server).registerSignalHandlers();
