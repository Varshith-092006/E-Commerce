import { jest } from '@jest/globals';
import { ShipmentService } from '../../src/services/shipment.service.js';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BusinessRuleError,
  EventTypes,
} from '@ecommerce/shared';

describe('ShipmentService Unit Tests (Phase 4B)', () => {
  let shipmentService;
  let mockPrisma;
  let mockShipmentRepo;
  let mockReservationRepo;
  let mockWarehouseRepo;
  let mockOutboxRepo;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn(async (callback) => {
        return await callback(mockPrisma);
      }),
    };

    mockShipmentRepo = {
      createShipmentWithItems: jest.fn(),
      findById: jest.fn(),
      findByShipmentNumber: jest.fn(),
      findByTrackingNumber: jest.fn(),
      findByOrderId: jest.fn(),
      findByReservationId: jest.fn(),
      updateShipmentStatus: jest.fn(),
      addTrackingUpdate: jest.fn(),
      findMany: jest.fn(),
    };

    mockReservationRepo = {
      findById: jest.fn(),
      findByReservationKey: jest.fn(),
    };

    mockWarehouseRepo = {
      findById: jest.fn(),
      findByCode: jest.fn(),
    };

    mockOutboxRepo = {
      createEvent: jest.fn(),
    };

    shipmentService = new ShipmentService({
      prismaClient: mockPrisma,
      shipmentRepo: mockShipmentRepo,
      reservationRepo: mockReservationRepo,
      warehouseRepo: mockWarehouseRepo,
      outboxRepo: mockOutboxRepo,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Multi-Warehouse Allocation & Shipment Creation', () => {
    it('should allocate single-warehouse committed reservation into one shipment and emit events', async () => {
      const mockReservation = {
        id: 'res-single',
        order_id: 'ord-123',
        user_id: 'cust-1',
        status: 'COMMITTED',
        items: [
          {
            product_id: 'prod-1',
            sku: 'SKU-SHIRT-M',
            quantity: 2,
            inventory_item: {
              warehouse_id: 'wh-blr-1',
              seller_id: 'seller-1',
            },
          },
        ],
      };
      mockReservationRepo.findById.mockResolvedValue(mockReservation);
      mockShipmentRepo.findByReservationId.mockResolvedValue([]);

      mockWarehouseRepo.findById.mockResolvedValue({
        id: 'wh-blr-1',
        code: 'WH-BLR-01',
        name: 'Bangalore Hub',
      });

      const mockCreatedShipment = {
        id: 'shp-1',
        shipment_number: 'SHP-20260825-000001',
        order_id: 'ord-123',
        user_id: 'cust-1',
        warehouse_id: 'wh-blr-1',
        status: 'ALLOCATED',
        courier_code: 'INTERNAL_FLEET',
        estimated_delivery: new Date(Date.now() + 86400000),
        items: [
          {
            product_id: 'prod-1',
            sku: 'SKU-SHIRT-M',
            seller_id: 'seller-1',
            quantity: 2,
          },
        ],
      };
      mockShipmentRepo.createShipmentWithItems.mockResolvedValue(mockCreatedShipment);

      const result = await shipmentService.allocateAndCreateShipment({
        orderId: 'ord-123',
        userId: 'cust-1',
        reservationId: 'res-single',
        shippingAddress: {
          street: '100 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].shipment_number).toBe('SHP-20260825-000001');

      // Verify outbox events
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.FULFILLMENT_ALLOCATED,
          aggregateId: 'shp-1',
          payload: expect.objectContaining({
            shipmentId: 'shp-1',
            orderId: 'ord-123',
            warehouseCode: 'WH-BLR-01',
          }),
        }),
        mockPrisma,
      );

      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.SHIPMENT_CREATED,
          aggregateId: 'shp-1',
        }),
        mockPrisma,
      );
    });

    it('should split multi-warehouse items into multiple distinct shipments for the same order', async () => {
      const mockReservation = {
        id: 'res-multi',
        order_id: 'ord-split',
        user_id: 'cust-1',
        status: 'COMMITTED',
        items: [
          {
            product_id: 'prod-1',
            sku: 'SKU-A',
            quantity: 1,
            inventory_item: { warehouse_id: 'wh-blr-1', seller_id: 'seller-1' },
          },
          {
            product_id: 'prod-2',
            sku: 'SKU-B',
            quantity: 3,
            inventory_item: { warehouse_id: 'wh-del-2', seller_id: 'seller-2' },
          },
        ],
      };
      mockReservationRepo.findById.mockResolvedValue(mockReservation);
      mockShipmentRepo.findByReservationId.mockResolvedValue([]);

      mockWarehouseRepo.findById.mockImplementation(async (id) => ({
        id,
        code: id === 'wh-blr-1' ? 'WH-BLR' : 'WH-DEL',
        name: id === 'wh-blr-1' ? 'Bangalore Hub' : 'Delhi Hub',
      }));

      mockShipmentRepo.createShipmentWithItems.mockImplementation(async (data) => ({
        id: `shp-${data.warehouse_id}`,
        ...data,
        items: data.items,
        estimated_delivery: new Date(),
      }));

      const result = await shipmentService.allocateAndCreateShipment({
        orderId: 'ord-split',
        userId: 'cust-1',
        reservationId: 'res-multi',
        shippingAddress: { city: 'Mumbai', state: 'MH', postalCode: '400001' },
      });

      expect(result).toHaveLength(2);
      expect(mockShipmentRepo.createShipmentWithItems).toHaveBeenCalledTimes(2);
    });

    it('should prevent double allocation for already allocated reservation', async () => {
      mockReservationRepo.findById.mockResolvedValue({
        id: 'res-allocated',
        order_id: 'ord-123',
        items: [],
      });
      mockShipmentRepo.findByReservationId.mockResolvedValue([{ id: 'existing-shp' }]);

      await expect(
        shipmentService.allocateAndCreateShipment({
          orderId: 'ord-123',
          userId: 'cust-1',
          reservationId: 'res-allocated',
          shippingAddress: { city: 'Bangalore' },
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('Shipment State Machine & Progression', () => {
    it('should support full forward progression: ALLOCATED -> PACKED -> DISPATCHED -> IN_TRANSIT -> OUT_FOR_DELIVERY -> DELIVERED', async () => {
      const mockShipment = {
        id: 'shp-state-1',
        shipment_number: 'SHP-001',
        order_id: 'ord-1',
        user_id: 'cust-1',
        status: 'ALLOCATED',
        courier_code: 'DELHIVERY',
        warehouse: { city: 'Bangalore' },
        shipping_address: { city: 'Pune' },
      };

      // 1. ALLOCATED -> PACKED
      mockShipmentRepo.findById.mockResolvedValue(mockShipment);
      mockShipmentRepo.updateShipmentStatus.mockResolvedValue({ ...mockShipment, status: 'PACKED' });

      const packed = await shipmentService.packShipment('shp-state-1');
      expect(packed.status).toBe('PACKED');

      // 2. PACKED -> DISPATCHED
      mockShipmentRepo.findById.mockResolvedValue({ ...mockShipment, status: 'PACKED' });
      mockShipmentRepo.updateShipmentStatus.mockResolvedValue({
        ...mockShipment,
        status: 'DISPATCHED',
        tracking_number: 'TRK-DELHIVERY-123',
        dispatched_at: new Date(),
      });

      const dispatched = await shipmentService.dispatchShipment('shp-state-1', {
        courierCode: 'DELHIVERY',
      });
      expect(dispatched.status).toBe('DISPATCHED');
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.SHIPMENT_SHIPPED,
          aggregateId: 'shp-state-1',
        }),
        mockPrisma,
      );

      // 3. DISPATCHED -> IN_TRANSIT
      mockShipmentRepo.findById.mockResolvedValue({ ...mockShipment, status: 'DISPATCHED' });
      mockShipmentRepo.updateShipmentStatus.mockResolvedValue({
        ...mockShipment,
        status: 'IN_TRANSIT',
      });

      const inTransit = await shipmentService.updateTrackingCheckpoint('shp-state-1', {
        status: 'IN_TRANSIT',
        location: 'Pune Sorting Hub',
        description: 'Arrived at destination hub',
      });
      expect(inTransit.status).toBe('IN_TRANSIT');

      // 4. IN_TRANSIT -> OUT_FOR_DELIVERY
      mockShipmentRepo.findById.mockResolvedValue({ ...mockShipment, status: 'IN_TRANSIT' });
      mockShipmentRepo.updateShipmentStatus.mockResolvedValue({
        ...mockShipment,
        status: 'OUT_FOR_DELIVERY',
      });

      const outForDelivery = await shipmentService.updateTrackingCheckpoint('shp-state-1', {
        status: 'OUT_FOR_DELIVERY',
        location: 'Pune Local Hub',
        description: 'Courier agent out for delivery',
      });
      expect(outForDelivery.status).toBe('OUT_FOR_DELIVERY');

      // 5. OUT_FOR_DELIVERY -> DELIVERED (via Proof of Delivery)
      mockShipmentRepo.findById.mockResolvedValue({ ...mockShipment, status: 'OUT_FOR_DELIVERY' });
      mockShipmentRepo.updateShipmentStatus.mockResolvedValue({
        ...mockShipment,
        status: 'DELIVERED',
        delivered_at: new Date(),
        pod_received_by: 'John Doe',
      });

      const delivered = await shipmentService.completeDelivery('shp-state-1', {
        recipientName: 'John Doe',
        signature: 'SIG-DATA-URL',
        deliveryNotes: 'Left at front door with security',
      });
      expect(delivered.status).toBe('DELIVERED');
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.SHIPMENT_DELIVERED,
          aggregateId: 'shp-state-1',
        }),
        mockPrisma,
      );
    });

    it('should reject invalid backward or terminal state transitions', async () => {
      // DELIVERED cannot transition back to IN_TRANSIT
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-delivered',
        status: 'DELIVERED',
      });

      await expect(
        shipmentService.updateTrackingCheckpoint('shp-delivered', {
          status: 'IN_TRANSIT',
          description: 'Invalid backtrack',
        }),
      ).rejects.toThrow(BusinessRuleError);

      // CANCELLED cannot transition to DISPATCHED
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-cancelled',
        status: 'CANCELLED',
      });

      await expect(
        shipmentService.dispatchShipment('shp-cancelled', {
          courierCode: 'BLUEDART',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });
  });

  describe('Courier Management & Tracking', () => {
    it('should reject invalid courier code', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-1',
        status: 'PACKED',
      });

      await expect(
        shipmentService.dispatchShipment('shp-1', {
          courierCode: 'INVALID_CARRIER',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should generate tracking number and manifest when dispatched', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-1',
        status: 'ALLOCATED',
        warehouse: { city: 'Bangalore' },
      });
      mockShipmentRepo.updateShipmentStatus.mockImplementation(async (id, data) => ({
        id,
        ...data,
      }));

      const res = await shipmentService.dispatchShipment('shp-1', {
        courierCode: 'BLUEDART',
      });

      expect(res.tracking_number).toMatch(/^TRK-BLUEDART-/);
      expect(res.manifest_id).toMatch(/^MAN-/);
      expect(res.status).toBe('DISPATCHED');
    });

    it('should retrieve sanitized tracking timeline by tracking number', async () => {
      mockShipmentRepo.findByTrackingNumber.mockResolvedValue({
        id: 'shp-trk-1',
        shipment_number: 'SHP-12345',
        tracking_number: 'TRK-BLUEDART-001',
        courier_code: 'BLUEDART',
        status: 'IN_TRANSIT',
        estimated_delivery: new Date('2026-08-30'),
        dispatched_at: new Date('2026-08-25'),
        delivered_at: null,
        shipping_address: { street: 'Confidential Address', city: 'Pune' },
        tracking_updates: [
          {
            status: 'ALLOCATED',
            location: null,
            description: 'Created',
            recorded_at: new Date('2026-08-25T10:00:00Z'),
          },
          {
            status: 'DISPATCHED',
            location: 'Bangalore',
            description: 'Handed to BlueDart',
            recorded_at: new Date('2026-08-25T12:00:00Z'),
          },
        ],
      });

      const timeline = await shipmentService.getTrackingTimeline('TRK-BLUEDART-001');

      expect(timeline.trackingNumber).toBe('TRK-BLUEDART-001');
      expect(timeline.status).toBe('IN_TRANSIT');
      expect(timeline.trackingUpdates).toHaveLength(2);
      expect(timeline.shipping_address).toBeUndefined(); // Sensitive address sanitized
    });
  });

  describe('Proof of Delivery (POD) Validation', () => {
    it('should throw ValidationError if recipient name is missing during delivery completion', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-pod',
        status: 'OUT_FOR_DELIVERY',
      });

      await expect(
        shipmentService.completeDelivery('shp-pod', {
          recipientName: '',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should be idempotent when completing an already DELIVERED shipment', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-already-del',
        status: 'DELIVERED',
        pod_received_by: 'Alice',
      });

      const res = await shipmentService.completeDelivery('shp-already-del', {
        recipientName: 'Alice',
      });

      expect(res.status).toBe('DELIVERED');
      expect(mockShipmentRepo.updateShipmentStatus).not.toHaveBeenCalled();
    });
  });

  describe('Authorization & IDOR Protection', () => {
    it('should prevent CUSTOMER A from fetching shipment belonging to CUSTOMER B', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-user-b',
        user_id: 'customer-b',
        items: [],
      });

      await expect(
        shipmentService.getShipmentById('shp-user-b', {
          userId: 'customer-a',
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should prevent SELLER from fetching shipment that does not contain their items', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-items-other',
        user_id: 'customer-a',
        items: [{ seller_id: 'seller-other' }],
      });

      await expect(
        shipmentService.getShipmentById('shp-items-other', {
          userId: 'seller-me-user',
          userRole: 'SELLER',
          authSellerId: 'seller-me-id',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should allow SELLER to fetch shipment if it contains products from their seller account', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-items-mine',
        user_id: 'customer-a',
        items: [{ seller_id: 'seller-me-id' }, { seller_id: 'seller-other' }],
      });

      const res = await shipmentService.getShipmentById('shp-items-mine', {
        userId: 'seller-me-user',
        userRole: 'SELLER',
        authSellerId: 'seller-me-id',
      });

      expect(res.id).toBe('shp-items-mine');
    });

    it('should allow ADMIN / LOGISTICS to access any shipment', async () => {
      mockShipmentRepo.findById.mockResolvedValue({
        id: 'shp-any',
        user_id: 'cust-xyz',
      });

      const res = await shipmentService.getShipmentById('shp-any', {
        userId: 'logistics-agent',
        userRole: 'LOGISTICS',
      });

      expect(res.id).toBe('shp-any');
    });
  });
});
