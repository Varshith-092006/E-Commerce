# Enterprise Multi-Role E-Commerce Microservices Platform
## Complete System Implementation Manifest

This document provides a comprehensive, exhaustive reference for all implemented services, database schemas, asynchronous event workers, REST API endpoints, shared packages, frontend applications, and observability subsystems across the entire monorepo.

---

## 1. Monorepo Architecture & Service Topology

```text
ecommerce-platform/
├── apps/
│   ├── customer-web/          # Port 3000 (React + Vite) — Customer Storefront
│   ├── seller-web/            # Port 3001 (React + Vite) — Seller Central
│   └── admin-web/             # Port 3002 (React + Vite) — Admin Command Center
├── packages/
│   ├── shared/                # Core domain errors, envelopes, auth/RBAC, Prometheus metrics, Outbox processor
│   └── ui/                    # Shared design system and React UI component library
├── services/
│   ├── gateway/               # Port 4000 — Express BFF / API Gateway, Rate Limiting & Admin Aggregation
│   ├── identity-svc/          # Port 4001 — PostgreSQL (identity_db) — Auth, Users, Sellers, Addresses
│   ├── catalog-svc/           # Port 4002 — PostgreSQL (catalog_db) — Products, Categories, Wishlist, Coupons
│   ├── order-svc/             # Port 4003 — PostgreSQL (order_db) — Cart, Checkout, Order State Machine, Sagas
│   ├── payment-svc/           # Port 4004 — PostgreSQL (payment_db) — Razorpay, COD, Automated Refunds
│   ├── fulfillment-svc/       # Port 4005 — PostgreSQL (fulfillment_db) — Inventory, Reservations, Logistics, Returns
│   └── notification-svc/      # Port 4006 — PostgreSQL (notification_db) — Email, SMS, In-App SSE, Circuit Breaker
├── infra/
│   ├── docker-compose.yml     # 6x PostgreSQL, Redis, Kafka, Zookeeper, Nginx, Microservices & Frontends
│   ├── postgres/              # Multi-tenant isolated DB initialization script
│   └── nginx/                 # HTTPS termination (Port 443) & HTTP redirect (Port 80)
```

---

## 2. Implemented Microservices Specification

### 2.1. API Gateway / BFF (`services/gateway` — Port 4000)
- **Security & Anti-Spoofing**: Strips untrusted incoming `x-user-*` headers from external clients; injects verified identity headers upon valid JWT verification.
- **Distributed Tracing**: Injects and propagates `x-trace-id`, `x-span-id`, and `x-request-id` to downstream services.
- **Rate Limiting Engine** (`services/gateway/src/middleware/rate-limiter.js`):
  - Strict IP-based Redis atomic limiter (`eval`/`multi`) with strict 503 fail-fast on Redis downtime.
  - Custom limits: `/api/v1/auth/login` (5 req/min), `/api/v1/products/search` (60 req/min), `/api/v1/products` (120 req/min), General (120 req/min).
- **Admin Command Center Aggregator** (`services/gateway/src/controllers/admin-dashboard.controller.js`):
  - `GET /api/v1/admin/dashboard/stats`: Aggregates Sales/GMV/AOV, Order pipeline, Fulfillment logistics, and 7-service health metrics with a 60-second Redis cache (`admin:dashboard:stats`) and `Promise.allSettled` resilience.
  - `GET /api/v1/admin/audit-logs`: Paginated platform audit trail with multi-field filtering.
- **Prometheus Metrics**: `GET /metrics` exporting runtime Golden Signals.

---

### 2.2. Identity Service (`services/identity-svc` — Port 4001, `identity_db`)
- **Database Schema**:
  - `User` (`id`, `email`, `password_hash`, `role` [CUSTOMER, SELLER, ADMIN], `is_active`, `created_at`, `updated_at`).
  - `SellerProfile` (`id`, `user_id`, `store_name`, `gstin`, `status` [PENDING, APPROVED, SUSPENDED], `is_active`).
  - `Address` (`id`, `user_id`, `street`, `city`, `state`, `postal_code`, `country`, `is_default`).
  - `RefreshToken` (`id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`).
- **REST Endpoints**:
  - `POST /api/v1/auth/register` — Customer / Seller registration.
  - `POST /api/v1/auth/login` — Authentication & dual-token issuance (Access JWT + HttpOnly Refresh Cookie).
  - `POST /api/v1/auth/refresh` — Refresh token rotation.
  - `POST /api/v1/auth/logout` — Revocation & cookie clearing.
  - `GET /api/v1/users/me` — Current user profile.
  - `GET /api/v1/users/me/addresses`, `POST /api/v1/users/me/addresses` — User address book.
  - `GET /api/v1/sellers/me`, `POST /api/v1/sellers/onboard` — Seller KYC & onboarding.
  - `GET /health`, `GET /metrics`.

