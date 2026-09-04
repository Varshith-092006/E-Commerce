import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { OutboxProcessor } from '../../src/workers/outbox-processor.js';

describe('OutboxProcessor Unit Tests', () => {
  let processor;
  let mockRepo;
  let mockProcessEvent;

  beforeEach(() => {
    mockRepo = {
      claimBatch: jest.fn(),
      markProcessed: jest.fn(),
      markFailed: jest.fn(),
      releaseExpiredLeases: jest.fn(),
    };
    mockProcessEvent = jest.fn();

    processor = new OutboxProcessor({
      repository: mockRepo,
      processEvent: mockProcessEvent,
      workerId: 'test_worker_1',
      batchSize: 5,
      pollIntervalMs: 50,
      lockTimeoutMs: 1000,
      maxAttempts: 3,
      baseRetryMs: 100,
      maxRetryMs: 1000,
    });
  });

  afterEach(async () => {
    if (processor.isRunning) {
      await processor.stop();
    }
    jest.clearAllMocks();
  });

  describe('Lifecycle & Polling', () => {
    it('should poll, claim batch, process events, and mark as PROCESSED on success', async () => {
      const sampleEvent = {
        id: 'evt-1',
        event_type: 'order.placed',
        retry_count: 0,
        payload: { orderNumber: 'ORD-100' },
      };

      mockRepo.claimBatch.mockResolvedValueOnce([sampleEvent]);
      mockProcessEvent.mockResolvedValueOnce({ success: true });

      await processor.pollAndProcess();

      expect(mockRepo.releaseExpiredLeases).toHaveBeenCalledWith(1000);
      expect(mockRepo.claimBatch).toHaveBeenCalledWith({
        workerId: 'test_worker_1',
        batchSize: 5,
        lockTimeoutMs: 1000,
        maxRetries: 3,
      });
      expect(mockProcessEvent).toHaveBeenCalledWith(sampleEvent);
      expect(mockRepo.markProcessed).toHaveBeenCalledWith('evt-1');
      expect(mockRepo.markFailed).not.toHaveBeenCalled();
    });

    it('should handle empty batch gracefully without errors', async () => {
      mockRepo.claimBatch.mockResolvedValueOnce([]);

      await processor.pollAndProcess();

      expect(mockProcessEvent).not.toHaveBeenCalled();
      expect(mockRepo.markProcessed).not.toHaveBeenCalled();
    });
  });

  describe('Retry Policy & Error Handling', () => {
    it('should calculate exponential backoff with bounded jitter', () => {
      const delay1 = OutboxProcessor.calculateBackoff({
        retryCount: 1,
        baseDelayMs: 1000,
        maxDelayMs: 10000,
        jitterMaxMs: 200,
      });
      expect(delay1).toBeGreaterThanOrEqual(2000);
      expect(delay1).toBeLessThanOrEqual(2200);

      const delayMax = OutboxProcessor.calculateBackoff({
        retryCount: 10,
        baseDelayMs: 1000,
        maxDelayMs: 5000,
        jitterMaxMs: 0,
      });
      expect(delayMax).toBe(5000);
    });

    it('should classify network/timeout errors as retryable and schedule next_retry_at', async () => {
      const sampleEvent = {
        id: 'evt-retryable',
        event_type: 'order.placed',
        retry_count: 0,
      };

      mockRepo.claimBatch.mockResolvedValueOnce([sampleEvent]);
      const timeoutError = new Error('Connection timed out to notification-svc');
      mockProcessEvent.mockRejectedValueOnce(timeoutError);

      await processor.pollAndProcess();

      expect(mockRepo.markProcessed).not.toHaveBeenCalled();
      expect(mockRepo.markFailed).toHaveBeenCalledWith('evt-retryable', {
        error: 'Connection timed out to notification-svc',
        retryCount: 1,
        nextRetryAt: expect.any(Date),
        isPermanent: false,
      });
    });

    it('should classify HTTP 400/403 or invalid payload as non-retryable dead letter', async () => {
      const sampleEvent = {
        id: 'evt-permanent-fail',
        event_type: 'order.placed',
        retry_count: 0,
      };

      mockRepo.claimBatch.mockResolvedValueOnce([sampleEvent]);
      const clientError = new Error('Invalid internal secret');
      clientError.statusCode = 403;
      mockProcessEvent.mockRejectedValueOnce(clientError);

      await processor.pollAndProcess();

      expect(mockRepo.markFailed).toHaveBeenCalledWith('evt-permanent-fail', {
        error: 'Invalid internal secret',
        retryCount: 1,
        nextRetryAt: null,
        isPermanent: true,
      });
    });

    it('should dead-letter event when maxAttempts threshold is exceeded', async () => {
      const sampleEvent = {
        id: 'evt-max-attempts',
        event_type: 'order.placed',
        retry_count: 2, // With maxAttempts = 3, retry_count + 1 = 3 (reached max)
      };

      mockRepo.claimBatch.mockResolvedValueOnce([sampleEvent]);
      const retryableError = new Error('Server 500 error');
      retryableError.statusCode = 500;
      mockProcessEvent.mockRejectedValueOnce(retryableError);

      await processor.pollAndProcess();

      expect(mockRepo.markFailed).toHaveBeenCalledWith('evt-max-attempts', {
        error: 'Server 500 error',
        retryCount: 3,
        nextRetryAt: null,
        isPermanent: true,
      });
    });
  });

  describe('Graceful Shutdown', () => {
    it('should stop polling and drain active processing on stop()', async () => {
      processor.start();
      expect(processor.isRunning).toBe(true);

      await processor.stop();
      expect(processor.isRunning).toBe(false);
    });
  });
});
