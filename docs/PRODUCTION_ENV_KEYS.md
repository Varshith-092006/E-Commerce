# Environment Configuration & Variable Audit

---

## 1. WHERE to Create the Environment File(s)

Based on the monorepo architecture, Docker Compose setup, and npm workspaces configuration:

### Primary Location (Recommended)
Create **ONE single root `.env.production`** (or `.env`) file in the repository root:
* **Path**: `c:\Users\The Mighty King\Desktop\E-Commerce\ecommerce-platform\.env.production`

> **How it works**:
> * When using **Docker Compose** (`infra/docker-compose.yml`), it automatically loads variables from the root `.env.production` or `.env` file and distributes them to the individual service containers.
> * When running root commands or running with a dotenv runner (e.g., `dotenv -e .env.production -- npm start`), all services and workers inherit their respective variables from this single root file.

---

### Alternative: Per-Service Files (If Deploying Services Separately)
If you are deploying each service as an independent standalone process/server (e.g. individual systemd services or separate container registries), you can place individual `.env.production` files in each service directory:
* `services/gateway/.env.production`
* `services/identity-svc/.env.production`
* `services/catalog-svc/.env.production`
* `services/order-svc/.env.production`
* `services/payment-svc/.env.production`
* `services/fulfillment-svc/.env.production`
* `services/notification-svc/.env.production`

---

## 2. Complete List of Environment Variable Key Names

---

### Global / Root
```text
NODE_ENV=
OPTIONAL (Default: 'development')
Used by: all services, packages/shared

PORT=
OPTIONAL (Defaults: Gateway 4000, Identity 4001, Catalog 4002, Order 4003, Payment 4004, Fulfillment 4005, Notification 4006)
Used by: all services

LOG_LEVEL=
OPTIONAL (Default: 'info')
Used by: packages/shared (Pino logger)
```

---

### Gateway
```text
IDENTITY_SVC_URL=
REQUIRED
Used by: gateway (proxy routing & auth verification)

CATALOG_SVC_URL=
REQUIRED
Used by: gateway (proxy routing)

ORDER_SVC_URL=
REQUIRED
Used by: gateway (proxy routing & admin aggregation)

PAYMENT_SVC_URL=
REQUIRED
Used by: gateway (proxy routing & admin aggregation)

FULFILLMENT_SVC_URL=
REQUIRED
Used by: gateway (proxy routing & admin aggregation)

NOTIFICATION_SVC_URL=
REQUIRED
Used by: gateway (proxy routing & SSE stream proxy)
```

---

### Identity Service
```text
DATABASE_URL= (or IDENTITY_DATABASE_URL)
REQUIRED
Used by: identity-svc (Prisma client connection for identity_db)

NOTIFICATION_SVC_URL=
OPTIONAL (Default: 'http://localhost:4006')
Used by: identity-svc (security notifications)
```

---

### Catalog Service
```text
DATABASE_URL= (or CATALOG_DATABASE_URL)
REQUIRED
Used by: catalog-svc (Prisma client connection for catalog_db)
```

---

### Order Service
```text
DATABASE_URL= (or ORDER_DATABASE_URL)
REQUIRED
Used by: order-svc (Prisma client connection for order_db)

CATALOG_SVC_URL=
OPTIONAL (Default: 'http://localhost:4002')
Used by: order-svc (cart/checkout product validation)

IDENTITY_SVC_URL=
OPTIONAL (Default: 'http://localhost:4001')
Used by: order-svc (user address validation)

PAYMENT_SVC_URL=
OPTIONAL (Default: 'http://localhost:4004')
Used by: order-svc (payment verification)

NOTIFICATION_SVC_URL=
OPTIONAL (Default: 'http://localhost:4006')
Used by: order-svc (outbox relay)
```

---

### Payment Service
```text
DATABASE_URL= (or PAYMENT_DATABASE_URL)
REQUIRED
Used by: payment-svc (Prisma client connection for payment_db)

ORDER_SVC_URL=
OPTIONAL (Default: 'http://localhost:4003')
Used by: payment-svc (order callbacks)

NOTIFICATION_SVC_URL=
OPTIONAL (Default: 'http://localhost:4006')
Used by: payment-svc (outbox relay)
```

---

