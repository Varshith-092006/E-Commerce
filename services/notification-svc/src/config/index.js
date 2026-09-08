import dotenv from 'dotenv';
import { getRequiredSecret } from '@ecommerce/shared';

dotenv.config();

const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';
const internalGatewaySecret = getRequiredSecret(
  'INTERNAL_GATEWAY_SECRET',
  DEV_ONLY_INTERNAL_SECRET,
);

export const config = Object.freeze({
  serviceName: 'notification-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4006', 10),
  internalGatewaySecret,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/notification_db?schema=public',
  redisUrl:
    process.env.REDIS_URL ||
    (process.env.NODE_ENV === 'production' ? 'redis://redis:6379' : 'redis://localhost:6379'),
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    preferencesTtl: parseInt(process.env.CACHE_TTL_NOTIFICATION_PREFERENCES_SECONDS || '300', 10),
  },
});
