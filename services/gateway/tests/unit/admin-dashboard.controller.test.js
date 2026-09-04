import { jest } from '@jest/globals';
import { AdminDashboardController } from '../../src/controllers/admin-dashboard.controller.js';

describe('AdminDashboardController Unit Tests (Phase 5)', () => {
  let controller;
  let mockRedis;
  let mockFetch;

  beforeEach(() => {
    mockRedis = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
    };

    mockFetch = jest.fn().mockImplementation((url) => {
      if (url.includes('/health')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: 'healthy' }),
        });
      }
      if (url.includes('/api/v1/orders/admin/summary')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              data: {
                totalGmv: 50000,
                completedOrders: 20,
                pendingCount: 5,
                processingCount: 8,
                shippedCount: 12,
                cancelledCount: 2,
                pendingReturnsCount: 3,
              },
            }),
        });
      }
      if (url.includes('/api/v1/users/admin/summary')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              data: {
                totalUsers: 150,
                activeUsers: 140,
                usersByRole: { CUSTOMER: 130, SELLER: 15, ADMIN: 5 },
                totalSellers: 15,
                approvedSellers: 12,
                pendingSellerApplications: 3,
                suspendedSellers: 0,
              },
            }),
        });
      }
      if (url.includes('/api/v1/payments/admin/summary')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              data: {
                capturedCount: 20,
                totalCapturedAmount: 50000,
                failedCount: 2,
                refundedCount: 1,
                totalRefundedAmount: 1500,
              },
            }),
        });
      }
      if (url.includes('/api/v1/returns/admin/summary')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              data: {
                totalReturns: 5,
                pendingCount: 3,
                completedCount: 1,
                rejectedCount: 1,
                returnsByStatus: { REQUESTED: 2, APPROVED: 1, COMPLETED: 1, REJECTED: 1 },
              },
            }),
        });
      }
      if (url.includes('/api/v1/fulfillment/inventory/low-stock')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: [{ sku: 'SKU-LOW-1' }] }),
        });
      }
      if (url.includes('/api/v1/notifications/admin/dlq')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              data: [],
              extraMeta: { pagination: { total: 4 } },
            }),
        });
      }
      if (url.includes('/api/v1/users/admin/audit-logs')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              data: [
                {
                  id: 'audit-1',
                  actor_id: 'admin-1',
                  event_type: 'user.role_assigned',
                  service: 'identity-svc',
                },
              ],
              meta: { pagination: { page: 1, limit: 10, total: 1 } },
            }),
        });
      }
      return Promise.resolve({
        ok: true,

        status: 200,
        json: () => Promise.resolve({}),
      });
    });

    controller = new AdminDashboardController({
      getRedis: () => mockRedis,
      serviceUrls: {
        identity: 'http://identity',
        catalog: 'http://catalog',
        order: 'http://order',
        payment: 'http://payment',
        fulfillment: 'http://fulfillment',
        notification: 'http://notification',
      },
      fetchFn: mockFetch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate Sales, GMV, and AOV correctly from live aggregation', async () => {
    const req = { id: 'req-1' };
    const jsonMock = jest.fn();
    const res = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    };
    const next = jest.fn();

    await controller.getDashboardStats(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = jsonMock.mock.calls[0][0].data;

    expect(data.sales.gmv).toBe(50000);
    expect(data.sales.completedOrders).toBe(20);
    expect(data.sales.aov).toBe(2500); // 50000 / 20 = 2500
    expect(data.sales.capturedPayments).toBe(20);
    expect(data.sales.failedPayments).toBe(2);
    expect(data.sales.refundedPayments).toBe(1);

    expect(data.orders.pending).toBe(5);
    expect(data.orders.processing).toBe(8);
    expect(data.orders.shipped).toBe(12);
    expect(data.orders.delivered).toBe(20);

    expect(data.users.totalUsers).toBe(150);
    expect(data.users.activeUsers).toBe(140);
    expect(data.users.totalSellers).toBe(15);
    expect(data.users.pendingSellerApplications).toBe(3);

    expect(data.fulfillment.totalReturns).toBe(5);
    expect(data.fulfillment.pendingReturns).toBe(3);
    expect(data.fulfillment.lowStockAlerts).toBe(1);
    expect(data.system.dlqFailures).toBe(4);

    expect(mockRedis.set).toHaveBeenCalledWith(
      'admin:dashboard:stats',
      expect.any(String),
      'EX',
      60,
    );
  });

  it('should return cached stats when available in Redis', async () => {
    const cachedStats = {
      sales: { gmv: 9999, completedOrders: 3, aov: 3333 },
      orders: { pending: 1 },
      fulfillment: {},
      system: {},
    };
    mockRedis.get.mockResolvedValue(JSON.stringify(cachedStats));

    const req = { id: 'req-cached' };
    const jsonMock = jest.fn();
    const res = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    };

    await controller.getDashboardStats(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock.mock.calls[0][0].data).toEqual(cachedStats);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle downstream service failure gracefully without failing dashboard request', async () => {
    mockFetch.mockRejectedValue(new Error('Network connection timeout'));

    const req = { id: 'req-err' };
    const jsonMock = jest.fn();
    const res = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    };

    await controller.getDashboardStats(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    const data = jsonMock.mock.calls[0][0].data;
    expect(data.system.services['identity-svc'].status).toBe('DOWN');
  });

  it('should return unified audit logs with pagination', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const jsonMock = jest.fn();
    const res = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    };

    await controller.getAuditLogs(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    const body = jsonMock.mock.calls[0][0];
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.meta.pagination.page).toBe(1);
  });
});
