# My Personal Project Learning Roadmap

> **Custom Progressive Mastery Roadmap from 20% to 100% Engineering Fluency**  
> *Target*: Senior Backend & Distributed Systems Mastery of [`ecommerce-platform/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/)

---

## Roadmap Overview

```
LEVEL 1: Foundations (JavaScript ES Modules, Node.js, HTTP, REST, Basic SQL)
   ↓
LEVEL 2: Core Backend Stack (Express, PostgreSQL, Redis, JWT, Docker Basics)
   ↓
LEVEL 3: Microservices & Perimeter (API Gateway, Nginx, Docker Compose, Monorepo Architecture)
   ↓
LEVEL 4: Asynchronous Events (Kafka, Partitions, Consumer Groups, Transactional Outbox, Idempotency)
   ↓
LEVEL 5: Production Reliability (Circuit Breakers, Bulkheads, Load Shedding, Prometheus/Grafana)
   ↓
LEVEL 6: Advanced Operations (Chaos Engineering, Disaster Recovery, Schema Governance, Enterprise Scale)
```

---

## LEVEL 1: Foundations

### 1.1 JavaScript ES Modules & Async/Await
* **What you must learn**: ES Module imports/exports, Promise lifecycle, `async`/`await`, `try`/`catch`, handling unhandled rejections.
* **Why you need it**: The entire codebase is written using modern native ES Modules (`"type": "module"`).
* **Part of project using it**: Every single file in [`services/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/) and [`packages/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/).
* **Prerequisite**: Basic programming concepts.
* **What mastery looks like**: You can trace asynchronous execution order without confusion; you know exactly why forgetting `await` causes silent failures.
* **Practical exercise**: Open [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js) and trace how `generateToken` and `verifyToken` return Promises.

### 1.2 HTTP Protocol & REST Conventions
* **What you must learn**: Methods (`GET`, `POST`, `PUT`, `DELETE`), status codes (200, 201, 400, 401, 403, 404, 409, 500, 503), headers (`Authorization`, `Content-Type`, `X-Correlation-ID`).
* **Why you need it**: HTTP is the communication bridge between browsers, Nginx, Gateway, and internal microservices.
* **Part of project using it**: All controllers in [`services/*/src/controllers/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/src/controllers/).
* **Prerequisite**: Basic web networking.
* **What mastery looks like**: You immediately know which status code to return for validation errors (400), authentication failures (401), unauthorized actions (403), and missing resources (404).
* **Practical exercise**: Inspect [`docs/POSTMAN_API_TESTING_GUIDE.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/POSTMAN_API_TESTING_GUIDE.md) and note the exact status code returned by each endpoint.

### 1.3 Relational SQL Basics
* **What you must learn**: Tables, primary keys, foreign keys, unique constraints, data types (UUID, VARCHAR, INT, TIMESTAMP), `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
* **Why you need it**: All 6 business services persist transactional data into PostgreSQL tables.
* **Part of project using it**: [`infra/postgres/init-databases.sql`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/postgres/init-databases.sql).
* **Prerequisite**: Basic database concepts.
* **What mastery looks like**: You can write a query with constraints and indexes without relying blindly on an ORM.
* **Practical exercise**: Read [`infra/postgres/init-databases.sql`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/postgres/init-databases.sql) and identify all 6 databases created on boot.

---

## LEVEL 2: Core Backend Stack

### 2.1 Express.js & Middleware Chaining
* **What you must learn**: Express routing, middleware execution sequence `(req, res, next)`, error handling middleware `(err, req, res, next)`.
* **Why you need it**: Express powers the API Gateway and every microservice.
* **Part of project using it**: Entry points in [`services/*/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/src/server.js).
* **Prerequisite**: Level 1.
* **What mastery looks like**: You can write custom middleware for request logging, error catching, and header manipulation.
* **Practical exercise**: Open [`packages/shared/src/middleware/correlation.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/middleware/correlation.js) and see how it reads or creates `x-correlation-id`.

### 2.2 PostgreSQL & Prisma ORM
* **What you must learn**: Prisma schema definition (`schema.prisma`), Prisma migrations (`npx prisma migrate dev`), `prisma.$transaction()`.
* **Why you need it**: Prisma models database entities and provides type-safe database queries across the services.
* **Part of project using it**: [`services/order-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/order-svc/prisma/schema.prisma).
* **Prerequisite**: SQL basics.
* **What mastery looks like**: You can model one-to-many relationships and execute atomic transactions using Prisma.
* **Practical exercise**: Open [`services/order-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/order-svc/prisma/schema.prisma) and locate the `Order`, `OrderItem`, and `OutboxEvent` models.

### 2.3 Redis & Cache-Aside
* **What you must learn**: In-memory key-value data structures, TTL (Time-to-Live), cache-aside reads, cache invalidation upon writes.
* **Why you need it**: Redis protects PostgreSQL from read-heavy catalog queries and stores distributed rate-limiting counters.
* **Part of project using it**: [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js) and [`services/catalog-svc/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/catalog-svc/).
* **Prerequisite**: Key-value data concept.
* **What mastery looks like**: You can explain why caching authoritative financial balances or inventory counts in Redis without distributed locks causes critical concurrency bugs.
* **Practical exercise**: Inspect [`docs/BACKEND_CACHING_AUDIT_AND_RECOMMENDATIONS.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/BACKEND_CACHING_AUDIT_AND_RECOMMENDATIONS.md) to see what is safe to cache vs what is forbidden.

### 2.4 JWT Authentication & Bcrypt Password Hashing
* **What you must learn**: Salt rounds, one-way password hashing, JWT creation, token verification, payload decoding.
* **Why you need it**: User authentication and API access control.
* **Part of project using it**: [`services/identity-svc/src/services/identity.service.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/src/services/identity.service.js).
* **Prerequisite**: HTTP headers & hashing concepts.
* **What mastery looks like**: You can explain why passwords must never be stored in plain text and why JWTs are stateless.
* **Practical exercise**: Look at [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js) and note how `JWT_SECRET` is required in production without fallback.

