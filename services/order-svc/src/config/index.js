import dotenv from 'dotenv';
import { getRequiredSecret } from '@ecommerce/shared';

dotenv.config();

const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';
const internalGatewaySecret = getRequiredSecret(
  'INTERNAL_GATEWAY_SECRET',
  DEV_ONLY_INTERNAL_SECRET,
);

export const config = Object.freeze({
  serviceName: 'order-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4003', 10),
  internalGatewaySecret,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/order_db?schema=public',
  redisUrl:
    process.env.REDIS_URL ||
    (process.env.NODE_ENV === 'production' ? 'redis://redis:6379' : 'redis://localhost:6379'),
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    analyticsTtl: parseInt(process.env.CACHE_TTL_ANALYTICS_SECONDS || '180', 10),
  },
});
