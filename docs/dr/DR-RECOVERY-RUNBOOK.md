# Disaster Recovery & Platform Reconstruction Runbook
**Phase 12: Operational Step-by-Step Recovery Procedures**  
*Document Version:* 1.0.0  
*Target Environment:* Microservices Platform (PostgreSQL 16, Redis 7, Kafka 7.6.1, Express, Nginx)  
*Audience:* SRE On-Call, Database Administrators, Platform Engineers  

---

## 1. Scope & Execution Rules

This runbook provides unambiguous, step-by-step instructions to reconstruct the platform after a catastrophic disaster.

> [!CAUTION]
> **SAFETY GUARDRAIL ENFORCEMENT:**
> 1. Never execute destructive restores against running production clusters without incident command authorization.
> 2. Always cryptographically verify SHA-256 backup checksums before restoring.
> 3. Verify data invariants and schemas in an isolated disposable container (`ecommerce-postgres-restore`) before promoting to live traffic.

---

## 2. Emergency Operational Checklist

### PRE-RECOVERY PHASE
- [ ] **Confirm Incident**: Declare disaster and designate Incident Commander.
- [ ] **Freeze Destructive Operations**: Stop incoming write traffic to prevent split-brain state or dirty writes.
- [ ] **Identify Latest Valid Backup**: Locate newest snapshot archive in `backups/`.
- [ ] **Verify Backup Checksums**: Run cryptographic SHA-256 verification.
- [ ] **Identify Affected Infrastructure**: Assess failure scope (host, database volume, Kafka broker, Redis).
- [ ] **Record Incident Timestamps**: Log failure detection time ($t_{\text{disaster}}$) and recovery start time ($t_{\text{start}}$).
- [ ] **Set Recovery Target**: Designate target container/host (`ecommerce-postgres-restore` or reconstructed cluster).

### DATA RECOVERY PHASE
- [ ] **PostgreSQL Infrastructure Available**: Provision PostgreSQL 16 container and initialize catalogs.
- [ ] **Databases Restored**: Stream SQL dumps into all 6 databases (`identity_db`, `catalog_db`, `order_db`, `payment_db`, `fulfillment_db`, `notification_db`).
- [ ] **Row Counts Verified**: Verify non-zero counts and compare with pre-disaster baseline across 27 tables.
- [ ] **Relational Invariants Verified**: Confirm 0 orphan order items, 0 orphan refunds, valid outbox status enums.
- [ ] **Redis Available**: Start Redis 7 container, verify `PING`, and confirm distributed lock acquisition.
- [ ] **ZooKeeper Available**: Start ZooKeeper container, verify port `2181` accepting connections.
- [ ] **Kafka Available**: Start Kafka broker, verify internal listener `29092` and host listener `9092`.
- [ ] **Topics Verified**: Confirm all 6 topics exist with exactly 3 partitions and RF=1.
- [ ] **Transactional Outbox Intact**: Verify `*_outbox` tables restored with un-drained event state.

### SERVICE RECOVERY PHASE
- [ ] **Identity Service Ready**: `identity-svc` passes `/liveness` and `/ready` (`db:ok, redis:ok`).
- [ ] **Catalog Service Ready**: `catalog-svc` passes `/liveness` and `/ready` (`db:ok, redis:ok`).
- [ ] **Order Service Ready**: `order-svc` passes `/liveness` and `/ready` (`db:ok, redis:ok, kafka:up`).
- [ ] **Payment Service Ready**: `payment-svc` passes `/liveness` and `/ready` (`db:ok, redis:ok, kafka:up`).
- [ ] **Fulfillment Service Ready**: `fulfillment-svc` passes `/liveness` and `/ready` (`db:ok, redis:ok, kafka:up`).
- [ ] **Notification Service Ready**: `notification-svc` passes `/liveness` and `/ready` (`db:ok, redis:ok, kafka:up`).
- [ ] **API Gateway Ready**: `gateway` passes `/liveness` and `/ready` (`redis:connected`).
- [ ] **Nginx Edge Ready**: `nginx` passes `/nginx-health` (port 80) and terminates HTTPS (port 443).

### EVENT RECOVERY PHASE
- [ ] **Consumers Connected**: All consumer groups registered (`order-saga-group`, `notification-group`, etc.).
- [ ] **Consumer Groups Stable**: Rebalances completed; partitions assigned.
- [ ] **Outbox Workers Draining**: Transactional outbox polling resumes (`SKIP LOCKED`).
- [ ] **Kafka Lag Decreasing**: Consumer offset processing matches event ingress rate.
- [ ] **Kafka Lag Converged to Zero**: All pending events processed.
- [ ] **DLQ Inspected**: Dead Letter Queue checked for unhandled exceptions or corrupt envelopes.

