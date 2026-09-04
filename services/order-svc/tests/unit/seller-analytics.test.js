import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { OrderService } from '../../src/services/order.service.js';
import { ValidationError, ForbiddenError } from '@ecommerce/shared';

describe('Seller Sales Analytics Unit Tests', () => {
  let orderService;
  let mockOrderRepo;

  beforeEach(() => {
    mockOrderRepo = {
      getSellerAnalyticsOverview: jest.fn(),
      getSellerRevenueTimeline: jest.fn(),
      getSellerTopProducts: jest.fn(),
    };

    orderService = new OrderService({
      orderRepo: mockOrderRepo,
    });
  });

  describe('getSellerAnalyticsOverview', () => {
    it('should correctly return aggregated seller overview metrics', async () => {
      mockOrderRepo.getSellerAnalyticsOverview.mockResolvedValue({
        totalRevenue: 5499.5,
        totalOrders: 12,
        totalUnitsSold: 18,
        averageOrderValue: 458.29,
        ordersByStatus: {
          PLACED: 2,
          CONFIRMED: 3,
          PROCESSING: 1,
          SHIPPED: 2,
          OUT_FOR_DELIVERY: 1,
          DELIVERED: 3,
          CANCELLED: 1,
        },
        cancelledRevenue: 499.0,
        dateRange: {
          startDate: '2026-08-01T00:00:00.000Z',
          endDate: '2026-09-01T00:00:00.000Z',
        },
      });

      const result = await orderService.getSellerAnalyticsOverview({
        sellerId: 'seller-uuid-1',
        userRole: 'SELLER',
        startDate: '2026-08-01T00:00:00.000Z',
        endDate: '2026-09-01T00:00:00.000Z',
      });

      expect(result.totalRevenue).toBe(5499.5);
      expect(result.totalOrders).toBe(12);
      expect(result.totalUnitsSold).toBe(18);
      expect(result.averageOrderValue).toBe(458.29);
      expect(result.ordersByStatus.DELIVERED).toBe(3);
      expect(result.cancelledRevenue).toBe(499.0);
      expect(mockOrderRepo.getSellerAnalyticsOverview).toHaveBeenCalledWith({
        sellerId: 'seller-uuid-1',
        startDate: '2026-08-01T00:00:00.000Z',
        endDate: '2026-09-01T00:00:00.000Z',
      });
    });

    it('should reject requests from CUSTOMER role', async () => {
      await expect(
        orderService.getSellerAnalyticsOverview({
          sellerId: 'seller-uuid-1',
          userRole: 'CUSTOMER',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should reject invalid date range where startDate is after endDate', async () => {
      await expect(
        orderService.getSellerAnalyticsOverview({
          sellerId: 'seller-uuid-1',
          userRole: 'SELLER',
          startDate: '2026-09-10T00:00:00.000Z',
          endDate: '2026-09-01T00:00:00.000Z',
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getSellerRevenueTimeline', () => {
    it('should return timeline data grouped by interval', async () => {
      mockOrderRepo.getSellerRevenueTimeline.mockResolvedValue({
        interval: 'day',
        timeline: [
          { date: '2026-08-15', revenue: 1200.0, unitsSold: 4, orderCount: 3 },
          { date: '2026-08-16', revenue: 850.5, unitsSold: 2, orderCount: 2 },
        ],
        totalPoints: 2,
      });

      const result = await orderService.getSellerRevenueTimeline({
        sellerId: 'seller-uuid-1',
        userRole: 'SELLER',
        interval: 'day',
      });

      expect(result.interval).toBe('day');
      expect(result.timeline).toHaveLength(2);
      expect(result.timeline[0].revenue).toBe(1200.0);
    });

    it('should reject unsupported interval', async () => {
      await expect(
        orderService.getSellerRevenueTimeline({
          sellerId: 'seller-uuid-1',
          userRole: 'SELLER',
          interval: 'decade',
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getSellerTopProducts', () => {
    it('should return top products ranked by revenue', async () => {
      mockOrderRepo.getSellerTopProducts.mockResolvedValue([
        {
          productId: 'prod-1',
          title: 'Wireless Gaming Mouse',
          unitsSold: 25,
          totalRevenue: 2247.5,
        },
        {
          productId: 'prod-2',
          title: 'Mechanical Keyboard',
          unitsSold: 15,
          totalRevenue: 1949.85,
        },
      ]);

      const result = await orderService.getSellerTopProducts({
        sellerId: 'seller-uuid-1',
        userRole: 'SELLER',
        limit: 5,
      });

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Wireless Gaming Mouse');
      expect(result[0].unitsSold).toBe(25);
      expect(mockOrderRepo.getSellerTopProducts).toHaveBeenCalledWith({
        sellerId: 'seller-uuid-1',
        startDate: null,
        endDate: null,
        limit: 5,
      });
    });
  });
});
