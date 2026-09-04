import { prisma as defaultPrisma } from '../lib/prisma.js';

export class EventIdempotencyService {
  constructor({ prismaClient = defaultPrisma } = {}) {
    this.prisma = prismaClient;
    this.processedEvents = new Map();
  }

  /**
   * Generates a composite key for a consumer and event
   */
  _buildKey(eventId, consumer = 'default') {
    return `${consumer}:${eventId}`;
  }

  /**
   * Checks if an event has already been processed by this consumer
   */
  async isProcessed(eventId, consumer = 'default') {
    if (!eventId) {
      return false;
    }
    const key = this._buildKey(eventId, consumer);
    if (this.processedEvents.has(key)) {
      return true;
    }

    if (!this.prisma?.processedEvent) {
      return false;
    }

    try {
      const record = await this.prisma.processedEvent.findUnique({
        where: {
          consumer_group_event_id: {
            consumer_group: consumer,
            event_id: eventId,
          },
        },
      });
      return Boolean(record);
    } catch {
      return false;
    }
  }

  /**
   * Marks an event as processed for this consumer
   */
  async markProcessed(eventId, consumer = 'default', metadata = {}) {
    if (!eventId) {
      return;
    }
    const key = this._buildKey(eventId, consumer);
    this.processedEvents.set(key, {
      eventId,
      consumer,
      processedAt: new Date(),
      metadata,
    });

    if (!this.prisma?.processedEvent) {
      return;
    }

    try {
      await this.prisma.processedEvent.create({
        data: {
          event_id: eventId,
          consumer_group: consumer,
          event_type: metadata.eventType || 'notification.event',
        },
      });
    } catch (err) {
      if (err.code !== 'P2002') {
        // Silently swallow duplicate key error
      }
    }
  }

  /**
   * Clears the store (used for test resets)
   */
  clear() {
    this.processedEvents.clear();
  }
}

export const eventIdempotencyService = new EventIdempotencyService();