### VALIDATION PHASE
- [ ] **Nginx Edge Health**: `http://localhost/nginx-health` returns `healthy`.
- [ ] **Public Catalog Read**: `https://localhost/api/v1/products?limit=1` returns product JSON over HTTPS.
- [ ] **API Gateway Aggregation**: `http://localhost:4000/health` reports all downstreams healthy.
- [ ] **Payment Safe Test Mode**: Payment verification endpoint rejects malformed signatures cleanly without 500s.
- [ ] **Observability Verification**: Prometheus targets `UP`, Grafana dashboards rendering metrics.

### CLOSURE PHASE
- [ ] **Compare Critical Data**: Baseline vs. restored record diff is 0 for committed transactions.
- [ ] **Calculate Actual RTO**: Record elapsed time from disaster declaration to full application readiness.
- [ ] **Estimate Actual RPO**: Record delta between backup timestamp and disaster timestamp.
- [ ] **Record Postmortem Artifacts**: Archive `reports/recovery/phase12-results.json` and postmortem log.
- [ ] **Promote Restored Database**: Switch service connection string to validated database or tear down disposable target.

---

## 3. Step-by-Step Operator Runbook

### Step 1: Pre-Recovery Diagnostics & Disaster Declaration

1. Inspect container states:
   ```bash
   docker ps -a
   ```
2. Stop incoming traffic to prevent corrupt writes:
   ```bash
   docker stop ecommerce-gateway ecommerce-nginx
   ```
3. Record current timestamp as disaster declaration:
   ```bash
   # Windows PowerShell:
   Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
   # Linux / Bash:
   date -u +"%Y-%m-%dT%H:%M:%SZ"
   ```

---

### Step 2: Identify & Verify Latest Backup Archive

1. Find the latest backup directory:
   ```bash
   npm run dr:verify-backups
   ```
   *Expected output:*
   ```text
   ========================================================================
   ▶ [DR BACKUP VERIFICATION] Archive: .../backups/YYYY-MM-DD_HH-mm-ss
   ========================================================================
   --- VERIFICATION RESULTS ---
     identity_db        | File: identity_db.sql      | Status: [VALID]
     catalog_db         | File: catalog_db.sql       | Status: [VALID]
     order_db           | File: order_db.sql         | Status: [VALID]
     payment_db         | File: payment_db.sql       | Status: [VALID]
     fulfillment_db     | File: fulfillment_db.sql   | Status: [VALID]
     notification_db    | File: notification_db.sql  | Status: [VALID]
   ✓ SUCCESS: All 6 databases verified with valid SHA-256 cryptographic checksums.
   ```
   > [!WARNING]
   > If verification reports `CORRUPTED` or missing checksums, **DO NOT PROCEED**. Inspect secondary backups.

---

### Step 3: Database Restoration

Execute restoration into an isolated disposable container:

1. Provision isolated container and empty catalogs:
   ```bash
   # Provision container
   docker run -d --name ecommerce-postgres-restore \
     --network infra_ecommerce-net \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgrespassword \
     -e POSTGRES_DB=postgres \
     postgres:16-alpine

   # Initialize database catalogs
   docker exec -i ecommerce-postgres-restore psql -U postgres -d postgres < infra/postgres/init-databases.sql
   ```

2. Restore all 6 databases:
   ```bash
   npm run restore:database -- --database all --target-container ecommerce-postgres-restore --confirm-restore
   ```

3. Verify post-restore row counts and relational invariants:
   ```bash
   npm run dr:verify-recovery -- --target-container ecommerce-postgres-restore
   ```

---

### Step 4: Infrastructure & Cache Restoration

1. Ensure Redis is healthy:
   ```bash
   docker exec ecommerce-redis redis-cli ping
   # Expected: PONG
   ```
2. If Redis container was lost, recreate it:
   ```bash
   docker compose -f infra/docker-compose.yml up -d redis
   ```

---

### Step 5: Kafka Event Mesh Restoration

1. Ensure ZooKeeper and Kafka are running:
   ```bash
   docker compose -f infra/docker-compose.yml up -d zookeeper kafka
   ```
