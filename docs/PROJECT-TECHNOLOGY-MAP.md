# E-Commerce Platform — Complete Technology Map

> **Authoritative Architectural Map & System Inventory**  
> *Target Audience*: Engineering on-boarding, distributed systems mastery, architectural auditing.  
> *Repository Standard*: Fully grounded in active repository evidence (`ecommerce-platform/`).

---

## 1. Programming Languages & Runtimes

### 1.1 JavaScript (Node.js 20+ ES Modules)
1. **What is it?**  
   A dynamic, event-driven, single-threaded runtime environment executing JavaScript outside the browser using the V8 engine, configured across the monorepo with native ECMAScript Modules (`"type": "module"` in [`package.json`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/package.json)).
2. **Why is it used in this project?**  
   Provides asynchronous, non-blocking I/O ideal for high-concurrency microservices, unified tooling across gateway, business services, background workers, and shared libraries.
3. **What problem does it solve?**  
   Eliminates thread-per-connection overhead found in traditional blocking architectures; allows fast JSON serialization/deserialization across HTTP and Kafka.
4. **Where is it implemented?**  
   All services ([`services/gateway`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway), [`services/identity-svc`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc), [`services/catalog-svc`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/catalog-svc), [`services/order-svc`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/order-svc), [`services/payment-svc`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/payment-svc), [`services/fulfillment-svc`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/fulfillment-svc), [`services/notification-svc`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/notification-svc)) and shared utilities ([`packages/shared`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared)).
5. **What would happen if it were removed?**  
   The entire backend runtime and all services would cease to operate.
6. **Prerequisite knowledge needed:**  
   JavaScript fundamentals, Event Loop, Promises, `async`/`await`, ES Module syntax (`import`/`export`), Error handling (`try`/`catch`).
7. **Most important concepts to learn:**  
   Event loop phases (microtask queue vs macrotask queue), non-blocking event-driven I/O, uncaught exceptions vs unhandled rejections, Node stream processing.
8. **Interactions:**  
   Interacts with the operating system, Docker container processes, PostgreSQL drivers, Redis client, and Kafka network sockets.
9. **Production implications:**  
   Single thread must never be blocked with CPU-heavy loops; memory leaks in heap will crash the process (handled by Docker restart policies and PM2/container supervisors).
