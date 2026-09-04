import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  serviceName: 'notification-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4006', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/notification_db?schema=public',
});
