# Environment Variables Documentation

This document describes all environment variables used throughout the Ecommerce Platform, categorized by system domain and classification.

---

## Variable Classification Guide

- **REQUIRED**: Must be provided in all environments (or explicitly in production) for the service to function securely and properly.
- **OPTIONAL**: Enhances functionality or overrides sensible defaults. Fallback exists.
- **DEV ONLY**: For local development convenience. Must NOT be used in production.
- **TEST ONLY**: Used during automated testing or mock modes.
- **PRODUCTION ONLY**: Enforced strictly in production (missing values will abort startup).

---

## 1. Global & Security

| Variable | Classification | Default / Fallback | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | **REQUIRED** | `development` | Application runtime environment (`development`, `production`, `test`). |
| `INTERNAL_GATEWAY_SECRET` | **PRODUCTION ONLY** / **REQUIRED** | `ecom_internal_mesh_secret_dev_2026` (Dev only) | Service mesh trust token injected by Gateway to authenticate internal service requests. |
| `JWT_SECRET` | **PRODUCTION ONLY** / **REQUIRED** | `ecom_super_secret_jwt_key_development_only_change_in_prod_2026` (Dev only) | HMAC-SHA256 secret key for issuing and validating customer/seller/admin JWT access tokens. |
| `PORT` | **OPTIONAL** | Per-service default (`4000`-`4006`) | HTTP listener port for the service. |
| `CORS_ORIGIN` | **OPTIONAL** | `http://localhost:3000,http://localhost:3001,http://localhost:3002` | Comma-separated list of allowed CORS origins for API Gateway. |
| `RATE_LIMIT_WINDOW_SECONDS` | **OPTIONAL** | `60` | IP rate limiter window duration in seconds. |
| `RATE_LIMIT_MAX_REQUESTS` | **OPTIONAL** | `120` | Max allowed requests per IP within the rate limit window. |

---

## 2. Databases (PostgreSQL per-service)

| Variable | Classification | Description |
| :--- | :--- | :--- |
| `IDENTITY_DB_URL` / `DATABASE_URL` | **REQUIRED** | PostgreSQL connection string for `identity-svc` (e.g. `postgresql://postgres:postgrespassword@localhost:5432/identity_db?schema=public`). |
| `CATALOG_DB_URL` / `DATABASE_URL` | **REQUIRED** | PostgreSQL connection string for `catalog-svc` (`catalog_db`). |
| `ORDER_DB_URL` / `DATABASE_URL` | **REQUIRED** | PostgreSQL connection string for `order-svc` (`order_db`). |
| `PAYMENT_DB_URL` / `DATABASE_URL` | **REQUIRED** | PostgreSQL connection string for `payment-svc` (`payment_db`). |
| `FULFILLMENT_DB_URL` / `DATABASE_URL` | **REQUIRED** | PostgreSQL connection string for `fulfillment-svc` (`fulfillment_db`). |
| `NOTIFICATION_DB_URL` / `DATABASE_URL` | **REQUIRED** | PostgreSQL connection string for `notification-svc` (`notification_db`). |

---

## 3. Shared Caching & Rate Limiting (Redis)

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `REDIS_URL` | **REQUIRED** | `redis://localhost:6379` | Redis connection URL for distributed locking, rate limiting, and cart storage. |

---

## 4. Event Bus & Messaging (Kafka)

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `KAFKA_BROKERS` | **REQUIRED** | `localhost:9092` (host) / `kafka:29092` (docker) | Comma-separated list of Kafka broker bootstrap servers. |
| `KAFKA_CLIENT_ID` | **OPTIONAL** | `ecommerce-platform` | Client identifier for Kafka connections. |
| `KAFKA_SECURITY_PROTOCOL` | **OPTIONAL** | `PLAINTEXT` | Protocol for Kafka communication (`PLAINTEXT`, `SSL`, `SASL_PLAINTEXT`, `SASL_SSL`). |
| `KAFKA_SASL_MECHANISM` | **OPTIONAL** | `PLAIN` | SASL authentication mechanism (`PLAIN`, `SCRAM-SHA-256`, `SCRAM-SHA-512`). |
| `KAFKA_USERNAME` | **OPTIONAL** | (empty) | Username for SASL authentication. |
| `KAFKA_PASSWORD` | **OPTIONAL** | (empty) | Password for SASL authentication. |
| `USE_KAFKA` | **OPTIONAL** | `true` | Boolean flag to enable/disable Kafka integration. |
| `START_KAFKA_CONSUMERS` | **OPTIONAL** | `true` | Set to `false` to disable starting background consumers. |
| `START_OUTBOX_WORKERS` | **OPTIONAL** | `true` | Set to `false` to disable starting transactional outbox polling workers. |

