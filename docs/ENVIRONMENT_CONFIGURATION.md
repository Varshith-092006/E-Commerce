# Environment Configuration

---

## 1. Overview

This document provides the authoritative, single source of truth for all environment variables, connection strings, security secrets, and runtime configuration across the E-Commerce Microservices Platform.

### Configuration Architecture
The platform is structured as an npm workspaces monorepo containing 7 backend services (`gateway`, `identity-svc`, `catalog-svc`, `order-svc`, `payment-svc`, `fulfillment-svc`, `notification-svc`), shared library packages (`@ecommerce/shared`, `@ecommerce/ui`), and frontend applications (`apps/customer-web`, `apps/seller-web`, `apps/admin-web`).

* **Database-per-Service Isolation**: 6 independent PostgreSQL databases.
* **Shared Redis Infrastructure**: Used for distributed caching, session tracking, token revocation, sliding-window rate limiting, and real-time SSE Pub/Sub broadcasting.
* **Gateway Trust Boundary**: Inter-service communication is secured via `INTERNAL_GATEWAY_SECRET`.
* **Zero Secret Leakage**: Passwords, tokens, CVVs, and authorization headers are automatically redacted in structured logs. Secrets must NEVER be committed to version control.

---

## 2. Required Environment Files

The platform expects the following `.env` files depending on the deployment target:

| Environment File | Location | Target Scope | Description |
|---|---|---|---|
| `.env` | Repository Root (`/`) | Local Development | Default configuration when running services locally via `npm run dev` or tests. |
| `.env.development` | Repository Root (`/`) | Docker Compose | Loaded by `infra/docker-compose.yml` for local containerized orchestration. |
| `.env.production` | Repository Root (`/`) | Production Cluster | Complete production configuration containing live secrets, RDS endpoints, and third-party credentials. |
| `.env.test` | Services (`services/*/`) | Unit & Integration Tests | Automatically populated with safe mock defaults during Jest test runs. |
| `.env` | Frontend Apps (`apps/*/`) | Client Applications | Contains public client-side variables prefixed with `VITE_`. |

---

## 3. Root / Shared Variables

These variables are consumed across `@ecommerce/shared` and apply to all services unless explicitly overridden.

| Variable | Required? | Service | Purpose | Example / Format | Secret? |
|---|:---:|---|---|---|:---:|
| `NODE_ENV` | Optional | All | Sets environment runtime mode (`development`, `production`, `test`). | `development` / `production` | No |
| `LOG_LEVEL` | Optional | All | Logging verbosity level (`debug`, `info`, `warn`, `error`). | `info` | No |
| `REDIS_URL` | **Required** | All | Shared Redis connection URI for caching, rate limiting, and Pub/Sub. | `redis://localhost:6379` | Yes (if authed) |
| `INTERNAL_GATEWAY_SECRET` | **Required** | All | Shared secret header (`x-internal-gateway-secret`) to authenticate internal traffic. | `<GENERATE_32_CHAR_SECRET>` | **YES** |
| `JWT_SECRET` | **Required** | Identity, Gateway, Notification | Signing and verifying short-lived (15m) access tokens. | `<GENERATE_64_CHAR_SECRET>` | **YES** |
| `JWT_REFRESH_SECRET` | **Required** | Identity | Signing and verifying long-lived (7d) refresh tokens. | `<GENERATE_64_CHAR_SECRET>` | **YES** |
| `JWT_EXPIRES_IN` | Optional | Identity | Access token lifespan. Default: `15m`. | `15m` | No |
| `JWT_REFRESH_EXPIRES_IN` | Optional | Identity | Refresh token lifespan. Default: `7d`. | `7d` | No |
| `START_OUTBOX_WORKERS` | Optional | Order, Payment, Fulfillment | Automatically spawns background outbox polling workers on HTTP server start. | `true` / `false` | No |
| `OUTBOX_POLL_INTERVAL_MS` | Optional | Order, Payment, Fulfillment | Polling frequency for claiming outbox batches. Default: `1000`. | `1000` | No |
| `OUTBOX_BATCH_SIZE` | Optional | Order, Payment, Fulfillment | Maximum number of outbox events claimed per batch. Default: `10`. | `10` | No |
| `OUTBOX_LOCK_TIMEOUT_MS` | Optional | Order, Payment, Fulfillment | Lease lock expiration timeout for worker crash recovery. Default: `30000`. | `30000` | No |
| `OUTBOX_MAX_ATTEMPTS` | Optional | Order, Payment, Fulfillment | Maximum retry attempts before dead-lettering. Default: `5`. | `5` | No |

