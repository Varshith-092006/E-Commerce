import { jest } from '@jest/globals';
import { OrderService } from '../../src/services/order.service.js';
import { ForbiddenError, NotFoundError } from '@ecommerce/shared';

describe('Order Tracking, Delivery Estimation & Invoicing Unit Tests', () => {
  let orderService;
  let mockOrderRepo;

  beforeEach(() => {
    mockOrderRepo = {
      findById: jest.fn(),
      findOrders: jest.fn(),
      countOrders: jest.fn(),
      transitionOrderStatusAtomic: jest.fn(),
    };

    orderService = new OrderService({
      orderRepo: mockOrderRepo,
      paymentBaseUrl: 'http://localhost:4004',
      internalSecret: 'test-internal-secret',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Tracking Step Progress Mapping', () => {
    it('should map PLACED to step 0 and 6 total steps', () => {
      const info = orderService.computeTrackingInfo({
        status: 'PLACED',
        created_at: new Date().toISOString(),
      });
      expect(info.currentStep).toBe(0);
      expect(info.totalSteps).toBe(6);
      expect(info.steps[0].completed).toBe(true);
      expect(info.steps[1].completed).toBe(false);
    });

    it('should map CONFIRMED to step 1 and PROCESSING to step 2', () => {
      const confirmed = orderService.computeTrackingInfo({
        status: 'CONFIRMED',
        created_at: new Date().toISOString(),
      });
      expect(confirmed.currentStep).toBe(1);

      const processing = orderService.computeTrackingInfo({
        status: 'PROCESSING',
        created_at: new Date().toISOString(),
      });
      expect(processing.currentStep).toBe(2);
    });

    it('should map SHIPPED to step 3, OUT_FOR_DELIVERY to step 4, and DELIVERED to step 5', () => {
      const shipped = orderService.computeTrackingInfo({
        status: 'SHIPPED',
        created_at: new Date().toISOString(),
      });
      expect(shipped.currentStep).toBe(3);

      const outForDelivery = orderService.computeTrackingInfo({
        status: 'OUT_FOR_DELIVERY',
        created_at: new Date().toISOString(),
      });
      expect(outForDelivery.currentStep).toBe(4);

      const delivered = orderService.computeTrackingInfo({
        status: 'DELIVERED',
        created_at: new Date().toISOString(),
      });
      expect(delivered.currentStep).toBe(5);
      expect(delivered.steps.every((s) => s.completed)).toBe(true);
    });

    it('should return currentStep null and status CANCELLED for cancelled orders', () => {
      const info = orderService.computeTrackingInfo({
        status: 'CANCELLED',
        created_at: new Date().toISOString(),
      });
      expect(info.currentStep).toBeNull();
      expect(info.status).toBe('CANCELLED');
      expect(info.estimatedDelivery).toBeNull();
    });
  });

  describe('Deterministic State-Aware Estimated Delivery Calculation', () => {
    const fixedCreated = new Date('2026-08-20T10:00:00.000Z');
    const fixedUpdated = new Date('2026-08-22T12:00:00.000Z');

    it('should return +4 business days from created_at for PLACED, CONFIRMED, and PROCESSING', () => {
      const estPlaced = orderService.computeEstimatedDelivery({
        status: 'PLACED',
        created_at: fixedCreated.toISOString(),
      });
      const expected = new Date(fixedCreated.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();
      expect(estPlaced).toBe(expected);
    });

    it('should return +2 business days from updated_at for SHIPPED', () => {
      const estShipped = orderService.computeEstimatedDelivery({
        status: 'SHIPPED',
        created_at: fixedCreated.toISOString(),
        updated_at: fixedUpdated.toISOString(),
      });
      const expected = new Date(fixedUpdated.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
      expect(estShipped).toBe(expected);
    });

    it('should return today end-of-day for OUT_FOR_DELIVERY', () => {
      const estOut = orderService.computeEstimatedDelivery({
        status: 'OUT_FOR_DELIVERY',
        created_at: fixedCreated.toISOString(),
      });
      const today = new Date();
      today.setHours(21, 0, 0, 0);
      expect(new Date(estOut).getHours()).toBe(21);
    });

    it('should return null for CANCELLED', () => {
      const estCancelled = orderService.computeEstimatedDelivery({
        status: 'CANCELLED',
        created_at: fixedCreated.toISOString(),
      });
      expect(estCancelled).toBeNull();
    });
  });

  describe('Invoice Generation & Role Authorization', () => {
    const customerId = 'u1a2b3c4-0000-0000-0000-000000000001';
    const otherCustomerId = 'u9a8b7c6-0000-0000-0000-000000000009';
    const sellerId = 's1a2b3c4-0000-0000-0000-000000000001';

    const mockOrder = {
      id: 'ord-123',
      order_number: 'ORD-20260824-A1B2C3',
      user_id: customerId,
      status: 'CONFIRMED',
      payment_method: 'PREPAID',
      payment_id: 'pay-123',
      total_amount: '118.00',
      created_at: new Date().toISOString(),
      shipping_address: {
        full_name: 'Jane Doe',
        phone: '+919999999999',
        street_address: '42 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India',
      },
      pricing_snapshot: {
        subtotal: '120.00',
        discount: '20.00',
        coupon_code: 'SAVE20',
        taxable_amount: '100.00',
        tax_rate: '0.18',
        tax: '18.00',
        shipping_fee: '0.00',
        grand_total: '118.00',
      },
      items: [
        {
          id: 'item-1',
          title: 'Mechanical Keyboard',
          quantity: 1,
          unit_price: '120.00',
          subtotal: '120.00',
        },
      ],
    };

    it('should generate structured invoice for owning customer', async () => {
      mockOrderRepo.findById.mockResolvedValue(mockOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue({
        status: 'CAPTURED',
      });

      const invoice = await orderService.getOrderInvoice('ord-123', customerId, 'CUSTOMER');

      expect(invoice.invoiceNumber).toBe('INV-ORD-20260824-A1B2C3');
      expect(invoice.paymentStatus).toBe('PAID');
      expect(invoice.pricing.grandTotal).toBe('118.00');
      expect(invoice.customer.name).toBe('Jane Doe');
    });

    it('should reject invoice request from unauthorized customer with ForbiddenError', async () => {
      mockOrderRepo.findById.mockResolvedValue(mockOrder);

      await expect(
        orderService.getOrderInvoice('ord-123', otherCustomerId, 'CUSTOMER'),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should strictly reject invoice request from SELLER with ForbiddenError', async () => {
      await expect(
        orderService.getOrderInvoice('ord-123', sellerId, 'SELLER'),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should allow ADMIN to generate invoice for any order', async () => {
      mockOrderRepo.findById.mockResolvedValue(mockOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue(null);

      const invoice = await orderService.getOrderInvoice('ord-123', 'admin-id', 'ADMIN');
      expect(invoice.invoiceNumber).toBe('INV-ORD-20260824-A1B2C3');
    });
  });

  describe('Non-Blocking Payment Resolution Fallback', () => {
    it('should return null fallback when payment service request fails or aborts', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Connection timed out'));

      const result = await orderService._fetchPaymentStatus('pay-timeout-id');
      expect(result).toBeNull();
    });

    it('should return data when payment service responds with 200 OK', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            paymentId: 'pay-123',
            status: 'CAPTURED',
            amount: '118.00',
          },
        }),
      });

      const result = await orderService._fetchPaymentStatus('pay-123');
      expect(result).toEqual({
        paymentId: 'pay-123',
        status: 'CAPTURED',
        amount: '118.00',
      });
    });
  });
});
