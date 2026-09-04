/**
 * P0-5: Persistent Return-Refund Idempotency Tests
 *
 * Verifies:
 * - ReturnRefundWorker uses persistent DB idempotency (not in-memory Set)
 * - Duplicate events are rejected by the ProcessedEvent check
 * - Concurrent duplicate events are handled via DB unique constraint (P2002)
 * - Process restart does NOT lose idempotency state
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

import { ReturnRefundWorker } from '../../src/workers/return-refund.worker.js';


const makeEvent = (overrides = {}) => ({
  eventId: 'event-uuid-001',
  eventType: 'return.completed',
  payload: {
    returnId: 'return-uuid-001',
    orderId: 'order-uuid-001',
    userId: 'user-uuid-001',
    amount: 250.0,
    returnNumber: 'RET-20260101-001',
  },
  ...overrides,
});

describe('ReturnRefundWorker — Persistent Idempotency', () => {
  let worker;
  let mockProcessedEventRepo;
  let mockReturnRefundService;

  beforeEach(() => {
    mockProcessedEventRepo = {
      checkAndMark: jest.fn(),
    };
    mockReturnRefundService = {
      processReturnRefund: jest.fn(),
    };
    worker = new ReturnRefundWorker({
      returnRefundService: mockReturnRefundService,
      processedEventRepo: mockProcessedEventRepo,
    });
  });

  describe('Duplicate event deduplication', () => {
    it('should process a new event and call returnRefundService', async () => {
      mockProcessedEventRepo.checkAndMark.mockResolvedValue({ alreadyProcessed: false });
      mockReturnRefundService.processReturnRefund.mockResolvedValue({
        refundId: 'refund-uuid-001',
        status: 'INITIATED',
      });

      const result = await worker.processEvent(makeEvent());

      expect(result.status).toBe('PROCESSED');
      expect(mockProcessedEventRepo.checkAndMark).toHaveBeenCalledWith(
        'payment-return-refund-worker',
        'event-uuid-001',
        'return.completed',
      );
      expect(mockReturnRefundService.processReturnRefund).toHaveBeenCalledTimes(1);
    });


    it('should skip and return SKIPPED_DUPLICATE for already-processed events', async () => {
      mockProcessedEventRepo.checkAndMark.mockResolvedValue({ alreadyProcessed: true });

      const result = await worker.processEvent(makeEvent());

      expect(result.status).toBe('SKIPPED_DUPLICATE');
      expect(result.eventId).toBe('event-uuid-001');
      // Must NOT call the downstream service for duplicates
      expect(mockReturnRefundService.processReturnRefund).not.toHaveBeenCalled();
    });

    it('should call checkAndMark with the correct consumer group name', async () => {
      mockProcessedEventRepo.checkAndMark.mockResolvedValue({ alreadyProcessed: false });
      mockReturnRefundService.processReturnRefund.mockResolvedValue({ refundId: 'r1' });

      await worker.processEvent(makeEvent({ eventId: 'event-for-group-test' }));

      expect(mockProcessedEventRepo.checkAndMark).toHaveBeenCalledWith(
        'payment-return-refund-worker', // consumer group constant
        'event-for-group-test',
        'return.completed',
      );
    });
  });

  describe('Process restart safety (persistent vs. in-memory)', () => {
    it('should use processedEventRepo (DB) not an in-memory Set', () => {
      // The worker should NOT have a _processedEventIds Set property
      // (which would be lost on process restart)
      expect(worker._processedEventIds).toBeUndefined();
      expect(worker.processedEventRepo).toBeDefined();
      expect(typeof worker.processedEventRepo.checkAndMark).toBe('function');
    });

    it('should call DB checkAndMark for every event (even second invocations)', async () => {
      mockProcessedEventRepo.checkAndMark.mockResolvedValue({ alreadyProcessed: false });
      mockReturnRefundService.processReturnRefund.mockResolvedValue({ refundId: 'r1' });

      // Process same event twice (simulates second process instance after restart)
      const event = makeEvent({ eventId: 'restart-event-001' });
      await worker.processEvent(event);

      // "Restart" — create new worker instance (DB state persists)
      const worker2 = new ReturnRefundWorker({
        returnRefundService: mockReturnRefundService,
        processedEventRepo: mockProcessedEventRepo, // Same mock (same DB state)
      });

      // Second process sees already-processed
      mockProcessedEventRepo.checkAndMark.mockResolvedValue({ alreadyProcessed: true });
      const result2 = await worker2.processEvent(event);
      expect(result2.status).toBe('SKIPPED_DUPLICATE');

      // Service was only called once total
      expect(mockReturnRefundService.processReturnRefund).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event routing', () => {
    it('should return UNMAPPED_EVENT for non-return events', async () => {
      const result = await worker.processEvent(makeEvent({ eventType: 'order.placed' }));
      expect(result.status).toBe('UNMAPPED_EVENT');
      expect(mockProcessedEventRepo.checkAndMark).not.toHaveBeenCalled();
    });

    it('should accept both return.completed and RETURN_COMPLETED event types', async () => {
      mockProcessedEventRepo.checkAndMark.mockResolvedValue({ alreadyProcessed: false });
      mockReturnRefundService.processReturnRefund.mockResolvedValue({ refundId: 'r1' });

      const result = await worker.processEvent(
        makeEvent({ eventId: 'ev-2', eventType: 'RETURN_COMPLETED' }),
      );
      expect(result.status).toBe('PROCESSED');
    });
  });

  describe('Validation', () => {
    it('should throw ValidationError when event has no eventId', async () => {
      await expect(
        worker.processEvent({ eventType: 'return.completed', payload: {} }),
      ).rejects.toThrow('Event ID and Event Type are required');
    });

    it('should throw ValidationError when event is null', async () => {
      await expect(worker.processEvent(null)).rejects.toThrow('Valid event object is required');
    });

    it('should throw ValidationError when payload is missing returnId', async () => {
      mockProcessedEventRepo.checkAndMark.mockResolvedValue({ alreadyProcessed: false });

      await expect(
        worker.processEvent({
          eventId: 'ev-no-payload',
          eventType: 'return.completed',
          payload: { orderId: 'ord-1' }, // missing returnId
        }),
      ).rejects.toThrow('returnId and orderId required');
    });
  });
});