---

## 4. Gateway Variables

Configured for `services/gateway` (Port `4000`).

| Variable | Required? | Purpose | Example / Format | Secret? |
|---|:---:|---|---|:---:|
| `PORT` | Optional | Port for the API Gateway server. Default: `4000`. | `4000` | No |
| `IDENTITY_SVC_URL` | **Required** | Downstream URL for identity service proxying and auth. | `http://localhost:4001` | No |
| `CATALOG_SVC_URL` | **Required** | Downstream URL for catalog service proxying. | `http://localhost:4002` | No |
| `ORDER_SVC_URL` | **Required** | Downstream URL for order service proxying and checkout. | `http://localhost:4003` | No |
| `PAYMENT_SVC_URL` | **Required** | Downstream URL for payment service proxying and webhooks. | `http://localhost:4004` | No |
| `FULFILLMENT_SVC_URL` | **Required** | Downstream URL for fulfillment service proxying. | `http://localhost:4005` | No |
| `NOTIFICATION_SVC_URL`| **Required** | Downstream URL for notification service and SSE proxying. | `http://localhost:4006` | No |
| `CORS_ORIGIN` | Optional | Allowed CORS origins for browser web applications. Default: `*`. | `http://localhost:3000,http://localhost:3001` | No |
| `RATE_LIMIT_MAX` | Optional | Maximum requests per IP per window on the gateway. Default: `1000`. | `1000` | No |
| `RATE_LIMIT_WINDOW_MS` | Optional | Gateway rate limiting sliding window in ms. Default: `60000`. | `60000` | No |

---

## 5. Identity Service Variables

Configured for `services/identity-svc` (Port `4001`).

| Variable | Required? | Purpose | Example / Format | Secret? |
|---|:---:|---|---|:---:|
| `PORT` | Optional | Port for identity-svc server. Default: `4001`. | `4001` | No |
| `DATABASE_URL` | **Required** | PostgreSQL connection string for `identity_db`. | `postgresql://postgres:postgrespassword@localhost:5432/identity_db?schema=public` | **YES** |
| `NOTIFICATION_SVC_URL`| Optional | URL for dispatching security and account notifications. | `http://localhost:4006` | No |

---

## 6. Catalog Service Variables

Configured for `services/catalog-svc` (Port `4002`).

| Variable | Required? | Purpose | Example / Format | Secret? |
|---|:---:|---|---|:---:|
| `PORT` | Optional | Port for catalog-svc server. Default: `4002`. | `4002` | No |
| `DATABASE_URL` | **Required** | PostgreSQL connection string for `catalog_db`. | `postgresql://postgres:postgrespassword@localhost:5432/catalog_db?schema=public` | **YES** |
| `CLOUDINARY_CLOUD_NAME`| Optional | Cloudinary cloud name for product image asset uploads. | `apex-ecommerce` | No |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API Key for image asset management. | `123456789012345` | **YES** |
| `CLOUDINARY_API_SECRET`| Optional | Cloudinary API Secret for secure asset signing. | `<CLOUDINARY_SECRET>` | **YES** |

---

## 7. Order Service Variables

Configured for `services/order-svc` (Port `4003`).

