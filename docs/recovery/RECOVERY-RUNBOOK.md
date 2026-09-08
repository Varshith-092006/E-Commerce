# Disaster Recovery & Database Restoration Runbook
**Phase 8: High-Availability & Disaster Recovery Operations**
*Document Version:* 1.0.0  
*Target Environment:* Microservices Platform (PostgreSQL 16 Multi-Database Architecture)

---

## 1. Scope & Objectives
This runbook provides step-by-step, copy-paste operational procedures to execute emergency database recovery across all 6 isolated PostgreSQL service databases:
- `identity_db` (Port 5432 / DB: `identity_db`)
- `catalog_db` (Port 5432 / DB: `catalog_db`)
- `order_db` (Port 5432 / DB: `order_db`)
- `payment_db` (Port 5432 / DB: `payment_db`)
- `fulfillment_db` (Port 5432 / DB: `fulfillment_db`)
- `notification_db` (Port 5432 / DB: `notification_db`)

> [!CAUTION]
> **DESTRUCTIVE RESTORE GUARDRAIL:**
> Never execute raw drop or restore commands directly against the primary cluster (`ecommerce-postgres`). All disaster recovery restores must first be executed into an isolated disposable container (`ecommerce-postgres-restore`) or verified staging host.

---

## 2. Emergency Recovery Workflow

```mermaid
flowchart TD
    A[Disaster / Data Corruption Detected] --> B[1. Stop Ingress & Affected Microservices]
    B --> C[2. Locate Latest Verified Backup]
    C --> D[3. Cryptographically Verify SHA-256 Checksums]
    D -->|Integrity Fails| E[Halt: Investigate Secondary Snapshot]
    D -->|Integrity Passes| F[4. Provision Disposable Restore Target]
    F --> G[5. Restore Logical SQL Snapshots]
    G --> H[6. Validate Schema & Relational Invariants]
    H --> I[7. Validate Outbox & Idempotency Logs]
    I --> J[8. Switch Traffic & Reconnect Services]
    J --> K[9. Validate End-to-End Health & API Reads]
```

---

## 3. Step-by-Step Recovery Procedures

### Step 1: Identify Failure & Declare Disaster Event
Inspect service health indicators and error logs to confirm data corruption, accidental deletion, or host volume failure:
```bash
# Check service health status
curl -s http://localhost:4000/health | jq .

# Inspect PostgreSQL server logs
docker logs --tail 100 ecommerce-postgres
```

### Step 2: Stop Affected Services (Prevent Dirty Writes)
To avoid split-brain states or cascading partial transactions, temporarily stop write traffic to the affected services:
```bash
# Example: Stop order and payment ingress
docker stop ecommerce-order-svc-1 ecommerce-order-svc-2 ecommerce-payment-svc
```

### Step 3: Locate Latest Valid Backup Set
Backups are archived in timestamped directories under `backups/YYYY-MM-DD_HH-mm-ss/`:
```bash
# List available backups ordered by recency
ls -lt backups/
```

### Step 4: Verify Backup Archive Integrity
Before performing any restoration, run cryptographic SHA-256 verification against the `manifest.json`:
```bash
npm run verify:backups
# Alternatively, target a specific directory:
node scripts/verify-backups.mjs --backup backups/2026-09-07_21-30-00
```
*Expected Output:* `ALL 6 DATABASES VERIFIED: VALID (0 errors)`

### Step 5: Provision Isolated Disposable Restore Container
Spin up an isolated PostgreSQL 16 instance on the Docker network.
```bash
# Spin up disposable container
docker run -d --name ecommerce-postgres-restore \
  --network infra_ecommerce-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=postgres \
  postgres:16-alpine

# Initialize empty database catalogs
docker exec -i ecommerce-postgres-restore psql -U postgres -d postgres < infra/postgres/init-databases.sql
```

### Step 6: Execute Database Restore
Restore all or specific microservice databases into the disposable target using the safety-validated CLI:
> [!WARNING]
> Restoring requires the explicit `--confirm-restore` flag. Without this flag, the tool runs in `--dry-run` mode.

```bash
# Dry run verification (Default)
npm run restore:database -- --database all --target-container ecommerce-postgres-restore

# Confirmed restoration
npm run restore:database -- --database all --target-container ecommerce-postgres-restore --confirm-restore
```

### Step 7: Verify Restored Schema & Tables
Verify that all schemas, relations, and indexes have restored correctly:
```bash
# Verify tables exist across all databases
for db in identity_db catalog_db order_db payment_db fulfillment_db notification_db; do
  echo "Checking $db:"
  docker exec ecommerce-postgres-restore psql -U postgres -d $db -c "\dt"
done
```

### Step 8: Verify Row Counts & Invariant Consistency
Compare row counts and primary key foreign key relations against expected baselines:
```bash
node scripts/verify-restore.mjs --target-container ecommerce-postgres-restore
```

### Step 9: Validate Outbox and Idempotency States
Ensure transactional outbox queues and idempotency deduplication tables are preserved:
```bash
# Check Order Outbox state in restored database
docker exec ecommerce-postgres-restore psql -U postgres -d order_db \
  -c "SELECT status, COUNT(*) FROM outbox_events GROUP BY status;"

# Check Payment Processed Events
docker exec ecommerce-postgres-restore psql -U postgres -d payment_db \
  -c "SELECT event_type, COUNT(*) FROM processed_events GROUP BY event_type;"
```

### Step 10: Reconnect Services to Restored Database
Once data validation passes 100%, update the microservice connection configurations to point to the validated restore target:
```bash
# Update DATABASE_URL environment variables in docker-compose.override.yml or service definitions:
# DATABASE_URL="postgresql://postgres:postgrespassword@ecommerce-postgres-restore:5432/<db_name>?schema=public"

# Restart services
docker compose -f infra/docker-compose.yml up -d ecommerce-order-svc-1 ecommerce-order-svc-2 ecommerce-payment-svc
```

### Step 11: Validate System Health Endpoints
Verify all dependent services successfully connect and pass readiness probes:
```bash
curl -s http://localhost:4000/health
curl -s http://localhost:4001/health
curl -s http://localhost:4002/health
curl -s http://localhost:4003/health
curl -s http://localhost:4004/health
curl -s http://localhost:4005/health
curl -s http://localhost:4006/health
```

### Step 12: Validate Representative API Read Operations
Execute smoke reads across the core customer, product, and order workflows:
```bash
# 1. Product Catalog Listing
curl -s "http://localhost:4000/api/v1/products?limit=5" | jq .

# 2. Category Hierarchy
curl -s "http://localhost:4000/api/v1/categories" | jq .
```

### Step 13: Post-Recovery Monitoring & Cleanup
- Monitor application latency and DB connection pools via Prometheus (`http://localhost:9090`) and Grafana (`http://localhost:3003`).
- Clean up the disposable container once traffic is stabilized or primary storage has been permanently reconstructed.
```bash
# Tear down disposable container after migration
docker rm -f ecommerce-postgres-restore
```

---

## 4. Emergency Escalation & Contacts
- **Primary Contact:** Platform SRE On-Call
- **Database Team:** Data Engineering & Infrastructure
- **Security Team:** Incident Response
