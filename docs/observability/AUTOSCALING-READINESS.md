# Autoscaling Readiness & Telemetry Signals

> [!NOTE]
> **Measurement & Readiness Scope**:
> In accordance with Phase 5 architecture rules, Kubernetes Horizontal Pod Autoscalers (HPA) and automated scaling controllers are **not** implemented in this phase. This document specifies the precise metrics, PromQL queries, and threshold triggers required for future production autoscaling automation.

---

## 1. Architectural Scaling Dimensions

Microservices have asymmetric scaling profiles based on their statefulness and workload:
- **Stateless Read-Dominant Services** (e.g., `catalog-svc`): Scale primarily on CPU, incoming RPS, and P95 latency.
- **Stateful Write-Dominant Services** (e.g., `order-svc`): Scaling is bounded by PostgreSQL write concurrency, connection pool limits, and table lock contention.
- **Asynchronous Stream Consumers** (e.g., `order-svc`, `fulfillment-svc`, `notification-svc` Kafka consumers): Scaling is strictly bounded by topic partition count (max replicas = partition count).

---

## 2. Per-Service Recommended Scaling Signals

### Catalog Service (`catalog-svc`)
*Role*: High-throughput product search, category browsing, and details resolution.

| Metric Signal | Source Metric | Scale-Out Trigger (Recommended) | Scale-In Trigger | Cooldown Period |
|:--------------|:-------------|:-------------------------------|:-----------------|:---------------|
| **CPU Utilization** | `rate(process_cpu_seconds_total[1m]) * 100` | $> 70\%$ for 2 consecutive minutes | $< 30\%$ for 10 minutes | 180s |
| **Inbound RPS** | `sum(rate(http_requests_total{service="catalog-svc"}[1m]))` | $> 120$ RPS per replica | $< 40$ RPS per replica | 120s |
| **Tail Latency** | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service="catalog-svc"}[1m])) by (le))` | $> 600$ ms for 2 minutes | $< 200$ ms | 300s |

### Order Service (`order-svc`)
*Role*: Transactional order processing, outbox persistence, saga coordination.

| Metric Signal | Source Metric | Scale-Out Trigger (Recommended) | Scale-In Trigger | Scaling Boundary Constraint |
|:--------------|:-------------|:-------------------------------|:-----------------|:---------------------------|
| **CPU Utilization** | `rate(process_cpu_seconds_total[1m]) * 100` | $> 70\%$ for 3 minutes | $< 35\%$ for 15 minutes | Max 6 replicas (PostgreSQL pool ceiling) |
| **P95 Latency** | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service="order-svc"}[1m])) by (le))` | $> 800$ ms for 3 minutes | $< 250$ ms | Investigate lock contention if latency rises without CPU |
| **Outbox Backlog** | `ecommerce_outbox_pending_records` | $> 500$ unprocessed records | $< 50$ records | Outbox batch size is 50; backlog indicates I/O saturation |

### Kafka Consumers (`consumer-group`)
*Role*: Saga progression, inventory reservations, email/SMS dispatch.

| Metric Signal | Source Metric | Scale-Out Trigger | Scale-In Trigger | Architectural Constraint |
|:--------------|:-------------|:-----------------|:-----------------|:-------------------------|
| **Consumer Lag** | `sum(kafka_consumer_lag) by (group, topic)` | $> 500$ messages for 3 minutes | $< 50$ messages for 10 minutes | Replicas **cannot** exceed topic partition count (6 partitions) |
| **Partition Idle Ratio** | Partitions without assigned consumer | $= 0$ (all assigned) | - | Adding consumers beyond partition count yields idle workers |

---

## 3. Production Readiness Checklist for HPA

Before enabling Kubernetes HPA in future phases:
- [x] Metrics exporter exposes Prometheus standard scrapable endpoints.
- [x] Route normalization prevents cardinality explosions in metrics registry.
- [x] Load shedding protects downstream instances during autoscale spin-up latency (cold start ~15–30s).
- [ ] Database connection pooling tier (e.g., PgBouncer) must be deployed before replica count exceeds 10 per service.
- [ ] Kafka topics must have partition count $\ge$ maximum planned consumer replicas.