| Variable | Required? | Purpose | Example / Format | Secret? |
|---|:---:|---|---|:---:|
| `PORT` | Optional | Port for order-svc server. Default: `4003`. | `4003` | No |
| `DATABASE_URL` | **Required** | PostgreSQL connection string for `order_db`. | `postgresql://postgres:postgrespassword@localhost:5432/order_db?schema=public` | **YES** |
| `CATALOG_SVC_URL` | Optional | Downstream URL for price and SKU validation during cart/checkout. | `http://localhost:4002` | No |
| `IDENTITY_SVC_URL` | Optional | Downstream URL for user address verification. | `http://localhost:4001` | No |
| `PAYMENT_SVC_URL` | Optional | Downstream URL for payment status verification. | `http://localhost:4004` | No |
| `NOTIFICATION_SVC_URL`| Optional | URL for outbox relay worker forwarding. | `http://localhost:4006` | No |

---

## 8. Payment Service Variables

Configured for `services/payment-svc` (Port `4004`).

| Variable | Required? | Purpose | Example / Format | Secret? |
|---|:---:|---|---|:---:|
| `PORT` | Optional | Port for payment-svc server. Default: `4004`. | `4004` | No |
| `DATABASE_URL` | **Required** | PostgreSQL connection string for `payment_db`. | `postgresql://postgres:postgrespassword@localhost:5432/payment_db?schema=public` | **YES** |
| `PAYMENT_PROVIDER_MODE`| **Required** | Mode selector (`live` or `mock`). Live requires valid Razorpay keys. | `live` / `mock` | No |
| `RAZORPAY_KEY_ID` | Conditional | Razorpay API Key ID (Required in `live` mode). | `rzp_live_ApexStoreLiveKey2026` | **YES** |
| `RAZORPAY_KEY_SECRET` | Conditional | Razorpay API Secret Key (Required in `live` mode). | `<RAZORPAY_LIVE_SECRET>` | **YES** |
| `RAZORPAY_WEBHOOK_SECRET`| Conditional | Webhook verification secret for HMAC signature validation. | `<RAZORPAY_WEBHOOK_SECRET>` | **YES** |
| `ORDER_SVC_URL` | Optional | Downstream URL for order status callbacks. | `http://localhost:4003` | No |
| `NOTIFICATION_SVC_URL`| Optional | URL for outbox relay worker forwarding. | `http://localhost:4006` | No |

---

## 9. Fulfillment Service Variables

Configured for `services/fulfillment-svc` (Port `4005`).

| Variable | Required? | Purpose | Example / Format | Secret? |
|---|:---:|---|---|:---:|
| `PORT` | Optional | Port for fulfillment-svc server. Default: `4005`. | `4005` | No |
| `DATABASE_URL` | **Required** | PostgreSQL connection string for `fulfillment_db`. | `postgresql://postgres:postgrespassword@localhost:5432/fulfillment_db?schema=public` | **YES** |
| `COURIER_PROVIDER_MODE`| Optional | Courier mode (`live` or `mock`). Default: `mock`. | `live` / `mock` | No |
| `DELHIVERY_API_TOKEN` | Conditional | API token for Delhivery Express carrier dispatch. | `<DELHIVERY_API_TOKEN>` | **YES** |
| `BLUEDART_API_KEY` | Conditional | API key for BlueDart Apex logistics integration. | `<BLUEDART_API_KEY>` | **YES** |
| `BLUEDART_API_SECRET` | Conditional | API secret for BlueDart Apex logistics integration. | `<BLUEDART_API_SECRET>` | **YES** |
| `EKART_CLIENT_ID` | Conditional | Client ID for Ekart Logistics carrier dispatch. | `<EKART_CLIENT_ID>` | **YES** |
| `EKART_CLIENT_SECRET` | Conditional | Client Secret for Ekart Logistics carrier dispatch. | `<EKART_CLIENT_SECRET>` | **YES** |
| `ORDER_SVC_URL` | Optional | Downstream URL for order status synchronization. | `http://localhost:4003` | No |
| `PAYMENT_SVC_URL` | Optional | Downstream URL for automated return refund callbacks. | `http://localhost:4004` | No |
| `NOTIFICATION_SVC_URL`| Optional | URL for outbox relay worker forwarding. | `http://localhost:4006` | No |