---

## 5. Downstream Service URLs (Gateway & Inter-service)

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `IDENTITY_SVC_URL` | **REQUIRED** | `http://localhost:4001` | Base URL for Identity Service. |
| `CATALOG_SVC_URL` | **REQUIRED** | `http://localhost:4002` | Base URL for Catalog Service. |
| `ORDER_SVC_URL` | **REQUIRED** | `http://localhost:4003` | Base URL for Order Service. |
| `PAYMENT_SVC_URL` | **REQUIRED** | `http://localhost:4004` | Base URL for Payment Service. |
| `FULFILLMENT_SVC_URL` | **REQUIRED** | `http://localhost:4005` | Base URL for Fulfillment Service. |
| `NOTIFICATION_SVC_URL` | **REQUIRED** | `http://localhost:4006` | Base URL for Notification Service. |

---

## 6. External Providers & Integrations

### A. Email Provider (Nodemailer / SMTP)

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `SMTP_HOST` | **PRODUCTION ONLY** | (empty) | SMTP server hostname (e.g. `smtp.sendgrid.net`, `smtp.gmail.com`). |
| `SMTP_PORT` | **OPTIONAL** | `587` | SMTP port (`587` for TLS, `465` for SSL). |
| `SMTP_SECURE` | **OPTIONAL** | `false` | Set to `true` if port 465 SSL is used. |
| `SMTP_USER` | **PRODUCTION ONLY** | (empty) | SMTP username or API key user. |
| `SMTP_PASS` | **PRODUCTION ONLY** | (empty) | SMTP password or API token. |
| `SMTP_FROM` | **OPTIONAL** | `no-reply@ecommerce.local` | Default sender email address. |
| `SMTP_TIMEOUT_MS` | **OPTIONAL** | `10000` | Socket/connection timeout in milliseconds. |
| `SMTP_MOCK` | **TEST / DEV ONLY** | `false` | Explicitly forces in-memory mock email mode. |

### B. SMS Provider (Twilio)

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `TWILIO_ACCOUNT_SID` | **PRODUCTION ONLY** | (empty) | Twilio Account SID. |
| `TWILIO_AUTH_TOKEN` | **PRODUCTION ONLY** | (empty) | Twilio Auth Token. |
| `TWILIO_FROM_NUMBER` | **PRODUCTION ONLY** | (empty) | Twilio E.164 phone number. |
| `SMS_TIMEOUT_MS` | **OPTIONAL** | `10000` | Request timeout in milliseconds. |
| `SMS_MOCK` | **TEST / DEV ONLY** | `false` | Explicitly forces in-memory mock SMS mode. |

### C. Payment Gateway (Razorpay)

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `RAZORPAY_KEY_ID` | **PRODUCTION ONLY** | (empty) | Razorpay API Key ID. |
| `RAZORPAY_KEY_SECRET` | **PRODUCTION ONLY** | (empty) | Razorpay Secret Key. |
| `RAZORPAY_WEBHOOK_SECRET` | **PRODUCTION ONLY** | (empty) | Webhook signature verification secret. |

### D. Courier Adapters (Delhivery & Shiprocket)

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `DELHIVERY_API_TOKEN` | **OPTIONAL** | (empty) | Delhivery API authorization token (uses mock fallback if omitted). |
| `DELHIVERY_BASE_URL` | **OPTIONAL** | `https://track.delhivery.com/api` | Delhivery REST API endpoint. |
| `SHIPROCKET_EMAIL` | **OPTIONAL** | (empty) | Shiprocket registered user email. |
| `SHIPROCKET_PASSWORD` | **OPTIONAL** | (empty) | Shiprocket registered account password. |
| `SHIPROCKET_CHANNEL_ID` | **OPTIONAL** | (empty) | Shiprocket Channel ID identifier. |
| `SHIPROCKET_BASE_URL` | **OPTIONAL** | `https://apiv2.shiprocket.in/v1/external` | Shiprocket API endpoint. |
| `SHIPROCKET_TIMEOUT_MS`| **OPTIONAL** | `15000` | Request timeout in milliseconds. |

---

## 7. Monitoring & Worker Configuration

| Variable | Classification | Default | Description |
| :--- | :--- | :--- | :--- |
| `GRAFANA_ADMIN_PASSWORD` | **OPTIONAL** | `changeme` | Initial admin password for Grafana dashboard. |
| `OUTBOX_POLL_INTERVAL_MS`| **OPTIONAL** | `5000` | Polling frequency for notification outbox worker. |
| `OUTBOX_BATCH_SIZE` | **OPTIONAL** | `10` | Maximum outbox records claimed per cycle. |
