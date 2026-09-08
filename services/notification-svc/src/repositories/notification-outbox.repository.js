import { calculateRetryDelayWithJitter } from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';

/**
 * NotificationOutbox Repository
 *
 * Manages outbox records for reliable async email/SMS dispatch.
 * Worker poll cycle:
 *   1. claimPending() — atomic lock on N PENDING records
 *   2. For each record, dispatch via provider
 *   3. On success: markSent()
 *   4. On failure: markFailed() with exponential backoff, or markDlq() if max_retries exceeded
 */
export class NotificationOutboxRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Enqueue a notification for async outbox dispatch.
   * Called after the Notification DB record is created.
   */
  async enqueue({
    notificationId,
    userId,
    channel,
    recipient,
    subject = null,
    content,
    idempotencyKey = null,
    maxRetries = 3,
  }) {
    return await this.prisma.notificationOutbox.create({
      data: {
        notification_id: notificationId,
        user_id: userId,
        channel,
        recipient,
        subject,
        content,
        idempotency_key: idempotencyKey,
        max_retries: maxRetries,
        status: 'PENDING',
        next_retry_at: new Date(),
      },
    });
  }

  /**
   * Atomically claims up to `limit` PENDING/FAILED records whose
   * next_retry_at is <= now. Sets status to PROCESSING and timestamps locked_at.
   * Uses a Prisma transaction to prevent concurrent double-processing.
   */
  async claimPending({ workerId, limit = 10 }) {
    const now = new Date();

    return await this.prisma.$transaction(async (tx) => {
      const records = await tx.notificationOutbox.findMany({
        where: {
          status: { in: ['PENDING', 'FAILED'] },
          next_retry_at: { lte: now },
          // Skip locked records (shouldn't happen with atomic lock, but safety net)
          locked_at: null,
        },
        orderBy: [{ next_retry_at: 'asc' }, { created_at: 'asc' }],
        take: limit,
      });

      if (records.length === 0) {
        return [];
      }

      const ids = records.map((r) => r.id);

      await tx.notificationOutbox.updateMany({
        where: { id: { in: ids } },
        data: {
          status: 'PROCESSING',
          locked_at: now,
          locked_by: workerId,
        },
      });

      return records;
    });
  }

  /**
   * Marks an outbox record as successfully dispatched.
   */
  async markSent(id, providerMessageId) {
    return await this.prisma.notificationOutbox.update({
      where: { id },
      data: {
        status: 'SENT',
        provider_message_id: providerMessageId || null,
        sent_at: new Date(),
        locked_at: null,
        locked_by: null,
      },
    });
  }

  /**
   * Marks a failed dispatch, scheduling a retry with exponential backoff.
   * If retry_count >= max_retries, moves to DLQ.
   */
  async markFailed(id, errorMessage) {
    const record = await this.prisma.notificationOutbox.findUnique({ where: { id } });
    if (!record) {
      return null;
    }

    const newRetryCount = record.retry_count + 1;
    const isDlq = newRetryCount >= record.max_retries;

    // Exponential backoff with jitter: 1m, 2m, 4m, ... capped at 1h
    const backoffMs = calculateRetryDelayWithJitter({
      attempt: newRetryCount,
      baseDelayMs: 60_000,
      maxDelayMs: 60 * 60 * 1000,
    });
    const nextRetryAt = new Date(Date.now() + backoffMs);

    return await this.prisma.notificationOutbox.update({
      where: { id },
      data: {
        status: isDlq ? 'DLQ' : 'FAILED',
        retry_count: newRetryCount,
        last_error: errorMessage,
        next_retry_at: isDlq ? null : nextRetryAt,
        locked_at: null,
        locked_by: null,
      },
    });
  }

  /**
   * Releases stale PROCESSING locks (e.g., after worker crash).
   * Records locked for more than staleAfterMs are reset to FAILED.
   */
  async releaseStale({ staleAfterMs = 10 * 60 * 1000 } = {}) {
    const staleThreshold = new Date(Date.now() - staleAfterMs);

    const result = await this.prisma.notificationOutbox.updateMany({
      where: {
        status: 'PROCESSING',
        locked_at: { lte: staleThreshold },
      },
      data: {
        status: 'FAILED',
        last_error: 'Worker lock expired (stale recovery)',
        next_retry_at: new Date(),
        locked_at: null,
        locked_by: null,
      },
    });

    return result.count;
  }
}

export const notificationOutboxRepository = new NotificationOutboxRepository();
