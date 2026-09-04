import { prisma as defaultPrisma } from '../lib/prisma.js';

export class FulfillmentOutboxRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Creates an outbox event record (can run inside a Prisma interactive transaction)
   */
  async createEvent(
    { eventType, aggregateType = 'Inventory', aggregateId, payload },
    tx = this.prisma,
  ) {
    return await tx.fulfillmentOutbox.create({
      data: {
        event_type: eventType,
        aggregate_type: aggregateType,
        aggregate_id: aggregateId,
        payload,
        status: 'PENDING',
      },
    });
  }

  /**
   * Atomically claims a batch of pending/failed/stale outbox rows for worker processing
   */
  async claimBatch({ workerId, batchSize = 10, lockTimeoutMs = 30000, maxRetries = 5 }) {
    const now = new Date();
    const staleThreshold = new Date(Date.now() - lockTimeoutMs);

    // 1. Find candidate records eligible for processing
    const candidates = await this.prisma.fulfillmentOutbox.findMany({
      where: {
        OR: [
          { status: 'PENDING' },
          {
            status: 'FAILED',
            retry_count: { lt: maxRetries },
            OR: [{ next_retry_at: null }, { next_retry_at: { lte: now } }],
          },
          {
            status: 'PROCESSING',
            locked_at: { lt: staleThreshold },
          },
        ],
      },
      orderBy: [{ created_at: 'asc' }, { id: 'asc' }],
      take: batchSize,
    });

    if (!candidates || candidates.length === 0) {
      return [];
    }

    const candidateIds = candidates.map((c) => c.id);

    // 2. Atomically lock candidate records with conditional update
    const updateResult = await this.prisma.fulfillmentOutbox.updateMany({
      where: {
        id: { in: candidateIds },
        OR: [
          { status: 'PENDING' },
          { status: 'FAILED' },
          {
            status: 'PROCESSING',
            locked_at: { lt: staleThreshold },
          },
        ],
      },
      data: {
        status: 'PROCESSING',
        locked_at: now,
        locked_by: workerId,
      },
    });

    if (updateResult.count === 0) {
      return [];
    }

    // 3. Return precisely the records claimed by this worker
    return await this.prisma.fulfillmentOutbox.findMany({
      where: {
        id: { in: candidateIds },
        locked_by: workerId,
        locked_at: now,
      },
    });
  }

  /**
   * Marks outbox row as successfully PROCESSED
   */
  async markProcessed(id) {
    return await this.prisma.fulfillmentOutbox.update({
      where: { id },
      data: {
        status: 'PROCESSED',
        processed_at: new Date(),
        locked_at: null,
        locked_by: null,
      },
    });
  }

  /**
   * Marks outbox row as FAILED with retry metadata or permanent dead-letter
   */
  async markFailed(id, { error, retryCount, nextRetryAt = null }) {
    return await this.prisma.fulfillmentOutbox.update({
      where: { id },
      data: {
        status: 'FAILED',
        retry_count: retryCount,
        last_error: error ? String(error) : null,
        next_retry_at: nextRetryAt,
        locked_at: null,
        locked_by: null,
      },
    });
  }

  /**
   * Releases stale leases back to PENDING if worker crashed
   */
  async releaseExpiredLeases(lockTimeoutMs = 30000) {
    const staleThreshold = new Date(Date.now() - lockTimeoutMs);

    const result = await this.prisma.fulfillmentOutbox.updateMany({
      where: {
        status: 'PROCESSING',
        locked_at: { lt: staleThreshold },
      },
      data: {
        status: 'PENDING',
        locked_at: null,
        locked_by: null,
      },
    });

    return { releasedCount: result.count };
  }

  /**
   * Returns count of active outbox rows
   */
  async getPendingCount() {
    return await this.prisma.fulfillmentOutbox.count({
      where: {
        status: { in: ['PENDING', 'PROCESSING', 'FAILED'] },
      },
    });
  }
}

export const fulfillmentOutboxRepository = new FulfillmentOutboxRepository();