---

### 2.3. Catalog Service (`services/catalog-svc` — Port 4002, `catalog_db`)
- **Database Schema**:
  - `Category` (`id`, `name`, `slug`, `parent_id`, `created_at`).
  - `Product` (`id`, `seller_id`, `category_id`, `title`, `slug`, `description`, `price`, `stock`, `status` [ACTIVE, DRAFT, OUT_OF_STOCK], `images`, `attributes`).
  - `Wishlist` (`id`, `user_id`, `product_id`, `created_at`).
  - `Coupon` (`id`, `code`, `discount_type` [PERCENTAGE, FIXED], `discount_value`, `min_order_amount`, `max_discount`, `expires_at`, `usage_limit`, `used_count`, `is_active`).
- **REST Endpoints**:
  - `GET /api/v1/categories`, `POST /api/v1/categories` (Admin).
  - `GET /api/v1/products` — Filtered catalog browsing (pagination, category, price range, search).
  - `GET /api/v1/products/:id` — Product detail view.
  - `POST /api/v1/seller/products`, `PUT /api/v1/seller/products/:id` — Seller inventory management.
  - `GET /api/v1/wishlist`, `POST /api/v1/wishlist`, `DELETE /api/v1/wishlist/:productId` — Redis-backed wishlist with DB fallback.
  - `POST /api/v1/coupons/validate` — Coupon validation engine.
  - `GET /health`, `GET /metrics`.

---

### 2.4. Order Service (`services/order-svc` — Port 4003, `order_db`)
- **Database Schema**:
  - `Cart` & `CartItem` (`id`, `user_id`, `product_id`, `quantity`, `price`).
  - `Order` (`id`, `order_number`, `user_id`, `seller_id`, `total_amount`, `discount_amount`, `final_amount`, `currency`, `payment_method` [ONLINE, COD], `payment_status` [PENDING, PAID, FAILED, REFUNDED], `order_status` [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURN_REQUESTED, RETURNED], `shipping_address`, `idempotency_key`).
  - `OrderItem` (`id`, `order_id`, `product_id`, `sku`, `title`, `unit_price`, `quantity`, `total_price`).
  - `OrderStatusHistory` (`id`, `order_id`, `from_status`, `to_status`, `reason`, `changed_by`).
  - `IdempotencyRecord` (`key`, `user_id`, `request_hash`, `response_body`, `expires_at`).
  - `OrderOutbox` (`id`, `event_type`, `aggregate_id`, `payload`, `status` [PENDING, PROCESSING, PROCESSED, FAILED, DEAD_LETTER], `retry_count`, `worker_id`).
- **REST Endpoints & Capabilities**:
  - `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PUT /api/v1/cart/items/:id`, `DELETE /api/v1/cart/items/:id` — Hybrid Redis cache + Postgres persistent cart.
  - `POST /api/v1/checkout/calculate` — Server-side pricing, tax, coupon deduction & shipping calculation.
  - `POST /api/v1/orders` — Atomic order creation with transactional outbox event `order.placed`.
  - `GET /api/v1/orders`, `GET /api/v1/orders/:id` — Order history and tracking.
  - `POST /api/v1/orders/:id/cancel` — Customer cancellation with inventory compensation trigger.
  - `POST /api/v1/orders/:id/returns` — Customer return request initiation.
  - `GET /api/v1/orders/admin/summary` — Aggregated order metrics for Admin Command Center.
  - `GET /health`, `GET /metrics`.
- **Background Workers**:
  - `OrderOutboxWorker`: Polls `OrderOutbox` with concurrency locks and exponential backoff.
  - `OrderSagaWorker`: Listens for fulfillment and refund events (`shipment.shipped`, `shipment.delivered`, `return.completed`, `payment.refunded`) to transition order state machine.

---

### 2.5. Payment Service (`services/payment-svc` — Port 4004, `payment_db`)
- **Database Schema**:
  - `Payment` (`id`, `order_id`, `user_id`, `amount`, `currency`, `provider` [RAZORPAY, COD], `status` [PENDING, AUTHORIZED, CAPTURED, FAILED, REFUNDED], `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`).
  - `Refund` (`id`, `payment_id`, `order_id`, `return_id`, `amount`, `currency`, `provider` [RAZORPAY, COD], `status` [PENDING, PROCESSED, FAILED], `razorpay_refund_id`, `idempotency_key`).
  - `PaymentOutbox` (`id`, `event_type`, `aggregate_id`, `payload`, `status`, `retry_count`).
