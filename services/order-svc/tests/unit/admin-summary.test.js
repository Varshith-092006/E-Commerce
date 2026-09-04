import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { OrderService } from '../../src/services/order.service.js';

describe('P0-4 Order Admin Summary API', () => {
  let orderService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      order: {
        groupBy: jest.fn(),
        aggregate: jest.fn(),
      },
    };

    const mockOrderRepo = {
      prisma: mockPrisma,
    };

    orderService = new OrderService({
      orderRepo: mockOrderRepo,
    });
  });

  it('should correctly aggregate pipeline counts and GMV from DB', async () => {
    mockPrisma.order.groupBy.mockResolvedValue([
      { status: 'PLACED', _count: { id: 10 } },
      { status: 'CONFIRMED', _count: { id: 5 } },
      { status: 'PROCESSING', _count: { id: 8 } },
      { status: 'SHIPPED', _count: { id: 12 } },
      { status: 'OUT_FOR_DELIVERY', _count: { id: 4 } },
      { status: 'DELIVERED', _count: { id: 50 } },
      { status: 'CANCELLED', _count: { id: 3 } },
    ]);

    mockPrisma.order.aggregate.mockResolvedValue({
      _sum: { total_amount: 125000.0 },
      _count: { id: 50 },
    });

    const summary = await orderService.getAdminSummary();

    expect(summary).toEqual({
      placedCount: 10,
      confirmedCount: 5,
      processingCount: 8,
      shippedCount: 12,
      outForDeliveryCount: 4,
      deliveredCount: 50,
      cancelledCount: 3,
      totalActive: 39,
      grandTotal: 92,
      totalGmv: 125000.0,
      completedOrders: 50,
      aov: 2500.0,
      pendingCount: 10,
      pendingReturnsCount: 0,
    });
  });

  it('should handle zero orders gracefully without division by zero', async () => {
    mockPrisma.order.groupBy.mockResolvedValue([]);
    mockPrisma.order.aggregate.mockResolvedValue({
      _sum: { total_amount: null },
      _count: { id: 0 },
    });

    const summary = await orderService.getAdminSummary();

    expect(summary.totalGmv).toBe(0);
    expect(summary.completedOrders).toBe(0);
    expect(summary.aov).toBe(0);
    expect(summary.grandTotal).toBe(0);
  });
});
