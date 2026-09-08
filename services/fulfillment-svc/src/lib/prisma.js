import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import { configureDatabaseUrl } from '@ecommerce/shared';

import pkg from '../../prisma/client/index.js';

// Auto-load .env.production only when not running in test mode
if (process.env.NODE_ENV !== 'test') {
  const rootEnvProd = path.resolve(process.cwd(), '.env.production');
  if (fs.existsSync(rootEnvProd)) {
    dotenv.config({ path: rootEnvProd });
  }
  dotenv.config();
}

const { PrismaClient } = pkg;

let prismaInstance = null;

export function getPrisma() {
  if (!prismaInstance) {
    let rawDbUrl = process.env.DATABASE_URL || process.env.FULFILLMENT_DATABASE_URL;
    if (rawDbUrl) {
      // Strip channel_binding which is unsupported by Neon pooler
      rawDbUrl = rawDbUrl.replace(/([?&])channel_binding=[^&]+(&|$)/, '$1').replace(/[?&]$/, '');
    }
    const dbUrl = configureDatabaseUrl(rawDbUrl, {
      serviceName: 'fulfillment-svc',
      defaultPoolSize: 8,
      defaultTimeout: 30,
    });
    const clientOptions = {
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      transactionOptions: {
        maxWait: 15000,
        timeout: 30000,
      },
    };
    if (dbUrl) {
      process.env.DATABASE_URL = dbUrl;
      clientOptions.datasources = { db: { url: dbUrl } };
    }
    prismaInstance = new PrismaClient(clientOptions);
  }
  return prismaInstance;
}

export const prisma = getPrisma();
