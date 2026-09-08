import dotenv from 'dotenv';
import { getRequiredSecret } from '@ecommerce/shared';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const DEV_ONLY_JWT_SECRET = 'ecom_default_jwt_secret_dev_only_change_in_prod';
const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';

const jwtSecret = getRequiredSecret('JWT_SECRET', DEV_ONLY_JWT_SECRET);
const internalGatewaySecret = getRequiredSecret(
  'INTERNAL_GATEWAY_SECRET',
  DEV_ONLY_INTERNAL_SECRET,
);

export const config = Object.freeze({
  serviceName: 'identity-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4001', 10),
  jwtSecret,
  internalGatewaySecret,
  redisUrl:
    process.env.REDIS_URL || (isProduction ? 'redis://redis:6379' : 'redis://localhost:6379'),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/identity_db?schema=public',
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    userProfileTtl: parseInt(process.env.CACHE_TTL_USER_PROFILE_SECONDS || '300', 10),
  },
});
