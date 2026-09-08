/**
 * Load Shedding Middleware
 *
 * Implements centralized overload protection by classifying inbound requests
 * into priority tiers (CRITICAL, IMPORTANT, LOWER_PRIORITY) and gracefully shedding
 * non-essential traffic when concurrent in-flight requests approach capacity.
 */

import { metricsRegistry as defaultRegistry } from '../utils/metrics.js';

const Priority = {
  CRITICAL: 'CRITICAL',
  IMPORTANT: 'IMPORTANT',
  LOWER_PRIORITY: 'LOWER_PRIORITY',
};

// Global in-flight tracking & metrics
let activeInflightRequests = 0;
let maxObservedConcurrency = 0;
let totalRequestsSeen = 0;
let totalShedRequests = 0;
const shedByPriority = {
  [Priority.CRITICAL]: 0,
  [Priority.IMPORTANT]: 0,
  [Priority.LOWER_PRIORITY]: 0,
};

/**
 * Returns current load shedding metrics.
 */
export function getLoadSheddingMetrics() {
  return {
    activeRequests: activeInflightRequests,
    maxObservedConcurrency,
    totalRequestsSeen,
    shedRequests: totalShedRequests,
    shedByPriority: { ...shedByPriority },
  };
}

/**
 * Resets load shedding metrics (primarily for unit test isolation).
 */
export function resetLoadSheddingMetrics() {
  activeInflightRequests = 0;
  maxObservedConcurrency = 0;
  totalRequestsSeen = 0;
  totalShedRequests = 0;
  shedByPriority[Priority.CRITICAL] = 0;
  shedByPriority[Priority.IMPORTANT] = 0;
  shedByPriority[Priority.LOWER_PRIORITY] = 0;
  const activeRequestsGauge = defaultRegistry.getMetric('load_shedding_active_requests');
  if (activeRequestsGauge) {
    activeRequestsGauge.reset();
  }
}

/**
 * Classifies an incoming request URL into a Priority tier.
 *
 * @param {string} path - Request URL or path
 * @returns {'CRITICAL' | 'IMPORTANT' | 'LOWER_PRIORITY'}
 */
export function classifyRequestPriority(path = '') {
  const cleanPath = path.split('?')[0].toLowerCase();

  // 1. CRITICAL: Payment, refund, order creation/processing, inventory reservations
  if (
    cleanPath.startsWith('/api/v1/payments') ||
    cleanPath.startsWith('/api/v1/refunds') ||
    cleanPath.startsWith('/api/v1/orders') ||
    cleanPath.startsWith('/api/v1/reservations')
  ) {
    return Priority.CRITICAL;
  }

  // 2. LOWER_PRIORITY: Analytics, reporting, admin aggregation, background notifications
  if (
    cleanPath.startsWith('/api/v1/seller/analytics') ||
    cleanPath.startsWith('/api/v1/admin') ||
    cleanPath.startsWith('/api/v1/notifications')
  ) {
    return Priority.LOWER_PRIORITY;
  }

  // 3. IMPORTANT: Catalog, categories, checkout, shipments, warehouses, fulfillment
  if (
    cleanPath.startsWith('/api/v1/products') ||
    cleanPath.startsWith('/api/v1/categories') ||
    cleanPath.startsWith('/api/v1/checkout') ||
    cleanPath.startsWith('/api/v1/shipments') ||
    cleanPath.startsWith('/api/v1/warehouses') ||
    cleanPath.startsWith('/api/v1/fulfillment')
  ) {
    return Priority.IMPORTANT;
  }

  // Default to IMPORTANT for other API routes
  return Priority.IMPORTANT;
}

/**
 * Creates Load Shedding Middleware.
 *
 * @param {Object} [options]
 * @param {boolean} [options.enabled] - Toggle load shedding (default: env LOAD_SHEDDING_ENABLED !== 'false')
 * @param {number} [options.maxInflight] - Max concurrent in-flight requests (default: 150)
 * @param {number} [options.lowerPriorityThresholdPercent] - % threshold to shed LOWER_PRIORITY (default: 80)
 * @param {number} [options.importantThresholdPercent] - % threshold to shed IMPORTANT (default: 95)
 * @param {number} [options.retryAfterSeconds] - Retry-After header value in seconds (default: 5)
 * @param {number} [options.statusCode] - HTTP status code on shed (default: 503)
 * @returns {import('express').RequestHandler}
 */
