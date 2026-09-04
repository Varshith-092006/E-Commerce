import { jest } from '@jest/globals';
import { NotificationEventWorker } from '../../src/workers/notification-event.worker.js';
import { ValidationError, EventTypes } from '@ecommerce/shared';

describe('NotificationEventWorker Unit Tests (Phase 4D)', () => {
  let worker;
  let mockNotificationService;
  let mockIdempotencyService;

  beforeEach(() => {
    mockNotificationService = {
      dispatchNotification: jest.fn().mockResolvedValue({
        dispatches: [{ channel: 'EMAIL', status: 'SENT' }],
      }),
    };

    mockIdempotencyService = {
      isProcessed: jest.fn().mockResolvedValue(false),
      markProcessed: jest.fn().mockResolvedValue(undefined),
    };

    worker = new NotificationEventWorker({
      notificationService: mockNotificationService,
      idempotencyService: mockIdempotencyService,
      consumerName: 'test-notification-worker',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Event Validation & Idempotency', () => {
    it('should throw ValidationError if event is missing required identifiers', async () => {
      await expect(worker.processEvent(null)).rejects.toThrow(ValidationError);
      await expect(worker.processEvent({})).rejects.toThrow(ValidationError);
      await expect(
        worker.processEvent({ eventType: 'order.placed' }),
      ).rejects.toThrow(ValidationError);
    });

    it('should skip already processed duplicate events', async () => {
      mockIdempotencyService.isProcessed.mockResolvedValue(true);

      const res = await worker.processEvent({
        eventId: 'evt-duplicate-1',
        eventType: EventTypes.ORDER_PLACED,
        payload: { userId: 'user-1', orderNumber: 'ORD-100' },
      });

      expect(res.status).toBe('SKIPPED_DUPLICATE');
      expect(mockNotificationService.dispatchNotification).not.toHaveBeenCalled();
    });
  });

  describe('Event Mappings & Channel Dispatches', () => {
    it('should map order.placed to order.placed template with EMAIL, SMS, IN_APP', async () => {
      const res = await worker.processEvent({
        eventId: 'evt-order-placed',
        eventType: EventTypes.ORDER_PLACED,
        payload: {
          userId: 'user-1',
          orderNumber: 'ORD-1234',
          totalAmount: 1500,
          email: 'customer@example.com',
          phone: '+919876543210',
          items: [{ sku: 'SKU-A' }],
        },
      });

      expect(res.status).toBe('PROCESSED');
      expect(mockNotificationService.dispatchNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          templateCode: 'order.placed',
          channels: ['EMAIL', 'SMS', 'IN_APP'],
          category: 'ORDERS',
          templateData: expect.objectContaining({
            orderNumber: 'ORD-1234',
            totalAmount: 1500,
          }),
        }),
      );
      expect(mockIdempotencyService.markProcessed).toHaveBeenCalledWith(
        'evt-order-placed',
        'test-notification-worker',
        expect.any(Object),
      );
    });

    it('should map payment.captured to payment.success template with EMAIL, IN_APP', async () => {
      const res = await worker.processEvent({
        eventId: 'evt-pay-cap',
        eventType: EventTypes.PAYMENT_CAPTURED,
        payload: {
          userId: 'user-2',
          orderId: 'ord-99',
          amount: 2500,
          email: 'buyer@example.com',
        },
      });

      expect(res.status).toBe('PROCESSED');
      expect(mockNotificationService.dispatchNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-2',
          templateCode: 'payment.success',
          channels: ['EMAIL', 'IN_APP'],
          category: 'PAYMENTS',
        }),
      );
    });

    it('should map shipment.shipped to order.shipped template with tracking URL', async () => {
      const res = await worker.processEvent({
        eventId: 'evt-ship-shipped',
        eventType: EventTypes.SHIPMENT_SHIPPED,
        payload: {
          userId: 'user-3',
          shipmentNumber: 'SHP-001',
          trackingNumber: 'TRK-DELHIVERY-001',
          courierCode: 'DELHIVERY',
        },
      });

      expect(res.status).toBe('PROCESSED');
      expect(mockNotificationService.dispatchNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-3',
          templateCode: 'order.shipped',
          category: 'ORDERS',
        }),
      );
    });

    it('should map shipment.delivered to order.delivered template with POD', async () => {
      const res = await worker.processEvent({
        eventId: 'evt-ship-del',
        eventType: EventTypes.SHIPMENT_DELIVERED,
        payload: {
          userId: 'user-4',
          shipmentNumber: 'SHP-002',
          podReceivedBy: 'John Doe',
        },
      });

      expect(res.status).toBe('PROCESSED');
      expect(mockNotificationService.dispatchNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-4',
          templateCode: 'order.delivered',
          category: 'ORDERS',
        }),
      );
    });

    it('should map return.completed to return.completed template', async () => {
      const res = await worker.processEvent({
        eventId: 'evt-ret-comp',
        eventType: EventTypes.RETURN_COMPLETED,
        payload: {
          userId: 'user-5',
          returnNumber: 'RET-001',
        },
      });

      expect(res.status).toBe('PROCESSED');
      expect(mockNotificationService.dispatchNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-5',
          templateCode: 'return.completed',
          category: 'ORDERS',
        }),
      );
    });
  });
});