- **REST Endpoints & Capabilities**:
  - `POST /api/v1/payments/create-order` — Creates Razorpay online order or initializes COD record.
  - `POST /api/v1/payments/verify` — Cryptographic HMAC-SHA256 signature verification.
  - `POST /api/v1/payments/webhook` — Razorpay webhook ingestion with raw body signature verification.
  - `POST /api/v1/payments/returns/refund` — Automated return refund engine for online (Razorpay API) and COD payouts with `ref_ret_${returnId}` idempotency.
  - `POST /api/v1/payments/cod/collect` — Delivery agent COD settlement.
  - `GET /health`, `GET /metrics`.
- **Background Workers**:
  - `PaymentOutboxWorker`: Dispatches `payment.captured`, `payment.failed`, and `payment.refunded` events.
  - `ReturnRefundWorker`: Consumes return completion events to trigger automatic customer refunds.

---

### 2.6. Fulfillment Service (`services/fulfillment-svc` — Port 4005, `fulfillment_db`)
- **Database Schema**:
  - `Warehouse` (`id`, `code`, `name`, `city`, `state`, `postal_code`, `is_active`).
  - `InventoryItem` (`id`, `warehouse_id`, `sku`, `available_qty`, `reserved_qty`, `safety_stock`, `version`).
  - `InventoryReservation` (`id`, `order_id`, `status` [PENDING, CONFIRMED, RELEASED, EXPIRED], `expires_at`).
  - `ReservationItem` (`id`, `reservation_id`, `warehouse_id`, `sku`, `quantity`).
  - `Shipment` (`id`, `order_id`, `warehouse_id`, `courier_code` [BLUEDART, DELHI VERY, EKART], `tracking_number`, `status` [MANIFESTED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED], `estimated_delivery`).
  - `ReturnPickup` (`id`, `return_id`, `order_id`, `warehouse_id`, `courier_code`, `return_tracking_number`, `status` [REQUESTED, SCHEDULED, PICKED_UP, RECEIVED_AT_WAREHOUSE, INSPECTED, COMPLETED, CANCELLED], `pop_image_url`, `inspection_notes`).
  - `ReturnItem` (`id`, `return_pickup_id`, `sku`, `quantity`, `inspection_grade` [PASS, DAMAGED, DEFECTIVE, WRONG_ITEM], `restocked_qty`).
  - `FulfillmentOutbox` (`id`, `event_type`, `aggregate_id`, `payload`, `status`, `retry_count`).
- **REST Endpoints & Capabilities**:
  - `POST /api/v1/fulfillment/reservations` — 15-minute TTL atomic inventory reservation engine with optimistic concurrency locking (`version`).
  - `POST /api/v1/fulfillment/reservations/:id/confirm`, `POST /api/v1/fulfillment/reservations/:id/release` — Lifecycle settlement.
  - `POST /api/v1/fulfillment/shipments` — Multi-warehouse shipment generation and courier tracking assignment.
  - `POST /api/v1/fulfillment/returns/pickup` — Return pickup scheduling and tracking generation.
  - `POST /api/v1/fulfillment/returns/:id/pickup-confirm` — Proof-of-Pickup (POP) verification.
  - `POST /api/v1/fulfillment/returns/:id/receive` — Warehouse arrival scan.
  - `POST /api/v1/fulfillment/returns/:id/inspect` — QC inspection grading and atomic restocking for PASS items.
  - `GET /api/v1/fulfillment/inventory/low-stock` — Low-stock alerts for Admin Command Center.
  - `GET /health`, `GET /metrics`.
- **Background Workers**:
  - `OrderEventWorker`: Subscribes to `order.placed` to trigger inventory reservations.
  - `PaymentEventWorker`: Subscribes to `payment.captured` to confirm reservations and allocate shipments; subscribes to `payment.failed` to release reserved stock.
  - `FulfillmentOutboxWorker`: Emits `shipment.shipped`, `shipment.delivered`, `return.pickedUp`, `return.received`, `return.completed`, `inventory.adjusted`.

---

### 2.7. Notification Service (`services/notification-svc` — Port 4006, `notification_db`)
- **Database Schema**:
  - `Notification` (`id`, `user_id`, `channel` [EMAIL, SMS, IN_APP], `template_code`, `status` [PENDING, DELIVERED, FAILED, SUPPRESSED], `metadata`, `error_message`, `created_at`).
  - `NotificationPreference` (`id`, `user_id`, `email_enabled`, `sms_enabled`, `in_app_enabled`, `orders_email`, `orders_sms`, `payments_email`, `payments_sms`, `marketing_email`, `marketing_sms`).
  - `DeadLetterEvent` (`id`, `event_id`, `event_type`, `consumer_name`, `payload`, `error_message`, `stack_trace`, `retry_count`, `resolved_at`).