---

## 10. Notification Service Variables

Configured for `services/notification-svc` (Port `4006`).

| Variable | Required? | Purpose | Example / Format | Secret? |
|---|:---:|---|---|:---:|
| `PORT` | Optional | Port for notification-svc server. Default: `4006`. | `4006` | No |
| `DATABASE_URL` | **Required** | PostgreSQL connection string for `notification_db`. | `postgresql://postgres:postgrespassword@localhost:5432/notification_db?schema=public` | **YES** |
| `SMTP_HOST` | Conditional | SMTP mail server hostname for Email provider. | `smtp.sendgrid.net` / `smtp.mailgun.org` | No |
| `SMTP_PORT` | Conditional | SMTP mail server port. Default: `587`. | `587` / `465` / `2525` | No |
| `SMTP_SECURE` | Optional | Use TLS (`true` for port 465). Default: `false`. | `true` / `false` | No |
| `SMTP_USER` | Conditional | SMTP authentication username. | `apikey` / `postmaster@yourdomain.com` | **YES** |
| `SMTP_PASS` | Conditional | SMTP authentication password or API key. | `<SMTP_API_PASSWORD>` | **YES** |
| `SMTP_FROM` | Optional | Default Sender email address. Default: `no-reply@ecommerce.local`.| `orders@apexstore.com` | No |
| `SMS_PROVIDER_MODE` | Optional | SMS dispatch mode (`live` or `mock`). Default: `mock`. | `live` / `mock` | No |
| `SMS_API_KEY` | Conditional | API Key for SMS gateway (Twilio, Gupshup, Kaleyra). | `<SMS_API_KEY>` | **YES** |
| `SMS_SENDER_ID` | Optional | 6-character registered SMS sender header. Default: `ECOMM`. | `APEXST` | No |

---

## 11. Frontend Variables

Configured for web applications in `apps/` (`apps/customer-web`, `apps/seller-web`, `apps/admin-web`).

> **CRITICAL SECURITY NOTE**: All variables prefixed with `VITE_` are embedded directly into the public client-side JavaScript bundle. **NEVER expose database URLs, JWT signing secrets, or internal service secrets in frontend `.env` files.**

| Variable | Required? | App Target | Purpose | Example Value |
|---|:---:|---|---|---|
| `VITE_GATEWAY_URL` | **Required** | All Web Apps | Base URL of the API Gateway BFF. | `http://localhost:4000` |
| `VITE_APP_TITLE` | Optional | Customer Web | Public browser title for the store. | `Apex E-Commerce Store` |
| `VITE_RAZORPAY_KEY_ID`| **Required** | Customer Web | Public Razorpay Key ID for client checkout modal. | `rzp_live_ApexStoreLiveKey2026` |
| `VITE_SSE_STREAM_URL` | Optional | Customer / Admin | SSE real-time stream endpoint URL. | `http://localhost:4000/api/v1/notifications/stream` |

---

## 12. Database Configuration

The platform adheres to strict **Database-per-Service isolation**. Each service possesses its own PostgreSQL database instance and dedicated Prisma schema.

