import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  serviceName: 'fulfillment-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4005', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/fulfillment_db?schema=public',
  reservationTtlSeconds: parseInt(process.env.RESERVATION_TTL_SECONDS || '900', 10),
  defaultReorderThreshold: parseInt(process.env.DEFAULT_REORDER_THRESHOLD || '10', 10),
  internalGatewaySecret: process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026',
});
