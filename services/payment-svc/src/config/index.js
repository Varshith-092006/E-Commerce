import dotenv from 'dotenv';
import { getRequiredSecret } from '@ecommerce/shared';

dotenv.config();

const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';
const internalSecret = getRequiredSecret('INTERNAL_GATEWAY_SECRET', DEV_ONLY_INTERNAL_SECRET);

export const config = Object.freeze({
  serviceName: 'payment-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4004', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/payment_db?schema=public',
  internalSecret,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_ApexStoreMockKey2026',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret_key_apex_2026',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_razorpay_webhook_secret_2026',
  razorpayMode: process.env.RAZORPAY_MODE || 'mock',
});
