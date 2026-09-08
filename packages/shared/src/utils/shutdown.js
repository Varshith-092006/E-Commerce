import { logger as defaultLogger } from './logger.js';

/**
 * Standard Graceful Shutdown Handler across all microservices.
 * Coordinates closing HTTP servers, background polling loops,
 * Kafka consumers, Kafka producers, Redis connections, and Prisma clients.
 */
export class GracefulShutdownHandler {
  constructor({
    server = null,
    serviceName = process.env.SERVICE_NAME || 'service',
    shutdownTimeoutMs = parseInt(process.env.SHUTDOWN_TIMEOUT_MS, 10) || 10000,
    logger = defaultLogger,
    workers = [],
    consumers = [],
    producers = [],
    redis = null,
    prisma = null,
    customCleanup = [],
  } = {}) {
    this.server = server;
    this.serviceName = serviceName;
    this.shutdownTimeoutMs = Math.max(1000, shutdownTimeoutMs);
    this.logger = logger;
    this.workers = [...workers];
    this.consumers = [...consumers];
    this.producers = [...producers];
    this.redis = redis;
    this.prisma = prisma;
    this.customCleanup = [...customCleanup];
    this.isShuttingDown = false;
    this._shutdownPromise = null;
  }

  setServer(server) {
    this.server = server;
    return this;
  }

  addWorker(worker) {
    if (worker) {
      this.workers.push(worker);
    }
    return this;
  }

  addConsumer(consumer) {
    if (consumer) {
      this.consumers.push(consumer);
    }
    return this;
  }

  addProducer(producer) {
    if (producer) {
      this.producers.push(producer);
    }
    return this;
  }

  setRedis(redis) {
    this.redis = redis;
    return this;
  }

  setPrisma(prisma) {
    this.prisma = prisma;
    return this;
  }

  addCleanup(fn) {
    if (typeof fn === 'function') {
      this.customCleanup.push(fn);
    }
    return this;
  }

  getIsShuttingDown() {
    return this.isShuttingDown;
  }

  registerSignalHandlers() {
    const shutdown = (signal) => {
      this.shutdown(signal).catch((err) => {
        this.logger.error({ err: err.message, signal }, 'Error during graceful shutdown');
        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    return this;
  }

  async shutdown(signal = 'SIGTERM') {
    if (this._shutdownPromise) {
      return await this._shutdownPromise;
    }

    this._shutdownPromise = (async () => {
      this.isShuttingDown = true;
      this.logger.info(
        { signal, service: this.serviceName, timeoutMs: this.shutdownTimeoutMs },
        `Starting graceful shutdown of ${this.serviceName}...`,
      );

      // Safety timer to force exit if shutdown hangs beyond timeout
      let forceTimer = null;
      if (process.env.NODE_ENV !== 'test') {
        forceTimer = setTimeout(() => {
          this.logger.error(
            { service: this.serviceName },
            `Graceful shutdown timed out (${this.shutdownTimeoutMs}ms); forcing exit`,
          );
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        }, this.shutdownTimeoutMs);
        if (forceTimer.unref) {
          forceTimer.unref();
        }
      }

      try {
        // 1. Stop accepting new HTTP connections
        if (this.server && typeof this.server.close === 'function') {
          await new Promise((resolve) => {
            this.server.close((err) => {
              if (err) {
                this.logger.warn({ err: err.message }, 'Error closing HTTP server');
              } else {
                this.logger.info('HTTP server stopped accepting new requests');
              }
              resolve();
            });
          });
        }

        // 2. Stop background workers (outbox, cron, etc.)
        for (const worker of this.workers) {
          if (worker && typeof worker.stop === 'function') {
            try {
              await worker.stop();
              this.logger.info('Background worker stopped');
            } catch (err) {
              this.logger.warn({ err: err.message }, 'Error stopping worker');
            }
          }
        }

        // 3. Stop Kafka consumers and let in-flight message commits complete
        for (const consumer of this.consumers) {
          if (consumer && typeof consumer.stop === 'function') {
            try {
              await consumer.stop();
              this.logger.info('Kafka consumer stopped');
            } catch (err) {
              this.logger.warn({ err: err.message }, 'Error stopping Kafka consumer');
            }
          }
        }

        // 4. Disconnect Kafka producers
        for (const producer of this.producers) {
          if (producer && typeof producer.disconnect === 'function') {
            try {
              await producer.disconnect();
              this.logger.info('Kafka producer disconnected');
            } catch (err) {
              this.logger.warn({ err: err.message }, 'Error disconnecting Kafka producer');
            }
          }
        }

        // 5. Run custom cleanup handlers (e.g. flushing metrics, caches)
        for (const cleanup of this.customCleanup) {
          try {
            await cleanup();
          } catch (err) {
            this.logger.warn({ err: err.message }, 'Error during custom cleanup');
          }
        }

        // 6. Close Redis connection
        if (this.redis) {
          try {
            if (typeof this.redis.quit === 'function') {
              await this.redis.quit();
            } else if (typeof this.redis.disconnect === 'function') {
              await this.redis.disconnect();
            }
            this.logger.info('Redis connection closed');
          } catch (err) {
            this.logger.warn({ err: err.message }, 'Error closing Redis client');
          }
        }

        // 7. Disconnect Prisma client
        if (this.prisma && typeof this.prisma.$disconnect === 'function') {
          try {
            await this.prisma.$disconnect();
            this.logger.info('Prisma connection closed');
          } catch (err) {
            this.logger.warn({ err: err.message }, 'Error disconnecting Prisma');
          }
        }

        this.logger.info(
          { service: this.serviceName },
          `Graceful shutdown completed successfully for ${this.serviceName}`,
        );

        if (forceTimer) {
          clearTimeout(forceTimer);
        }

        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-process-exit
          process.exit(0);
        }
      } catch (err) {
        this.logger.error({ err: err.message }, 'Unexpected error during shutdown');
        if (forceTimer) {
          clearTimeout(forceTimer);
        }
        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        }
        throw err;
      }
    })();

    return this._shutdownPromise;
  }
}