```
┌─────────────────┬─────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Service         │ Database Name   │ Default Local Connection String                                        │
├─────────────────┼─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ identity-svc    │ identity_db     │ postgresql://postgres:postgrespassword@localhost:5432/identity_db     │
│ catalog-svc     │ catalog_db      │ postgresql://postgres:postgrespassword@localhost:5432/catalog_db      │
│ order-svc       │ order_db        │ postgresql://postgres:postgrespassword@localhost:5432/order_db        │
│ payment-svc     │ payment_db      │ postgresql://postgres:postgrespassword@localhost:5432/payment_db      │
│ fulfillment-svc │ fulfillment_db  │ postgresql://postgres:postgrespassword@localhost:5432/fulfillment_db  │
│ notification-svc│ notification_db │ postgresql://postgres:postgrespassword@localhost:5432/notification_db │
└─────────────────┴─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Redis Configuration

* **Connection Variable**: `REDIS_URL` (e.g. `redis://localhost:6379` or `rediss://default:<PASSWORD>@<ELASTICACHE_ENDPOINT>:6379`).
* **Redis Key Namespaces**:
  * `ratelimit:notif:{userId}:{channel}` — Sliding window sorted sets for notification rate limiting.
  * `gateway:ratelimit:{ip}` — Gateway IP rate limiting.
  * `admin:dashboard:stats` — 60s cached administrative analytics KPIs.
  * `catalog:category:tree` — Hierarchical category tree cache.
  * `wishlist:{userId}` — Cached user wishlist sets.
* **Pub/Sub Channels**:
  * `sse:notifications:broadcast` — Multi-pod horizontal SSE notification synchronization.

---

## 14. Kafka / Event Streaming Configuration

For containerized deployments using Apache Kafka (configured in `infra/docker-compose.yml`):

| Variable | Required? | Purpose | Example Value |
|---|:---:|---|---|
| `KAFKA_BROKERS` | Optional | Comma-separated list of Kafka broker endpoints. | `localhost:9092` / `kafka:29092` |
| `KAFKA_CLIENT_ID` | Optional | Client identifier for producer/consumer registration. | `ecommerce-platform` |
| `KAFKA_GROUP_ID_PREFIX`| Optional | Consumer group prefix for event partitions. | `ecommerce-group` |

---

## 15. Authentication & Security Secrets

All security secrets must be cryptographically generated random strings.

```bash
# Generate 64-byte high-entropy secrets for JWT and Gateway
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

| Secret Variable | Recommended Length | Usage | Rotation Policy |
|---|:---:|---|---|
| `JWT_SECRET` | 64+ hex characters | HMAC-SHA256 access token signature | 90 Days |
| `JWT_REFRESH_SECRET` | 64+ hex characters | HMAC-SHA256 refresh token signature | 90 Days |
| `INTERNAL_GATEWAY_SECRET`| 32+ hex characters | Gateway-to-Service trust verification | 180 Days |
| `RAZORPAY_WEBHOOK_SECRET`| 32+ hex characters | Razorpay webhook signature validation | As needed |

---

## 16. External Providers

| Provider | Service Target | Required Environment Variables | Notes |
|---|---|---|---|
| **Razorpay** | `payment-svc` | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Required for live credit card, UPI, and netbanking transactions. |
| **SMTP Provider** | `notification-svc` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Works with SendGrid, AWS SES, Mailgun, or Postmark. |
| **SMS Gateway** | `notification-svc` | `SMS_API_KEY`, `SMS_SENDER_ID` | Works with Twilio, Gupshup, or Kaleyra. |
| **Delhivery** | `fulfillment-svc` | `DELHIVERY_API_TOKEN` | Third-party express courier logistics. |
| **BlueDart** | `fulfillment-svc` | `BLUEDART_API_KEY`, `BLUEDART_API_SECRET` | Air cargo and apex logistics. |
| **Ekart** | `fulfillment-svc` | `EKART_CLIENT_ID`, `EKART_CLIENT_SECRET` | Surface logistics and courier dispatch. |
| **Cloudinary** | `catalog-svc` | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Product and category image asset CDN. |

---

## 17. Production `.env.production` Checklist

Copy and populate the template below into `.env.production` before initiating live production staging or deployment:

```env
# ==============================================================================
# ENVIRONMENT & RUNTIME
# ==============================================================================
NODE_ENV=production
LOG_LEVEL=info
START_OUTBOX_WORKERS=true
OUTBOX_POLL_INTERVAL_MS=1000
OUTBOX_BATCH_SIZE=20
OUTBOX_LOCK_TIMEOUT_MS=30000

