import {
  requestIdMiddleware,
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
  createLogger,
  SecurityHeaders,
  verifyAccessToken,
  PlatformPolicies,
  metricsMiddleware,
  metricsEndpoint,
} from '@ecommerce/shared';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { config } from './config/index.js';
import { createIpRateLimiter } from './middleware/rate-limiter.js';
import { createHealthRouter } from './routes/health.js';
import { createAdminDashboardRouter } from './routes/admin-dashboard.routes.js';
import { getRedisClient as defaultGetRedisClient } from './lib/redis.js';

const logger = createLogger({ service: 'gateway' });

export function createApp({ checkRedisHealth, getRedisClient = defaultGetRedisClient } = {}) {
  const app = express();

  // Trust proxy for X-Forwarded-* headers from Nginx
  app.set('trust proxy', 1);

  // Security Headers
  app.use(helmet());
  app.use(cookieParser());

  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }
        if (config.corsOrigin.includes('*') || config.corsOrigin.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'Idempotency-Key'],
      exposedHeaders: [
        'X-Request-Id',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
      ],
    }),
  );

  // Anti-spoofing middleware: STRIP all client-supplied internal identity headers
  app.use((req, res, next) => {
    delete req.headers[SecurityHeaders.USER_ID];
    delete req.headers[SecurityHeaders.USER_ROLE];
    delete req.headers[SecurityHeaders.USER_EMAIL];
    delete req.headers[SecurityHeaders.SELLER_ID];
    delete req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET];
    delete req.headers['x-user-id'];
    delete req.headers['x-user-role'];
    delete req.headers['x-user-email'];
    delete req.headers['x-seller-id'];
    delete req.headers['x-internal-gateway-secret'];

    // Verify JWT if Authorization header is present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = verifyAccessToken(token);
        req.user = {
          id: decoded.sub || decoded.id || decoded.userId,
          role: decoded.role,
          email: decoded.email,
          sellerId: decoded.sellerId || null,
        };
      } catch {
        // Invalid tokens will be rejected or handled appropriately downstream
      }
    }

    next();
  });

  // Request ID & Distributed Tracing Correlation
  app.use(requestIdMiddleware);

  // Prometheus Metrics Collection Middleware
  app.use(metricsMiddleware({ serviceName: 'gateway' }));

  // Standard /metrics scraping endpoint
  app.get('/metrics', metricsEndpoint);

  // Health route (excluded from rate limiting)
  app.use(createHealthRouter({ checkHealth: checkRedisHealth }));

  // Route-Specific Rate Limiters (Redis-backed, locked platform policies)
  const loginLimiter = createIpRateLimiter({
    maxRequests: PlatformPolicies.RATE_LIMIT_LOGIN,
    windowSeconds: 60,
    keyPrefix: 'ratelimit:login:ip:',
    getRedisClient,
  });

  const searchLimiter = createIpRateLimiter({
    maxRequests: PlatformPolicies.RATE_LIMIT_SEARCH,
    windowSeconds: 60,
    keyPrefix: 'ratelimit:search:',
    getRedisClient,
  });

  const listingLimiter = createIpRateLimiter({
    maxRequests: PlatformPolicies.RATE_LIMIT_PRODUCT_LISTING,
    windowSeconds: 60,
    keyPrefix: 'ratelimit:listing:',
    getRedisClient,
  });

  const generalLimiter = createIpRateLimiter({
    maxRequests: PlatformPolicies.RATE_LIMIT_DEFAULT_READ,
    windowSeconds: 60,
    keyPrefix: 'ratelimit:general:',
    getRedisClient,
  });

  const returnsCreationLimiter = createIpRateLimiter({
    maxRequests: PlatformPolicies.RATE_LIMIT_RETURNS || 5,
    windowSeconds: 60,
    keyGenerator: (req) => {
      const userId = req.user?.id || req.headers['x-user-id'];
      const clientIp =
        req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      return userId ? `ratelimit:returns:user:${userId}` : `ratelimit:returns:ip:${clientIp}`;
    },
    getRedisClient,
  });

  // Apply rate limiters
  app.post('/api/v1/returns', returnsCreationLimiter);
  app.use('/api/v1/auth/login', loginLimiter);
  app.use('/api/v1/products/search', searchLimiter);
  app.use('/api/v1/products/autocomplete', searchLimiter);
  app.use('/api/v1/products', listingLimiter);
  app.use('/api/v1', generalLimiter);

  // Phase 5: Admin Command Center Aggregation Router (Before microservice proxy)
  app.use('/api/v1/admin', express.json(), createAdminDashboardRouter({ getRedisClient }));

  // Proxy Helper with error handling, request correlation, and trusted identity injection
  const createServiceProxy = (target, pathFilter = []) => {
    // Use validated secret from config — never logged or exposed externally
    const internalSecret = config.internalGatewaySecret;

    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathFilter,
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.id) {
            proxyReq.setHeader(SecurityHeaders.REQUEST_ID, req.id);
          }
          if (req.traceId) {
            proxyReq.setHeader(SecurityHeaders.TRACE_ID, req.traceId);
          }
          if (req.spanId) {
            proxyReq.setHeader(SecurityHeaders.SPAN_ID, req.spanId);
          }

          // Inject verified internal gateway secret
          proxyReq.setHeader(SecurityHeaders.INTERNAL_GATEWAY_SECRET, internalSecret);

          // If user was verified by Gateway, inject trusted identity headers
          if (req.user) {
            if (req.user.id) {
              proxyReq.setHeader(SecurityHeaders.USER_ID, req.user.id);
            }
            if (req.user.role) {
              proxyReq.setHeader(SecurityHeaders.USER_ROLE, req.user.role);
            }
            if (req.user.email) {
              proxyReq.setHeader(SecurityHeaders.USER_EMAIL, req.user.email);
            }
            if (req.user.sellerId) {
              proxyReq.setHeader(SecurityHeaders.SELLER_ID, req.user.sellerId);
            }
          }
        },
        error: (err, req, res) => {
          logger.error(
            { err: err.message, target, path: req.url },
            'Proxy error to downstream service',
          );
          if (!res.headersSent) {
            res.status(503).json({
              success: false,
              error: {
                code: 'SERVICE_UNAVAILABLE',
                message: 'Downstream service is currently unreachable',
                details: { target },
              },
              meta: { requestId: req.id || 'unknown' },
            });
          }
        },
      },
    });
  };

  // Microservice Proxy Routing
  app.use(
    createServiceProxy(config.services.identity, [
      '/api/v1/auth',
      '/api/v1/users',
      '/api/v1/sellers',
    ]),
  );
  app.use(
    createServiceProxy(config.services.catalog, [
      '/api/v1/categories',
      '/api/v1/products',
      '/api/v1/seller/products',
      '/api/v1/wishlist',
      '/api/v1/coupons',
      '/api/v1/reviews',
    ]),
  );
  app.use(
    createServiceProxy(config.services.order, [
      '/api/v1/cart',
      '/api/v1/checkout',
      '/api/v1/orders',
      '/api/v1/seller/analytics',
      // NOTE: /api/v1/returns is intentionally NOT here — it belongs to fulfillment-svc
    ]),
  );
  app.use(createServiceProxy(config.services.payment, ['/api/v1/payments', '/api/v1/refunds']));
  app.use(
    createServiceProxy(config.services.fulfillment, [
      '/api/v1/warehouses',
      '/api/v1/inventory',
      '/api/v1/reservations',
      '/api/v1/shipments',
      '/api/v1/fulfillment',
      // Returns/reverse logistics are handled by fulfillment-svc
      '/api/v1/returns',
    ]),
  );
  app.use(createServiceProxy(config.services.notification, ['/api/v1/notifications']));

  // 404 Fallback
  app.use(notFoundHandlerMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
