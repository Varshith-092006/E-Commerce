import { metricsRegistry as defaultRegistry } from '../utils/metrics.js';

/**
 * Normalizes dynamic path parameters to prevent Prometheus label high cardinality
 */
export function normalizeRoute(req) {
  if (req.route && req.route.path) {
    const basePath = req.baseUrl || '';
    const routePath =
      typeof req.route.path === 'string' ? req.route.path : req.route.path.toString();
    return `${basePath}${routePath}` || '/';
  }

  // Fallback for unrouted or proxy paths: sanitize UUIDs, hex IDs, and numbers
  const rawPath = req.originalUrl ? req.originalUrl.split('?')[0] : req.path || '/';
  return (
    rawPath
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/[0-9a-f]{24}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .replace(/\/+$/, '') || '/'
  );
}

/**
 * Express middleware to collect standard Prometheus Golden Signals HTTP metrics
 */
export function metricsMiddleware({
  serviceName = 'ecommerce-service',
  registry = defaultRegistry,
} = {}) {
  const httpRequestsTotal = registry.getMetric('http_requests_total');
  const httpRequestDuration = registry.getMetric('http_request_duration_seconds');
  const httpActiveRequests = registry.getMetric('http_active_requests');

  return (req, res, next) => {
    // Avoid self-monitoring /metrics recursion
    if (req.path === '/metrics') {
      return next();
    }

    if (httpActiveRequests) {
      httpActiveRequests.inc({ service: serviceName });
    }

    const startHrTime = process.hrtime();
    let isFinished = false;

    const recordMetrics = () => {
      if (isFinished) {
        return;
      }
      isFinished = true;

      if (httpActiveRequests) {
        httpActiveRequests.dec({ service: serviceName });
      }

      const diff = process.hrtime(startHrTime);
      const durationSeconds = diff[0] + diff[1] / 1e9;
      const route = normalizeRoute(req);
      const statusCode = res.statusCode ? String(res.statusCode) : '500';

      if (httpRequestsTotal) {
        httpRequestsTotal.inc({
          service: serviceName,
          method: req.method,
          route,
          status_code: statusCode,
        });
      }

      if (httpRequestDuration) {
        httpRequestDuration.observe(
          {
            service: serviceName,
            method: req.method,
            route,
            status_code: statusCode,
          },
          durationSeconds,
        );
      }
    };

    res.on('finish', recordMetrics);
    res.on('close', recordMetrics);

    next();
  };
}
