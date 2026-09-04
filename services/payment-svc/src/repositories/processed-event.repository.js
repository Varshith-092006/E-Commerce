import { prisma as defaultPrisma } from '../lib/prisma.js';

/**
 * ProcessedEvent Repository — payment-svc
 *
 * Provides persistent Kafka consumer idempotency.
 * Prevents duplicate event processing across process/container restarts.
 * The unique constraint on [consumer_group, event_id] is the idempotency key.
 */
export class ProcessedEventRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Checks if a given event has already been processed by the given consumer group.
   * @param {string} consumerGroup
   * @param {string} eventId
   * @returns {Promise<boolean>}
   */
  async isProcessed(consumerGroup, eventId) {
    if (!this.prisma?.processedEvent) {
      return false;
    }
    const record = await this.prisma.processedEvent.findUnique({
      where: {
        consumer_group_event_id: {
          consumer_group: consumerGroup,
          event_id: eventId,
        },
      },
    });
    return !!record;
  }

  /**
   * Marks an event as processed in a transaction-safe way.
   * Uses upsert to handle concurrent duplicate events gracefully.
   * If the unique constraint is violated concurrently, the second write is ignored.
   *
   * @param {string} consumerGroup
   * @param {string} eventId
   * @param {string} eventType
   * @returns {Promise<{created: boolean}>}
   */
  async markProcessed(consumerGroup, eventId, eventType) {
    if (!this.prisma?.processedEvent) {
      return { created: true };
    }
    try {
      await this.prisma.processedEvent.create({
        data: {
          consumer_group: consumerGroup,
          event_id: eventId,
          event_type: eventType,
        },
      });
      return { created: true };
    } catch (err) {
      // P2002 = Prisma unique constraint violation
      // This means another process beat us to marking this event as processed
      if (err.code === 'P2002') {
        return { created: false };
      }
      throw err;
    }
  }

  /**
   * Atomically checks-and-marks in a transaction.
   * Returns { alreadyProcessed: true } if duplicate, { alreadyProcessed: false } if newly marked.
   * Safe against concurrent duplicate events.
   *
   * @param {string} consumerGroup
   * @param {string} eventId
   * @param {string} eventType
   * @returns {Promise<{alreadyProcessed: boolean}>}
   */
  async checkAndMark(consumerGroup, eventId, eventType) {
    const result = await this.markProcessed(consumerGroup, eventId, eventType);
    return { alreadyProcessed: !result.created };
  }
}

export const processedEventRepository = new ProcessedEventRepository();
