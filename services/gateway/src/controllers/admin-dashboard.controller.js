import { successResponse, createLogger } from '@ecommerce/shared';

import { config } from '../config/index.js';
import { getRedisClient as defaultGetRedisClient } from '../lib/redis.js';

const logger = createLogger({ service: 'gateway:admin-dashboard' });
const STATS_CACHE_KEY = 'admin:dashboard:stats';
const STATS_CACHE_TTL_SEC = 60;

export class AdminDashboardController {
  constructor({
    getRedis = defaultGetRedisClient,
    serviceUrls = config.services,
    fetchFn = globalThis.fetch,
  } = {}) {
    this.getRedis = getRedis;
    this.serviceUrls = serviceUrls;
    this.fetchFn = fetchFn;
  }

  /**
   * Helper to perform safe downstream HTTP calls with timeout
   */
  async _safeFetch(url, timeoutMs = 2500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const start = Date.now();

    try {
      // Use config.internalGatewaySecret — validated at startup, never logged
      const internalSecret = config.internalGatewaySecret;
      const res = await this.fetchFn(url, {
        signal: controller.signal,
        headers: {
          'x-internal-gateway-secret': internalSecret,
          'x-user-role': 'ADMIN',
        },
      });
      const latencyMs = Date.now() - start;
      if (!res.ok) {
        return { ok: false, status: res.status, latencyMs };
      }
      const data = await res.json();
      return { ok: true, status: res.status, data, latencyMs };
    } catch (err) {
      return {
        ok: false,
        status: 503,
        error: err.name === 'AbortError' ? 'TIMEOUT' : err.message,
        latencyMs: Date.now() - start,
      };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Executive Dashboard Stats Aggregator
   */
  getDashboardStats = async (req, res, next) => {
    try {
      const redis = this.getRedis();

      // 1. Try reading from Redis Cache
      if (redis) {
        try {
          const cached = await redis.get(STATS_CACHE_KEY);
          if (cached) {
            return res.status(200).json(
              successResponse({
                data: JSON.parse(cached),
                requestId: req.id,
                extraMeta: { cached: true, ttl: STATS_CACHE_TTL_SEC },
              }),
            );
          }
        } catch (err) {
          logger.warn({ err: err.message }, 'Redis read failed for admin stats; computing live');
        }
      }

      // 2. Aggregate Live Cross-Service Metrics Concurrently
      const [
        identityHealth,
        catalogHealth,
        orderHealth,
        paymentHealth,
        fulfillmentHealth,
        notificationHealth,
        orderStatsRes,
        userStatsRes,
        paymentStatsRes,
        returnStatsRes,
        inventoryAlertsRes,
        notificationDlqRes,
      ] = await Promise.allSettled([
        this._safeFetch(`${this.serviceUrls.identity}/health`),
        this._safeFetch(`${this.serviceUrls.catalog}/health`),
        this._safeFetch(`${this.serviceUrls.order}/health`),
        this._safeFetch(`${this.serviceUrls.payment}/health`),
        this._safeFetch(`${this.serviceUrls.fulfillment}/health`),
        this._safeFetch(`${this.serviceUrls.notification}/health`),
        this._safeFetch(`${this.serviceUrls.order}/api/v1/orders/admin/summary`),
        this._safeFetch(`${this.serviceUrls.identity}/api/v1/users/admin/summary`),
        this._safeFetch(`${this.serviceUrls.payment}/api/v1/payments/admin/summary`),
        this._safeFetch(`${this.serviceUrls.fulfillment}/api/v1/returns/admin/summary`),
        this._safeFetch(`${this.serviceUrls.fulfillment}/api/v1/fulfillment/inventory/low-stock`),
        this._safeFetch(`${this.serviceUrls.notification}/api/v1/notifications/admin/dlq`),
      ]);

      // Service Health mapping
      const formatHealth = (settled) => {
        if (settled.status === 'fulfilled' && settled.value.ok) {
          return { status: 'UP', latencyMs: settled.value.latencyMs };
        }
        return {
          status: 'DOWN',
          latencyMs: settled.value?.latencyMs || 0,
          error: settled.value?.error || 'Unavailable',
        };
      };

      const servicesHealth = {
        gateway: { status: 'UP', latencyMs: 0 },
        'identity-svc': formatHealth(identityHealth),
        'catalog-svc': formatHealth(catalogHealth),
        'order-svc': formatHealth(orderHealth),
        'payment-svc': formatHealth(paymentHealth),
        'fulfillment-svc': formatHealth(fulfillmentHealth),
        'notification-svc': formatHealth(notificationHealth),
      };

      // Order & Sales Stats
      const orderSummary =
        orderStatsRes.status === 'fulfilled' && orderStatsRes.value.ok
          ? orderStatsRes.value.data?.data || {}
          : {};

      const paymentSummary =
        paymentStatsRes.status === 'fulfilled' && paymentStatsRes.value.ok
          ? paymentStatsRes.value.data?.data || {}
          : {};

      const userSummary =
        userStatsRes.status === 'fulfilled' && userStatsRes.value.ok
          ? userStatsRes.value.data?.data || {}
          : {};

      const returnSummary =
        returnStatsRes.status === 'fulfilled' && returnStatsRes.value.ok
          ? returnStatsRes.value.data?.data || {}
          : {};

      const completedOrders = Number(
        orderSummary.completedOrders || orderSummary.deliveredCount || 0,
      );
      const gmv = Number(orderSummary.totalGmv || orderSummary.totalRevenue || 0);
      const aov = completedOrders > 0 ? Number((gmv / completedOrders).toFixed(2)) : 0;

      const sales = {
        gmv,
        completedOrders,
        aov,
        capturedPayments: Number(paymentSummary.capturedCount || 0),
        capturedAmount: Number(paymentSummary.totalCapturedAmount || 0),
        failedPayments: Number(paymentSummary.failedCount || 0),
        refundedPayments: Number(paymentSummary.refundedCount || 0),
        refundedAmount: Number(paymentSummary.totalRefundedAmount || 0),
      };

      const orders = {
        total: Number(orderSummary.grandTotal || 0),
        active: Number(orderSummary.totalActive || 0),
        pending: Number(orderSummary.pendingCount || orderSummary.placedCount || 0),
        processing: Number(orderSummary.processingCount || orderSummary.confirmedCount || 0),
        shipped: Number(orderSummary.shippedCount || 0),
        outForDelivery: Number(orderSummary.outForDeliveryCount || 0),
        delivered: completedOrders,
        cancelled: Number(orderSummary.cancelledCount || 0),
      };

      const users = {
        totalUsers: Number(userSummary.totalUsers || 0),
        activeUsers: Number(userSummary.activeUsers || 0),
        usersByRole: userSummary.usersByRole || {},
        totalSellers: Number(userSummary.totalSellers || 0),
        approvedSellers: Number(userSummary.approvedSellers || 0),
        pendingSellerApplications: Number(userSummary.pendingSellerApplications || 0),
        suspendedSellers: Number(userSummary.suspendedSellers || 0),
      };

      // Fulfillment Stats
      const lowStockAlerts =
        inventoryAlertsRes.status === 'fulfilled' && inventoryAlertsRes.value.ok
          ? Number(inventoryAlertsRes.value.data?.data?.length || 0)
          : 0;

      const fulfillment = {
        activeShipments: Number(orderSummary.shippedCount || 0),
        totalReturns: Number(returnSummary.totalReturns || 0),
        pendingReturns: Number(returnSummary.pendingCount || orderSummary.pendingReturnsCount || 0),
        completedReturns: Number(returnSummary.completedCount || 0),
        rejectedReturns: Number(returnSummary.rejectedCount || 0),
        returnsByStatus: returnSummary.returnsByStatus || {},
        lowStockAlerts,
      };

      // System DLQ & Backlog
      const dlqFailures =
        notificationDlqRes.status === 'fulfilled' && notificationDlqRes.value.ok
          ? Number(
              notificationDlqRes.value.data?.extraMeta?.pagination?.total ||
                notificationDlqRes.value.data?.data?.length ||
                0,
            )
          : 0;

      const system = {
        services: servicesHealth,
        dlqFailures,
        outboxBacklog: 0,
      };

      const statsData = {
        sales,
        orders,
        users,
        fulfillment,
        system,
      };

      // 3. Cache in Redis (60s TTL)
      if (redis) {
        try {
          await redis.set(STATS_CACHE_KEY, JSON.stringify(statsData), 'EX', STATS_CACHE_TTL_SEC);
        } catch (err) {
          logger.warn({ err: err.message }, 'Redis write failed for admin stats cache');
        }
      }

      return res.status(200).json(
        successResponse({
          data: statsData,
          requestId: req.id,
          extraMeta: { cached: false, ttl: STATS_CACHE_TTL_SEC },
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Unified Admin Audit Logs Query API
   * Proxies to identity-svc which maintains the persistent AuditLog table.
   */
  getAuditLogs = async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 20,
        service = null,
        eventType = null,
        actor = null,
        traceId = null,
        requestId = null,
        from = null,
        to = null,
      } = req.query;

      // Build query string for forwarding
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', limit);
      if (service) {
        params.set('service', service);
      }
      if (eventType) {
        params.set('eventType', eventType);
      }
      if (actor) {
        params.set('actorEmail', actor); // map 'actor' filter to actorEmail
      }
      if (traceId) {
        params.set('traceId', traceId);
      }
      if (requestId) {
        params.set('requestId', requestId);
      }
      if (from) {
        params.set('from', from);
      }
      if (to) {
        params.set('to', to);
      }

      const url = `${this.serviceUrls.identity}/api/v1/users/admin/audit-logs?${params.toString()}`;
      const result = await this._safeFetch(url);

      if (!result.ok) {
        // Identity-svc is unreachable — return graceful degraded response
        return res.status(200).json(
          successResponse({
            data: [],
            extraMeta: {
              pagination: {
                page: Number(page) || 1,
                limit: Number(limit) || 20,
                total: 0,
                totalPages: 0,
              },
              degraded: true,
              warning: 'Identity service audit logs temporarily unavailable',
            },
            requestId: req.id,
          }),
        );
      }

      // Forward the identity-svc response directly
      return res.status(200).json(result.data);
    } catch (err) {
      next(err);
    }
  };
}

export const adminDashboardController = new AdminDashboardController();
