# Service Level Objectives (SLOs) & Error Budgets

> [!IMPORTANT]
> **Engineering Baselines vs Contractual SLAs**:
> The objectives defined in this document are internal engineering baselines used for performance tracking, capacity planning, and architectural alerting. They are **not** customer-facing contractual SLAs. Breaching an SLO indicates an engineering priority to stabilize or scale before accepting additional architectural risk.

---

## 1. System Availability SLO

- **Target Availability**: $\ge 99.0\%$ measured monthly over a 30-day rolling window.
- **Scope**: Successful response rate (non-5xx) for all admitted inbound HTTP requests across API Gateway.
- **Formula**:
  $$\text{Availability} = \frac{\sum \text{http\_requests\_total}\{\text{status\_code} !~ "5.." \}}{\sum \text{http\_requests\_total}} \times 100\%$$

### Error Budget Model (30-Day Rolling Window)

| Target Availability | 30-Day Period Duration | Permitted Downtime / Unavailability | Permitted Failed Requests (per 1,000,000 reqs) |
|:-------------------:|:----------------------:|:----------------------------------:|:----------------------------------------------:|
| **99.0%** (Baseline)| 43,200 minutes (720 h) | **7 hours 12 minutes** (432 min)   | **10,000 requests** (1.0%)                     |
| 99.5% (Aspirational)| 43,200 minutes (720 h) | 3 hours 36 minutes (216 min)       | 5,000 requests (0.5%)                          |
| 99.9% (Enterprise)  | 43,200 minutes (720 h) | 43 minutes 12 seconds (43.2 min)   | 1,000 requests (0.1%)                          |

When $> 80\%$ of the monthly error budget is depleted, feature deployments are gated and engineering effort redirects to resilience hardening.

---

## 2. Latency SLOs (P95 Latency by Service Tier)

Latency is measured from request arrival at the service boundary until response completion (`http_request_duration_seconds`).

| Service | P95 Latency Target | P99 Latency Objective | Rationale / Dependency Bounds |
|:--------|:------------------:|:---------------------:|:-----------------------------|
| **API Gateway** | **< 500 ms** | < 1000 ms | Routing overhead, auth validation, compression, rate-limiting |
| **Catalog Service** | **< 750 ms** | < 1200 ms | Read-heavy queries, category tree resolution, Redis cache fallback |
| **Order Service** | **< 1000 ms** | < 2000 ms | ACID transactions, outbox persistence, distributed locks |
| **Payment Service** | **< 1500 ms** | < 3000 ms | External PSP round-trips, webhook processing, signature validation |
| **Notification Service** | **< 1000 ms** | < 2000 ms | Template compilation, SMTP/SMS dispatcher queue ingestion |

---

## 3. Event-Stream & Asynchronous Pipeline Objectives

Kafka event pipelines decouple core transaction processing from downstream workflows.

| Metric | Target | Warning Threshold | Critical Threshold |
|:-------|:------:|:-----------------:|:------------------:|
| **Consumer Lag (per group)** | **< 1,000 messages** | > 1,000 messages (5m) | > 5,000 messages (5m) |
| **Outbox Processing Latency** | < 1,000 ms | > 2,500 ms | > 5,000 ms |
| **DLQ Message Arrival Rate** | 0 msg/s | > 0 msg/s (sustained 5m)| > 5 msg/s (instant) |
| **Idempotency Re-check Overhead**| < 5 ms | > 15 ms | > 50 ms |

---

## 4. Resource Utilization Engineering Targets

Sustained resource utilization above these targets degrades tail latency and compromises burst headroom.

| Resource Dimension | Healthy Baseline | Warning Target | Critical Action Threshold |
|:-------------------|:----------------:|:--------------:|:-------------------------:|
| **Process CPU Utilization** | < 50% | **< 70%** | > 80% (scale-out trigger) |
| **Process Memory (RSS / Heap)** | < 60% | **< 75%** | > 85% (leak/OOM mitigation)|
| **DB Connection Pool Utilization** | < 50% | **< 70%** | > 80% (pool saturation) |
| **Redis Memory Utilization** | < 50% | **< 70%** | > 80% (eviction warning) |
| **Node.js Event-Loop Lag** | < 10 ms | < 50 ms | > 100 ms (CPU starvation) |
