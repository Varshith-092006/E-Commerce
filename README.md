# Production-Grade Multi-Role E-Commerce Platform

This repository contains the monorepo implementation of the scalable, multi-role e-commerce platform built according to the **Master Prompt v3**, **PRD**, **Feature Breakdown Document**, and **System Architecture Specification**.

---

## 1. Monorepo Structure

```text
ecommerce-platform/
├── apps/
│   ├── customer-web/          # React (Vite) — Customer Storefront (Port 3000)
│   ├── seller-web/            # React (Vite) — Seller Central (Port 3001)
│   └── admin-web/             # React (Vite) — Admin Command Center (Port 3002)
├── packages/
│   ├── shared/                # Pure error classes, canonical codes, response envelope, logger, constants
│   └── ui/                    # Shared React UI component library (tokens, Button, Card, Badge, Modal, etc.)
├── services/
│   ├── gateway/               # Express BFF / API Gateway (Port 4000)
│   ├── identity-svc/          # Auth, users, sellers, addresses (Port 4001, identity_db)
│   ├── catalog-svc/           # Products, categories, reviews, wishlist (Port 4002, catalog_db)
│   ├── order-svc/             # Cart, orders, state machine, return orchestration (Port 4003, order_db)
│   ├── payment-svc/           # Payments, transactions, refunds (Port 4004, payment_db)
│   ├── fulfillment-svc/       # Inventory, reservations, shipments (Port 4005, fulfillment_db)
│   └── notification-svc/      # Email, SMS, notification log (Port 4006, notification_db)
├── infra/
│   ├── docker-compose.yml     # PostgreSQL, Redis, Kafka, Zookeeper, Nginx, all services/apps
│   ├── postgres/              # Database initialization scripts (6 isolated DBs)
│   └── nginx/                 # HTTPS termination (Port 443), HTTP redirect (Port 80), proxy routing
├── docs/                      # PRD, Feature Breakdown, API specifications
└── .github/workflows/         # CI pipelines
```

---

## 2. Phase Roadmap & Execution Rules

- **Phase 0 — Engineering Foundation**: Monorepo, Docker Compose, PostgreSQL (6 DBs), Redis, Kafka (infra-only), Gateway/BFF skeleton, API/error contracts, CI, lint/format, HTTPS/TLS, CORS, shared packages.
- **Phase 1 — Identity + Catalog**: Authentication, verification, JWT/sessions, RBAC, seller onboarding, products, categories, Cloudinary, browse/search, wishlist.
- **Phase 2 — Cart $\rightarrow$ Checkout $\rightarrow$ Order**: Cart, coupons, address selection, server-side checkout calculation, Razorpay, COD, idempotency, order state machine.
- **Phase 3 — Async Backbone + Fulfillment**: Kafka eventing, Outbox pattern, atomic inventory reservation (15m TTL), fulfillment, tracking, Saga compensation.
- **Phase 4 — Post-Purchase**: Returns, reverse logistics, COD refunds, notification consumers.
- **Phase 5 — Admin + Observability + Scale**: Admin operations, OpenTelemetry distributed tracing, Prometheus metrics, alerting.

---

## 3. Local Development Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose

### Quick Start
1. Clone the repository and navigate to `ecommerce-platform`:
   ```bash
   cd ecommerce-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start Docker stack (PostgreSQL, Redis, Kafka, Services, Apps, Nginx):
   ```bash
   npm run docker:up
   ```
5. Run tests:
   ```bash
   npm run test:unit
   npm run test:integration
   ```