10. **Parts using it:**  
    100% of backend services, operational scripts ([`scripts/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/)), and tests.

---

### 1.2 SQL (Structured Query Language — PostgreSQL dialect)
1. **What is it?**  
   Declarative query language used to define schemas, constraints, transactions, and manipulate data in relational databases.
2. **Why is it used in this project?**  
   To guarantee ACID (Atomicity, Consistency, Isolation, Durability) properties for core e-commerce data (financial transactions, inventory reservations, order lifecycle).
3. **What problem does it solve?**  
   Prevents data corruption, phantom inventory updates, and race conditions during simultaneous user checkouts and ledger updates.
4. **Where is it implemented?**  
   - [`infra/postgres/init-databases.sql`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/postgres/init-databases.sql) (bootstrap schema & database provisioning)
   - Service Prisma migrations ([`services/*/prisma/migrations/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/order-svc/prisma))
   - Direct raw outbox queries with row-level locking (`SELECT ... FOR UPDATE SKIP LOCKED` in [`packages/shared/src/kafka/transactional-outbox.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/transactional-outbox.js)).
5. **What would happen if it were removed?**  
   Transactional consistency would be lost; inventory overselling and corrupted order records would occur.
6. **Prerequisite knowledge needed:**  
   Relational database theory, tables, primary/foreign keys, joins, indexes, ACID transactions.
7. **Most important concepts to learn:**  
   `BEGIN / COMMIT / ROLLBACK`, row-level locking (`FOR UPDATE SKIP LOCKED`), index scan vs sequential scan, isolation levels (`READ COMMITTED` vs `SERIALIZABLE`).
8. **Interactions:**  
   Interacts with PostgreSQL engine via Prisma ORM and node-postgres pools.
9. **Production implications:**  
   Slow queries lock connections; missing indexes cause CPU spikes; unindexed foreign keys lead to table lock contention.
10. **Parts using it:**  
    All 6 stateful services (`identity-svc`, `catalog-svc`, `order-svc`, `payment-svc`, `fulfillment-svc`, `notification-svc`).

---

## 2. Core Frameworks & Libraries

### 2.1 Express.js (v4.19.2)
1. **What is it?**  
   A minimalist, unopinionated web routing and middleware framework for Node.js.
2. **Why is it used in this project?**  
   Provides standard HTTP routing, request parsing, middleware chaining, and lifecycle hooks for building RESTful microservice endpoints.
3. **What problem does it solve?**  
   Standardizes HTTP request pipelines: correlation ID injection -> authentication -> rate limiting -> schema validation -> controller -> response formatting.
4. **Where is it implemented?**  
   Every service entry point: [`services/gateway/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/server.js) and `services/*/src/server.js`.
5. **What would happen if it were removed?**  
   Services would have to implement raw Node `http.createServer` listeners and manual routing tables.
6. **Prerequisite knowledge needed:**  
   HTTP protocol (methods, headers, status codes), middleware function signature `(req, res, next)`.
7. **Most important concepts to learn:**  
   Middleware order of execution, error-handling middleware (`(err, req, res, next)`), route parameter extraction, response streaming.
8. **Interactions:**  
   Wraps Node HTTP layer; executes security middlewares (`helmet`, `cors`), authentication middleware, and business controllers.
9. **Production implications:**  
   Uncaught asynchronous errors in middleware can hang requests if `next(err)` is not called; request parsing body limits must be enforced to prevent DoS.
10. **Parts using it:**  
    `gateway`, `identity-svc`, `catalog-svc`, `order-svc`, `payment-svc`, `fulfillment-svc`, `notification-svc`.

---

### 2.2 Prisma ORM (v5.16.1)
1. **What is it?**  
   A next-generation Object-Relational Mapper (ORM) providing type-safe database queries, schema modeling, and automated migration management.
2. **Why is it used in this project?**  
   Provides a declarative schema definition language (`schema.prisma`) and an auto-generated client for consistent data access across all services.
3. **What problem does it solve?**  
   Eliminates manual SQL boilerplate, prevents SQL injection via parameterized queries, and guarantees schema version control across migrations.
4. **Where is it implemented?**  
   - Service schemas: [`services/identity-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/prisma/schema.prisma), `services/*/prisma/schema.prisma`.
   - Shared client instantiations and model querying.
5. **What would happen if it were removed?**  
   Services would require raw SQL queries or an alternative ORM like Sequelize or Knex.
6. **Prerequisite knowledge needed:**  
   Database schemas, model relations (1-to-1, 1-to-many, many-to-many), migrations.
7. **Most important concepts to learn:**  
   Prisma connection pooling, transactions (`prisma.$transaction`), query filters, migration lifecycle (`prisma migrate dev` vs `prisma migrate deploy`).
8. **Interactions:**  
   Connects service business logic directly to individual PostgreSQL databases.
9. **Production implications:**  
   Connection pool starvation if service instances exceed PostgreSQL `max_connections`; Prisma engine binary memory usage in container environments.
10. **Parts using it:**  
    All 6 PostgreSQL microservices.

---

### 2.3 KafkaJS (v2.2.4)
1. **What is it?**  
   A production-grade, zero-dependency Apache Kafka client for Node.js written in pure JavaScript.
2. **Why is it used in this project?**  
   Manages all event publication, topic subscription, consumer group partition balancing, heartbeat management, and offset committing.
3. **What problem does it solve?**  
   Enables asynchronous event-driven decoupling between microservices; allows services to publish events without waiting for downstream processing.
4. **Where is it implemented?**  
   - Producer abstraction: [`packages/shared/src/kafka/kafka-producer.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/kafka-producer.js)
   - Consumer abstraction: [`packages/shared/src/kafka/kafka-consumer.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/kafka-consumer.js)
   - Envelope governance: [`packages/shared/src/kafka/kafka-event-envelope.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/kafka-event-envelope.js)
   - Outbox worker: [`packages/shared/src/kafka/transactional-outbox.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/transactional-outbox.js)
5. **What would happen if it were removed?**  
   Asynchronous messaging would fail; services would have to communicate via synchronous HTTP calls, introducing tight coupling and cascade failure risks.
6. **Prerequisite knowledge needed:**  
   Message queues, pub/sub, broker topologies, offsets, consumer groups.
7. **Most important concepts to learn:**  
   `acks: -1` (all ISRs acknowledged), partition assignment, consumer group rebalancing, heartbeat intervals, offset commit semantics.
8. **Interactions:**  
   Communicates over TCP with Kafka brokers on ports 9092 (internal) and 29092 (external).
9. **Production implications:**  
   Slow consumer processing can trigger consumer group rebalance storms if heartbeat timeouts expire; backpressure must be respected.
10. **Parts using it:**  
    `order-svc`, `payment-svc`, `fulfillment-svc`, `notification-svc`, shared Kafka library.

---

### 2.4 ioredis (v5.4.1 / v5.11.1)
1. **What is it?**  
   A robust, full-featured Redis client for Node.js supporting cluster, sentinel, pipelining, and Lua scripting.
2. **Why is it used in this project?**  
   Handles distributed caching, distributed locking (`Redlock` pattern), rate-limiting counters, and token blacklisting.
3. **What problem does it solve?**  
   Prevents database overload via cache-aside read caching; prevents concurrent double-processing using Redis mutex locks.
4. **Where is it implemented?**  
   - Cache manager: [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js)
   - Distributed locking: [`packages/shared/src/utils/distributed-lock.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/distributed-lock.js)
   - Rate limiting: [`services/gateway/src/middleware/rate-limiter.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/middleware/rate-limiter.js)
5. **What would happen if it were removed?**  
   Catalog reads would hit PostgreSQL directly (causing DB exhaustion at scale); distributed rate limiting and multi-replica mutex locking would fail.
6. **Prerequisite knowledge needed:**  
   In-memory data structures, key expiration (TTL), cache invalidation.
7. **Most important concepts to learn:**  
   Atomic commands (`SET NX EX`), pipeline execution, Lua scripts for atomic multi-key operations, reconnection strategies.
8. **Interactions:**  
   Direct TCP connection to Redis container on port 6379.
9. **Production implications:**  
   Redis single-threaded command execution; large unindexed keys or heavy `KEYS *` commands will block the engine.
10. **Parts using it:**  
    `gateway`, `catalog-svc`, `order-svc`, `payment-svc`, `fulfillment-svc`.

---

### 2.5 Pino (v9.1.2) & Pino-Pretty
1. **What is it?**  
   An extremely fast, low-overhead JSON logger for Node.js.
2. **Why is it used in this project?**  
   Generates machine-readable, structured log events containing correlation IDs, timestamps, log levels, and contextual metadata.
3. **What problem does it solve?**  
   Eliminates unstructured `console.log` statements; enables centralized log aggregation, searching, and distributed request tracing.
4. **Where is it implemented?**  
   - Shared logger: [`packages/shared/src/utils/logger.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/logger.js)
   - Used across all service controllers, middlewares, and workers.
5. **What would happen if it were removed?**  
   Debugging distributed transactions, production errors, and latency regressions would be nearly impossible across container boundaries.
6. **Prerequisite knowledge needed:**  
   Log levels (TRACE, DEBUG, INFO, WARN, ERROR, FATAL), structured JSON formats.
7. **Most important concepts to learn:**  
   Asynchronous logging, redaction of sensitive credentials (passwords, JWTs, card tokens), child loggers with contextual metadata.
8. **Interactions:**  
   Writes directly to process `stdout`, scraped by Docker logging drivers or external collectors.
9. **Production implications:**  
   Synchronous logging slows down event loops; Pino formats JSON asynchronously to maintain high throughput.
10. **Parts using it:**  
    Every service and library in the repository.

---

### 2.6 JsonWebToken (v9.0.3) & BcryptJS (v3.0.3)
1. **What is it?**  
   `jsonwebtoken` implements RFC 7519 JSON Web Tokens for stateless identity assertions; `bcryptjs` implements the bcrypt adaptive one-way password hashing algorithm.
2. **Why is it used in this project?**  
   Handles user authentication, password security against rainbow tables/dictionary attacks, and stateless authorization tokens passed to microservices.
3. **What problem does it solve?**  
   Protects stored passwords using salt + work factors; allows downstream services to verify user identity without querying the `identity_db` on every request.
4. **Where is it implemented?**  
   - Authentication utility: [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js)
   - Password hashing: [`services/identity-svc/src/services/identity.service.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/src/services/identity.service.js)
   - Gateway authentication middleware: [`services/gateway/src/middleware/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/middleware/auth.js)
5. **What would happen if it were removed?**  
   User accounts could not be securely authenticated; passwords would be vulnerable to breach.
6. **Prerequisite knowledge needed:**  
   Hashing vs encryption, salt, rainbow tables, digital signatures (HMAC SHA-256), token claims (`sub`, `exp`, `role`).
7. **Most important concepts to learn:**  
   Stateless token verification, token expiration, secret rotation, cost factors in bcrypt (`saltRounds = 10` or `12`).
8. **Interactions:**  
   Token generated by `identity-svc`, verified by `gateway` and downstream microservices using shared `JWT_SECRET`.
9. **Production implications:**  
   JWT revocation requires a distributed blacklist (Redis) or short expiration periods; bcrypt is CPU-intensive and must not run on main event threads with excessive cost factors.
10. **Parts using it:**  
    `identity-svc`, `gateway`, `@ecommerce/shared`.

---

### 2.7 Helmet (v7.1.0) & CORS (v2.8.5)
1. **What is it?**  
   `helmet` configures essential HTTP response headers for security; `cors` configures Cross-Origin Resource Sharing headers.
2. **Why is it used in this project?**  
   Hardens the API Gateway against common web vulnerabilities (XSS, clickjacking, MIME sniffing) and controls browser cross-origin access.
3. **What problem does it solve?**  
   Prevents unauthorized frontend domains from making authenticated API calls and stops browsers from executing dangerous content.
4. **Where is it implemented?**  
   [`services/gateway/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/server.js).
5. **What would happen if it were removed?**  
   Browser-based clients would face CORS errors, and the gateway would emit default headers vulnerable to browser-side exploits.
6. **Prerequisite knowledge needed:**  
   HTTP security headers (`Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`), Same-Origin Policy (SOP).
7. **Most important concepts to learn:**  
   Preflight requests (`OPTIONS`), allowed origins, allowed headers, credential handling in CORS (`Access-Control-Allow-Credentials`).
8. **Interactions:**  
   Intercepts incoming browser requests before routing to internal proxies.
9. **Production implications:**  
   Misconfigured CORS origins allow malicious sites to steal customer data; strict CSP rules must not break legitimate client scripts.
10. **Parts using it:**  
    `services/gateway`.

---

### 2.8 Http-Proxy-Middleware (v3.0.0)
1. **What is it?**  
   HTTP proxy middleware for Node.js Express, redirecting requests to target backend services.
2. **Why is it used in this project?**  
   Enables the API Gateway to route client requests (`/api/v1/catalog/*`, `/api/v1/orders/*`) directly to internal private microservices.
3. **What problem does it solve?**  
   Hides internal microservice network topology from the public internet; provides a single unified entry URL for clients.
4. **Where is it implemented?**  
   [`services/gateway/src/routes/proxy.routes.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/routes/proxy.routes.js).
5. **What would happen if it were removed?**  
   Clients would have to connect directly to each individual service port, exposing internal services to the internet.
6. **Prerequisite knowledge needed:**  
   Forward proxy vs reverse proxy, URL path rewriting, connection streaming.
7. **Most important concepts to learn:**  
   Path rewriting (`pathRewrite`), header forwarding (`x-forwarded-for`, `x-correlation-id`), proxy error handling (`onProxyError`), timeout configuration.
8. **Interactions:**  
   Connects the Gateway process to individual downstream microservices (`identity-svc:3001`, `catalog-svc:3002`, etc.).
9. **Production implications:**  
   Proxy socket pooling and keep-alive settings must match downstream capacities to avoid socket exhaustion.
10. **Parts using it:**  
    `services/gateway`.

---

## 3. Data & Storage Infrastructure

### 3.1 PostgreSQL 16 (Alpine)
1. **What is it?**  
   An enterprise-grade, open-source object-relational database management system.
2. **Why is it used in this project?**  
   Acts as the single source of truth for persistent domain state across 6 independent databases using the **Database-per-Service** pattern.
3. **What problem does it solve?**  
   Guarantees strong data consistency, relational integrity, unique order IDs, ACID transactions, and safe outbox message inserts.
4. **Where is it implemented?**  
   - Docker container: `ecommerce-postgres` in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml)
   - Provisioning script: [`infra/postgres/init-databases.sql`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/postgres/init-databases.sql)
   - 6 isolated logical databases:
     1. `identity_db` (users, credentials, roles)
     2. `catalog_db` (products, categories, pricing)
     3. `order_db` (orders, order items, outbox)
     4. `payment_db` (payments, payment transactions, outbox)
     5. `fulfillment_db` (shipments, inventory reservations, outbox)
     6. `notification_db` (notification logs, delivery statuses)
5. **What would happen if it were removed?**  
   All persistent state would vanish upon service restarts; transactions and data durability would be lost.
6. **Prerequisite knowledge needed:**  
   Relational models, SQL syntax, foreign keys, indexing, transactions.
7. **Most important concepts to learn:**  
   Write-Ahead Logging (WAL), connection pools, MVCC (Multi-Version Concurrency Control), index types (B-Tree, GIN), `pg_dump` backup/recovery.
8. **Interactions:**  
   Serves queries from microservices via Prisma and node-postgres connections.
9. **Production implications:**  
   Requires automated backups, disk I/O monitoring (IOPS), connection pool tuning (`max_connections`), and periodic vacuuming.
10. **Parts using it:**  
    All backend services except the stateless Gateway.

---

### 3.2 Redis 7 (Alpine)
1. **What is it?**  
   An in-memory, key-value data structure store used as a distributed cache, message broker, and synchronization coordinator.
2. **Why is it used in this project?**  
   Configured with `allkeys-lru` eviction policy and an explicit 200MB memory ceiling to provide microsecond-latency caching and distributed locking.
3. **What problem does it solve?**  
   Shields PostgreSQL from read hotspots (e.g. popular product catalog pages); provides atomic distributed locks to prevent double-charging or duplicate fulfillment.
4. **Where is it implemented?**  
   - Container: `ecommerce-redis` in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml)
   - Persistence: Append-Only File (`--appendonly yes`)
   - Client wrappers: [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js) and [`packages/shared/src/utils/distributed-lock.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/distributed-lock.js).
5. **What would happen if it were removed?**  
   Read performance would degrade significantly; distributed locks would be disabled, requiring fallback to database locks.
6. **Prerequisite knowledge needed:**  
   Key-value stores, memory management, eviction algorithms (LRU, LFU).
7. **Most important concepts to learn:**  
   Cache-aside pattern, TTL jitter to prevent cache stampedes, atomic operations (`SETNX`), memory limits (`maxmemory`), persistence tradeoffs (AOF vs RDB).
8. **Interactions:**  
   Connected to by `gateway` (rate limiting) and domain services (`catalog-svc`, `order-svc`, `payment-svc`).
9. **Production implications:**  
   Memory exhaustion crashes Redis unless proper eviction policies are configured; Redis single-threading means slow commands block all clients.
10. **Parts using it:**  
    `gateway`, `catalog-svc`, `order-svc`, `payment-svc`, `fulfillment-svc`.

---

## 4. Messaging & Event Infrastructure

### 4.1 Apache Kafka 7.6.1 & ZooKeeper 7.6.1
1. **What is it?**  
   A distributed event store and stream-processing platform; ZooKeeper coordinates broker metadata, cluster election, and configuration.
2. **Why is it used in this project?**  
   Acts as the backbone for asynchronous event choreography across the entire e-commerce lifecycle (orders, payments, fulfillment, notifications).
3. **What problem does it solve?**  
   Decouples slow or volatile operations (e.g., payment capture, sending emails, inventory reservation) from synchronous HTTP request threads.
4. **Where is it implemented?**  
   - Containers: `ecommerce-kafka` and `ecommerce-zookeeper` in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml)
   - Topic definitions (each configured with 3 partitions and replication factor 1):
     1. `ecommerce.order-events`
     2. `ecommerce.payment-events`
     3. `ecommerce.fulfillment-events`
     4. `ecommerce.notification-events`
     5. `ecommerce.dead-letter-events`
     6. `ecommerce.review-events`
   - Governed in [`docs/events/EVENT-CATALOG.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/events/EVENT-CATALOG.md).
5. **What would happen if it were removed?**  
   Asynchronous workflows would stop functioning; services could not communicate state changes without synchronous HTTP calls.
6. **Prerequisite knowledge needed:**  
   Pub/sub concepts, append-only logs, partition keys, offsets, consumer groups.
7. **Most important concepts to learn:**  
   Partitioning & message ordering guarantees, consumer offset committing, consumer lag, at-least-once delivery, Dead Letter Queues (DLQ).
8. **Interactions:**  
   Kafka brokers interact with ZooKeeper; producers and consumer groups in each microservice interact with Kafka brokers over TCP.
9. **Production implications:**  
   Broker disk space must be monitored for message retention cleanup; ZooKeeper is deprecated in newer Kafka versions in favor of KRaft mode (documented limitation).
10. **Parts using it:**  
    `order-svc`, `payment-svc`, `fulfillment-svc`, `notification-svc`, shared Kafka library.

---

## 5. Edge & Networking Infrastructure

### 5.1 Nginx (Alpine)
1. **What is it?**  
   A high-performance HTTP web server, reverse proxy, and edge load balancer.
2. **Why is it used in this project?**  
   Acts as the public edge boundary, terminating SSL/TLS, enforcing IP rate limits, filtering malicious requests, and serving static frontend assets.
3. **What problem does it solve?**  
   Protects Node.js services from slow-client attacks, limits request payload sizes at the network perimeter, and offloads TLS computation.
4. **Where is it implemented?**  
   - Container: `ecommerce-nginx` in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml)
   - Configuration files: [`infra/nginx/nginx.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/nginx.conf) and [`infra/nginx/conf.d/default.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/conf.d/default.conf).
5. **What would happen if it were removed?**  
   Node.js Gateway would be directly exposed to the public internet, bearing the overhead of TLS handshakes and perimeter security filtering.
6. **Prerequisite knowledge needed:**  
   Reverse proxies, HTTP protocol, TLS certificates, upstream blocks, MIME types.
7. **Most important concepts to learn:**  
   Upstream proxying, connection pooling (`keepalive`), rate-limiting zones (`limit_req_zone`), buffer size controls, security response headers.
8. **Interactions:**  
   Listens on public ports 80 and 443; forwards `/api/*` traffic to `gateway:3000` and static web requests to frontend containers.
9. **Production implications:**  
   Worker processes and worker connections must be tuned to available CPU cores and file descriptor limits (`ulimit`).
10. **Parts using it:**  
    All ingress internet traffic entering the platform.

---

### 5.2 Docker & Docker Compose
1. **What is it?**  
   Container virtualization platform packaging application runtimes, code, and system dependencies into isolated, reproducible container images.
2. **Why is it used in this project?**  
   Provides a unified local and production-like development environment, orchestrating 16 containers over an isolated bridge network (`ecommerce-net`).
3. **What problem does it solve?**  
   Eliminates "works on my machine" issues by guaranteeing identical Node.js, PostgreSQL, Redis, Kafka, and Nginx configurations across machines.
4. **Where is it implemented?**  
   - Main compose: [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml)
   - Dev overrides: [`infra/docker-compose.dev.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.dev.yml)
   - Service Dockerfiles: `services/*/Dockerfile`.
5. **What would happen if it were removed?**  
   Developers would have to manually install, configure, and manage 6 PostgreSQL databases, Redis, ZooKeeper, Kafka, Nginx, Prometheus, and Grafana locally.
6. **Prerequisite knowledge needed:**  
   Virtualization vs containerization, images, containers, volumes, bridge networks, port bindings.
7. **Most important concepts to learn:**  
   Multi-stage Docker builds, container networking (DNS resolution by container name), volume persistence, healthchecks (`pg_isready`, `redis-cli ping`), resource limits (CPU/memory).
8. **Interactions:**  
   Runs all infrastructure services, microservices, and databases within a private Docker network (`ecommerce-net`).
9. **Production implications:**  
   Container logs must be rotated to prevent disk exhaustion; memory limits (`limits.memory`) must be enforced to prevent OOM killer events.
10. **Parts using it:**  
    The entire platform runtime.

---

## 6. Observability & Monitoring

### 6.1 Prometheus
1. **What is it?**  
   An open-source systems monitoring and time-series database utilizing a pull/scrape model over HTTP.
2. **Why is it used in this project?**  
   Scrapes `/metrics` endpoints across all microservices, PostgreSQL exporters, Redis, and Kafka to measure throughput, latency, error rates, and resource utilization.
3. **What problem does it solve?**  
   Provides quantitative real-time visibility into system health, SLO violations, database pool exhaustion, and Kafka consumer lag.
4. **Where is it implemented?**  
   - Container: `ecommerce-prometheus` in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml)
   - Scrape configuration: [`infra/prometheus/prometheus.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/prometheus/prometheus.yml)
   - Shared metrics middleware: [`packages/shared/src/middleware/metrics.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/middleware/metrics.js).
5. **What would happen if it were removed?**  
   Engineering teams would have zero visibility into operational latency, memory consumption, consumer lag, or error spikes until users reported outages.
6. **Prerequisite knowledge needed:**  
   Time-series data, PromQL syntax, metric types (Counter, Gauge, Histogram, Summary).
7. **Most important concepts to learn:**  
   Scrape intervals, metric cardinality (avoiding high-cardinality labels like user IDs), quantile calculations (`histogram_quantile(0.99, ...)`).
8. **Interactions:**  
   Periodically scrapes port `:3000` through `:3006` on path `/metrics`; provides data sources to Grafana.
9. **Production implications:**  
   Metric retention policies and storage disk sizing; scrape targets must not block main application threads.
10. **Parts using it:**  
    Scrapes all backend microservices.

---

### 6.2 Grafana
1. **What is it?**  
   An open-source visualization and analytics dashboard platform.
2. **Why is it used in this project?**  
   Provides interactive visual dashboards for system health, request rates, P95/P99 latencies, database connections, and Kafka lag.
3. **What problem does it solve?**  
   Transforms raw Prometheus time-series data into actionable, unified graphical dashboards for operators and on-call engineers.
4. **Where is it implemented?**  
   - Container: `ecommerce-grafana` on port 3001 in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml)
   - Provisioned dashboards & data sources in `infra/grafana/`.
5. **What would happen if it were removed?**  
   Engineers would have to query raw Prometheus metrics via CLI or basic web interfaces.
6. **Prerequisite knowledge needed:**  
   Dashboard panels, query editors, time windows, alert thresholds.
7. **Most important concepts to learn:**  
   Dashboard templating, alerts based on SLO thresholds, query aggregation.
8. **Interactions:**  
   Connects to Prometheus as its primary time-series data source.
9. **Production implications:**  
   Dashboard queries must be optimized to prevent heavy queries from crashing the Prometheus server.
10. **Parts using it:**  
    Platform operations and monitoring.

---

## 7. Testing & Verification Tooling

### 7.1 Jest (v29.7.0) & Supertest (v7.0.0)
1. **What is it?**  
   `jest` is a delightful JavaScript testing framework; `supertest` is an HTTP assertion library for testing Node.js HTTP servers without binding to network ports.
2. **Why is it used in this project?**  
   Runs the entire test suite comprising **106 test suites and 800 automated tests** across unit, integration, security, and schema governance domains.
3. **What problem does it solve?**  
   Prevents regression defects, validates business logic edge cases, verifies token security, and guarantees backward compatibility of event schemas.
4. **Where is it implemented?**  
   - Configuration: [`jest.config.cjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/jest.config.cjs)
   - Unit tests: `packages/*/tests/unit/`, `services/*/tests/unit/`
   - Integration tests: `packages/*/tests/integration/`, `services/*/tests/integration/`.
