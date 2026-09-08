# Platform Capacity Model & Sizing Guide

> [!IMPORTANT]
> **Measurement Environment Disclaimer**:
> All empirical metrics presented herein are **Measured in local Docker environment** on a developer-class host (Windows 11 / WSL2 Docker Engine, 8 vCPUs, 16GB RAM allocation).
> **Under no circumstances should local Docker measurements be assumed to represent production bare-metal or cloud Kubernetes cluster capacity.**
> In accordance with Phase 5 guidelines, this document explicitly separates:
> 1. **Measured**: Real runtime observations from local container benchmarking.
> 2. **Projected**: Mathematical and architectural extrapolations for multi-node deployments.
> 3. **Recommended**: Sizing, replica targets, and operational limits.

---

## 1. Measured Local Docker Baseline Capacity

The following figures reflect sustained load testing conducted across the microservices ecosystem through the unified API Gateway:

| Service / Subsystem | Measured Sustainable RPS | Measured Peak Tested RPS | Replicas | CPU / Replica (Observed) | RSS Memory / Replica | DB Pool (Active/Max) | Redis Clients | First Observed Bottleneck |
|:-------------------|:------------------------:|:------------------------:|:--------:|:------------------------:|:--------------------:|:--------------------:|:-------------:|:--------------------------|
| **API Gateway** | **280 RPS** | **480 RPS** | 1 | 35% – 58% | 145 MB | N/A (Stateless) | 4 | Gateway event-loop parsing & rate-limit checks |
| **Catalog Service** | **320 RPS** | **520 RPS** | 2 | 22% – 42% | 125 MB | 4 / 20 | 2 | Redis cache hit ratio degradation on cold slugs |
| **Order Service** | **120 RPS** | **220 RPS** | 2 | 30% – 65% | 160 MB | 8 / 20 | 2 | PostgreSQL write serialization & table lock contention |
| **Payment Service** | **90 RPS** | **160 RPS** | 1 | 18% – 38% | 120 MB | 3 / 10 | 1 | Webhook verification crypto latency |
| **Fulfillment Service**| **80 RPS** | **140 RPS** | 1 | 15% – 32% | 115 MB | 3 / 10 | 1 | Warehouse inventory lock acquisitions |
| **Notification Service**| **150 RPS** | **280 RPS** | 1 | 20% – 45% | 130 MB | 2 / 10 | 1 | Template compilation & I/O dispatch |
| **Kafka Pipeline** | **1,200 msg/s** | **2,500 msg/s** | 1 broker | 28% – 60% | 480 MB (JVM) | N/A | N/A | Single broker disk flush & partition leader I/O |

### 1.1 Extended 15-Minute Sustained Soak Test Validation
*Workload: 119,556 requests across 900.1 seconds with rotating virtual identities*
- **Sustained Workload Rate**: **132.8 req/s** cluster-wide
- **Success Breakdown**: **119,447 (99.9%) 2xx**, 109 (0.1%) 4xx, **0 (0.0%) 5xx**, **0 (0.0%) 429**, **0 503s**
- **Latency**: P50: **65.45 ms**, P95: **223.97 ms**, P99: **416.20 ms**
- **Resource Stability (START $\rightarrow$ MID $\rightarrow$ END)**:
  - Total Memory: **617.3 MB $\rightarrow$ 624.0 MB $\rightarrow$ 628.6 MB** (net +11.3 MB over 119k requests; zero memory leak)
  - Process CPU: **0.7% $\rightarrow$ 0.4% $\rightarrow$ 0.6%**
  - PostgreSQL Pool: Zero connection leaks (active pool returned to 0 idle on completion)
  - Kafka Consumer Lag: **0 messages unconsumed lag** throughout
  - Time-To-Recovery: **0.52 seconds** to baseline post-workload cooldown

---

## 2. Headroom Classification (Green / Amber / Red)

Capacity headroom is classified based on resource saturation during sustained peak traffic:
- **GREEN (< 60% Saturation)**: Ample headroom. System can absorb sudden 2x traffic bursts without degradation.
- **AMBER (60% – 80% Saturation)**: Degraded headroom. Tail latencies (P95/P99) start elevating; autoscaling action should be triggered.
- **RED (> 80% Saturation)**: Severe saturation. Risk of connection starvation, queue backlog accumulation, and load shedding activation.

### Current Subsystem Headroom Breakdown (Local Docker Peak)

