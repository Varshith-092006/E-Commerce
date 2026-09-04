import { jest } from '@jest/globals';
import { OrderSagaService } from '../../src/services/order-saga.service.js';
import { OrderSagaWorker } from '../../src/workers/order-saga.worker.js';
import { ValidationError, NotFoundError, EventTypes } from '@ecommerce/shared';

describe('OrderSagaService and OrderSagaWorker Unit Tests (Phase 4D)', () => {
  let sagaService;
  let sagaWorker;
  let mockOrderRepo;

  beforeEach(() => {
    mockOrderRepo = {
      findById: jest.fn(),
      transitionOrderStatusAtomic: jest.fn(),
    };

    sagaService = new OrderSagaService({ orderRepo: mockOrderRepo });
    sagaWorker = new OrderSagaWorker({
      orderSagaService: sagaService,
      consumerName: 'test-saga-worker',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('OrderSagaService', () => {
    it('should transition order to SHIPPED upon shipment.shipped event', async () => {
      mockOrderRepo.findById.mockResolvedValue({
        id: 'ord-100',
        status: 'PROCESSING',
      });
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: { id: 'ord-100', status: 'SHIPPED' },
        idempotent: false,
      });

      const res = await sagaService.handleShipmentShipped({
        orderId: 'ord-100',
        shipmentNumber: 'SHP-001',
        trackingNumber: 'TRK-001',
        courierCode: 'DELHIVERY',
        dispatchedAt: new Date().toISOString(),
      });

      expect(res.status).toBe('SHIPPED');
      expect(res.idempotent).toBe(false);
      expect(mockOrderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'ord-100',
          targetStatus: 'SHIPPED',
          shippingData: {
            courierName: 'DELHIVERY',
            trackingNumber: 'TRK-001',
          },
        }),
      );
    });

    it('should be idempotent if order is already in SHIPPED or later state', async () => {
      mockOrderRepo.findById.mockResolvedValue({
        id: 'ord-100',
        status: 'SHIPPED',
      });

      const res = await sagaService.handleShipmentShipped({
        orderId: 'ord-100',
        shipmentNumber: 'SHP-001',
      });

      expect(res.status).toBe('SHIPPED');
      expect(res.idempotent).toBe(true);
      expect(mockOrderRepo.transitionOrderStatusAtomic).not.toHaveBeenCalled();
    });

    it('should transition order to DELIVERED upon shipment.delivered event', async () => {
      mockOrderRepo.findById.mockResolvedValue({
        id: 'ord-200',
        status: 'SHIPPED',
      });
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: { id: 'ord-200', status: 'DELIVERED' },
        idempotent: false,
      });

      const res = await sagaService.handleShipmentDelivered({
        orderId: 'ord-200',
        shipmentNumber: 'SHP-002',
        deliveredAt: new Date().toISOString(),
        podReceivedBy: 'Alice',
      });

      expect(res.status).toBe('DELIVERED');
      expect(res.idempotent).toBe(false);
      expect(mockOrderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'ord-200',
          targetStatus: 'DELIVERED',
        }),
      );
    });

    it('should throw NotFoundError if order does not exist', async () => {
      mockOrderRepo.findById.mockResolvedValue(null);

      await expect(
        sagaService.handleShipmentShipped({ orderId: 'ord-none' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if orderId is missing', async () => {
      await expect(
        sagaService.handleShipmentShipped({ orderId: null }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('OrderSagaWorker Event Consumption', () => {
    it('should consume shipment.shipped event and invoke service', async () => {
      mockOrderRepo.findById.mockResolvedValue({ id: 'ord-1', status: 'PROCESSING' });
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: { id: 'ord-1', status: 'SHIPPED' },
        idempotent: false,
      });

      const res = await sagaWorker.processEvent({
        eventId: 'evt-saga-1',
        eventType: EventTypes.SHIPMENT_SHIPPED,
        payload: { orderId: 'ord-1', shipmentNumber: 'SHP-1' },
      });

      expect(res.status).toBe('PROCESSED');
    });

    it('should skip duplicate saga events', async () => {
      mockOrderRepo.findById.mockResolvedValue({ id: 'ord-1', status: 'PROCESSING' });
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: { id: 'ord-1', status: 'SHIPPED' },
        idempotent: false,
      });

      await sagaWorker.processEvent({
        eventId: 'evt-dup-saga',
        eventType: EventTypes.SHIPMENT_SHIPPED,
        payload: { orderId: 'ord-1' },
      });

      const res2 = await sagaWorker.processEvent({
        eventId: 'evt-dup-saga',
        eventType: EventTypes.SHIPMENT_SHIPPED,
        payload: { orderId: 'ord-1' },
      });

      expect(res2.status).toBe('SKIPPED_DUPLICATE');
    });
  });
});
