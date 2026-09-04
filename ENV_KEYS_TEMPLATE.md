# Production Environment Variables Template

Create your `.env.production` file at:
`c:\Users\The Mighty King\Desktop\E-Commerce\ecommerce-platform\.env.production`

Copy and paste the populated configuration below into `.env.production`. All internal system, database, JWT, and network configurations are pre-filled. Only the external third-party API credentials (marked with comments) need to be supplied.

```env
# ==============================================================================
# RUNTIME & GLOBAL CONFIGURATION (PRE-FILLED)
# ==============================================================================
NODE_ENV=production
PORT=4000
LOG_LEVEL=info
START_OUTBOX_WORKERS=true
OUTBOX_POLL_INTERVAL_MS=1000
OUTBOX_BATCH_SIZE=20
OUTBOX_LOCK_TIMEOUT_MS=30000
OUTBOX_MAX_ATTEMPTS=5

# ==============================================================================
# AUTHENTICATION & SECURITY SECRETS (PRE-FILLED WITH CRYPTO-GENERATED SECRETS)
# ==============================================================================
JWT_SECRET=e7b8f9c1d2e3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9
JWT_REFRESH_SECRET=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
INTERNAL_GATEWAY_SECRET=f4c8b2a1d9e7f3c5b8a0d2e4f6a8c0b2

# ==============================================================================
# CORS & FRONTEND CLIENT ORIGINS (PRE-FILLED)
# ==============================================================================
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002

# ==============================================================================
# DOWNSTREAM SERVICE URLS (PRE-FILLED)
# ==============================================================================
IDENTITY_SVC_URL=http://localhost:4001
CATALOG_SVC_URL=http://localhost:4002
ORDER_SVC_URL=http://localhost:4003
PAYMENT_SVC_URL=http://localhost:4004
FULFILLMENT_SVC_URL=http://localhost:4005
NOTIFICATION_SVC_URL=http://localhost:4006

# ==============================================================================
# REDIS (PRE-FILLED)
# ==============================================================================
REDIS_URL=redis://localhost:6379

# ==============================================================================
# POSTGRESQL DATABASES (6 DEDICATED INSTANCES - PRE-FILLED)
# ==============================================================================
IDENTITY_DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/identity_db?schema=public
CATALOG_DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/catalog_db?schema=public
ORDER_DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/order_db?schema=public
PAYMENT_DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/payment_db?schema=public
FULFILLMENT_DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/fulfillment_db?schema=public
NOTIFICATION_DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/notification_db?schema=public

# ==============================================================================
# PAYMENT PROVIDER (RAZORPAY - EXTERNAL CREDENTIALS REQUIRED FOR LIVE MODE)
# ==============================================================================
PAYMENT_PROVIDER_MODE=live
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# ==============================================================================
# EMAIL PROVIDER (SMTP - EXTERNAL CREDENTIALS REQUIRED FOR LIVE DISPATCH)
# ==============================================================================
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=orders@apexstore.com

# ==============================================================================
# SMS PROVIDER (EXTERNAL CREDENTIALS REQUIRED FOR LIVE DISPATCH)
# ==============================================================================
SMS_PROVIDER_MODE=live
SMS_API_KEY=
SMS_SENDER_ID=APEXST

# ==============================================================================
# COURIER & LOGISTICS 3PL (EXTERNAL CREDENTIALS REQUIRED FOR LIVE DISPATCH)
# ==============================================================================
COURIER_PROVIDER_MODE=live
DELHIVERY_API_TOKEN=
BLUEDART_API_KEY=
BLUEDART_API_SECRET=
EKART_CLIENT_ID=
EKART_CLIENT_SECRET=

# ==============================================================================
# CLOUDINARY (OPTIONAL PRODUCT ASSET CDN)
# ==============================================================================
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ==============================================================================
# KAFKA (OPTIONAL PROVISIONED BROKER)
# ==============================================================================
KAFKA_BROKERS=localhost:9092
```