# ==============================================================================
# GATEWAY & CORE PORTS
# ==============================================================================
PORT=4000
CORS_ORIGIN=https://store.yourdomain.com,https://admin.yourdomain.com,https://seller.yourdomain.com

# Downstream Service URLs (Set to Kubernetes Service Names or Internal VPC DNS)
IDENTITY_SVC_URL=http://identity-svc:4001
CATALOG_SVC_URL=http://catalog-svc:4002
ORDER_SVC_URL=http://order-svc:4003
PAYMENT_SVC_URL=http://payment-svc:4004
FULFILLMENT_SVC_URL=http://fulfillment-svc:4005
NOTIFICATION_SVC_URL=http://notification-svc:4006

# ==============================================================================
# AUTHENTICATION & SECURITY SECRETS
# ==============================================================================
JWT_SECRET=<GENERATE_64_CHAR_HEX_SECRET>
JWT_REFRESH_SECRET=<GENERATE_64_CHAR_HEX_SECRET>
INTERNAL_GATEWAY_SECRET=<GENERATE_32_CHAR_HEX_SECRET>

# ==============================================================================
# REDIS CLUSTER CONFIGURATION
# ==============================================================================
REDIS_URL=rediss://default:<REDIS_PASSWORD>@<AWS_ELASTICACHE_HOST>:6379

# ==============================================================================
# POSTGRESQL DATABASES (AWS RDS / AURORA ENDPOINTS)
# ==============================================================================
IDENTITY_DATABASE_URL=postgresql://<USER>:<PASS>@<DB_HOST>:5432/identity_db?schema=public&sslmode=require
CATALOG_DATABASE_URL=postgresql://<USER>:<PASS>@<DB_HOST>:5432/catalog_db?schema=public&sslmode=require
ORDER_DATABASE_URL=postgresql://<USER>:<PASS>@<DB_HOST>:5432/order_db?schema=public&sslmode=require
PAYMENT_DATABASE_URL=postgresql://<USER>:<PASS>@<DB_HOST>:5432/payment_db?schema=public&sslmode=require
FULFILLMENT_DATABASE_URL=postgresql://<USER>:<PASS>@<DB_HOST>:5432/fulfillment_db?schema=public&sslmode=require
NOTIFICATION_DATABASE_URL=postgresql://<USER>:<PASS>@<DB_HOST>:5432/notification_db?schema=public&sslmode=require

# ==============================================================================
# PAYMENT PROVIDER (RAZORPAY LIVE)
# ==============================================================================
PAYMENT_PROVIDER_MODE=live
RAZORPAY_KEY_ID=rzp_live_<YOUR_RAZORPAY_KEY_ID>
RAZORPAY_KEY_SECRET=<YOUR_RAZORPAY_KEY_SECRET>
RAZORPAY_WEBHOOK_SECRET=<YOUR_RAZORPAY_WEBHOOK_SECRET>

# ==============================================================================
# NOTIFICATION PROVIDERS (EMAIL & SMS)
# ==============================================================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=<YOUR_SENDGRID_OR_SES_API_KEY>
SMTP_FROM=orders@yourdomain.com

SMS_PROVIDER_MODE=live
SMS_API_KEY=<YOUR_SMS_GATEWAY_API_KEY>
SMS_SENDER_ID=MYSHOP

# ==============================================================================
# LOGISTICS & COURIER ADAPTERS
# ==============================================================================
COURIER_PROVIDER_MODE=live
DELHIVERY_API_TOKEN=<YOUR_DELHIVERY_TOKEN>
BLUEDART_API_KEY=<YOUR_BLUEDART_KEY>
BLUEDART_API_SECRET=<YOUR_BLUEDART_SECRET>
EKART_CLIENT_ID=<YOUR_EKART_CLIENT_ID>
EKART_CLIENT_SECRET=<YOUR_EKART_CLIENT_SECRET>

# ==============================================================================
# CLOUDINARY MEDIA CDN
# ==============================================================================
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
```
