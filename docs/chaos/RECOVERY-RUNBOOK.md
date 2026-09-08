# Microservices Disaster Recovery Runbook

## 1. Overview & Operational Principles

This runbook defines standard operational procedures for identifying, diagnosing, mitigating, and recovering from failures across the ecommerce microservices mesh.

### Core Recovery Invariants:
1. **Never drop databases or delete Kafka topics during incident recovery.**
2. **Always verify database consistency before and after restarting workers.**
3. **Always verify consumer lag after restoring Kafka brokers.**
4. **Always verify Redis memory and client connections after cache recovery.**

---

## 2. Component Recovery Procedures

### 2.1 API Gateway Outage
- **Symptoms**:
  - Nginx returning HTTP 502 Bad Gateway or 503 Service Unavailable.
  - Ingress traffic completely halted.
  - Prometheus alert `GatewayDown` firing.
- **Triage & Diagnosis**:
  ```bash
  docker ps -a --filter "name=ecommerce-gateway"
  docker logs --tail 100 ecommerce-gateway
  ```
- **Recovery Procedure**:
  ```bash
  docker compose -f infra/docker-compose.yml restart gateway
  ```
- **Verification**:
  ```bash
  curl -i http://localhost:4000/health
  curl -i http://localhost:4000/ready
  ```
- **Data Integrity Check**:
  - Confirm downstream microservices did not suffer transaction corruption while edge was down.

---

### 2.2 Kafka Broker Outage
- **Symptoms**:
  - Prometheus alert `KafkaBrokerDown` firing.
  - Outbox workers logging retry errors: `Connection lost to Kafka broker`.
  - Microservices `order-svc`, `payment-svc`, `fulfillment-svc` logging Kafka connection attempts.
  - Outbox tables (`order_outbox`, `payment_outbox`) showing rows accumulating in `PENDING` state.
- **Triage & Diagnosis**:
  ```bash
  docker logs --tail 100 ecommerce-kafka
  docker exec ecommerce-kafka kafka-topics --bootstrap-server kafka:29092 --list
  ```
- **Recovery Procedure**:
  ```bash
  docker compose -f infra/docker-compose.yml start kafka
  ```
- **Verification**:
  ```bash
  # Wait for broker healthcheck to report healthy
  docker inspect --format "{{.State.Health.Status}}" ecommerce-kafka
  ```
- **Data Integrity Check**:
  - Verify consumer lag drains to 0:
    ```bash
    docker exec ecommerce-kafka kafka-consumer-groups --bootstrap-server kafka:29092 --describe --group order-saga-group
    ```
  - Verify outbox records transition from `PENDING` to `PROCESSED`:
    ```sql
    docker exec -i ecommerce-postgres psql -U postgres -d order_db -c "SELECT status, count(*) FROM order_outbox GROUP BY status;"
    ```

---

### 2.3 PostgreSQL Datastore Outage
- **Symptoms**:
  - All microservices returning HTTP 503 / 500 with `PrismaClientInitializationError` or `DatabaseConnectionError`.
  - Readiness probes (`/ready`) failing across all services.
- **Triage & Diagnosis**:
  ```bash
  docker logs --tail 100 ecommerce-postgres
  docker exec ecommerce-postgres pg_isready -U postgres
  ```
- **Recovery Procedure**:
  ```bash
  docker compose -f infra/docker-compose.yml start postgres
  ```
- **Verification**:
  ```bash
  docker exec ecommerce-postgres pg_isready -U postgres
  docker exec -i ecommerce-postgres psql -U postgres -d order_db -c "SELECT 1;"
  ```
- **Data Integrity Check**:
  - Verify no duplicate orders:
    ```sql
    SELECT order_number, count(*) FROM orders GROUP BY order_number HAVING count(*) > 1;
    ```
  - Verify no orphaned or corrupted payment records:
    ```sql
    SELECT count(*) FROM payments WHERE status IS NULL;
    ```

---

### 2.4 Redis Cache & Lock Store Outage
- **Symptoms**:
  - Gateway returning `HTTP 503 Service Unavailable` with code `REDIS_UNAVAILABLE` (fail-closed rate limit policy).
  - Cache service logging warnings: `Cache get failed, degrading to DB`.
- **Triage & Diagnosis**:
  ```bash
  docker logs --tail 100 ecommerce-redis
  docker exec ecommerce-redis redis-cli ping
  ```
- **Recovery Procedure**:
  ```bash
  docker compose -f infra/docker-compose.yml start redis
  ```
- **Verification**:
  ```bash
  docker exec ecommerce-redis redis-cli ping
  curl -i http://localhost:4000/ready
  ```

---

### 2.5 Microservice Replica Crash (Catalog / Order)
- **Symptoms**:
  - One replica container exits or enters crash loop.
  - Overall cluster capacity decreases by 50%.
- **Triage & Diagnosis**:
  ```bash
  docker ps --filter "name=catalog-svc"
  docker logs --tail 50 infra-catalog-svc-2
  ```
- **Recovery Procedure**:
  ```bash
  docker compose -f infra/docker-compose.yml up -d --scale catalog-svc=2 --scale order-svc=2
  ```
- **Verification**:
  - Verify 2 active containers are running for the service:
    ```bash
    docker ps --filter "name=catalog-svc" --format "{{.Names}} - {{.Status}}"
    ```

---

## 3. Escalation Conditions

Escalate immediately to Lead Infrastructure / Engineering if:
1. **PostgreSQL corruption**: Any query reveals duplicate primary keys or broken foreign key invariants.
2. **Kafka topic partition loss**: A partition leader is missing or consumer group enters unrecoverable deadlock.
3. **Cascading crash loop**: Gateway restarts cause dependent services to spike CPU and crash simultaneously.
4. **Permanent DLQ accumulation**: A poison pill message causes consumer groups to endlessly fail without routing to DLQ.
