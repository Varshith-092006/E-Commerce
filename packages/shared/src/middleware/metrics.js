import { metricsRegistry as defaultRegistry } from '../utils/metrics.js';

/**
 * Normalizes dynamic path parameters to prevent Prometheus label high cardinality
 */
/**
 * Normalizes dynamic path parameters to prevent Prometheus label high cardinality
 */
export function normalizeRoute(req) {
  if (req.route && req.route.path) {
    const basePath = req.baseUrl || '';
    const routePath =
      typeof req.route.path === 'string' ? req.route.path : req.route.path.toString();
    const combined = `${basePath}${routePath}` || '/';
    return (
      combined
        .replace(/:[a-zA-Z0-9_]*uuid/gi, ':uuid')
        .replace(/:[a-zA-Z0-9_]*slug/gi, ':slug')
        .replace(/:[a-zA-Z0-9_]+/g, ':id')
        .replace(/\/+$/, '') || '/'
    );
  }

  // Fallback for unrouted or proxy paths: sanitize UUIDs, hex IDs, numbers, and slugs
  const rawPath = (req.originalUrl ? req.originalUrl.split('?')[0] : req.path || '/').split('#')[0];
  return (
    rawPath
      .replace(
        /(\/api\/v1\/users\/)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        '$1:uuid',
      )
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/[0-9a-f]{24}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .replace(/(\/api\/v1\/products\/(?!(?:search|autocomplete)\b))[a-zA-Z0-9_-]+/g, '$1:slug')
      .replace(/(\/api\/v1\/categories\/)[a-zA-Z0-9_-]+/g, '$1:slug')
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
  const httpRequestErrorsTotal = registry.getMetric('http_request_errors_total');

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
      const statusCodeNum = res.statusCode || 500;

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

      // Record HTTP errors for status >= 400
      if (statusCodeNum >= 400 && httpRequestErrorsTotal) {
        const errorType = statusCodeNum >= 500 ? 'server_error' : 'client_error';
        httpRequestErrorsTotal.inc({
          service: serviceName,
          method: req.method,
          route,
          error_type: errorType,
        });
      }
    };

    res.on('finish', recordMetrics);
    res.on('close', recordMetrics);

    next();
  };
}