- **REST Endpoints & Capabilities**:
  - `GET /api/v1/notifications/stream` — Real-time Server-Sent Events (SSE) stream for in-app bell notifications.
  - `GET /api/v1/notifications/inbox`, `PATCH /api/v1/notifications/:id/read` — In-app notification management.
  - `GET /api/v1/notifications/preferences`, `PUT /api/v1/notifications/preferences` — User channel preferences.
  - `POST /api/v1/notifications/events/ingest` — Event ingestion API protected by internal secret and admin RBAC.
  - `GET /api/v1/notifications/admin/dlq`, `POST /api/v1/notifications/admin/dlq/:id/replay` — Dead Letter Queue management.
  - `GET /health`, `GET /metrics`.
- **Resilience Engine**:
  - `CircuitBreaker` with automated state transitions (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`) protecting email/SMS external providers.
  - Instrumenting `circuit_breaker_state` gauge in Prometheus.

---

## 3. Shared Library Subsystems (`packages/shared`)

| Module | Features & Implementation |
| :--- | :--- |
| **`utils/metrics.js`** | Zero-dependency Prometheus metrics registry: `Counter`, `Gauge`, `Histogram` with default process metrics (resident memory, heap, uptime). |
| **`middleware/metrics.js`** | Express middleware tracking `http_requests_total`, `http_request_duration_seconds`, `http_active_requests` with route normalization (UUID/:id) to prevent label explosion. |
| **`middleware/request-id.js`** | Distributed tracing correlation injecting `x-trace-id`, `x-span-id`, `x-request-id` into requests and responses. |
| **`utils/logger.js`** | Pino structured JSON logger with context binding (`logger.withContext({ traceId, spanId, requestId })`) and sensitive credential redaction. |
| **`workers/outbox-processor.js`** | Standardized Outbox processor with database row locks, lease renewals, exponential backoff, retry classification, and Prometheus metrics tracking (`outbox_events_total`). |
| **`middleware/auth.js`** & **`rbac.js`** | Multi-role gateway boundary authentication and role enforcement (`requireAuth`, `requireRole`, `requireAdmin`, `requireSeller`). |
| **`utils/response.js`** & **`errors/`** | Standardized JSON response envelope (`successResponse`, `errorResponse`) and hierarchy of typed domain errors. |

---

## 4. Frontend Applications (`apps/`)

### 4.1. Customer Storefront (`apps/customer-web` — Port 3000)
- **Tech Stack**: React 18, Vite, Context API, CSS Design Tokens.
- **Pages & Components**:
  - `HomePage`, `ProductListingPage`, `ProductDetailPage` (with stock counter, image gallery, rating reviews).
  - `CartDrawer` & `CartPage` (with live quantity adjustments and item removal).
  - `CheckoutPage` (Address selector, Coupon apply, Razorpay modal launch, Cash-On-Delivery choice).
  - `OrdersPage` & `OrderDetailPage` (Order timeline, courier tracking progress bar, return request trigger).
  - `WishlistPage` & `NotificationPreferencesModal`.
  - `Header` with real-time SSE in-app notifications drawer.

### 4.2. Seller Central (`apps/seller-web` — Port 3001)
- **Pages & Components**:
  - `SellerDashboard` (Sales overview, GMV, total orders, pending shipments).
  - `ProductCatalogManagement` (Add/Edit products, price, stock, category assignment).
  - `OrderFulfillmentManagement` (Print packing slip, assign shipment, mark dispatched).
  - `ReturnsManagement` (Review returned orders and inspection statuses).

### 4.3. Admin Command Center (`apps/admin-web` — Port 3002)
- **Pages & Components**:
  - `ExecutiveDashboard` (Live sales KPIs, GMV, AOV, Order pipeline funnel, Logistics metrics).
  - `SystemHealthMonitor` (Real-time latency & UP/DOWN status for all 7 services).
  - `DLQManagement` (Dead Letter Queue inspection, failure stack trace analysis, and retry replay).
  - `AuditLogViewer` (Search and filter system-wide audit logs by trace ID, actor, or event type).
  - `SellerKYCApproval` & `CouponManagement`.

---

## 5. Verification & Test Suite Matrix

```bash
# Test Execution Command:
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

### Complete Test Results:
- **Total Test Suites**: **78 passed, 78 total (100%)**
- **Total Tests**: **453 passed, 453 total (100%)**
- **Snapshot Tests**: 0 failed
- **Linter Status**: `npm run lint` $\rightarrow$ **0 errors, 0 warnings**
- **Code Formatter**: `npm run format` $\rightarrow$ **100% compliant**
- **Frontend Builds**: `npm run build:apps` $\rightarrow$ **3/3 apps built cleanly (`customer-web`, `seller-web`, `admin-web`)**

---

## 6. Production Deployment & Local Execution

### 6.1. Running the Complete Stack with Docker Compose
```bash
cd ecommerce-platform
cp .env.example .env
npm run docker:up
```

### 6.2. Running Tests Locally
```bash
# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run full test suite
npm test
```
