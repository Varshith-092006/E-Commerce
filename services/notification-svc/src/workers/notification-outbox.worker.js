import crypto from 'crypto';

import { createLogger, mapConcurrent } from '@ecommerce/shared';

import { NotificationOutboxRepository } from '../repositories/notification-outbox.repository.js';
import { EmailProvider } from '../services/providers/email.provider.js';
import { SmsProvider } from '../services/providers/sms.provider.js';

const logger = createLogger({ service: 'notification-svc:outbox-worker' });

const WORKER_ID = `outbox-worker-${crypto.randomBytes(4).toString('hex')}`;
const DEFAULT_POLL_INTERVAL_MS = parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || '5000', 10);
const DEFAULT_BATCH_SIZE = parseInt(process.env.OUTBOX_BATCH_SIZE || '10', 10);
const STALE_LOCK_MS = 10 * 60 * 1000; // 10 minutes

/**
 * NotificationOutbox Relay Worker
 *
 * Polls the notification_outbox table for PENDING/FAILED records
 * and dispatches them through the appropriate provider (Email/SMS).
 *
 * Design:
 * - Polls DB on configurable interval (default 5s)
 * - Uses atomic DB-level locking (PROCESSING status + locked_at) to prevent duplicate dispatch
 * - Exponential backoff retry (1m → 5m → 25m → DLQ) via repository
 * - Stale lock recovery runs every 5 poll cycles
 * - Graceful shutdown via stop()
 *
 * NOTE: Only dispatches EMAIL and SMS channels.
 *       IN_APP notifications are handled via SSE directly in the notification service.
 *       PUSH notifications (not implemented) can be added similarly.
 */
export class NotificationOutboxWorker {
  constructor({
    outboxRepo = new NotificationOutboxRepository(),
    emailProvider = new EmailProvider(),
    smsProvider = new SmsProvider(),
    pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
    batchSize = DEFAULT_BATCH_SIZE,
    concurrency = null,
    workerId = WORKER_ID,
  } = {}) {
    this.outboxRepo = outboxRepo;
    this.emailProvider = emailProvider;
    this.smsProvider = smsProvider;
    this.pollIntervalMs = pollIntervalMs;
    this.batchSize = batchSize;
    this.concurrency =
      concurrency !== null && concurrency !== undefined
        ? Math.max(1, parseInt(concurrency, 10) || 5)
        : Math.max(1, parseInt(process.env.MAX_NOTIFICATION_CONCURRENCY, 10) || 5);
    this.workerId = workerId;

    this._timer = null;
    this._running = false;
    this._pollCycle = 0;
  }

  /**
   * Starts the outbox relay worker.
   * Returns immediately — polling runs in background.
   */
  start() {
    if (this._running) {
      logger.warn({ workerId: this.workerId }, 'NotificationOutboxWorker already running');
      return;
    }

    this._running = true;
    logger.info(
      {
        workerId: this.workerId,
        pollIntervalMs: this.pollIntervalMs,
        batchSize: this.batchSize,
      },
      'NotificationOutboxWorker started',
    );

    this._scheduleNextPoll();
  }

  /**
   * Stops the outbox relay worker gracefully.
   */
  stop() {
    this._running = false;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    logger.info({ workerId: this.workerId }, 'NotificationOutboxWorker stopped');
  }

  _scheduleNextPoll() {
    if (!this._running) {
      return;
    }

    this._timer = setTimeout(async () => {
      try {
        await this._poll();
      } catch (err) {
        logger.error({ err: err.message, workerId: this.workerId }, 'Outbox poll cycle error');
      } finally {
        this._scheduleNextPoll();
      }
    }, this.pollIntervalMs);
  }

  async _poll() {
    this._pollCycle++;

    // Stale lock recovery every 5 cycles
    if (this._pollCycle % 5 === 0) {
      try {
        const released = await this.outboxRepo.releaseStale({ staleAfterMs: STALE_LOCK_MS });
        if (released > 0) {
          logger.warn({ released, workerId: this.workerId }, 'Released stale outbox locks');
        }
      } catch (err) {
        logger.error({ err: err.message }, 'Failed to release stale outbox locks');
      }
    }

    // Claim a batch of pending records
    let records;
    try {
      records = await this.outboxRepo.claimPending({
        workerId: this.workerId,
        limit: this.batchSize,
      });
    } catch (err) {
      logger.error({ err: err.message }, 'Failed to claim outbox records');
      return;
    }

    if (records.length === 0) {
      return; // Nothing to process
    }

    logger.debug({ count: records.length, workerId: this.workerId }, 'Processing outbox records');

    // Process records with bounded concurrency (MAX_NOTIFICATION_CONCURRENCY)
    await mapConcurrent(records, (record) => this._dispatch(record), this.concurrency);
  }

  /**
   * Dispatches a single outbox record to the appropriate provider.
   */
  async _dispatch(record) {
    const { id, channel, recipient, subject, content } = record;

    try {
      let result;

      switch (channel) {
        case 'EMAIL':
          result = await this.emailProvider.send({ recipient, subject, content });
          break;
        case 'SMS':
          result = await this.smsProvider.send({ recipient, content });
          break;
        default:
          // IN_APP and unsupported channels — mark sent immediately (no-op)
          await this.outboxRepo.markSent(id, null);
          return;
      }

      if (result.success) {
        await this.outboxRepo.markSent(id, result.providerMessageId);
        logger.debug(
          {
            id,
            channel,
            recipient: `${recipient.slice(0, 3)}***`,
            providerMessageId: result.providerMessageId,
          },
          'Outbox notification dispatched',
        );
      } else {
        await this.outboxRepo.markFailed(id, result.errorReason || 'Provider returned failure');
        logger.warn(
          { id, channel, errorReason: result.errorReason, retryable: result.retryable },
          'Outbox notification dispatch failed',
        );
      }
    } catch (err) {
      logger.error(
        { err: err.message, outboxId: id, channel },
        'Unhandled error during outbox dispatch',
      );
      try {
        await this.outboxRepo.markFailed(id, err.message);
      } catch (markErr) {
        logger.error(
          { err: markErr.message, outboxId: id },
          'Failed to mark outbox record as failed after dispatch error',
        );
      }
    }
  }
}

export const notificationOutboxWorker = new NotificationOutboxWorker();
