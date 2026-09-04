import { jest } from '@jest/globals';

import { InventoryReservationService } from '../../src/services/inventory-reservation.service.js';
import { InventoryRepository } from '../../src/repositories/inventory.repository.js';

describe('Inventory Concurrency & Race Condition Protection', () => {
  let mockPrisma;
  let inventoryRepo;
  let reservationRepo;
  let outboxRepo;
  let reservationService;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn((cb) => cb(mockPrisma)),
      inventoryItem: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $executeRawUnsafe: jest.fn(),
    };

    inventoryRepo = new InventoryRepository({ prisma: mockPrisma });
    reservationRepo = {
      findByReservationKey: jest.fn().mockResolvedValue(null),
      createReservation: jest.fn(),
    };
    outboxRepo = {
      createEvent: jest.fn().mockResolvedValue({ id: 'outbox-1' }),
    };

    reservationService = new InventoryReservationService({
      prismaClient: mockPrisma,
      inventoryRepo,
      reservationRepo,
      outboxRepo,
    });
  });

  test('prevents overselling when atomic conditional raw SQL update returns 0 affected rows', async () => {
    // Simulate raw SQL update returning 0 rows affected (concurrent race won by another request)
    mockPrisma.$executeRawUnsafe.mockResolvedValue(0);

    inventoryRepo.findByWarehouseAndSku = jest.fn().mockResolvedValue({
      id: 'inv-item-1',
      sku: 'IPHONE-15',
      warehouse_id: 'wh-1',
      quantity_on_hand: 5,
      quantity_reserved: 4,
      quantity_allocated: 1, // Available = 0
    });

    await expect(
      reservationService.createReservation({
        reservationKey: 'res-race-1',
        userId: 'user-100',
        items: [{ sku: 'IPHONE-15', warehouseId: 'wh-1', quantity: 1 }],
      }),
    ).rejects.toThrow(/Insufficient stock for SKU/i);
  });

  test('prevents overselling when stock invariant (on_hand < reserved + allocated) is violated', async () => {
    // If raw query is unavailable, fallback Prisma update checks invariant
    mockPrisma.$executeRawUnsafe = null;

    inventoryRepo.findByWarehouseAndSku = jest.fn().mockResolvedValue({
      id: 'inv-item-1',
      sku: 'MACBOOK-PRO',
      warehouse_id: 'wh-1',
      quantity_on_hand: 1,
      quantity_reserved: 0,
      quantity_allocated: 0,
    });

    // Simulate concurrent update where reserved becomes 2 on on_hand 1
    mockPrisma.inventoryItem.update.mockResolvedValue({
      id: 'inv-item-1',
      sku: 'MACBOOK-PRO',
      warehouse_id: 'wh-1',
      quantity_on_hand: 1,
      quantity_reserved: 2, // Invariant violated!
      quantity_allocated: 0,
    });

    await expect(
      reservationService.createReservation({
        reservationKey: 'res-race-2',
        userId: 'user-200',
        items: [{ sku: 'MACBOOK-PRO', warehouseId: 'wh-1', quantity: 1 }],
      }),
    ).rejects.toThrow(/Insufficient stock for SKU/i);
  });
});
