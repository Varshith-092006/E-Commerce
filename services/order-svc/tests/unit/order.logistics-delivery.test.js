import { jest } from '@jest/globals';
import { OrderService } from '../../src/services/order.service.js';
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  BusinessRuleError,
} from '@ecommerce/shared';

describe('Logistics & Last-Mile Delivery Unit Tests', () => {
  let orderService;
  let mockOrderRepo;

  const courierId = 'c1a2b3c4-0000-0000-0000-000000000001';
  const customerId = 'u1a2b3c4-0000-0000-0000-000000000001';
  const sellerId = 's1a2b3c4-0000-0000-0000-000000000001';
  const orderId = 'ord-123';

  const sampleOrder = {
    id: orderId,
    order_number: 'ORD-20260824-A1B2C3',
    user_id: customerId,
    status: 'SHIPPED',
    payment_method: 'COD',
    payment_id: 'pay-cod-123',
    total_amount: '118.00',
    courier_name: 'BlueDart',
    tracking_number: 'BD-8899776655',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shipping_address: {
      full_name: 'John Customer',
      phone: '+919876543210',
      street_address: '10 Tech Street',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560001',
    },
    items: [
      {
        id: 'item-1',
        product_id: 'prod-1',
        seller_id: sellerId,
        title: 'Mechanical Keyboard',
        unit_price: '118.00',
        quantity: 1,
        subtotal: '118.00',
      },
    ],
  };

  beforeEach(() => {
    mockOrderRepo = {
      findById: jest.fn(),
      findLogisticsOrders: jest.fn(),
      countLogisticsOrders: jest.fn(),
      transitionOrderStatusAtomic: jest.fn(),
      recordDeliveryAttemptAtomic: jest.fn(),
    };

    orderService = new OrderService({
      orderRepo: mockOrderRepo,
      paymentBaseUrl: 'http://localhost:4004',
      internalSecret: 'test-secret',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Out for Delivery Dispatch', () => {
    it('should transition SHIPPED to OUT_FOR_DELIVERY with agent metadata', async () => {
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'OUT_FOR_DELIVERY',
          delivery_agent_name: 'Ramesh Kumar',
          delivery_agent_phone: '+919876543210',
          updated_at: new Date().toISOString(),
        },
        alreadyInState: false,
        idempotent: false,
      });

      const res = await orderService.markOutForDelivery({
        orderId,
        actorId: courierId,
        actorRole: 'COURIER',
        deliveryAgentName: 'Ramesh Kumar',
        deliveryAgentPhone: '+919876543210',
      });

      expect(res.status).toBe('OUT_FOR_DELIVERY');
      expect(res.deliveryAgentName).toBe('Ramesh Kumar');
      expect(mockOrderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          targetStatus: 'OUT_FOR_DELIVERY',
          actorId: courierId,
          deliveryAgentData: {
            deliveryAgentName: 'Ramesh Kumar',
            deliveryAgentPhone: '+919876543210',
          },
        }),
      );
    });

    it('should reject CUSTOMER or SELLER role attempting out-for-delivery with ForbiddenError', async () => {
      await expect(
        orderService.markOutForDelivery({
          orderId,
          actorId: customerId,
          actorRole: 'CUSTOMER',
          deliveryAgentName: 'Ramesh Kumar',
          deliveryAgentPhone: '+919876543210',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should reject invalid deliveryAgentName with ValidationError', async () => {
      await expect(
        orderService.markOutForDelivery({
          orderId,
          actorId: courierId,
          actorRole: 'COURIER',
          deliveryAgentName: 'A', // too short (< 2)
          deliveryAgentPhone: '+919876543210',
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Delivery & Proof of Delivery (POD)', () => {
    it('should transition OUT_FOR_DELIVERY to DELIVERED with POD metadata', async () => {
      const deliveredAtDate = new Date().toISOString();
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'DELIVERED',
          delivered_at: deliveredAtDate,
          pod_metadata: {
            recipientName: 'John Customer',
            podReference: 'OTP-9876',
            deliveryNotes: 'Handed at door',
          },
        },
        alreadyInState: false,
        idempotent: false,
      });

      // Mock internal fetch for COD payment settlement
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { status: 'CAPTURED', settled: true },
        }),
      });

      const res = await orderService.markDelivered({
        orderId,
        actorId: courierId,
        actorRole: 'COURIER',
        recipientName: 'John Customer',
        podReference: 'OTP-9876',
        deliveryNotes: 'Handed at door',
        codAmountCollected: '118.00',
      });

      expect(res.status).toBe('DELIVERED');
      expect(res.podMetadata.recipientName).toBe('John Customer');
      expect(res.alreadyDelivered).toBe(false);
      expect(mockOrderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          targetStatus: 'DELIVERED',
          deliveryData: expect.objectContaining({
            recipientName: 'John Customer',
            podReference: 'OTP-9876',
          }),
        }),
      );
    });

    it('should be idempotent if order is already DELIVERED', async () => {
      const deliveredAtDate = new Date().toISOString();
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'DELIVERED',
          delivered_at: deliveredAtDate,
          pod_metadata: {
            recipientName: 'John Customer',
            podReference: 'OTP-9876',
          },
        },
        alreadyInState: true,
        idempotent: true,
      });

      const res = await orderService.markDelivered({
        orderId,
        actorId: courierId,
        actorRole: 'COURIER',
        recipientName: 'John Customer',
        podReference: 'OTP-9876',
      });

      expect(res.status).toBe('DELIVERED');
      expect(res.alreadyDelivered).toBe(true);
      expect(res.idempotent).toBe(true);
    });

    it('should reject missing or short recipientName with ValidationError', async () => {
      await expect(
        orderService.markDelivered({
          orderId,
          actorId: courierId,
          actorRole: 'COURIER',
          recipientName: 'J', // too short (< 2)
          podReference: 'OTP-9876',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should reject missing or short podReference with ValidationError', async () => {
      await expect(
        orderService.markDelivered({
          orderId,
          actorId: courierId,
          actorRole: 'COURIER',
          recipientName: 'John Customer',
          podReference: 'OT', // too short (< 3)
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Failed Delivery Attempt Logging', () => {
    it('should increment attempt count and record history reason atomically', async () => {
      mockOrderRepo.recordDeliveryAttemptAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'OUT_FOR_DELIVERY',
          delivery_attempts: 1,
          updated_at: new Date().toISOString(),
        },
        historyEntry: { id: 'hist-1' },
      });

      const res = await orderService.recordFailedDeliveryAttempt({
        orderId,
        actorId: courierId,
        actorRole: 'COURIER',
        reason: 'Customer premises locked / Door closed. Rescheduled.',
      });

      expect(res.status).toBe('OUT_FOR_DELIVERY');
      expect(res.deliveryAttempts).toBe(1);
      expect(mockOrderRepo.recordDeliveryAttemptAtomic).toHaveBeenCalledWith({
        orderId,
        actorId: courierId,
        actorRole: 'COURIER',
        reason: 'Customer premises locked / Door closed. Rescheduled.',
      });
    });

    it('should reject failure attempt logging if reason is too short (< 5 chars)', async () => {
      await expect(
        orderService.recordFailedDeliveryAttempt({
          orderId,
          actorId: courierId,
          actorRole: 'COURIER',
          reason: 'Door', // too short (< 5)
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Logistics Orders Query', () => {
    it('should return logistics run sheet items with correct pagination', async () => {
      mockOrderRepo.findLogisticsOrders.mockResolvedValue([
        {
          ...sampleOrder,
          delivery_attempts: 0,
        },
      ]);
      mockOrderRepo.countLogisticsOrders.mockResolvedValue(1);

      const res = await orderService.getLogisticsOrders({
        userRole: 'COURIER',
        status: 'SHIPPED,OUT_FOR_DELIVERY',
        page: 1,
        limit: 10,
      });

      expect(res.items).toHaveLength(1);
      expect(res.items[0].orderNumber).toBe('ORD-20260824-A1B2C3');
      expect(res.pagination.total).toBe(1);
    });

    it('should reject CUSTOMER or SELLER accessing logistics query with ForbiddenError', async () => {
      await expect(
        orderService.getLogisticsOrders({
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });
  });
});
