import dotenv from 'dotenv';
import { getRequiredSecret } from '@ecommerce/shared';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';
const internalGatewaySecret = getRequiredSecret(
  'INTERNAL_GATEWAY_SECRET',
  DEV_ONLY_INTERNAL_SECRET,
);

export const config = Object.freeze({
  serviceName: 'catalog-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4002', 10),
  internalGatewaySecret,
  redisUrl:
    process.env.REDIS_URL || (isProduction ? 'redis://redis:6379' : 'redis://localhost:6379'),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/catalog_db?schema=public',
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    productTtl: parseInt(process.env.CACHE_TTL_PRODUCT_SECONDS || '300', 10),
    productListTtl: parseInt(process.env.CACHE_TTL_PRODUCT_LIST_SECONDS || '120', 10),
    categoryTtl: parseInt(process.env.CACHE_TTL_CATEGORY_SECONDS || '900', 10),
    searchTtl: parseInt(process.env.CACHE_TTL_SEARCH_SECONDS || '60', 10),
    autocompleteTtl: parseInt(process.env.CACHE_TTL_AUTOCOMPLETE_SECONDS || '60', 10),
    reviewTtl: parseInt(process.env.CACHE_TTL_REVIEW_SECONDS || '120', 10),
  },
});
