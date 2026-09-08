# Phase 6: Load, Stress, Spike & Soak Testing Guide

## 1. Overview & Operating Scope

Phase 6 validates the ecommerce microservices platform under operating conditions far beyond typical sustainable load. The platform comprises:
- **API Gateway / Edge Proxy**: Express.js with connection pooling, rate limiting, and priority load shedding.
- **Microservices Mesh**: Catalog, Order, Identity, Payment, Fulfillment, and Notification services.
- **Event Mesh**: Apache Kafka with confluentcp-kafka broker, zookeeper, 3-partition topics, and idempotent consumers.
- **Persistence & Caching**: PostgreSQL 16 (6 segregated databases), Redis 7 (LRU cache & rate limiter).

*All performance metrics documented herein were measured in the local Docker environment.*

---

## 2. Standard Workload Specifications

Controlled workloads isolate endpoint behavior and realistic user flows:

| Workload ID | Name | Method & Path | Auth Role | Distribution in Mixed |
|-------------|------|---------------|-----------|-----------------------|
| **Workload A** | Catalog Read | `GET /api/v1/products` | Public | 40% |
| **Workload B** | Product Detail | `GET /api/v1/products/:id` | Public | 15% |
| **Workload C** | Order Read | `GET /api/v1/orders` | CUSTOMER | 15% |
| **Workload D** | Notification Read | `GET /api/v1/notifications` | CUSTOMER | 10% |
| **Workload E** | Seller Analytics | `GET /api/v1/orders/seller/analytics/overview` | SELLER | 10% |
| **Workload F** | Admin Summary | `GET /api/v1/orders/admin/summary` | ADMIN | 10% |
| **Workload G** | Mixed Traffic | Weighted composite of A–F | Rotated | 100% |

---

## 3. Operating Zones & Latency Profiles

Empirical validation identifies four distinct operational zones:

1. **Normal Zone (0 – 250 RPS / Concurrency $\le 75$)**:
   - P95 latency: $< 50$ ms
   - CPU utilization: $< 30\%$
   - HTTP 429 / 503 count: 0
   - Kafka consumer lag: 0

2. **Sustainable Zone (250 – 350 RPS / Concurrency 75 – 150)**:
   - P95 latency: $50 – 120$ ms
   - CPU utilization: $30 – 55\%$
   - Database connections: 6 – 12 active
   - Zero load shedding or dropped requests

3. **Warning / Contention Zone (350 – 480 RPS / Concurrency 150 – 300)**:
   - P95 latency: $120 – 350$ ms
   - Gateway event-loop lag increases
   - Order DB write lock contention begins to queue transactions

4. **Saturation / Overload Zone ($> 480$ RPS / Concurrency $> 300$)**:
   - Gateway in-flight saturation ($> 150$ in-flight)
   - Centralized load shedding actively sheds `LOWER_PRIORITY` (analytics, notifications) with HTTP 503 `OVERLOAD_LOAD_SHED`
   - `CRITICAL` transactions (orders, payments) remain protected
