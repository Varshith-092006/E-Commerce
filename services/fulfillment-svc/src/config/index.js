import dotenv from 'dotenv';
import { getRequiredSecret } from '@ecommerce/shared';

dotenv.config();

const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';
const internalGatewaySecret = getRequiredSecret(
  'INTERNAL_GATEWAY_SECRET',
  DEV_ONLY_INTERNAL_SECRET,
);

export const config = Object.freeze({
  serviceName: 'fulfillment-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4005', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/fulfillment_db?schema=public',
  reservationTtlSeconds: parseInt(process.env.RESERVATION_TTL_SECONDS || '900', 10),
  defaultReorderThreshold: parseInt(process.env.DEFAULT_REORDER_THRESHOLD || '10', 10),
  internalGatewaySecret,
  redisUrl:
    process.env.REDIS_URL ||
    (process.env.NODE_ENV === 'production' ? 'redis://redis:6379' : 'redis://localhost:6379'),
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    warehouseTtl: parseInt(process.env.CACHE_TTL_WAREHOUSE_SECONDS || '900', 10),
    shipmentTtl: parseInt(process.env.CACHE_TTL_SHIPMENT_SECONDS || '60', 10),
    trackingTtl: parseInt(process.env.CACHE_TTL_TRACKING_SECONDS || '30', 10),
    inventoryDisplayTtl: parseInt(process.env.CACHE_TTL_INVENTORY_DISPLAY_SECONDS || '10', 10),
  },
});
