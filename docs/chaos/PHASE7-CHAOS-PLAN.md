# Phase 7: Chaos Engineering & Resilience Plan

## 1. Executive Summary

Phase 7 executes controlled chaos engineering and fault injection across the ecommerce microservices platform. Following the successful validation of performance, capacity limits, and traffic management in Phase 6, Phase 7 proves the system's operational resilience against component, network, and infrastructure dependencies failure.

The primary objective is to prove that the system:
1. **Fails safely**: Degrades gracefully and protects client callers from uncontrolled failures.
2. **Preserves transactional integrity**: Ensures zero lost or duplicate orders in PostgreSQL.
3. **Preserves transactional outbox events**: Persists outbox events even during full Kafka broker outages.
4. **Guarantees Kafka at-least-once & idempotency**: Eliminates duplicate financial/business side effects under consumer rebalancing and crash events.
5. **Prevents cascading failures**: Contains blast radius using Gateway circuit breakers, bulkheads, and load shedding.
6. **Recovers automatically**: Restores services, consumer groups, connection pools, and cache states upon dependency restoration.

---

## 2. Testing Environment & Non-Negotiable Safety Rules

All chaos experiments are executed strictly against the local disposable Docker Compose mesh (`infra/docker-compose.yml`).

### Safety Boundaries:
- **Local Host Constraint**: Tests run exclusively on local loopback (`localhost` / `127.0.0.1`). Remote Docker daemons are blocked.
- **Forbidden Operations**:
  - No `DROP DATABASE` or `DROP TABLE`.
  - No `TRUNCATE TABLE`.
  - No Kafka topic deletion (`--delete`).
  - No Redis `FLUSHALL` / `FLUSHDB`.
- **Default Mode**: Safe mode (`--safe`) is the default. Any destructive operations require explicit opt-in flags and strict bounds.
- **Automated Cleanup**: Every experiment registers SIGINT/SIGTERM handlers and unconditional restoration routines to guarantee the platform is returned to a 100% operational state.

---

## 3. Architecture Under Test & Resilience Mechanisms

The microservice mesh consists of:
- **Edge Layer**: Nginx Reverse Proxy (SSL termination, HTTP routing) -> API Gateway (Authentication, IP rate limiting, circuit breaker, load shedding, request timeouts).
- **Core Microservices**:
  - `identity-svc` (Auth, JWT, RBAC, User & Seller Profiles)
  - `catalog-svc` (Categories, Products, Redis cache-aside, DB fallback)
  - `order-svc` (Cart, Checkout, Order State Machine, Outbox Worker, Saga Consumer)
  - `payment-svc` (Razorpay integrations, Payment Outbox Worker, Refund Worker)
  - `fulfillment-svc` (Couriers, Shipment Tracking, Outbox Worker)
  - `notification-svc` (Email/SMS/SSE Providers, Decoupled Kafka Consumers)
- **Infrastructure**:
  - PostgreSQL 16 (Relational datastores for all services)
  - Redis 7 (Cache-aside, IP rate limiting, distributed lock store)
  - Kafka 7.6.1 + ZooKeeper (Event bus, consumer groups, retry topics, DLQs)
  - Prometheus + Grafana (Telemetry, metrics collection, alerting)

---

## 4. Experiment Methodology

Every experiment follows a rigorous 10-step lifecycle:
1. **Hypothesis**: Formal prediction of degradation and containment behavior.
2. **Pre-flight Health Check**: Verification that Docker containers, PostgreSQL, Redis, Kafka, and Gateway are 100% healthy before injecting faults. If unhealthy, the test aborts immediately.
3. **Invariant Snapshot**: Baseline recording of order count, outbox state, and Kafka lag.
4. **Fault Injection**: Controlled component termination, network isolation, or latency injection.
5. **Detection Measurement**: Recording elapsed time until failure detection or degraded response.
6. **Recovery Initiation**: Controlled container startup, network reconnection, or fault removal.
7. **Stabilization Monitoring**: Continuous polling of readiness and health endpoints until 200 OK.
8. **Recovery Measurement**: Recording elapsed time until complete system stabilization.
9. **Data & Event Integrity Verification**: Re-querying PostgreSQL tables and Kafka consumer lag to guarantee 0 data loss, 0 duplicate mutations, and 0 lost events.
10. **Severity Classification**: Formally categorized into **GREEN**, **AMBER**, or **RED**.

---

## 5. Experiment Registry Summary

The 19 approved experiments are:
1. `catalog-replica-failure`: Kill catalog replica 2; verify surviving replica continues serving traffic.
2. `order-replica-failure`: Kill order replica 2; verify surviving replica maintains order processing.
3. `gateway-failure`: Terminate single Gateway container; verify Nginx 502/503 behavior and safe restart.
4. `catalog-service-failure`: Full catalog outage; verify Gateway 503 response and isolation from order/payment.
5. `order-service-failure`: Full order outage; verify catalog/identity unaffected; restart and rebalance.
6. `payment-service-failure`: Payment outage; verify checkout fails safely without phantom charges.
7. `fulfillment-service-failure`: Fulfillment outage; verify orders queue events in Kafka without error.
8. `notification-service-failure`: Notification outage; verify business flows continue unaffected.
9. `redis-failure`: Redis outage; verify cache fallback to DB and rate-limiter fail-closed protection.
10. `kafka-failure`: Kafka broker outage; verify outbox persistence in PostgreSQL and post-recovery drain.
11. `postgresql-failure`: Database connectivity failure; verify controlled 503 and Prisma pool recovery.
12. `network-isolation`: Docker bridge network disconnect; verify circuit breaker and recovery on reconnect.
13. `latency-injection`: Artificial delay stages (250ms - 2000ms); verify request timeouts and bulkheads.
14. `error-injection`: Faulty payloads and error responses; verify DLQ routing and bounded retries.
15. `kafka-consumer-failure`: Consumer container kill; verify dynamic partition rebalance & deduplication.
16. `outbox-worker-failure`: Outbox worker crash; verify 30s lease timeout and secondary worker claim.
17. `redis-lock-failure`: Lock holder crash; verify TTL expiration and subsequent worker acquisition.
18. `cascading-failure`: Dependency failure under load; verify load shedding isolates blast radius.
19. `combined-failure`: Simultaneous multi-replica outages; verify concurrent cluster recovery.
