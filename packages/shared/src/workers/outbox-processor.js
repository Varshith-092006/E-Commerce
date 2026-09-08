import { logger as defaultLogger } from '../utils/logger.js';
import { metricsRegistry } from '../utils/metrics.js';
import { calculateRetryDelayWithJitter, mapConcurrent } from '../utils/concurrency.js';

export class OutboxProcessor {
  constructor({
    repository,
    processEvent,
    workerId = `worker_${process.pid}_${Math.random().toString(16).slice(2, 8)}`,
    batchSize = 10,
    pollIntervalMs = 1000,
    lockTimeoutMs = 30000,
    maxAttempts = 5,
    baseRetryMs = 1000,
    maxRetryMs = 60000,
    concurrency = null,
    logger = defaultLogger,
  } = {}) {
    if (!repository) {
      throw new Error('OutboxProcessor requires a repository instance');
    }
    if (typeof processEvent !== 'function') {
      throw new Error('OutboxProcessor requires a processEvent async function');
    }

    this.repository = repository;
    this.processEvent = processEvent;
    this.workerId = workerId;
    this.batchSize = batchSize;
    this.pollIntervalMs = pollIntervalMs;
    this.lockTimeoutMs = lockTimeoutMs;
    this.maxAttempts = maxAttempts;
    this.baseRetryMs = baseRetryMs;
    this.maxRetryMs = maxRetryMs;
    this.concurrency =
      concurrency !== null && concurrency !== undefined
        ? Math.max(1, parseInt(concurrency, 10) || 5)
        : Math.max(1, parseInt(process.env.MAX_DB_WORKER_CONCURRENCY, 10) || 5);
    this.logger = logger;

    this.isRunning = false;
    this.isPolling = false;
    this.timer = null;
    this.inFlightProcessing = new Set();
  }

  /**
   * Helper to determine if an error is transient/retryable
   */
  static isRetryableError(error) {
    if (!error) {
      return false;
    }

    // Explicit flag on custom error objects
    if (typeof error.retryable === 'boolean') {
      return error.retryable;
    }

    const status = error.statusCode || error.status;
    if (status) {
      // 408 Request Timeout, 429 Too Many Requests, 5xx Server Errors are retryable
      if (status === 408 || status === 429 || (status >= 500 && status < 600)) {
        return true;
      }
      // 4xx Client Errors (except 408/429) are permanent non-retryable failures
      if (status >= 400 && status < 500) {
        return false;
      }
    }

    const msg = (error.message || '').toLowerCase();
    const networkKeywords = [
      'timeout',
      'timed out',
      'econnrefused',
      'econnreset',
      'etimedout',
      'socket hang up',
      'fetch failed',
      'network error',
      'service unavailable',
      'gateway timeout',
    ];

    return networkKeywords.some((keyword) => msg.includes(keyword));
  }

  /**
   * Calculates exponential backoff delay with bounded random jitter
   */
  static calculateBackoff({
    retryCount = 0,
    baseDelayMs = 1000,
    maxDelayMs = 60000,
    jitterMaxMs = undefined,
    jitterPercent = null,
  } = {}) {
    return calculateRetryDelayWithJitter({
      attempt: retryCount + 1,
      baseDelayMs,
      maxDelayMs,
      jitterPercent,
      jitterMaxMs,
    });
  }

  /**
   * Starts the polling loop
   */
  start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.logger.info(
      { workerId: this.workerId, batchSize: this.batchSize, pollIntervalMs: this.pollIntervalMs },
      'OutboxProcessor started',
    );

    const loop = async () => {
      if (!this.isRunning) {
        return;
      }
      await this.pollAndProcess();
      if (this.isRunning) {
        this.timer = setTimeout(loop, this.pollIntervalMs);
      }
    };

