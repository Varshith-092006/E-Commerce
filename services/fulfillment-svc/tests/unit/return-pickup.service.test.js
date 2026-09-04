import { jest } from '@jest/globals';
import { ReturnPickupService } from '../../src/services/return-pickup.service.js';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  BusinessRuleError,
  EventTypes,
} from '@ecommerce/shared';

describe('ReturnPickupService Unit Tests (Phase 4C)', () => {
  let returnService;
  let mockPrisma;
  let mockReturnRepo;
  let mockInventoryRepo;
  let mockWarehouseRepo;
  let mockOutboxRepo;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn(async (callback) => {
        return await callback(mockPrisma);
      }),
    };

    mockReturnRepo = {
      createReturnPickup: jest.fn(),
      findById: jest.fn(),
      findByReturnNumber: jest.fn(),
      findByTrackingNumber: jest.fn(),
      findByOrderId: jest.fn(),
      updateReturnStatus: jest.fn(),
      updateItemInspection: jest.fn(),
      addTrackingUpdate: jest.fn(),
      findMany: jest.fn(),
    };

    mockInventoryRepo = {
      findByWarehouseAndSku: jest.fn(),
      adjustStock: jest.fn(),
      upsertStock: jest.fn(),
    };

    mockWarehouseRepo = {
      findById: jest.fn(),
      findMany: jest.fn(),
    };

    mockOutboxRepo = {
      createEvent: jest.fn(),
    };

    returnService = new ReturnPickupService({
      prismaClient: mockPrisma,
      returnRepo: mockReturnRepo,
      inventoryRepo: mockInventoryRepo,
      warehouseRepo: mockWarehouseRepo,
      outboxRepo: mockOutboxRepo,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Return Request Creation', () => {
    it('should create return pickup request, assign warehouse, and emit return.requested event', async () => {
      mockWarehouseRepo.findById.mockResolvedValue({
        id: 'wh-blr-1',
        code: 'WH-BLR-01',
      });

      const mockCreated = {
        id: 'ret-1',
        return_number: 'RET-20260825-001',
        order_id: 'ord-100',
        user_id: 'cust-1',
        warehouse_id: 'wh-blr-1',
        status: 'REQUESTED',
        courier_code: 'INTERNAL_FLEET',
        items: [
          {
            product_id: 'prod-1',
            sku: 'SKU-SHIRT-M',
            seller_id: 'seller-1',
            quantity: 1,
            reason: 'Wrong Size',
          },
        ],
      };
      mockReturnRepo.createReturnPickup.mockResolvedValue(mockCreated);

      const result = await returnService.requestReturnPickup({
        orderId: 'ord-100',
        userId: 'cust-1',
        warehouseId: 'wh-blr-1',
        pickupAddress: { street: '123 MG Road', city: 'Bangalore' },
        items: [
          {
            productId: 'prod-1',
            sku: 'SKU-SHIRT-M',
            sellerId: 'seller-1',
            quantity: 1,
            reason: 'Wrong Size',
          },
        ],
      });

      expect(result.id).toBe('ret-1');
      expect(result.status).toBe('REQUESTED');

      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.RETURN_REQUESTED,
          aggregateId: 'ret-1',
        }),
        mockPrisma,
      );
    });

    it('should reject return request if items array is empty', async () => {
      await expect(
        returnService.requestReturnPickup({
          orderId: 'ord-1',
          userId: 'cust-1',
          pickupAddress: { city: 'Pune' },
          items: [],
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Reverse Logistics Lifecycle & State Machine', () => {
    it('should progress through complete lifecycle: REQUESTED -> PICKUP_SCHEDULED -> PICKED_UP -> RECEIVED_AT_WAREHOUSE -> INSPECTED -> COMPLETED', async () => {
      const mockReturn = {
        id: 'ret-flow',
        return_number: 'RET-1001',
        order_id: 'ord-1',
        user_id: 'cust-1',
        warehouse_id: 'wh-blr-1',
        status: 'REQUESTED',
        courier_code: 'DELHIVERY',
        pickup_address: { city: 'Bangalore' },
        items: [
          {
            id: 'item-1',
            product_id: 'prod-1',
            sku: 'SKU-1',
            quantity: 2,
            is_restocked: false,
          },
        ],
      };

      // 1. Schedule Pickup
      mockReturnRepo.findById.mockResolvedValue(mockReturn);
      mockReturnRepo.updateReturnStatus.mockResolvedValue({
        ...mockReturn,
        status: 'PICKUP_SCHEDULED',
        return_tracking_number: 'RET-TRK-DELHIVERY-001',
      });

      const scheduled = await returnService.schedulePickup('ret-flow', {
        courierCode: 'DELHIVERY',
      });
      expect(scheduled.status).toBe('PICKUP_SCHEDULED');

      // 2. Record Proof of Pickup (POP)
      mockReturnRepo.findById.mockResolvedValue({ ...mockReturn, status: 'PICKUP_SCHEDULED' });
      mockReturnRepo.updateReturnStatus.mockResolvedValue({
        ...mockReturn,
        status: 'PICKED_UP',
        picked_up_at: new Date(),
      });

      const pickedUp = await returnService.recordProofOfPickup('ret-flow', {
        signature: 'POP-SIG-DATA',
        receivedBy: 'Agent Smith',
      });
      expect(pickedUp.status).toBe('PICKED_UP');
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.RETURN_PICKED_UP,
          aggregateId: 'ret-flow',
        }),
        mockPrisma,
      );

      // 3. Receive at Warehouse
      mockReturnRepo.findById.mockResolvedValue({ ...mockReturn, status: 'PICKED_UP' });
      mockReturnRepo.updateReturnStatus.mockResolvedValue({
        ...mockReturn,
        status: 'RECEIVED_AT_WAREHOUSE',
        received_at: new Date(),
      });

      const received = await returnService.receiveAtWarehouse('ret-flow');
      expect(received.status).toBe('RECEIVED_AT_WAREHOUSE');
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.RETURN_RECEIVED,
          aggregateId: 'ret-flow',
        }),
        mockPrisma,
      );

      // 4. Quality Inspection & Restocking
      mockReturnRepo.findById.mockResolvedValue({
        ...mockReturn,
        status: 'RECEIVED_AT_WAREHOUSE',
        items: [
          {
            id: 'item-1',
            product_id: 'prod-1',
            sku: 'SKU-1',
            quantity: 2,
            is_restocked: false,
          },
        ],
      });

      mockInventoryRepo.findByWarehouseAndSku.mockResolvedValue({
        id: 'inv-1',
        warehouse_id: 'wh-blr-1',
        sku: 'SKU-1',
        quantity_on_hand: 10,
        version: 1,
      });

      mockReturnRepo.updateReturnStatus.mockResolvedValue({
        ...mockReturn,
        status: 'COMPLETED',
        completed_at: new Date(),
      });

      const inspected = await returnService.inspectAndRestock('ret-flow', {
        inspections: [{ itemId: 'item-1', grade: 'PASS', notes: 'Item in mint condition' }],
      });

      expect(inspected.status).toBe('COMPLETED');

      // Verify stock was adjusted
      expect(mockInventoryRepo.adjustStock).toHaveBeenCalledWith(
        'inv-1',
        expect.objectContaining({ quantityOnHandDelta: 2 }),
        mockPrisma,
      );

      // Verify return item updated
      expect(mockReturnRepo.updateItemInspection).toHaveBeenCalledWith(
        'item-1',
        expect.objectContaining({
          inspection_grade: 'PASS',
          is_restocked: true,
        }),
        mockPrisma,
      );

      // Verify events emitted
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.RETURN_COMPLETED,
          aggregateId: 'ret-flow',
        }),
        mockPrisma,
      );
    });

    it('should reject invalid backward state transitions', async () => {
      mockReturnRepo.findById.mockResolvedValue({
        id: 'ret-done',
        status: 'COMPLETED',
      });

      await expect(
        returnService.updateTrackingCheckpoint('ret-done', {
          status: 'PICKUP_SCHEDULED',
          description: 'Invalid rollback',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });
  });

  describe('Quality Inspection & Restocking Rules', () => {
    it('should mark return REJECTED if items fail inspection (DAMAGED/DEFECTIVE) and not restock inventory', async () => {
      const mockReturn = {
        id: 'ret-damaged',
        return_number: 'RET-DAMAGED-1',
        warehouse_id: 'wh-blr-1',
        status: 'RECEIVED_AT_WAREHOUSE',
        items: [
          {
            id: 'item-damaged-1',
            product_id: 'prod-1',
            sku: 'SKU-DAMAGED',
            quantity: 1,
            is_restocked: false,
          },
        ],
      };

      mockReturnRepo.findById.mockResolvedValue(mockReturn);
      mockReturnRepo.updateReturnStatus.mockResolvedValue({
        ...mockReturn,
        status: 'REJECTED',
        completed_at: new Date(),
      });

      const res = await returnService.inspectAndRestock('ret-damaged', {
        inspections: [{ itemId: 'item-damaged-1', grade: 'DAMAGED', notes: 'Product shattered' }],
      });

      expect(res.status).toBe('REJECTED');
      expect(mockInventoryRepo.adjustStock).not.toHaveBeenCalled();
      expect(mockReturnRepo.updateItemInspection).toHaveBeenCalledWith(
        'item-damaged-1',
        expect.objectContaining({
          inspection_grade: 'DAMAGED',
          is_restocked: false,
        }),
        mockPrisma,
      );
    });

    it('should handle all inspection grades (DEFECTIVE, WRONG_ITEM, MISSING_ACCESSORIES) properly without restock', async () => {
      const mockReturn = {
        id: 'ret-non-pass',
        warehouse_id: 'wh-blr-1',
        status: 'RECEIVED_AT_WAREHOUSE',
        items: [
          { id: 'i1', sku: 'SKU-DEFECT', quantity: 1, is_restocked: false },
          { id: 'i2', sku: 'SKU-WRONG', quantity: 1, is_restocked: false },
          { id: 'i3', sku: 'SKU-MISSING', quantity: 1, is_restocked: false },
        ],
      };

      mockReturnRepo.findById.mockResolvedValue(mockReturn);
      mockReturnRepo.updateReturnStatus.mockResolvedValue({
        ...mockReturn,
        status: 'REJECTED',
        completed_at: new Date(),
      });

      const res = await returnService.inspectAndRestock('ret-non-pass', {
        inspections: [
          { itemId: 'i1', grade: 'DEFECTIVE' },
          { itemId: 'i2', grade: 'WRONG_ITEM' },
          { itemId: 'i3', grade: 'MISSING_ACCESSORIES' },
        ],
      });

      expect(res.status).toBe('REJECTED');
      expect(mockInventoryRepo.adjustStock).not.toHaveBeenCalled();
      expect(mockReturnRepo.updateItemInspection).toHaveBeenCalledTimes(3);
    });

    it('should reject invalid inspection grade', async () => {
      mockReturnRepo.findById.mockResolvedValue({
        id: 'ret-inv-grade',
        status: 'RECEIVED_AT_WAREHOUSE',
        items: [{ id: 'i1', sku: 'SKU-1', quantity: 1, is_restocked: false }],
      });

      await expect(
        returnService.inspectAndRestock('ret-inv-grade', {
          inspections: [{ itemId: 'i1', grade: 'INVALID_GRADE' }],
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should reject inspection on already finalized return', async () => {
      mockReturnRepo.findById.mockResolvedValue({
        id: 'ret-finalized',
        status: 'COMPLETED',
      });

      await expect(
        returnService.inspectAndRestock('ret-finalized', {
          inspections: [],
        }),
      ).rejects.toThrow(BusinessRuleError);
    });
  });

  describe('Tracking & Listing Queries', () => {
    it('should return sanitized tracking timeline by return tracking number', async () => {
      mockReturnRepo.findByTrackingNumber.mockResolvedValue({
        id: 'ret-1',
        return_number: 'RET-001',
        return_tracking_number: 'RET-TRK-001',
        courier_code: 'DELHIVERY',
        status: 'IN_TRANSIT',
        pickup_address: { street: 'Private Address', city: 'Bangalore' },
        tracking_updates: [
          { status: 'REQUESTED', description: 'Requested', recorded_at: new Date() },
          { status: 'PICKED_UP', description: 'Picked up', recorded_at: new Date() },
        ],
      });

      const timeline = await returnService.getTrackingTimeline('RET-TRK-001');
      expect(timeline.returnNumber).toBe('RET-001');
      expect(timeline.status).toBe('IN_TRANSIT');
      expect(timeline.trackingUpdates).toHaveLength(2);
      expect(timeline.pickup_address).toBeUndefined(); // Address stripped
    });

    it('should list returns with pagination and role scoping', async () => {
      mockReturnRepo.findMany.mockResolvedValue({
        items: [{ id: 'ret-1' }, { id: 'ret-2' }],
        total: 2,
      });

      const result = await returnService.listReturns(
        { page: 1, limit: 10 },
        { userId: 'cust-1', userRole: 'CUSTOMER' },
      );

      expect(result.returns).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('Authorization & IDOR Protection', () => {
    it('should prevent CUSTOMER A from fetching return belonging to CUSTOMER B', async () => {
      mockReturnRepo.findById.mockResolvedValue({
        id: 'ret-user-b',
        user_id: 'customer-b',
        items: [],
      });

      await expect(
        returnService.getReturnById('ret-user-b', {
          userId: 'customer-a',
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should allow SELLER to view return only if it contains their items', async () => {
      mockReturnRepo.findById.mockResolvedValue({
        id: 'ret-seller-item',
        user_id: 'cust-1',
        items: [{ seller_id: 'my-seller-id' }],
      });

      const res = await returnService.getReturnById('ret-seller-item', {
        userId: 'seller-user',
        userRole: 'SELLER',
        authSellerId: 'my-seller-id',
      });

      expect(res.id).toBe('ret-seller-item');
    });

    it('should prevent SELLER from viewing return for another seller', async () => {
      mockReturnRepo.findById.mockResolvedValue({
        id: 'ret-other-seller',
        user_id: 'cust-1',
        items: [{ seller_id: 'other-seller-id' }],
      });

      await expect(
        returnService.getReturnById('ret-other-seller', {
          userId: 'seller-user',
          userRole: 'SELLER',
          authSellerId: 'my-seller-id',
        }),
      ).rejects.toThrow(ForbiddenError);
    });
  });
});