5. **What would happen if it were removed?**  
   There would be no automated way to verify platform correctness; bugs would only be discovered at runtime.
6. **Prerequisite knowledge needed:**  
   Assertions (`expect`), test suites (`describe`), test cases (`it`/`test`), mocks, stubs, spies.
7. **Most important concepts to learn:**  
   Testing asynchronous code, mocking external I/O (Kafka brokers, Redis, databases), test lifecycle hooks (`beforeEach`, `afterAll`).
8. **Interactions:**  
   Imports microservice Express apps and executes synthetic HTTP requests against them.
9. **Production implications:**  
   Tests must run in CI/CD before any deployment; flaky tests undermine engineering confidence.
10. **Parts using it:**  
    Validates all microservices, shared packages, and DR orchestration scripts.

---

### 7.2 Custom Chaos & Disaster Recovery Suites
1. **What is it?**  
   Node.js automation scripts executing fault injection, single-database recovery, full-platform disaster reconstruction, and cryptographic backup validation.
2. **Why is it used in this project?**  
   Validates resilience (Phase 7), database backup/recovery RPO/RTO (Phase 8), edge security (Phase 9), and disaster recovery reconstruction (Phase 12).
3. **What problem does it solve?**  
   Proves that the system can recover from database crashes, network partitions, corrupted volumes, and complete datacenter loss with zero data divergence.
