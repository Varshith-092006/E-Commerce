import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  serviceName: 'order-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4003', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/order_db?schema=public',
});