### 2.5 Docker Basics
* **What you must learn**: Containers vs images, Dockerfile instructions (`FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`), container ports vs host ports.
* **Why you need it**: All 16 components of this platform run inside Docker containers.
* **Part of project using it**: `services/*/Dockerfile`.
* **Prerequisite**: Basic command line navigation.
* **What mastery looks like**: You understand that `localhost:5432` inside a container refers to the container itself, not the host machine or another container.
* **Practical exercise**: Read [`services/gateway/Dockerfile`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/Dockerfile) and explain what each line does.

---

## LEVEL 3: Microservices & Perimeter Architecture

### 3.1 Microservices Architecture & Database-per-Service
* **What you must learn**: Service autonomy, domain boundaries, why shared databases create fatal coupling.
* **Why you need it**: The fundamental architectural pattern of the entire platform.
* **Part of project using it**: All 7 microservices in [`services/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/).
* **Prerequisite**: Level 2.
* **What mastery looks like**: You can explain why `order-svc` cannot directly query `identity_db` to get a customer's email.
* **Practical exercise**: Review [`docs/PROJECT-ARCHITECTURE-WALKTHROUGH.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/PROJECT-ARCHITECTURE-WALKTHROUGH.md).

### 3.2 Nginx Edge Proxy & Edge Hardening
* **What you must learn**: Reverse proxying, TLS termination, `limit_req_zone`, `client_max_body_size`, header sanitation.
* **Why you need it**: Protects Node.js services from the public internet and offloads static assets.
* **Part of project using it**: [`infra/nginx/nginx.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/nginx.conf) and [`docs/production/EDGE-ARCHITECTURE.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/production/EDGE-ARCHITECTURE.md).
* **Prerequisite**: HTTP & Docker networking.
* **What mastery looks like**: You can configure rate limits and upstream keep-alive connections in Nginx.
* **Practical exercise**: Open [`infra/nginx/conf.d/default.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/conf.d/default.conf) and find the upstream definition for `gateway:3000`.

### 3.3 Express API Gateway & Proxy Routing
* **What you must learn**: Gateway routing, path rewriting, injecting `x-user-id` and `x-user-role`, verifying tokens at the edge.
* **Why you need it**: Single entry point for all frontend client API calls.
* **Part of project using it**: [`services/gateway/src/routes/proxy.routes.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/routes/proxy.routes.js).
* **Prerequisite**: Express & JWT.
* **What mastery looks like**: You can add a new proxy route connecting a new service path to an internal container.
* **Practical exercise**: Read [`services/gateway/src/routes/proxy.routes.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/routes/proxy.routes.js) and see how `/api/v1/orders` rewrites to the order service.

### 3.4 Docker Compose & Bridge Networks
* **What you must learn**: Multi-container orchestration, named volumes, environment variable interpolation, container DNS resolution.
* **Why you need it**: Starts and connects all 16 platform containers with a single command (`npm run docker:up`).
* **Part of project using it**: [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml).
* **Prerequisite**: Docker basics.
* **What mastery looks like**: You can explain how `http://order-svc:3003` resolves over the internal `ecommerce-net` bridge network.
* **Practical exercise**: Open [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml) and inspect the `networks:` and `volumes:` sections at the bottom.

---

## LEVEL 4: Asynchronous Events & Kafka

### 4.1 Apache Kafka Fundamentals
* **What you must learn**: Topics, partitions, partition keys, offsets, commit logs, producer vs consumer.
* **Why you need it**: Kafka is the backbone for asynchronous communication across the platform.
* **Part of project using it**: [`packages/shared/src/kafka/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/) and [`docs/events/EVENT-CATALOG.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/events/EVENT-CATALOG.md).
* **Prerequisite**: Level 3.
* **What mastery looks like**: You can explain why events with the same `orderId` partition key always land on the exact same partition and are processed strictly in order.
* **Practical exercise**: Check the 6 active topics defined in [`docs/events/EVENT-CATALOG.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/events/EVENT-CATALOG.md).

### 4.2 The Dual-Write Problem & Transactional Outbox
* **What you must learn**: Why writing to PostgreSQL and publishing to Kafka in the same function fails during network crashes; `SELECT ... FOR UPDATE SKIP LOCKED`.
* **Why you need it**: Guarantees zero message loss during crashes.
* **Part of project using it**: [`packages/shared/src/kafka/transactional-outbox.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/transactional-outbox.js).
* **Prerequisite**: PostgreSQL transactions & Kafka.
* **What mastery looks like**: You can draw the complete lifecycle: DB Insert -> Outbox Table -> Poller -> Kafka -> Mark Published.
* **Practical exercise**: Open [`packages/shared/src/kafka/transactional-outbox.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/transactional-outbox.js) and locate the query containing `FOR UPDATE SKIP LOCKED`.

### 4.3 At-Least-Once Delivery & Idempotent Consumers
* **What you must learn**: Why Kafka can deliver the same message twice; using a `processed_events` table to ensure business actions only execute once.
* **Why you need it**: Prevents double-charging credit cards and duplicate shipments.
* **Part of project using it**: Consuming services (`payment-svc`, `fulfillment-svc`, `notification-svc`).
* **Prerequisite**: Level 4.2.
* **What mastery looks like**: You can explain the exact difference between "at-least-once delivery" and "idempotent processing".
* **Practical exercise**: Inspect the `processed_events` table schema in [`services/payment-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/payment-svc/prisma/schema.prisma).

---

## LEVEL 5: Production Reliability & Observability

### 5.1 Resilience Patterns (Circuit Breaker, Bulkhead, Load Shedding)
* **What you must learn**: Circuit breaker states (Closed, Open, Half-Open), bulkhead isolation, backpressure, load shedding under CPU saturation.
* **Why you need it**: Prevents a slow downstream service from bringing down the entire platform.
* **Part of project using it**: Gateway middleware and shared resilience utilities.
* **Prerequisite**: Level 3.
* **What mastery looks like**: You can trace how an unresponsive `payment-svc` causes the circuit breaker to trip, returning instant 503 errors and saving gateway threads.
* **Practical exercise**: Check the resilience definitions in [`docs/PROJECT-GLOSSARY.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/PROJECT-GLOSSARY.md).

### 5.2 Metrics & Observability (Prometheus & Grafana)
* **What you must learn**: Counters, Gauges, Histograms, PromQL, scrape intervals, SLIs, SLOs, P95/P99 latencies.
* **Why you need it**: Detects performance regressions and outages before users complain.
* **Part of project using it**: [`infra/prometheus/prometheus.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/prometheus/prometheus.yml) and [`docs/observability/SLOs.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/observability/SLOs.md).
* **Prerequisite**: HTTP & Linux basics.
* **What mastery looks like**: You can write a PromQL query calculating the P99 latency of checkout endpoints over the last 5 minutes.
* **Practical exercise**: Inspect [`infra/prometheus/prometheus.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/prometheus/prometheus.yml) to see which service ports are scraped.

---

## LEVEL 6: Advanced Operations

### 6.1 Chaos Engineering
* **What you must learn**: Fault injection, simulating container crashes, network latency, verifying self-healing behavior.
* **Why you need it**: Validates system resilience empirically under real failure conditions.
* **Part of project using it**: [`scripts/chaos-test.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/chaos-test.mjs) and [`docs/chaos/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/chaos/).
* **Prerequisite**: Level 5.
* **What mastery looks like**: You can execute chaos tests and observe how circuit breakers and healthchecks restore service availability.
* **Practical exercise**: Review [`docs/chaos/FAILURE-MATRIX.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/chaos/FAILURE-MATRIX.md).

### 6.2 Disaster Recovery & Recovery Reconstruction
* **What you must learn**: Backup verification, SHA-256 cryptographic manifests, dependency-ordered recovery graphs, outbox replay, consumer lag reconciliation.
* **Why you need it**: Restores the entire platform from zero infrastructure after catastrophic failure with zero data divergence.
* **Part of project using it**: [`scripts/dr/dr-reconstruction.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/dr/dr-reconstruction.mjs) and [`docs/dr/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/dr/).
* **Prerequisite**: Full platform understanding.
* **What mastery looks like**: You can walk an interviewer through how the platform restores 6 databases, verifies data equivalence, resumes Kafka outboxes, and brings consumers back to zero lag in 26.79 seconds.
* **Practical exercise**: Read [`docs/dr/DR-RECOVERY-RUNBOOK.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/dr/DR-RECOVERY-RUNBOOK.md).
