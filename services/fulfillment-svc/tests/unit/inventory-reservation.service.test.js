import { jest } from '@jest/globals';
import { InventoryReservationService } from '../../src/services/inventory-reservation.service.js';
import { WarehouseService } from '../../src/services/warehouse.service.js';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BusinessRuleError,
  ErrorCodes,
  EventTypes,
} from '@ecommerce/shared';

describe('InventoryReservationService & WarehouseService Unit Tests', () => {
  let inventoryReservationService;
  let warehouseService;
  let mockPrisma;
  let mockInventoryRepo;
  let mockReservationRepo;
  let mockWarehouseRepo;
  let mockOutboxRepo;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn(async (callback) => {
        return await callback(mockPrisma);
      }),
    };

    mockInventoryRepo = {
      findById: jest.fn(),
      findByWarehouseAndSku: jest.fn(),
      findBySku: jest.fn(),
      findByProductId: jest.fn(),
      findMany: jest.fn(),
      upsertStock: jest.fn(),
      adjustStock: jest.fn(),
      reserveStock: jest.fn(),
      commitStock: jest.fn(),
      releaseStock: jest.fn(),
    };

    mockReservationRepo = {
      createReservation: jest.fn(),
      findByReservationKey: jest.fn(),
      findById: jest.fn(),
      findExpiredHeldReservations: jest.fn(),
      commitReservation: jest.fn(),
      releaseReservation: jest.fn(),
      expireReservation: jest.fn(),
    };

    mockWarehouseRepo = {
      createWarehouse: jest.fn(),
      updateWarehouse: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findMany: jest.fn(),
    };

    mockOutboxRepo = {
      createEvent: jest.fn(),
      claimBatch: jest.fn(),
      markProcessed: jest.fn(),
      markFailed: jest.fn(),
      releaseExpiredLeases: jest.fn(),
    };

    inventoryReservationService = new InventoryReservationService({
      prismaClient: mockPrisma,
      inventoryRepo: mockInventoryRepo,
      reservationRepo: mockReservationRepo,
      warehouseRepo: mockWarehouseRepo,
      outboxRepo: mockOutboxRepo,
      defaultTtlSeconds: 900,
    });

    warehouseService = new WarehouseService({
      warehouseRepo: mockWarehouseRepo,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Warehouse Management', () => {
    it('should successfully create a warehouse with formatted code', async () => {
      mockWarehouseRepo.findByCode.mockResolvedValue(null);
      mockWarehouseRepo.createWarehouse.mockResolvedValue({
        id: 'wh-1',
        code: 'WH-BLR-01',
        name: 'Bangalore Central Hub',
        address_line1: '123 Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        postal_code: '560001',
        country: 'IN',
        is_active: true,
      });

      const result = await warehouseService.createWarehouse({
        code: 'wh-blr-01',
        name: 'Bangalore Central Hub',
        addressLine1: '123 Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
      });

      expect(result.code).toBe('WH-BLR-01');
      expect(mockWarehouseRepo.createWarehouse).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'WH-BLR-01',
          name: 'Bangalore Central Hub',
          is_active: true,
        }),
      );
    });

    it('should throw ValidationError if required warehouse fields are missing', async () => {
      await expect(
        warehouseService.createWarehouse({
          code: '',
          name: 'Hub',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ConflictError on duplicate warehouse code', async () => {
      mockWarehouseRepo.findByCode.mockResolvedValue({ id: 'existing-wh' });

      await expect(
        warehouseService.createWarehouse({
          code: 'WH-BLR-01',
          name: 'Duplicate Hub',
          addressLine1: '123 Street',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
        }),
      ).rejects.toThrow(ConflictError);
    });

    it('should update warehouse details and handle active/inactive status', async () => {
      mockWarehouseRepo.findById.mockResolvedValue({
        id: 'wh-1',
        name: 'Old Name',
        is_active: true,
      });
      mockWarehouseRepo.updateWarehouse.mockResolvedValue({
        id: 'wh-1',
        name: 'New Name',
        is_active: false,
      });

      const result = await warehouseService.updateWarehouse('wh-1', {
        name: 'New Name',
        isActive: false,
      });

      expect(result.is_active).toBe(false);
      expect(mockWarehouseRepo.updateWarehouse).toHaveBeenCalledWith('wh-1', {
        name: 'New Name',
        is_active: false,
      });
    });

    it('should list warehouses with pagination and active filter', async () => {
      mockWarehouseRepo.findMany.mockResolvedValue({
        items: [{ id: 'wh-1', is_active: true }],
        total: 1,
      });

      const res = await warehouseService.listWarehouses({ isActive: 'true', page: 1, limit: 10 });
      expect(res.warehouses).toHaveLength(1);
      expect(res.pagination.total).toBe(1);
    });
  });

  describe('Inventory Intake & Adjustments', () => {
    it('should successfully intake stock for active warehouse and trigger low stock event if below threshold', async () => {
      mockWarehouseRepo.findById.mockResolvedValue({
        id: 'wh-1',
        code: 'WH-BLR-01',
        is_active: true,
      });

      const mockItem = {
        id: 'inv-1',
        product_id: 'prod-1',
        sku: 'SKU-SHIRT-M',
        warehouse_id: 'wh-1',
        quantity_on_hand: 5,
        quantity_reserved: 0,
        quantity_allocated: 0,
        safety_stock: 2,
        reorder_threshold: 10,
      };
      mockInventoryRepo.upsertStock.mockResolvedValue(mockItem);

      const result = await inventoryReservationService.intakeStock({
        productId: 'prod-1',
        sku: 'sku-shirt-m',
        warehouseId: 'wh-1',
        quantity: 5,
        reorderThreshold: 10,
        userRole: 'ADMIN',
      });

      expect(result.id).toBe('inv-1');
      // Because available quantity (5) <= reorder_threshold (10), outbox event should be written
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.INVENTORY_LOW_STOCK,
          aggregateId: 'inv-1',
          payload: expect.objectContaining({
            availableQuantity: 5,
            reorderThreshold: 10,
          }),
        }),
        mockPrisma,
      );
    });

    it('should reject stock intake on inactive warehouse', async () => {
      mockWarehouseRepo.findById.mockResolvedValue({
        id: 'wh-inactive',
        code: 'WH-INACTIVE',
        is_active: false,
      });

      await expect(
        inventoryReservationService.intakeStock({
          productId: 'prod-1',
          sku: 'SKU-1',
          warehouseId: 'wh-inactive',
          quantity: 10,
          userRole: 'ADMIN',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });

    it('should prevent seller from intaking stock for another seller account', async () => {
      await expect(
        inventoryReservationService.intakeStock({
          productId: 'prod-1',
          sku: 'SKU-1',
          warehouseId: 'wh-1',
          sellerId: 'seller-other',
          quantity: 10,
          userRole: 'SELLER',
          authSellerId: 'seller-mine',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should adjust stock and reject adjustment that makes stock less than reserved+allocated', async () => {
      mockInventoryRepo.findById.mockResolvedValue({
        id: 'inv-1',
        quantity_on_hand: 10,
        quantity_reserved: 8,
        quantity_allocated: 1,
      });

      // Reducing by 3 would make on_hand = 7, which is less than reserved (8) + allocated (1) = 9
      await expect(
        inventoryReservationService.adjustStock('inv-1', {
          quantityDelta: -3,
          userRole: 'ADMIN',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });

    it('should check stock across warehouses accurately', async () => {
      mockInventoryRepo.findBySku.mockResolvedValue([
        {
          id: 'inv-1',
          product_id: 'prod-1',
          sku: 'SKU-A',
          warehouse_id: 'wh-1',
          quantity_on_hand: 20,
          quantity_reserved: 5,
          quantity_allocated: 2,
          warehouse: { code: 'WH-1' },
        },
        {
          id: 'inv-2',
          product_id: 'prod-1',
          sku: 'SKU-A',
          warehouse_id: 'wh-2',
          quantity_on_hand: 15,
          quantity_reserved: 0,
          quantity_allocated: 0,
          warehouse: { code: 'WH-2' },
        },
      ]);

      const result = await inventoryReservationService.checkStock({
        items: [{ sku: 'SKU-A', requestedQuantity: 25 }],
      });

      expect(result).toHaveLength(1);
      expect(result[0].quantityOnHand).toBe(35);
      expect(result[0].quantityReserved).toBe(5);
      expect(result[0].quantityAllocated).toBe(2);
      expect(result[0].availableQuantity).toBe(28); // 35 - 5 - 2 = 28
      expect(result[0].isAvailable).toBe(true); // 28 >= 25
    });
  });

  describe('Inventory Reservation & Concurrency Safety', () => {
    it('should atomically reserve stock, persist TTL, and write inventory.reserved outbox event', async () => {
      mockReservationRepo.findByReservationKey.mockResolvedValue(null);

      const candidateInventory = {
        id: 'inv-1',
        product_id: 'prod-1',
        sku: 'SKU-RED-SHIRT',
        warehouse_id: 'wh-1',
        quantity_on_hand: 50,
        quantity_reserved: 10,
        quantity_allocated: 0,
        reorder_threshold: 5,
      };
      mockInventoryRepo.findBySku.mockResolvedValue([candidateInventory]);
      mockInventoryRepo.reserveStock.mockResolvedValue({
        ...candidateInventory,
        quantity_reserved: 12,
      });

      const mockCreatedReservation = {
        id: 'res-1',
        reservation_key: 'res-key-abc',
        user_id: 'cust-1',
        order_id: null,
        status: 'HELD',
        expires_at: new Date(Date.now() + 900000),
        items: [
          {
            inventory_item_id: 'inv-1',
            product_id: 'prod-1',
            sku: 'SKU-RED-SHIRT',
            quantity: 2,
          },
        ],
      };
      mockReservationRepo.createReservation.mockResolvedValue(mockCreatedReservation);

      const result = await inventoryReservationService.createReservation({
        reservationKey: 'res-key-abc',
        userId: 'cust-1',
        ttlSeconds: 900,
        items: [{ sku: 'SKU-RED-SHIRT', quantity: 2 }],
        userRole: 'CUSTOMER',
      });

      expect(result.isIdempotent).toBe(false);
      expect(result.reservation.id).toBe('res-1');

      // Verify atomic reserveStock called
      expect(mockInventoryRepo.reserveStock).toHaveBeenCalledWith('inv-1', 2, mockPrisma);

      // Verify outbox event written transactionally
      expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: EventTypes.INVENTORY_RESERVED,
          aggregateId: 'res-1',
          payload: expect.objectContaining({
            reservationId: 'res-1',
            reservationKey: 'res-key-abc',
            userId: 'cust-1',
          }),
        }),
        mockPrisma,
      );
    });

    it('should return existing reservation idempotently on duplicate reservationKey for same user', async () => {
      const existing = {
        id: 'res-1',
        reservation_key: 'res-key-abc',
        user_id: 'cust-1',
        status: 'HELD',
      };
      mockReservationRepo.findByReservationKey.mockResolvedValue(existing);

      const result = await inventoryReservationService.createReservation({
        reservationKey: 'res-key-abc',
        userId: 'cust-1',
        items: [{ sku: 'SKU-RED-SHIRT', quantity: 2 }],
        userRole: 'CUSTOMER',
      });

      expect(result.isIdempotent).toBe(true);
      expect(result.reservation.id).toBe('res-1');
      expect(mockInventoryRepo.reserveStock).not.toHaveBeenCalled();
    });

    it('should reject duplicate reservationKey belonging to another user with ForbiddenError (IDOR protection)', async () => {
      const existing = {
        id: 'res-1',
        reservation_key: 'res-key-abc',
        user_id: 'cust-original',
        status: 'HELD',
      };
      mockReservationRepo.findByReservationKey.mockResolvedValue(existing);

      await expect(
        inventoryReservationService.createReservation({
          reservationKey: 'res-key-abc',
          userId: 'cust-attacker',
          items: [{ sku: 'SKU-RED-SHIRT', quantity: 2 }],
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should roll back and reject when inventory is insufficient for any item', async () => {
      mockReservationRepo.findByReservationKey.mockResolvedValue(null);

      mockInventoryRepo.findBySku.mockResolvedValue([
        {
          id: 'inv-1',
          product_id: 'prod-1',
          sku: 'SKU-LOW',
          warehouse_id: 'wh-1',
          quantity_on_hand: 5,
          quantity_reserved: 4,
          quantity_allocated: 0, // Available is only 1
          reorder_threshold: 2,
        },
      ]);

      await expect(
        inventoryReservationService.createReservation({
          reservationKey: 'res-fail-1',
          userId: 'cust-1',
          items: [{ sku: 'SKU-LOW', quantity: 5 }],
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(BusinessRuleError);

      expect(mockReservationRepo.createReservation).not.toHaveBeenCalled();
    });

    it('should roll back multi-item reservation if one item fails stock availability', async () => {
      mockReservationRepo.findByReservationKey.mockResolvedValue(null);

      // SKU-1 has plenty of stock, SKU-2 has 0
      mockInventoryRepo.findBySku.mockImplementation(async (sku) => {
        if (sku === 'SKU-1') {
          return [
            {
              id: 'inv-1',
              product_id: 'prod-1',
              sku: 'SKU-1',
              warehouse_id: 'wh-1',
              quantity_on_hand: 100,
              quantity_reserved: 0,
              quantity_allocated: 0,
              reorder_threshold: 5,
            },
          ];
        }
        return [
          {
            id: 'inv-2',
            product_id: 'prod-2',
            sku: 'SKU-2',
            warehouse_id: 'wh-1',
            quantity_on_hand: 0,
            quantity_reserved: 0,
            quantity_allocated: 0,
            reorder_threshold: 5,
          },
        ];
      });

      await expect(
        inventoryReservationService.createReservation({
          reservationKey: 'res-multi-fail',
          userId: 'cust-1',
          items: [
            { sku: 'SKU-1', quantity: 2 },
            { sku: 'SKU-2', quantity: 1 },
          ],
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });
  });

  describe('Reservation State Transitions & Lifecycle', () => {
    describe('HELD -> COMMITTED', () => {
      it('should commit reservation, move reserved to allocated stock, and write inventory.committed outbox event', async () => {
        const mockReservation = {
          id: 'res-1',
          reservation_key: 'key-1',
          user_id: 'cust-1',
          status: 'HELD',
          expires_at: new Date(Date.now() + 600000), // Valid future date
          items: [
            {
              inventory_item_id: 'inv-1',
              product_id: 'prod-1',
              sku: 'SKU-1',
              quantity: 3,
            },
          ],
        };
        mockReservationRepo.findById.mockResolvedValue(mockReservation);
        mockReservationRepo.commitReservation.mockResolvedValue({
          ...mockReservation,
          status: 'COMMITTED',
          committed_at: new Date(),
        });

        const result = await inventoryReservationService.commitReservation({
          reservationId: 'res-1',
          userId: 'cust-1',
          userRole: 'CUSTOMER',
        });

        expect(result.status).toBe('COMMITTED');
        expect(mockInventoryRepo.commitStock).toHaveBeenCalledWith('inv-1', 3, mockPrisma);
        expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            eventType: EventTypes.INVENTORY_COMMITTED,
            aggregateId: 'res-1',
          }),
          mockPrisma,
        );
      });

      it('should prevent committing a reservation that has expired', async () => {
        const expiredReservation = {
          id: 'res-expired',
          reservation_key: 'key-exp',
          user_id: 'cust-1',
          status: 'HELD',
          expires_at: new Date(Date.now() - 10000), // In the past
          items: [{ inventory_item_id: 'inv-1', quantity: 2 }],
        };
        mockReservationRepo.findById.mockResolvedValue(expiredReservation);
        mockReservationRepo.expireReservation.mockResolvedValue({
          ...expiredReservation,
          status: 'EXPIRED',
        });

        await expect(
          inventoryReservationService.commitReservation({
            reservationId: 'res-expired',
            userId: 'cust-1',
            userRole: 'CUSTOMER',
          }),
        ).rejects.toThrow(BusinessRuleError);

        expect(mockReservationRepo.commitReservation).not.toHaveBeenCalled();
      });

      it('should reject committing an already RELEASED reservation', async () => {
        mockReservationRepo.findById.mockResolvedValue({
          id: 'res-released',
          user_id: 'cust-1',
          status: 'RELEASED',
          expires_at: new Date(Date.now() + 10000),
          items: [],
        });

        await expect(
          inventoryReservationService.commitReservation({
            reservationId: 'res-released',
            userId: 'cust-1',
            userRole: 'CUSTOMER',
          }),
        ).rejects.toThrow(BusinessRuleError);
      });

      it('should be idempotent if reservation is already COMMITTED', async () => {
        const alreadyCommitted = {
          id: 'res-comm',
          user_id: 'cust-1',
          status: 'COMMITTED',
          items: [],
        };
        mockReservationRepo.findById.mockResolvedValue(alreadyCommitted);

        const result = await inventoryReservationService.commitReservation({
          reservationId: 'res-comm',
          userId: 'cust-1',
          userRole: 'CUSTOMER',
        });

        expect(result.status).toBe('COMMITTED');
        expect(mockInventoryRepo.commitStock).not.toHaveBeenCalled();
      });
    });

    describe('HELD -> RELEASED', () => {
      it('should release reservation, return reserved quantity to available stock, and write inventory.released outbox event', async () => {
        const mockReservation = {
          id: 'res-2',
          reservation_key: 'key-2',
          user_id: 'cust-1',
          status: 'HELD',
          expires_at: new Date(Date.now() + 600000),
          items: [
            {
              inventory_item_id: 'inv-1',
              product_id: 'prod-1',
              sku: 'SKU-1',
              quantity: 4,
            },
          ],
        };
        mockReservationRepo.findById.mockResolvedValue(mockReservation);
        mockReservationRepo.releaseReservation.mockResolvedValue({
          ...mockReservation,
          status: 'RELEASED',
          released_at: new Date(),
        });

        const result = await inventoryReservationService.releaseReservation({
          reservationId: 'res-2',
          userId: 'cust-1',
          userRole: 'CUSTOMER',
        });

        expect(result.status).toBe('RELEASED');
        expect(mockInventoryRepo.releaseStock).toHaveBeenCalledWith('inv-1', 4, mockPrisma);
        expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            eventType: EventTypes.INVENTORY_RELEASED,
            aggregateId: 'res-2',
          }),
          mockPrisma,
        );
      });

      it('should reject releasing a COMMITTED reservation', async () => {
        mockReservationRepo.findById.mockResolvedValue({
          id: 'res-committed',
          user_id: 'cust-1',
          status: 'COMMITTED',
          items: [],
        });

        await expect(
          inventoryReservationService.releaseReservation({
            reservationId: 'res-committed',
            userId: 'cust-1',
            userRole: 'CUSTOMER',
          }),
        ).rejects.toThrow(BusinessRuleError);
      });

      it('should handle release idempotently if already RELEASED', async () => {
        const alreadyReleased = {
          id: 'res-rel',
          user_id: 'cust-1',
          status: 'RELEASED',
          items: [],
        };
        mockReservationRepo.findById.mockResolvedValue(alreadyReleased);

        const result = await inventoryReservationService.releaseReservation({
          reservationId: 'res-rel',
          userId: 'cust-1',
          userRole: 'CUSTOMER',
        });

        expect(result.status).toBe('RELEASED');
        expect(mockInventoryRepo.releaseStock).not.toHaveBeenCalled();
      });
    });

    describe('HELD -> EXPIRED (Sweeper Engine)', () => {
      it('should find expired HELD reservations, release reserved inventory, and transition to EXPIRED', async () => {
        const stale = {
          id: 'res-stale-1',
          reservation_key: 'key-stale',
          user_id: 'cust-1',
          status: 'HELD',
          expires_at: new Date(Date.now() - 5000),
          items: [
            {
              inventory_item_id: 'inv-1',
              product_id: 'prod-1',
              sku: 'SKU-1',
              quantity: 5,
            },
          ],
        };
        mockReservationRepo.findExpiredHeldReservations.mockResolvedValue([stale]);
        mockReservationRepo.findById.mockResolvedValue(stale);
        mockReservationRepo.expireReservation.mockResolvedValue({
          ...stale,
          status: 'EXPIRED',
          expired_at: new Date(),
        });

        const result = await inventoryReservationService.expireStaleReservations({ limit: 10 });

        expect(result.expiredCount).toBe(1);
        expect(mockInventoryRepo.releaseStock).toHaveBeenCalledWith('inv-1', 5, mockPrisma);
        expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            eventType: EventTypes.INVENTORY_RELEASED,
            payload: expect.objectContaining({
              reason: 'EXPIRED',
            }),
          }),
          mockPrisma,
        );
      });

      it('should safely execute repeated sweeper calls when no expired reservations exist', async () => {
        mockReservationRepo.findExpiredHeldReservations.mockResolvedValue([]);

        const result = await inventoryReservationService.expireStaleReservations();
        expect(result.expiredCount).toBe(0);
        expect(result.expiredReservations).toHaveLength(0);
      });
    });
  });

  describe('IDOR & Authorization Scenarios', () => {
    it('should prevent customer A from fetching reservation created by customer B', async () => {
      mockReservationRepo.findById.mockResolvedValue({
        id: 'res-other',
        user_id: 'customer-b',
      });

      await expect(
        inventoryReservationService.getReservationById('res-other', {
          userId: 'customer-a',
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should allow ADMIN to fetch any customer reservation', async () => {
      mockReservationRepo.findById.mockResolvedValue({
        id: 'res-cust',
        user_id: 'customer-b',
      });

      const res = await inventoryReservationService.getReservationById('res-cust', {
        userId: 'admin-id',
        userRole: 'ADMIN',
      });
      expect(res.id).toBe('res-cust');
    });
  });

  describe('Concurrency & Overselling Prevention', () => {
    it('should prevent overselling when concurrent reservations compete for limited inventory', async () => {
      let currentStock = {
        id: 'inv-concurrent',
        product_id: 'prod-conc',
        sku: 'SKU-LIMITED',
        warehouse_id: 'wh-1',
        quantity_on_hand: 5,
        quantity_reserved: 0,
        quantity_allocated: 0,
        reorder_threshold: 2,
      };

      // Mock DB state evolution
      mockInventoryRepo.findBySku.mockImplementation(async () => [currentStock]);
      mockInventoryRepo.reserveStock.mockImplementation(async (id, qty) => {
        currentStock = {
          ...currentStock,
          quantity_reserved: currentStock.quantity_reserved + qty,
        };
        return currentStock;
      });
      mockReservationRepo.createReservation.mockImplementation(async (data) => ({
        id: `res-${Math.random()}`,
        ...data,
      }));

      // Request 1: reserve 4 units (succeeds, 1 unit remaining)
      const res1 = await inventoryReservationService.createReservation({
        reservationKey: 'req-1',
        userId: 'user-1',
        items: [{ sku: 'SKU-LIMITED', quantity: 4 }],
        userRole: 'CUSTOMER',
      });
      expect(res1.reservation).toBeDefined();

      // Request 2: tries to reserve 2 units (fails because only 1 available, prevents overselling)
      await expect(
        inventoryReservationService.createReservation({
          reservationKey: 'req-2',
          userId: 'user-2',
          items: [{ sku: 'SKU-LIMITED', quantity: 2 }],
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(BusinessRuleError);

      // Verify available stock never became negative
      const available = InventoryReservationService.prototype._calculateAvailable(currentStock);
      expect(available).toBe(1);
      expect(available).toBeGreaterThanOrEqual(0);
    });

    it('should reject stock adjustment when version check fails', async () => {
      mockInventoryRepo.findById.mockResolvedValue({
        id: 'inv-v1',
        quantity_on_hand: 10,
        quantity_reserved: 0,
        quantity_allocated: 0,
        version: 2, // version mismatch
      });

      mockInventoryRepo.adjustStock.mockRejectedValue(new Error('Record to update not found (version conflict)'));

      await expect(
        inventoryReservationService.adjustStock('inv-v1', {
          quantityDelta: 5,
          expectedVersion: 1,
          userRole: 'ADMIN',
        }),
      ).rejects.toThrow();
    });
  });
});

