import dotenv from 'dotenv';
import { getRequiredSecret } from '@ecommerce/shared';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

// Internal gateway secret — used for service mesh authentication.
// In production, fails immediately if missing, empty, or set to a known dev default.
const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';
const internalGatewaySecret = getRequiredSecret(
  'INTERNAL_GATEWAY_SECRET',
  DEV_ONLY_INTERNAL_SECRET,
);

// JWT secret — used to verify user access tokens at edge/ingress.
// In production, fails immediately if missing, empty, or set to a known dev default.
const DEV_ONLY_JWT_SECRET = 'ecom_default_jwt_secret_dev_only_change_in_prod';
const jwtSecret = getRequiredSecret('JWT_SECRET', DEV_ONLY_JWT_SECRET);

export const config = Object.freeze({
  env: NODE_ENV,
  port: parseInt(process.env.PORT || '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  // IMPORTANT: internalGatewaySecret is for SERVICE MESH USE ONLY.
  // Never log or expose this value to external clients.
  internalGatewaySecret,
  jwtSecret,
  services: {
    identity: process.env.IDENTITY_SVC_URL || 'http://localhost:4001',
    catalog: process.env.CATALOG_SVC_URL || 'http://localhost:4002',
    order: process.env.ORDER_SVC_URL || 'http://localhost:4003',
    payment: process.env.PAYMENT_SVC_URL || 'http://localhost:4004',
    fulfillment: process.env.FULFILLMENT_SVC_URL || 'http://localhost:4005',
    notification: process.env.NOTIFICATION_SVC_URL || 'http://localhost:4006',
  },
  rateLimit: {
    windowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '120', 10),
  },
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    adminDashboardTtl: parseInt(process.env.CACHE_TTL_ADMIN_DASHBOARD_SECONDS || '60', 10),
  },
});
