import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Internal gateway secret — used for service mesh authentication.
// NEVER expose this value in logs or responses.
const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';
const rawInternalSecret = process.env.INTERNAL_GATEWAY_SECRET;

if (isProduction && !rawInternalSecret) {
  // Fail hard at startup in production — misconfigured secret is a security risk
  throw new Error(
    '[FATAL] INTERNAL_GATEWAY_SECRET environment variable is required in production. ' +
      'Set this to a strong, unique secret shared across all microservices.',
  );
}

if (!isProduction && !rawInternalSecret) {
  console.warn(
    '[WARNING] INTERNAL_GATEWAY_SECRET not set. Using dev-only default. ' +
      'DO NOT use this default in production.',
  );
}

const internalGatewaySecret = rawInternalSecret || DEV_ONLY_INTERNAL_SECRET;

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
});
