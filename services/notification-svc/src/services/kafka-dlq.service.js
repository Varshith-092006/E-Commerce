import {
  ValidationError,
  NotFoundError,
  BusinessRuleError,
  KafkaProducer,
  KafkaTopics,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';

const ALLOWED_REPLAY_TOPICS = [
  KafkaTopics.ORDER_EVENTS,
  KafkaTopics.PAYMENT_EVENTS,
  KafkaTopics.FULFILLMENT_EVENTS,
  KafkaTopics.NOTIFICATION_EVENTS,
];

export class KafkaDlqService {
  constructor({ prismaClient = defaultPrisma, kafkaProducer = null, logger = defaultLogger } = {}) {
    this.prisma = prismaClient;
    this.logger = logger;
    this.kafkaProducer =
      kafkaProducer || new KafkaProducer({ serviceName: 'notification-svc', logger });
  }

  /**
   * Persists an incoming DLQ event envelope into PostgreSQL
   */
  async recordDlqEvent(dlqEnvelope) {
    const payload = dlqEnvelope.payload || {};
    const originalTopic = payload.originalTopic || 'unknown';
    const originalPartition = parseInt(payload.originalPartition || '0', 10);
    const originalOffset = String(payload.originalOffset || '0');
    const consumerGroup = payload.consumerGroup || 'unknown-group';

    try {
      const record = await this.prisma.kafkaDlqRecord.upsert({
        where: {
          consumer_group_original_topic_original_partition_original_offset: {
            consumer_group: consumerGroup,
            original_topic: originalTopic,
            original_partition: originalPartition,
            original_offset: originalOffset,
          },
        },
        create: {
          event_id:
            dlqEnvelope.eventId || payload.originalEnvelope?.eventId || `offset_${originalOffset}`,
          event_type: payload.originalEnvelope?.eventType || 'event.failed_max_retries',
          original_topic: originalTopic,
          original_partition: originalPartition,
          original_offset: originalOffset,
          consumer_group: consumerGroup,
          failure_reason: payload.failureReason || 'RETRY_EXHAUSTED',
          error_message: payload.errorMessage || 'Unknown processing failure',
          payload: dlqEnvelope,
          status: 'DEAD_LETTERED',
        },
        update: {
          failure_reason: payload.failureReason || 'RETRY_EXHAUSTED',
          error_message: payload.errorMessage || 'Unknown processing failure',
          payload: dlqEnvelope,
        },
      });

      this.logger.info(
        { id: record.id, originalTopic, originalOffset, consumerGroup },
        'Recorded Kafka DLQ message in database',
      );
      return record;
    } catch (err) {
      this.logger.error(
        { err: err.message, originalTopic, originalOffset },
        'Error persisting Kafka DLQ record',
      );
      throw err;
    }
  }

  /**
   * Lists DLQ records with pagination and filtering
   */
  async listDlqRecords({ page = 1, limit = 20, topic, status } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * take;

    const where = {};
    if (topic) {
      where.original_topic = topic;
    }
    if (status) {
      where.status = status;
    }

    const [total, records] = await Promise.all([
      this.prisma.kafkaDlqRecord.count({ where }),
      this.prisma.kafkaDlqRecord.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      records,
      meta: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Replays a dead-lettered message back to its original or target domain topic
   */
  async replayDlqRecord({ dlqId, targetTopic, replayedBy = 'admin' }) {
    if (!dlqId) {
      throw new ValidationError('DLQ Record ID is required');
    }

    const dlqRecord = await this.prisma.kafkaDlqRecord.findUnique({
      where: { id: dlqId },
    });

    if (!dlqRecord) {
      throw new NotFoundError(`Kafka DLQ record with ID '${dlqId}' not found`);
    }

    if (dlqRecord.status === 'REPLAYED') {
      throw new BusinessRuleError(
        `Kafka DLQ record '${dlqId}' has already been replayed to topic '${dlqRecord.replayed_topic}'`,
      );
    }

    const destinationTopic = targetTopic || dlqRecord.original_topic;
    if (!ALLOWED_REPLAY_TOPICS.includes(destinationTopic)) {
      throw new ValidationError(
        `Invalid target topic '${destinationTopic}'. Must be one of: ${ALLOWED_REPLAY_TOPICS.join(', ')}`,
      );
    }

    const fullPayload = dlqRecord.payload || {};
    const originalEnvelope = fullPayload.payload?.originalEnvelope || fullPayload;

    if (!originalEnvelope || !originalEnvelope.eventId || !originalEnvelope.eventType) {
      throw new ValidationError('DLQ record is missing original event envelope data');
    }

    // Publish event back to destination topic
    await this.kafkaProducer.publish({
      topic: destinationTopic,
      key: String(originalEnvelope.aggregateId || originalEnvelope.eventId),
      eventEnvelope: originalEnvelope,
      headers: {
        'x-replayed-from-dlq': 'true',
        'x-dlq-id': dlqRecord.id,
      },
    });

    // Update DLQ record status
    const updated = await this.prisma.kafkaDlqRecord.update({
      where: { id: dlqId },
      data: {
        status: 'REPLAYED',
        replayed_topic: destinationTopic,
        replayed_at: new Date(),
        replayed_by: replayedBy,
      },
    });

    this.logger.info(
      { dlqId, destinationTopic, eventId: originalEnvelope.eventId, replayedBy },
      'Successfully replayed Kafka DLQ message',
    );

    return {
      success: true,
      dlqId,
      replayedToTopic: destinationTopic,
      eventId: originalEnvelope.eventId,
      record: updated,
    };
  }
}

export const kafkaDlqService = new KafkaDlqService();