export function createLoadSheddingMiddleware(options = {}) {
  const serviceName = options.serviceName || process.env.SERVICE_NAME || 'ecommerce-service';
  const registry = options.registry || defaultRegistry;
  const requestsTotal = registry.getMetric('load_shedding_requests_total');
  const activeRequestsGauge = registry.getMetric('load_shedding_active_requests');
  const rejectedTotal = registry.getMetric('load_shedding_rejected_total');

  return function loadSheddingMiddleware(req, res, next) {
    const isEnabled =
      options.enabled !== undefined
        ? Boolean(options.enabled)
        : process.env.LOAD_SHEDDING_ENABLED !== 'false';

    if (!isEnabled) {
      return next();
    }

    // Health, liveness, readiness, and metrics probes must never be shed
    const path = req.path || req.url || '';
    if (
      path === '/health' ||
      path === '/ready' ||
      path === '/liveness' ||
      path === '/metrics' ||
      path === '/nginx-health'
    ) {
      return next();
    }

    const priority = classifyRequestPriority(path);
    totalRequestsSeen++;
    if (requestsTotal) {
      requestsTotal.inc({ service: serviceName, priority });
    }

    const maxInflight =
      options.maxInflight !== undefined
        ? Number(options.maxInflight)
        : parseInt(process.env.MAX_INFLIGHT_REQUESTS, 10) || 150;

    const lowerThresholdPct =
      options.lowerPriorityThresholdPercent !== undefined
        ? Number(options.lowerPriorityThresholdPercent)
        : parseInt(process.env.LOAD_SHEDDING_THRESHOLD_PERCENT, 10) || 80;

    const importantThresholdPct =
      options.importantThresholdPercent !== undefined
        ? Number(options.importantThresholdPercent)
        : parseInt(process.env.LOAD_SHEDDING_THRESHOLD_IMPORTANT_PERCENT, 10) || 95;

    const retryAfter =
      options.retryAfterSeconds !== undefined
        ? Number(options.retryAfterSeconds)
        : parseInt(process.env.LOAD_SHEDDING_RETRY_AFTER_SECONDS, 10) || 5;

    const statusCode = options.statusCode || 503;

    const lowerCapacity = Math.floor(maxInflight * (lowerThresholdPct / 100));
    const importantCapacity = Math.floor(maxInflight * (importantThresholdPct / 100));

    let shouldShed = false;

    if (priority === Priority.LOWER_PRIORITY && activeInflightRequests >= lowerCapacity) {
      shouldShed = true;
    } else if (priority === Priority.IMPORTANT && activeInflightRequests >= importantCapacity) {
      shouldShed = true;
    }
    // CRITICAL priority traffic is NEVER shed during normal load shedding

    if (shouldShed) {
      totalShedRequests++;
      shedByPriority[priority]++;
      if (rejectedTotal) {
        rejectedTotal.inc({ service: serviceName, priority });
      }

      res.setHeader('Retry-After', String(retryAfter));
      return res.status(statusCode).json({
        success: false,
        error: {
          code: 'OVERLOAD_LOAD_SHED',
          message: `Service is currently overloaded. Request shed to protect system stability. Please retry after ${retryAfter} seconds.`,
          priority,
          activeInflight: activeInflightRequests,
          retryAfter,
        },
      });
    }

    // Safely track active in-flight request
    activeInflightRequests++;
    if (activeInflightRequests > maxObservedConcurrency) {
      maxObservedConcurrency = activeInflightRequests;
    }
    if (activeRequestsGauge) {
      activeRequestsGauge.set({ service: serviceName }, activeInflightRequests);
    }

    let decremented = false;
    const cleanup = () => {
      if (!decremented) {
        decremented = true;
        activeInflightRequests = Math.max(0, activeInflightRequests - 1);
        if (activeRequestsGauge) {
          activeRequestsGauge.set({ service: serviceName }, activeInflightRequests);
        }
      }
    };

    res.once('finish', cleanup);
    res.once('close', cleanup);

    next();
  };
}