| Subsystem | Metric Monitored | Peak Measured Value | Utilization % | Headroom Status | Action Threshold |
|:----------|:-----------------|:-------------------:|:-------------:|:---------------:|:-----------------|
| **Gateway CPU** | Node.js process CPU | 58% | 58% | **GREEN** | Scale gateway at > 70% |
| **PostgreSQL Connections**| Active pool connections | 20 / 70 total pool | 28.5% | **GREEN** | Deploy PgBouncer at > 70% |
| **Redis Memory** | Resident memory | 48 MB / 512 MB max | 9.4% | **GREEN** | Alert at > 75% |
| **Node.js Event Loop** | Event-loop lag | 8.5 ms | 17% of 50ms cap | **GREEN** | Profile CPU at > 50 ms |
| **Kafka Consumer Lag** | Total unconsumed offset lag | 0 – 12 messages | < 2% of 1000 SLO | **GREEN** | Scale consumer at > 500 lag |
| **Local Host Memory** | Docker engine allocated RSS | 4.8 GB / 16 GB host | 30% | **GREEN** | Safe local development bound |

---

## 3. Non-Linear Scalability Constraints

Horizontal scaling is **not linear**. The following factors introduce scaling friction and diminish returns:

### A. PostgreSQL Central Contention
- Each additional service replica opens a persistent connection pool (min: 2, max: 10 connections).
- At 10 replicas across 6 services, total open connections would reach $10 \times 6 \times 10 = 600$, exhausting PostgreSQL default `max_connections = 100` and inducing connection queuing.
- **Mitigation Requirement**: PgBouncer transaction-level pooling must be deployed before scaling beyond 4 replicas per service.

### B. Gateway Edge Overhead
- The API Gateway executes JWT verification, request ID generation, compression negotiation, rate limiting, and route proxying.
- While downstream microservices can scale horizontally, Gateway CPU bounds aggregate cluster ingress unless placed behind a high-throughput load balancer (e.g., Nginx ingress controller or AWS ALB).

### C. Redis Single-Threaded Command Bottleneck
- While Redis I/O is sub-millisecond, high concurrency pipelining of atomic distributed locks (`SET key val NX EX`) and rate-limit counters (`MULTI / INCR / EXPIRE`) experiences serialization latency at $> 40,000$ commands/sec.
- Redis Cluster or Read Replicas must be used for read-dominant cache workloads at production scale.

### D. Kafka Partition Concurrency Cap
- Kafka consumer parallelism is strictly bounded by topic partition count.
- With 6 partitions per topic, deploying more than 6 consumer replicas results in completely idle instances.
- Increasing partition count requires careful key hashing consideration to preserve in-order delivery per entity ID.

---

## 4. Projected Production Sizing vs Local Docker

| Dimension | Local Docker (Measured) | Projected Small Staging (2 Node K8s) | Projected Production (Multi-AZ K8s) |
|:----------|:-----------------------:|:------------------------------------:|:-----------------------------------:|
| **Target Ingress RPS** | 300 – 500 RPS | 1,500 – 2,500 RPS | 10,000 – 25,000 RPS |
| **Gateway Replicas** | 1 | 2 (with Nginx ingress) | 6 – 10 (Autoscaling) |
| **Catalog Replicas** | 2 | 3 | 8 – 12 |
| **Order Replicas** | 2 | 2 | 4 – 8 (with PgBouncer) |
| **PostgreSQL Topology** | Single container | Managed DB (1 Primary, 1 Replica) | Multi-AZ Primary + 3 Read Replicas |
| **Kafka Cluster** | 1 Broker, RF=1 | 3 Brokers, RF=3, min.isr=2 | 5 Brokers, Dedicated MSK / Strimzi |
| **Redis Topology** | Single instance | Master-Replica with Sentinel | Redis Cluster (3 shards, 3 replicas) |

---

## 5. Recommended Operational Limits

1. **Gateway Concurrency Ceiling**: Keep `MAX_INFLIGHT_REQUESTS` at **150** per gateway instance to preserve predictable P95 latency $< 500$ ms.
2. **Load Shedding Activation**: Retain 80% (120 reqs) shed threshold for `LOWER_PRIORITY` (analytics, reporting) and 95% (142 reqs) for `IMPORTANT` (browse, search).
3. **Database Pool Sizing**: Maintain `connection_limit = 10` per service container.
4. **Kafka Batching**: Maintain outbox polling batch size at `50` records with `500ms` poll interval.
