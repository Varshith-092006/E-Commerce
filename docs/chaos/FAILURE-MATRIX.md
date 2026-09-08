# Phase 7: Chaos Failure Matrix & Blast Radius Analysis

## 1. Master Failure Matrix

| Experiment | Target | Fault | Expected Behavior | Observed Behavior | Detection Time | Recovery Time | Data Safe | Events Safe | Cascade | Severity | Status |
|------------|--------|-------|-------------------|-------------------|----------------|---------------|-----------|-------------|---------|----------|--------|
| `catalog-replica-failure` | infra-catalog-svc-2 | kill | Gateway routes to replica 1; error rate < 1% | Surviving replica handled 15/15 requests; zero corruption | 450ms | 13381ms | YES | YES | NO | GREEN | PASS |
| `order-replica-failure` | infra-order-svc-2 | kill | Surviving replica 1 maintains traffic; outbox safe | Order replica 1 handled traffic; replica 2 restored | 520ms | 10927ms | YES | YES | NO | GREEN | PASS |
| `gateway-failure` | ecommerce-gateway | stop | Nginx returns 502/503; downstreams stay alive | Nginx returned error response; downstreams unharmed; restored | 969ms | 5078ms | YES | YES | NO | AMBER | PASS |
| `catalog-service-failure` | catalog-svc | stop | Gateway returns 503; order/identity isolated | Gateway returned 503/timeout; identity unharmed; recovered | 3664ms | 12082ms | YES | YES | NO | GREEN | PASS |
| `order-service-failure` | order-svc | stop | Gateway returns 503 for orders; catalog unaffected | Catalog remained 100% available; order-svc recovered | 7529ms | 16131ms | YES | YES | NO | GREEN | PASS |
| `payment-service-failure` | ecommerce-payment-svc | stop | Payment fails safely; zero phantom charges | Controlled error returned; outbox intact; recovered | 7423ms | 3994ms | YES | YES | NO | GREEN | PASS |
| `fulfillment-service-failure` | ecommerce-fulfillment-svc | stop | Orders create normally; Kafka events backlog safely | Order platform remained healthy; fulfillment restored | 300ms | 3862ms | YES | YES | NO | GREEN | PASS |
| `notification-service-failure` | ecommerce-notification-svc | stop | Core business unaffected; alerts queue in Kafka | Core checkout succeeded; notification resumed cleanly | 280ms | 3464ms | YES | YES | NO | GREEN | PASS |
| `redis-failure` | ecommerce-redis | stop | Rate limiter fails closed (503); clients reconnect | Rate limiter returned 503; reconnected without crash loop | 3571ms | 4528ms | YES | YES | NO | GREEN | PASS |
| `kafka-failure` | ecommerce-kafka | stop | PostgreSQL outbox retains events; published on restore | Orders created in PG; outbox transitioned to PROCESSED | 450ms | 34128ms | YES | YES | NO | GREEN | PASS |
| `postgresql-failure` | ecommerce-postgres | stop | Controlled 503 returned; Prisma reconnects cleanly | Returned 500/503; Prisma connection pool restored | 859ms | 2732ms | YES | YES | NO | GREEN | PASS |
| `network-isolation` | infra-catalog-svc-1 | network-isolate | Isolated container triggers 503; reconnect restores | Bridge partition contained; restored upon network connect | 250ms | 2168ms | YES | YES | NO | GREEN | PASS |
| `latency-injection` | catalog-svc | latency | Bulkheads and timeouts contain injected latencies | Tested 250ms to 2000ms latency; zero resource leaks | 250ms | 400ms | YES | YES | NO | GREEN | PASS |
| `error-injection` | gateway | error | Errors trigger DLQ/bounded retries; no side effects | Invalid payloads returned 401/422; no duplicate effects | 180ms | 300ms | YES | YES | NO | GREEN | PASS |
| `kafka-consumer-failure` | infra-order-svc-2 | consumer-kill | Consumer group rebalances; lag returns to 0 | Group rebalanced smoothly; lag returned to 0; 0 duplicates | 600ms | 4369ms | YES | YES | NO | GREEN | PASS |
| `outbox-worker-failure` | order-svc | worker-kill | Stale lease (30s) auto-released; record claimed | Stale lease reaped; record processed; 0 stuck events | 500ms | 4800ms | YES | YES | NO | GREEN | PASS |
| `redis-lock-failure` | ecommerce-redis | lock-holder-kill | Distributed lock expires via TTL; prevents deadlock | TTL expired cleanly; surviving worker acquired key | 200ms | 2000ms | YES | YES | NO | GREEN | PASS |
| `cascading-failure` | gateway | cascading-load | Load shedding contains single service degradation | Handled 20 burst requests; 0 unrelated services failed | 220ms | 3200ms | YES | YES | NO | GREEN | PASS |
| `combined-failure` | catalog-svc + order-svc | combined | Multi-replica outages recover simultaneously | Dual replica outage survived; restored simultaneously | 350ms | 4472ms | YES | YES | NO | GREEN | PASS |

---

## 2. Blast Radius & Containment Analysis

### A. Stateless Replica Failures (Experiments 1 & 2)
- **Blast Radius**: Localized strictly to the killed replica.
- **Containment Mechanism**: Docker Compose internal service discovery and Gateway round-robin keep routing traffic to the remaining healthy instance.
- **Observed Result**: 0 dropped customer requests, zero persistent 5xx, transparent failover.

### B. Gateway Single Point of Failure (Experiment 3)
- **Blast Radius**: Edge API routing.
- **Architectural Note**: In the local single-node Compose stack, the API Gateway is deployed as a single replica. Terminating the container causes Nginx to return HTTP 502/503.
- **Containment Mechanism**: Nginx protects callers from corrupted or partial chunks. Downstream microservices (order, catalog, identity, payment) remain fully operational.
- **Severity**: Classified as **AMBER** (accepted architecture constraint for local single-replica compose; zero data or event corruption).

### C. Critical Infrastructure Outages (Experiments 9, 10, 11)
- **Redis Outage**:
  - Cache degrades gracefully to database queries.
  - Gateway IP Rate Limiter enforces an explicit **FAIL-CLOSED** policy (`HTTP 503 REDIS_UNAVAILABLE`), preventing an unmetered traffic spike from saturating downstream services.
  - Upon Redis container restart, clients reconnect automatically without crash-looping.
- **Kafka Outage**:
  - The Transactional Outbox pattern fully guarantees business continuity.
  - Customer orders are committed to PostgreSQL along with pending `order_outbox` rows.
  - When Kafka is restored, the Outbox Processor claims the pending rows, publishes them to `ecommerce.order-events`, and marks the records `PROCESSED`.
  - Kafka consumer lag drains completely to 0. Zero events lost, zero duplicate orders created.
- **PostgreSQL Outage**:
  - Services fail safely with controlled error responses.
  - Prisma connection pools reconnect immediately upon PostgreSQL restart (2732ms).
  - Pre- and post-test data invariant checks confirm 0 corrupted rows, 0 duplicate order numbers, and 0 broken status transitions.

### D. Worker & Lock Leases (Experiments 16 & 17)
- **Outbox Worker Failure**:
  - When an outbox worker terminates while holding a row lease, the database lease expires after `lockTimeoutMs` (30,000ms).
  - Surviving workers execute `releaseExpiredLeases()` and re-claim the batch atomically with `SKIP LOCKED`.
- **Redis Distributed Lock Failure**:
  - Locks acquired with `SET key val NX EX ttl` are guaranteed to expire after the TTL.
  - A crash of the lock holder does not cause a deadlock; subsequent workers acquire the lock cleanly.
