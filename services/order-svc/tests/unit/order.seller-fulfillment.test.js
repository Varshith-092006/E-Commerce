import { jest } from '@jest/globals';
import { OrderService } from '../../src/services/order.service.js';
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  BusinessRuleError,
} from '@ecommerce/shared';

describe('Seller Order Management & Fulfillment Unit Tests', () => {
  let orderService;
  let mockOrderRepo;

  const sellerA = 's1a2b3c4-0000-0000-0000-000000000001';
  const sellerB = 's9a8b7c6-0000-0000-0000-000000000009';
  const customerId = 'u1a2b3c4-0000-0000-0000-000000000001';
  const adminId = 'a1a2b3c4-0000-0000-0000-000000000001';
  const orderId = 'ord-123';

  const sampleOrder = {
    id: orderId,
    order_number: 'ORD-20260824-A1B2C3',
    user_id: customerId,
    status: 'PLACED',
    payment_method: 'COD',
    total_amount: '120.00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shipping_address: {
      full_name: 'John Customer',
      phone: '+919876543210',
      street_address: '10 Tech Street',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560001',
      country: 'India',
    },
    items: [
      {
        id: 'item-1',
        product_id: 'prod-1',
        seller_id: sellerA,
        title: 'Mechanical Keyboard',
        unit_price: '120.00',
        quantity: 1,
        subtotal: '120.00',
        status: 'PLACED',
      },
    ],
  };

  beforeEach(() => {
    mockOrderRepo = {
      findById: jest.fn(),
      findSellerOrders: jest.fn(),
      countSellerOrders: jest.fn(),
      transitionOrderStatusAtomic: jest.fn(),
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

  describe('Seller Order Listing (Scoping & Validation)', () => {
    it('should list seller orders filtered by status and search', async () => {
      mockOrderRepo.findSellerOrders.mockResolvedValue([
        {
          ...sampleOrder,
          sellerItems: sampleOrder.items,
          sellerItemsCount: 1,
        },
      ]);
      mockOrderRepo.countSellerOrders.mockResolvedValue(1);

      const result = await orderService.getSellerOrders({
        sellerId: sellerA,
        userRole: 'SELLER',
        status: 'PLACED,CONFIRMED',
        search: 'Keyboard',
        page: 1,
        limit: 10,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].orderNumber).toBe('ORD-20260824-A1B2C3');
      expect(result.items[0].sellerItems).toHaveLength(1);
      expect(mockOrderRepo.findSellerOrders).toHaveBeenCalledWith({
        sellerId: sellerA,
        userRole: 'SELLER',
        statuses: ['PLACED', 'CONFIRMED'],
        search: 'Keyboard',
        skip: 0,
        take: 10,
      });
    });

    it('should reject CUSTOMER role attempting to access seller orders', async () => {
      await expect(
        orderService.getSellerOrders({
          sellerId: customerId,
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Seller Order Confirmation (PLACED -> CONFIRMED)', () => {
    it('should transition PLACED to CONFIRMED successfully', async () => {
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: { ...sampleOrder, status: 'CONFIRMED', updated_at: new Date().toISOString() },
        alreadyInState: false,
      });

      const res = await orderService.confirmSellerOrder({
        orderId,
        sellerId: sellerA,
        userRole: 'SELLER',
        reason: 'Stock confirmed',
      });

      expect(res.status).toBe('CONFIRMED');
      expect(mockOrderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith({
        orderId,
        targetStatus: 'CONFIRMED',
        actorId: sellerA,
        actorRole: 'SELLER',
        reason: 'Stock confirmed',
      });
    });

    it('should throw NotFoundError if order does not exist', async () => {
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({ notFound: true });

      await expect(
        orderService.confirmSellerOrder({
          orderId: 'non-existent',
          sellerId: sellerA,
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('Seller Order Processing (CONFIRMED -> PROCESSING)', () => {
    it('should transition CONFIRMED to PROCESSING successfully', async () => {
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: { ...sampleOrder, status: 'PROCESSING', updated_at: new Date().toISOString() },
        alreadyInState: false,
      });

      const res = await orderService.processSellerOrder({
        orderId,
        sellerId: sellerA,
        userRole: 'SELLER',
      });

      expect(res.status).toBe('PROCESSING');
      expect(mockOrderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          targetStatus: 'PROCESSING',
          actorId: sellerA,
        }),
      );
    });
  });

  describe('Seller Shipping & Dispatch (PROCESSING -> SHIPPED)', () => {
    it('should transition PROCESSING to SHIPPED and persist courier/AWB tracking metadata', async () => {
      const shippedAtDate = new Date().toISOString();
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'SHIPPED',
          courier_name: 'BlueDart',
          tracking_number: 'BD-8899776655',
          shipped_at: shippedAtDate,
          updated_at: shippedAtDate,
        },
        alreadyInState: false,
      });

      const res = await orderService.shipSellerOrder({
        orderId,
        sellerId: sellerA,
        userRole: 'SELLER',
        courierName: 'BlueDart',
        trackingNumber: 'BD-8899776655',
      });

      expect(res.status).toBe('SHIPPED');
      expect(res.courierName).toBe('BlueDart');
      expect(res.trackingNumber).toBe('BD-8899776655');

      expect(mockOrderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith({
        orderId,
        targetStatus: 'SHIPPED',
        actorId: sellerA,
        actorRole: 'SELLER',
        reason: 'Handed over to BlueDart (AWB: BD-8899776655)',
        shippingData: {
          courierName: 'BlueDart',
          trackingNumber: 'BD-8899776655',
        },
      });
    });

    it('should reject shipping if courierName is missing or invalid length', async () => {
      await expect(
        orderService.shipSellerOrder({
          orderId,
          sellerId: sellerA,
          courierName: 'A', // too short (< 2)
          trackingNumber: 'BD-8899776655',
        }),
      ).rejects.toThrow(ValidationError);

      await expect(
        orderService.shipSellerOrder({
          orderId,
          sellerId: sellerA,
          courierName: '',
          trackingNumber: 'BD-8899776655',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should reject shipping if trackingNumber is missing or invalid length', async () => {
      await expect(
        orderService.shipSellerOrder({
          orderId,
          sellerId: sellerA,
          courierName: 'BlueDart',
          trackingNumber: '123', // too short (< 6)
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Seller Packing Slip Generation', () => {
    it('should generate packing slip containing only Seller A items', async () => {
      const multiItemOrder = {
        ...sampleOrder,
        items: [
          { id: 'i-1', product_id: 'p1', seller_id: sellerA, title: 'Item A', quantity: 2, unit_price: '50.00', subtotal: '100.00' },
          { id: 'i-2', product_id: 'p2', seller_id: sellerB, title: 'Item B', quantity: 1, unit_price: '20.00', subtotal: '20.00' },
        ],
      };

      mockOrderRepo.findById.mockResolvedValue(multiItemOrder);

      const slip = await orderService.getSellerPackingSlip({
        orderId,
        sellerId: sellerA,
        userRole: 'SELLER',
      });

      expect(slip.slipNumber).toBe('SLIP-ORD-20260824-A1B2C3');
      expect(slip.sellerItems).toHaveLength(1);
      expect(slip.sellerItems[0].title).toBe('Item A');
      expect(slip.recipient.fullName).toBe('John Customer');
    });

    it('should reject packing slip generation for unrelated Seller B with ForbiddenError', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder); // contains only sellerA item

      await expect(
        orderService.getSellerPackingSlip({
          orderId,
          sellerId: sellerB,
          userRole: 'SELLER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should allow ADMIN to generate packing slip with all items', async () => {
      const multiItemOrder = {
        ...sampleOrder,
        items: [
          { id: 'i-1', product_id: 'p1', seller_id: sellerA, title: 'Item A', quantity: 2, unit_price: '50.00', subtotal: '100.00' },
          { id: 'i-2', product_id: 'p2', seller_id: sellerB, title: 'Item B', quantity: 1, unit_price: '20.00', subtotal: '20.00' },
        ],
      };

      mockOrderRepo.findById.mockResolvedValue(multiItemOrder);

      const slip = await orderService.getSellerPackingSlip({
        orderId,
        sellerId: adminId,
        userRole: 'ADMIN',
      });

      expect(slip.sellerItems).toHaveLength(2);
    });
  });
});
