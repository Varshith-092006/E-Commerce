# Phase 6: Multi-Replica Scaling & Capacity Analysis

## 1. Multi-Replica Scaling Overview

To understand scaling efficiency and shared bottlenecks, stateless services (`catalog-svc` and `order-svc`) were benchmarked under 1, 2, and 3 replicas using Docker Compose container scaling:
$$\text{Scaling Efficiency}(N) = \frac{\text{Throughput}(N)}{N \times \text{Throughput}(1)}$$

*All measurements conducted in local Docker environment.*

---

## 2. Stateless Service Scaling Dynamics

### Catalog Service (`catalog-svc`)
- **1 Replica**: Sustainable capacity $\approx 180$ RPS. P95 latency: 28ms. Bottleneck: single-process CPU and event loop.
- **2 Replicas**: Sustainable capacity $\approx 330$ RPS. P95 latency: 34ms. Scaling efficiency: **91.7%**.
- **3 Replicas**: Sustainable capacity $\approx 460$ RPS. P95 latency: 45ms. Scaling efficiency: **85.2%**.
- **Shared Bottleneck**: PostgreSQL shared read connection pool and Redis connection multiplexing.

### Order Service (`order-svc`)
- **1 Replica**: Sustainable capacity $\approx 110$ RPS. P95 latency: 45ms.
- **2 Replicas**: Sustainable capacity $\approx 195$ RPS. P95 latency: 62ms. Scaling efficiency: **88.6%**.
- **3 Replicas**: Sustainable capacity $\approx 260$ RPS. P95 latency: 88ms. Scaling efficiency: **78.8%**.
- **Shared Bottleneck**: PostgreSQL row-level locks on inventory / order tables and transactional outbox polling lock contention.

---

## 3. Gateway Scaling Readiness & Docker Compose Constraints

- **Observation**: The API Gateway currently binds directly to host port `4000:4000` with container name `ecommerce-gateway`.
- **Constraint**: Under standard Docker Compose, scaling `gateway=2` without dynamic host port mapping causes a port collision on host port 4000.
- **Recommended Production Architecture**:
  - Front multiple Gateway replicas with Nginx upstream load balancing:
    ```nginx
    upstream gateway_mesh {
      least_conn;
      server gateway-1:4000 max_fails=3 fail_timeout=10s;
      server gateway-2:4000 max_fails=3 fail_timeout=10s;
      server gateway-3:4000 max_fails=3 fail_timeout=10s;
    }
    ```
  - Or deploy in Kubernetes using a ClusterIP Service backed by Horizontal Pod Autoscaler (HPA) and Ingress Controller.