    this.timer = setTimeout(loop, 100);
  }

  /**
   * Gracefully stops the polling loop and awaits active processing
   */
  async stop(timeoutMs = 10000) {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.logger.info(
      { workerId: this.workerId, inFlightCount: this.inFlightProcessing.size },
      'OutboxProcessor stopping...',
    );

    const startTime = Date.now();
    while (this.inFlightProcessing.size > 0 && Date.now() - startTime < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.logger.info({ workerId: this.workerId }, 'OutboxProcessor stopped cleanly');
  }

  /**
   * Performs single poll, claim, and process cycle
   */
  async pollAndProcess() {
    if (this.isPolling) {
      return;
    }
    this.isPolling = true;

    try {
      // 1. Release expired leases
      if (typeof this.repository.releaseExpiredLeases === 'function') {
        await this.repository.releaseExpiredLeases(this.lockTimeoutMs);
      }

      // 2. Claim batch atomically
      const events = await this.repository.claimBatch({
        workerId: this.workerId,
        batchSize: this.batchSize,
        lockTimeoutMs: this.lockTimeoutMs,
        maxRetries: this.maxAttempts,
      });

      if (!events || events.length === 0) {
        return;
      }

      this.logger.info(
        { workerId: this.workerId, claimedCount: events.length },
        'Claimed outbox event batch',
      );

      // 3. Process events with bounded concurrency within batch
      await mapConcurrent(events, (event) => this.handleSingleEvent(event), this.concurrency);
    } catch (err) {
      this.logger.error(
        { workerId: this.workerId, err: err.message },
        'Error during outbox poll and process cycle',
      );
    } finally {
      this.isPolling = false;
    }
  }

  /**
   * Processes a single event with retry and error classification
   */
  async handleSingleEvent(event) {
    const eventId = event.id;
    this.inFlightProcessing.add(eventId);
    const startTime = Date.now();

    try {
      await this.processEvent(event);

      await this.repository.markProcessed(eventId);

      const metric = metricsRegistry.getMetric('outbox_events_total');
      if (metric) {
        metric.inc({
          service: this.serviceName || 'outbox-worker',
          event_type: event.event_type || 'unknown',
          status: 'processed',
        });
      }

      this.logger.info(
        {
          workerId: this.workerId,
          eventId,
          eventType: event.event_type,
          durationMs: Date.now() - startTime,
        },
        'Successfully processed outbox event',
      );
    } catch (err) {
      const currentRetryCount = (event.retry_count || 0) + 1;
      const isRetryable = OutboxProcessor.isRetryableError(err);
      const hasAttemptsLeft = currentRetryCount < this.maxAttempts;
      const willRetry = isRetryable && hasAttemptsLeft;

      let nextRetryAt = null;
      if (willRetry) {
        const delayMs = OutboxProcessor.calculateBackoff({
          retryCount: currentRetryCount,
          baseDelayMs: this.baseRetryMs,
          maxDelayMs: this.maxRetryMs,
        });
        nextRetryAt = new Date(Date.now() + delayMs);
      }

      await this.repository.markFailed(eventId, {
        error: err.message || 'Unknown processing error',
        retryCount: currentRetryCount,
        nextRetryAt,
        isPermanent: !willRetry,
      });

      const metric = metricsRegistry.getMetric('outbox_events_total');
      if (metric) {
        metric.inc({
          service: this.serviceName || 'outbox-worker',
          event_type: event.event_type || 'unknown',
          status: willRetry ? 'retrying' : 'dead_lettered',
        });
      }

      if (willRetry) {
        this.logger.warn(
          {
            workerId: this.workerId,
            eventId,
            eventType: event.event_type,
            retryCount: currentRetryCount,
            nextRetryAt,
            err: err.message,
          },
          'Outbox event processing failed; scheduled retry',
        );
      } else {
        this.logger.error(
          {
            workerId: this.workerId,
            eventId,
            eventType: event.event_type,
            retryCount: currentRetryCount,
            isRetryable,
            err: err.message,
          },
          'Outbox event processing failed permanently (dead-lettered)',
        );
      }
    } finally {
      this.inFlightProcessing.delete(eventId);
    }
  }
}