### Fulfillment Service
```text
DATABASE_URL= (or FULFILLMENT_DATABASE_URL)
REQUIRED
Used by: fulfillment-svc (Prisma client connection for fulfillment_db)

ORDER_SVC_URL=
OPTIONAL (Default: 'http://localhost:4003')
Used by: fulfillment-svc (status synchronization)

PAYMENT_SVC_URL=
OPTIONAL (Default: 'http://localhost:4004')
Used by: fulfillment-svc (return refund triggers)

NOTIFICATION_SVC_URL=
OPTIONAL (Default: 'http://localhost:4006')
Used by: fulfillment-svc (outbox relay)
```

---

### Notification Service
```text
DATABASE_URL= (or NOTIFICATION_DATABASE_URL)
REQUIRED
Used by: notification-svc (Prisma client connection for notification_db)
```

---

### Shared / Infrastructure & Outbox Workers
```text
START_OUTBOX_WORKERS=
OPTIONAL (Set 'true' to start background polling workers automatically with HTTP servers)
Used by: order-svc, payment-svc, fulfillment-svc

OUTBOX_POLL_INTERVAL_MS=
OPTIONAL (Default: '1000')
Used by: packages/shared (OutboxProcessor)

OUTBOX_BATCH_SIZE=
OPTIONAL (Default: '10')
Used by: packages/shared (OutboxProcessor)

OUTBOX_LOCK_TIMEOUT_MS=
OPTIONAL (Default: '30000')
Used by: packages/shared (OutboxProcessor)

OUTBOX_MAX_ATTEMPTS=
OPTIONAL (Default: '5')
Used by: packages/shared (OutboxProcessor)
```

---

### PostgreSQL
```text
IDENTITY_DATABASE_URL=
REQUIRED for Docker Compose & Prisma migrations
Used by: identity-svc

CATALOG_DATABASE_URL=
REQUIRED for Docker Compose & Prisma migrations
Used by: catalog-svc

ORDER_DATABASE_URL=
REQUIRED for Docker Compose & Prisma migrations
Used by: order-svc

PAYMENT_DATABASE_URL=
REQUIRED for Docker Compose & Prisma migrations
Used by: payment-svc

FULFILLMENT_DATABASE_URL=
REQUIRED for Docker Compose & Prisma migrations
Used by: fulfillment-svc

NOTIFICATION_DATABASE_URL=
REQUIRED for Docker Compose & Prisma migrations
Used by: notification-svc
```

---

### Redis
```text
REDIS_URL=
REQUIRED
Used by: gateway (rate limiting & dashboard cache), catalog-svc (tree & wishlist caching), notification-svc (rate limiting & SSE Pub/Sub), packages/shared
```

---

### Kafka (Optional / Provisioned Infrastructure)
```text
KAFKA_BROKERS=
OPTIONAL (Default: 'localhost:9092')
Used by: infra/docker-compose.yml
```

---

### Razorpay
```text
PAYMENT_PROVIDER_MODE=
REQUIRED ('live' for real Razorpay API calls, 'mock' for testing)
Used by: payment-svc

RAZORPAY_KEY_ID=
REQUIRED for real Razorpay testing (when PAYMENT_PROVIDER_MODE=live)
Used by: payment-svc

RAZORPAY_KEY_SECRET=
REQUIRED for real Razorpay testing (when PAYMENT_PROVIDER_MODE=live)
Used by: payment-svc

RAZORPAY_WEBHOOK_SECRET=
REQUIRED for real webhook HMAC signature verification
Used by: payment-svc
```

---

### Cloudinary (Optional Asset CDN)
```text
CLOUDINARY_CLOUD_NAME=
OPTIONAL
Used by: catalog-svc

CLOUDINARY_API_KEY=
OPTIONAL
Used by: catalog-svc

CLOUDINARY_API_SECRET=
OPTIONAL
Used by: catalog-svc
```

---

### Email (SMTP Provider)
```text
SMTP_HOST=
REQUIRED for real email delivery (Default: 'localhost')
Used by: notification-svc

SMTP_PORT=
OPTIONAL (Default: '2525' in dev, '587' in prod)
Used by: notification-svc

SMTP_SECURE=
OPTIONAL (Default: 'false')
Used by: notification-svc

SMTP_USER=
REQUIRED for real SMTP authentication
Used by: notification-svc

SMTP_PASS=
REQUIRED for real SMTP authentication
Used by: notification-svc

SMTP_FROM=
OPTIONAL (Default: 'no-reply@ecommerce.local')
Used by: notification-svc
```

---

### SMS
```text
SMS_PROVIDER_MODE=
OPTIONAL (Default: 'mock')
Used by: notification-svc

SMS_API_KEY=
REQUIRED for real SMS delivery
Used by: notification-svc

SMS_SENDER_ID=
OPTIONAL (Default: 'ECOMM')
Used by: notification-svc
```

