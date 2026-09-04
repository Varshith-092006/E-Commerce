import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  serviceName: 'identity-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4001', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/identity_db?schema=public',
});
