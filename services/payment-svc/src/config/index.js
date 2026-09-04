import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  serviceName: 'payment-svc',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4004', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/payment_db?schema=public',
  internalSecret: process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_ApexStoreMockKey2026',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret_key_apex_2026',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_razorpay_webhook_secret_2026',
  razorpayMode: process.env.RAZORPAY_MODE || 'mock',
});