4. **Where is it implemented?**  
   - Chaos suite: [`scripts/chaos-test.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/chaos-test.mjs), [`scripts/chaos-suite.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/chaos-suite.mjs)
   - Phase 8 backup/restore: [`scripts/backup-databases.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/backup-databases.mjs), [`scripts/restore-database.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/restore-database.mjs)
   - Phase 12 DR orchestrator: [`scripts/dr/dr-reconstruction.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/dr/dr-reconstruction.mjs), [`scripts/dr/verify-backups.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/dr/verify-backups.mjs), [`scripts/dr/validate-kafka-recovery.mjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/scripts/dr/validate-kafka-recovery.mjs).
5. **What would happen if it were removed?**  
   Backups and recovery plans would remain theoretical and untested until an actual disaster occurs.
6. **Prerequisite knowledge needed:**  
   Disaster recovery terminology (RPO, RTO), cryptographic checksums (SHA-256), process spawning in Node.js (`child_process`).
7. **Most important concepts to learn:**  
   Ordered recovery dependency graphs, dry-run safety modes, outbox event replay, Kafka offset reconciliation, consumer idempotency verification.
8. **Interactions:**  
   Interacts with Docker daemon, PostgreSQL containers, Kafka brokers, and service HTTP health endpoints.
9. **Production implications:**  
   DR reconstruction must be tested periodically in staging environments to ensure backups are restorable.
10. **Parts using it:**  
    Root npm scripts (`npm run dr:reconstruct`, `npm run recovery:suite`, `npm run chaos:suite`).

---

## 8. Summary Technology Matrix

| Technology | Domain | Role in Platform | Key File Reference |
| :--- | :--- | :--- | :--- |
| **Node.js (v20+)** | Runtime | Asynchronous runtime for all services | [`package.json`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/package.json) |
| **Express.js (v4.19)** | Framework | HTTP routing, middleware, controllers | [`services/gateway/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/server.js) |
| **PostgreSQL 16** | Database | ACID relational store (DB-per-Service) | [`infra/postgres/init-databases.sql`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/postgres/init-databases.sql) |
| **Prisma (v5.16)** | ORM | Schema migrations & typed DB queries | [`services/order-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/order-svc/prisma/schema.prisma) |
| **Redis 7** | In-Memory | LRU caching, rate limits, distributed locks | [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js) |
| **Kafka (v7.6.1)** | Event Broker | Asynchronous event streaming | [`packages/shared/src/kafka/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/) |
| **ZooKeeper** | Coordination | Kafka cluster metadata coordinator | [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml) |
| **Nginx (Alpine)** | Reverse Proxy | Perimeter edge proxy, TLS, rate limits | [`infra/nginx/nginx.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/nginx.conf) |
| **Docker Compose** | Orchestration | Multi-container local & test topology | [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml) |
| **Prometheus** | Monitoring | Time-series metrics scraper | [`infra/prometheus/prometheus.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/prometheus/prometheus.yml) |
| **Grafana** | Visualization | Operational dashboards & charts | [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml) |
| **Pino (v9.1)** | Logging | Fast structured JSON logging | [`packages/shared/src/utils/logger.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/logger.js) |
| **BcryptJS / JWT** | Security | Password hashing & stateless auth | [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js) |
| **Jest / Supertest** | Testing | 106 suites / 800 automated tests | [`jest.config.cjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/jest.config.cjs) |