2. Verify Kafka topics and 3-partition topology:
   ```bash
   npm run dr:validate-kafka
   ```
   *Expected output:*
   ```text
   ✓ Connected to Kafka Admin API.
   --- KAFKA TOPIC TOPOLOGY ---
     ecommerce.order-events           | Partitions: 3 | RF: 1 | Status: [OK]
     ecommerce.payment-events         | Partitions: 3 | RF: 1 | Status: [OK]
     ecommerce.fulfillment-events     | Partitions: 3 | RF: 1 | Status: [OK]
     ecommerce.notification-events    | Partitions: 3 | RF: 1 | Status: [OK]
     ecommerce.dead-letter-events     | Partitions: 3 | RF: 1 | Status: [OK]
     ecommerce.review-events          | Partitions: 3 | RF: 1 | Status: [OK]
   ✓ SUCCESS: Kafka mesh recovery verified (all 6 topics, 3 partitions, RF=1).
   ```

---

### Step 6: Microservice Startup in Topological Order

Start microservices adhering strictly to dependency ordering:

1. Start upstream domain services:
   ```bash
   docker compose -f infra/docker-compose.yml up -d identity-svc catalog-svc
   ```
2. Start transaction-heavy services:
   ```bash
   docker compose -f infra/docker-compose.yml up -d order-svc payment-svc fulfillment-svc notification-svc
   ```
3. Verify readiness across all services:
   ```bash
   npm run dr:validate-services
   ```
   *Expected output:*
   ```text
   --- SERVICE READINESS STATUS ---
     identity-svc         | Liveness: ✓ UP     | Readiness: ✓ READY      | Status: [HEALTHY]   (db:ok, redis:ok)
     catalog-svc          | Liveness: ✓ UP     | Readiness: ✓ READY      | Status: [HEALTHY]   (db:ok, redis:ok)
     order-svc            | Liveness: ✓ UP     | Readiness: ✓ READY      | Status: [HEALTHY]   (db:ok, redis:ok, kafka:up)
     payment-svc          | Liveness: ✓ UP     | Readiness: ✓ READY      | Status: [HEALTHY]   (db:ok, redis:ok, kafka:up)
     fulfillment-svc      | Liveness: ✓ UP     | Readiness: ✓ READY      | Status: [HEALTHY]   (db:ok, redis:ok, kafka:up)
     notification-svc     | Liveness: ✓ UP     | Readiness: ✓ READY      | Status: [HEALTHY]   (db:ok, redis:ok, kafka:up)
   ```

---

### Step 7: Edge Proxy & Ingress Reopening

1. Start Gateway and Frontends:
   ```bash
   docker compose -f infra/docker-compose.yml up -d gateway customer-web seller-web admin-web
   ```
2. Start Nginx Edge Proxy:
   ```bash
   docker compose -f infra/docker-compose.yml up -d nginx
   ```
3. Verify Gateway and Nginx readiness:
   ```bash
   curl.exe http://localhost:4000/ready
   curl.exe http://localhost/nginx-health
   curl.exe -k https://localhost/api/v1/products?limit=1
   ```

---

### Step 8: Observability Verification

1. Start Prometheus and Grafana:
   ```bash
   docker compose -f infra/docker-compose.yml up -d prometheus grafana
   ```
2. Verify Prometheus targets are scraping:
   Open `http://localhost:9090/targets` or run:
   ```bash
   curl.exe -s http://localhost:9090/api/v1/targets | grep '"health":"up"'
   ```
3. Open Grafana dashboards at `http://localhost:3003` to verify request rate and latency graphs.

---

### Step 9: Post-Recovery Synthetic Smoke Validation

Execute automated end-to-end smoke verification:
```bash
# 1. Edge health
curl.exe http://localhost/nginx-health

# 2. Public Catalog Read via HTTPS
curl.exe -k https://localhost/api/v1/products?limit=1

# 3. Aggregated Gateway Health
curl.exe http://localhost:4000/health
```

---

### Step 10: Automated Disaster Reconstruction Exercise (Local Simulation)

To perform a safe, end-to-end automated simulation in dry-run mode:
```bash
node scripts/dr/dr-reconstruction.mjs --dry-run
```

To execute a confirmed live reconstruction against an isolated test container:
```bash
npm run dr:reconstruct -- --confirm-destructive
```

---

## 4. Emergency Contacts & Escalation Matrix

| Role | Contact Channel | Primary Responsibility |
|:-----|:----------------|:-----------------------|
| **Incident Commander** | Slack `#incident-response` | Overall coordination, stakeholder updates, rollback decisions |
| **SRE Lead / On-Call** | PagerDuty Tier 1 | Infrastructure, Docker daemon, network, Nginx, Prometheus |
| **Database Administrator** | PagerDuty Tier 2 | PostgreSQL backup verification, schema validation, restore execution |
| **Backend Service Lead** | Slack `#backend-oncall` | Microservice dependency health, Kafka topic initialization, outbox catch-up |
| **Security Officer** | Slack `#security-eng` | Secret rotation, credential validation, TLS certificate integrity |