---

### Logistics & Courier (3PL Providers)
```text
COURIER_PROVIDER_MODE=
OPTIONAL ('live' or 'mock', Default: 'mock')
Used by: fulfillment-svc

DELHIVERY_API_TOKEN=
REQUIRED for real Delhivery carrier dispatch
Used by: fulfillment-svc

BLUEDART_API_KEY=
REQUIRED for real BlueDart carrier dispatch
Used by: fulfillment-svc

BLUEDART_API_SECRET=
REQUIRED for real BlueDart carrier dispatch
Used by: fulfillment-svc

EKART_CLIENT_ID=
REQUIRED for real Ekart carrier dispatch
Used by: fulfillment-svc

EKART_CLIENT_SECRET=
REQUIRED for real Ekart carrier dispatch
Used by: fulfillment-svc
```

---

### JWT / Authentication
```text
JWT_SECRET=
REQUIRED (Must be a 64+ char high-entropy secret)
Used by: identity-svc, gateway, notification-svc, packages/shared

JWT_REFRESH_SECRET=
REQUIRED (Must be a 64+ char high-entropy secret)
Used by: identity-svc, packages/shared

JWT_EXPIRES_IN=
OPTIONAL (Default: '15m')
Used by: identity-svc, packages/shared

JWT_REFRESH_EXPIRES_IN=
OPTIONAL (Default: '7d')
Used by: identity-svc, packages/shared
```

---

### Internal Service Authentication
```text
INTERNAL_GATEWAY_SECRET=
REQUIRED (Must be a 32+ char high-entropy secret)
Used by: gateway, packages/shared, and all 6 backend services
```

---

### CORS / Frontend
```text
CORS_ORIGIN=
OPTIONAL (Default: '*' in dev, comma-separated URLs in prod)
Used by: gateway
```

---

### Observability / Metrics / Tracing
```text
PROMETHEUS_METRICS_ENABLED=
OPTIONAL (Default: 'true')
Used by: packages/shared
```

---

## 3. COPY-PASTE TEMPLATE (Key Names Only)

Create your `.env.production` file at `c:\Users\The Mighty King\Desktop\E-Commerce\ecommerce-platform\.env.production` and paste this template:

```env
# ==============================================================================
# RUNTIME & GLOBAL CONFIGURATION
# ==============================================================================
NODE_ENV=
PORT=
LOG_LEVEL=
START_OUTBOX_WORKERS=
OUTBOX_POLL_INTERVAL_MS=
OUTBOX_BATCH_SIZE=
OUTBOX_LOCK_TIMEOUT_MS=
OUTBOX_MAX_ATTEMPTS=

# ==============================================================================
# AUTHENTICATION & SECURITY SECRETS
# ==============================================================================
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
INTERNAL_GATEWAY_SECRET=

# ==============================================================================
# CORS & FRONTEND
# ==============================================================================
CORS_ORIGIN=

# ==============================================================================
# DOWNSTREAM SERVICE URLS (GATEWAY & INTER-SERVICE ROUTING)
# ==============================================================================
IDENTITY_SVC_URL=
CATALOG_SVC_URL=
ORDER_SVC_URL=
PAYMENT_SVC_URL=
FULFILLMENT_SVC_URL=
NOTIFICATION_SVC_URL=

# ==============================================================================
# REDIS
# ==============================================================================
REDIS_URL=

# ==============================================================================
# POSTGRESQL DATABASES (6 DEDICATED INSTANCES)
# ==============================================================================
IDENTITY_DATABASE_URL=
CATALOG_DATABASE_URL=
ORDER_DATABASE_URL=
PAYMENT_DATABASE_URL=
FULFILLMENT_DATABASE_URL=
NOTIFICATION_DATABASE_URL=

# ==============================================================================
# PAYMENT PROVIDER (RAZORPAY)
# ==============================================================================
PAYMENT_PROVIDER_MODE=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# ==============================================================================
# EMAIL (SMTP PROVIDER)
# ==============================================================================
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# ==============================================================================
# SMS PROVIDER
# ==============================================================================
SMS_PROVIDER_MODE=
SMS_API_KEY=
SMS_SENDER_ID=

# ==============================================================================
# COURIER & LOGISTICS PROVIDERS
# ==============================================================================
COURIER_PROVIDER_MODE=
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
# KAFKA (OPTIONAL)
# ==============================================================================
KAFKA_BROKERS=
```
