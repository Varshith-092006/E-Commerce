# E-Commerce Platform — End-to-End Execution Guide

---

## 1. Prerequisites Checklist

Ensure the following tools are installed on your machine:
* **Node.js**: `v20.x` or higher (`node -v`)
* **npm**: `v10.x` or higher (`npm -v`)
* **Docker & Docker Compose**: Docker Desktop running (`docker --version`, `docker compose version`)

---

## 2. Step 1: Start PostgreSQL & Redis Infrastructure

The platform uses 6 dedicated PostgreSQL databases and a shared Redis instance. Start them in the background using Docker Compose:

```bash
# Navigate to the repository root
cd "c:\Users\The Mighty King\Desktop\E-Commerce\ecommerce-platform"

# Start PostgreSQL and Redis containers
docker compose -f infra/docker-compose.yml up -d postgres redis
```

Verify that both containers are healthy:
```bash
docker ps
```
You should see `ecommerce-postgres` (port `5432`) and `ecommerce-redis` (port `6379`) running.

---

## 3. Step 2: Initialize Database Schemas & Migrations

Deploy the Prisma migrations across all 6 isolated database schemas:

```bash
# 1. Identity Service Database
npx prisma migrate deploy --schema=services/identity-svc/prisma/schema.prisma

# 2. Catalog Service Database
npx prisma migrate deploy --schema=services/catalog-svc/prisma/schema.prisma

# 3. Order Service Database
npx prisma migrate deploy --schema=services/order-svc/prisma/schema.prisma

# 4. Payment Service Database
npx prisma migrate deploy --schema=services/payment-svc/prisma/schema.prisma

# 5. Fulfillment Service Database
npx prisma migrate deploy --schema=services/fulfillment-svc/prisma/schema.prisma

# 6. Notification Service Database
npx prisma migrate deploy --schema=services/notification-svc/prisma/schema.prisma
```

Generate the Prisma Client libraries:
```bash
npx prisma generate --schema=services/identity-svc/prisma/schema.prisma
npx prisma generate --schema=services/catalog-svc/prisma/schema.prisma
npx prisma generate --schema=services/order-svc/prisma/schema.prisma
npx prisma generate --schema=services/payment-svc/prisma/schema.prisma
npx prisma generate --schema=services/fulfillment-svc/prisma/schema.prisma
npx prisma generate --schema=services/notification-svc/prisma/schema.prisma
```

---

## 4. Step 3: Run the Microservices

You can run the platform using **Option A (Local Node.js)** or **Option B (Full Docker Compose)**.

---

### Option A: Local Node.js Execution (Recommended for Development & Testing)

Open separate terminal windows (or tabs) in the root directory for each service:

#### Terminal 1 — Gateway (Port 4000)
```bash
node services/gateway/src/server.js
```

#### Terminal 2 — Identity Service (Port 4001)
```bash
node services/identity-svc/src/server.js
```

#### Terminal 3 — Catalog Service (Port 4002)
```bash
node services/catalog-svc/src/server.js
```

#### Terminal 4 — Order Service (Port 4003)
```bash
START_OUTBOX_WORKERS=true node services/order-svc/src/server.js
```

#### Terminal 5 — Payment Service (Port 4004)
```bash
START_OUTBOX_WORKERS=true node services/payment-svc/src/server.js
```

#### Terminal 6 — Fulfillment Service (Port 4005)
```bash
START_OUTBOX_WORKERS=true node services/fulfillment-svc/src/server.js
```

#### Terminal 7 — Notification Service (Port 4006)
```bash
node services/notification-svc/src/server.js
```

---

### Option B: Full Containerized Execution (All 7 Services via Docker)

To run the entire backend inside Docker containers:

```bash
docker compose -f infra/docker-compose.yml up --build -d
```

To view live logs from all services:
```bash
docker compose -f infra/docker-compose.yml logs -f
```

---

## 5. Step 4: Verify Platform Health & Prometheus Metrics

Once services are running, run these quick curl commands or open them in your browser:

### 1. Gateway Health Check
```bash
curl http://localhost:4000/health
```
**Expected Response**:
```json
{
  "status": "UP",
  "service": "gateway",
  "timestamp": "..."
}
```

### 2. Prometheus Golden Signals Metrics
```bash
curl http://localhost:4000/metrics
```
**Expected Output**: Standard Prometheus metric text with `http_requests_total`, `http_request_duration_seconds`, `http_active_requests`.

### 3. Individual Service Health Checks
* **Identity**: `curl http://localhost:4001/health`
* **Catalog**: `curl http://localhost:4002/health`
* **Order**: `curl http://localhost:4003/health`
* **Payment**: `curl http://localhost:4004/health`
* **Fulfillment**: `curl http://localhost:4005/health`
* **Notification**: `curl http://localhost:4006/health`

---

## 6. Step 5: Test End-to-End Business Flow

### 1. Register a Customer
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login & Obtain JWT Token
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Password123!"
  }'
```
*Copy the `accessToken` from the response.*

### 3. Query Catalog Products
```bash
curl http://localhost:4000/api/v1/products
```

### 4. Connect to Real-Time SSE Stream (In a separate terminal)
```bash
curl -N -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  http://localhost:4000/api/v1/notifications/stream
```

### 5. Access Admin Command Center Dashboard (Admin Token required)
```bash
curl -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  http://localhost:4000/api/v1/admin/dashboard/stats
```

---

## 7. Step 6: Shutdown & Cleanup Commands

### Stopping Local Node.js Processes
Press `Ctrl + C` in each terminal window.

### Stopping Docker Infrastructure
```bash
# Stop containers without deleting database data
docker compose -f infra/docker-compose.yml down

# Stop and wipe databases (Fresh reset)
docker compose -f infra/docker-compose.yml down -v
```

---

## 8. Summary of Service Ports

```
┌───────────────────┬──────┬────────────────────────────────────────────────────────┐
│ Service           │ Port │ Public Entrypoint / Base URL                           │
├───────────────────┼──────┼────────────────────────────────────────────────────────┤
│ API Gateway       │ 4000 │ http://localhost:4000 (Main entrypoint for all clients)│
│ identity-svc      │ 4001 │ http://localhost:4001/api/v1/auth                      │
│ catalog-svc       │ 4002 │ http://localhost:4002/api/v1/products                  │
│ order-svc         │ 4003 │ http://localhost:4003/api/v1/orders                    │
│ payment-svc       │ 4004 │ http://localhost:4004/api/v1/payments                  │
│ fulfillment-svc   │ 4005 │ http://localhost:4005/api/v1/fulfillment               │
│ notification-svc  │ 4006 │ http://localhost:4006/api/v1/notifications             │
│ PostgreSQL        │ 5432 │ postgresql://localhost:5432                            │
│ Redis             │ 6379 │ redis://localhost:6379                                 │
└───────────────────┴──────┴────────────────────────────────────────────────────────┘
```
