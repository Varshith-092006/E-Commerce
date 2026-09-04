import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  serviceName: 'catalog-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4002', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/catalog_db?schema=public',
});
