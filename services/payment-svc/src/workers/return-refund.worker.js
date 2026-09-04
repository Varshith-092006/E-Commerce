import { ValidationError, EventTypes, createLogger } from '@ecommerce/shared';

import { returnRefundService as defaultReturnRefundService } from '../services/return-refund.service.js';
import { processedEventRepository as defaultProcessedEventRepo } from '../repositories/processed-event.repository.js';

const logger = createLogger({ service: 'payment-svc:return-refund-worker' });

const CONSUMER_GROUP = 'payment-return-refund-worker';

export class ReturnRefundWorker {
  constructor({
    returnRefundService = defaultReturnRefundService,
    processedEventRepo = defaultProcessedEventRepo,
    consumerName = CONSUMER_GROUP,
  } = {}) {
    this.returnRefundService = returnRefundService;
    this.processedEventRepo = processedEventRepo;
    this.consumerName = consumerName;
  }

  /**
   * Consumes return.completed event and triggers automated refund.
   *
   * Idempotency:
   * - Checks ProcessedEvent table in DB before processing (survives restarts)
   * - Uses DB unique constraint as the concurrency safety net
   * - Does NOT use in-memory Set (would be lost on restart)
   *
   * Concurrency safety:
   * - checkAndMark uses a DB upsert with unique constraint
   * - If two workers race on the same event_id, only one inserts; the other sees P2002
   * - The loser gets { alreadyProcessed: true } and returns SKIPPED_DUPLICATE
   */
  async processEvent(event) {
    if (!event || typeof event !== 'object') {
      throw new ValidationError('Valid event object is required');
    }

    const { eventId, eventType, payload = {} } = event;
    if (!eventId || !eventType) {
      throw new ValidationError('Event ID and Event Type are required');
    }

    const normalizedType = String(eventType).toLowerCase();
    if (
      eventType !== EventTypes.RETURN_COMPLETED &&
      normalizedType !== 'return.completed' &&
      normalizedType !== 'return_completed'
    ) {
      return { status: 'UNMAPPED_EVENT', eventType };
    }

    // ── Persistent idempotency check ──────────────────────────────────────────
    // This replaces the in-memory Set and survives process/container restarts.
    // Also handles concurrent duplicate events safely via DB unique constraint.
    const { alreadyProcessed } = await this.processedEventRepo.checkAndMark(
      CONSUMER_GROUP,
      eventId,
      eventType,
    );

    if (alreadyProcessed) {
      logger.info(
        { eventId, eventType, consumerGroup: CONSUMER_GROUP },
        'Return refund event already processed (persistent idempotency check); skipping duplicate',
      );
      return { status: 'SKIPPED_DUPLICATE', eventId };
    }

    const returnId = payload.returnId || payload.return_id || payload.id;
    const returnNumber = payload.returnNumber || payload.return_number;
    const orderId = payload.orderId || payload.order_id;
    const userId = payload.userId || payload.user_id;
    const amount = payload.amount;

    if (!returnId || !orderId) {
      throw new ValidationError('returnId and orderId required in return.completed event payload');
    }

    const result = await this.returnRefundService.processReturnRefund({
      returnId,
      returnNumber,
      orderId,
      userId,
      amount,
      reason: `Return Completed (${returnNumber || returnId})`,
    });

    // The event was marked processed BEFORE calling processReturnRefund so that
    // if the refund service itself fails, the event is not retried automatically.
    // If you want at-least-once refund semantics, move markProcessed after result.
    // Current choice: idempotency first, prevents duplicate refunds on retry.

    return { status: 'PROCESSED', eventId, result };
  }
}

export const returnRefundWorker = new ReturnRefundWorker();
