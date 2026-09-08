# STAGE 1: Project Technology Map & Core Fundamentals — Deep Dive

> **Senior Architect & Mentorship Masterclass**  
> *Target Level*: From Beginner (20%) to Advanced Architectural Mastery (100%).  
> *Repository Scope*: Fully grounded in [`ecommerce-platform/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/).  
> *Format*: Structured progressively using the 9-part pedagogical framework (Concept, Why, Prerequisites, Implementation, Flow, Example, Failure Case, Interview Knowledge, Practice).

---

## Table of Contents
1. [Architectural Overview & Philosophy](#1-architectural-overview--philosophy)
2. [Runtime & Language: Node.js 20+ & ECMAScript Modules](#2-runtime--language-nodejs-20--ecmascript-modules)
3. [Web Server & HTTP Pipeline: Express.js v4.19](#3-web-server--http-pipeline-expressjs-v419)
4. [Relational Storage: PostgreSQL 16 & Database-per-Service](#4-relational-storage-postgresql-16--database-per-service)
5. [Data Modeling & Access: Prisma ORM v5.16](#5-data-modeling--access-prisma-orm-v516)
6. [In-Memory State & Caching: Redis 7 (RESP & LRU)](#6-in-memory-state--caching-redis-7-resp--lru)
7. [Distributed Streaming: Apache Kafka 7.6.1 & ZooKeeper](#7-distributed-streaming-apache-kafka-761--zookeeper)
8. [Perimeter Security & Edge Proxy: Nginx (Alpine)](#8-perimeter-security--edge-proxy-nginx-alpine)
9. [Application Gateway: Express API Gateway & Proxy](#9-application-gateway-express-api-gateway--proxy)
10. [Identity, Encryption & Auth: JWT & Bcrypt](#10-identity-encryption--auth-jwt--bcrypt)
11. [Structured Observability: Pino, Prometheus & Grafana](#11-structured-observability-pino-prometheus--grafana)
12. [Container Virtualization & Orchestration: Docker & Compose](#12-container-virtualization--orchestration-docker--compose)
13. [Testing Harness: Jest v29 & Supertest v7](#13-testing-harness-jest-v29--supertest-v7)
14. [Summary Review & Self-Assessment Exercises](#14-summary-review--self-assessment-exercises)

---

## 1. Architectural Overview & Philosophy

Before diving into individual software components, we must understand **why** this repository exists in this specific form.

### The Problem with the Monolith in High-Scale E-Commerce
In a traditional monolithic e-commerce application:
1. Product browsing, shopping carts, checkout, payment processing, warehouse fulfillment, and customer email alerts all execute within a **single operating system process**.
2. All business modules connect to a **single shared database**.
3. If marketing launches a flash sale, tens of thousands of users search for products simultaneously. The database CPU hits 100%, query queues fill up, and customers attempting to pay for orders time out.
4. If a bug is introduced into the email template formatting logic, an uncaught exception can crash the entire Node.js process, taking down checkout and payments.

### The Microservices Solution in This Repository
This platform decomposes the e-commerce domain into **7 autonomous microservices**:
* **`gateway` (Port 3000)**: Public API ingress, rate limiting, and request routing.
* **`identity-svc` (Port 3001)**: User registration, password hashing, and authentication tokens.
* **`catalog-svc` (Port 3002)**: Products, categories, search, reviews, and high-speed Redis read caching.
* **`order-svc` (Port 3003)**: Shopping carts, checkout calculation, order placement, and outbox event creation.
* **`payment-svc` (Port 3004)**: Payment authorization, external gateway processing, and financial ledger recording.
* **`fulfillment-svc` (Port 3005)**: Inventory reservation, stock tracking, and shipping logistics.
* **`notification-svc` (Port 3006)**: Asynchronous customer notifications via email and SMS.

---

## 2. Runtime & Language: Node.js 20+ & ECMAScript Modules

### CONCEPT
Node.js is an open-source, cross-platform runtime environment executing JavaScript outside web browsers. It runs on the Google V8 JavaScript engine. Unlike traditional multi-threaded web servers (which spawn an OS thread of 1MB–8MB stack size for each incoming connection), Node.js uses a **single-threaded event loop** backed by a non-blocking asynchronous I/O pool (`libuv`).

In this project, Node.js is configured with native **ECMAScript Modules (ESM)** via `"type": "module"` in [`package.json`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/package.json#L5). This standardizes all imports using `import` and `export` statements rather than legacy CommonJS `require()`.

### WHY
E-commerce backends are overwhelmingly **I/O-bound** (waiting on network packets, database disk reads, and Kafka queues), not CPU-bound (complex 3D rendering or video encoding). Node.js can hold tens of thousands of concurrent open socket connections using minimal memory because the main thread never blocks waiting for a database to answer a query.

### PREREQUISITES
1. **JavaScript Basics**: Variables (`const`, `let`), arrow functions, object destructuring.
2. **Asynchronous Execution**: Promises, `.then()`, `async`/`await`, `try`/`catch`.
3. **The Event Loop**: Microtask queue (Promise callbacks) vs Macrotask queue (`setTimeout`, I/O events).

### PROJECT IMPLEMENTATION
* **Root Configuration**: [`package.json`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/package.json) specifies:
  ```json
  "type": "module",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
  ```
* **Workspaces**: Configured as an npm monorepo (`"workspaces": ["packages/*", "services/*", "apps/*"]`), allowing [`packages/shared`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared) to be imported across all services as `@ecommerce/shared`.

### FLOW
```
Incoming Client HTTP Request
            ↓
Kernel accepts TCP connection on socket
            ↓
Node.js Event Loop receives 'connection' event
            ↓
Express route triggers an async database read
            ↓
Node.js offloads DB network call to libuv
            ↓
Main thread immediately accepts the NEXT client connection!
            ↓
Database finishes query -> response arrives on socket
            ↓
libuv pushes callback onto Node.js microtask queue
            ↓
Event Loop executes callback -> Express formats JSON -> sends response
```

### EXAMPLE
In [`packages/shared/src/utils/logger.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/logger.js):
```javascript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime
});
```
Notice the modern `import` and `export` syntax—no `require()` or `module.exports`.

### FAILURE CASE
If an engineer writes CPU-blocking code on the main thread:
```javascript
// FATAL ANTI-PATTERN
app.get('/compute', (req, res) => {
  const end = Date.now() + 5000;
  while (Date.now() < end) {} // Freezes the event loop for 5 seconds!
  res.send('Done');
});
```
While that 5-second `while` loop runs, **not a single other user can load products, log in, or pay**. All incoming requests queue up, socket buffers fill, and clients receive HTTP 504 Gateway Timeout errors.

### INTERVIEW KNOWLEDGE
* *Question*: "Is Node.js truly single-threaded?"
* *Answer*: "JavaScript execution in Node.js runs on a single main thread. However, libuv provides a background thread pool (default 4 threads) for blocking system tasks like file system access, DNS resolution, and certain crypto operations. Furthermore, network I/O utilizes OS-native non-blocking notification systems (like epoll on Linux, kqueue on macOS, and IOCP on Windows) without consuming worker threads."

### PRACTICE
Open [`package.json`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/package.json) and verify lines 5 and 47–50. Notice how npm workspaces link `packages/*` and `services/*`.

---

## 3. Web Server & HTTP Pipeline: Express.js v4.19

### CONCEPT
Express is a minimalist, unopinionated routing and middleware web framework for Node.js. It wraps incoming HTTP requests (`http.IncomingMessage`) and server responses (`http.ServerResponse`) into developer-friendly objects (`req` and `res`), organizing business logic into a sequential chain of functions known as **middleware**.

### WHY
Handling HTTP requests manually using Node's raw `http.createServer()` requires manual URL regex parsing, manual query-string decoding, manual body buffering, and manual header setting. Express standardizes these tasks into reusable, composable middleware.

### PREREQUISITES
1. **HTTP Protocol**: Request methods (`GET`, `POST`, `PUT`, `DELETE`), URL paths, headers, status codes.
2. **Functions as First-Class Citizens**: Passing functions as arguments (callbacks).

### PROJECT IMPLEMENTATION
Every microservice boots an Express application in `src/server.js`. For example:
* [`services/gateway/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/server.js)
* [`services/identity-svc/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/src/server.js)

### FLOW
The Express middleware chain executes strictly in the order middlewares are registered with `app.use()`:

```mermaid
graph LR
    Req[Incoming HTTP Request] --> M1[1. Correlation Middleware]
    M1 --> M2[2. Helmet Security Headers]
    M2 --> M3[3. Body Parser express.json]
    M3 --> M4[4. Rate Limiter Redis]
    M4 --> M5[5. Auth Verifier JWT]
    M5 --> C[6. Business Controller]
    C --> Res[7. HTTP Response 200/201]
    
    M4 -.->|Rate limit breached| Err[Error Handler 429]
    M5 -.->|Invalid token| Err[Error Handler 401]
    C -.->|Uncaught Exception| Err[Error Handler 500]
```

### EXAMPLE
In [`services/gateway/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/server.js):
```javascript
const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(correlationMiddleware);

// Routes
app.use('/api/v1', proxyRoutes);

// Centralized error handler MUST be registered LAST
app.use((err, req, res, next) => {
  logger.error({ err, correlationId: req.correlationId }, 'Unhandled error');
  res.status(err.status || 500).json({ error: err.message });
});
```

### FAILURE CASE
1. **Forgetting `next()`**: If a custom middleware does some logging but forgets to call `next()`, the request freezes. The browser spinner keeps spinning until the browser gives up.
2. **Forgetting `err` in Error Handler**: If an error middleware only declares 3 parameters `(req, res, next)` instead of 4 `(err, req, res, next)`, Express treats it as normal middleware and will **never route errors to it**, exposing raw stack traces to the public internet!

### INTERVIEW KNOWLEDGE
* *Question*: "How does Express know a middleware is an error handler?"
* *Answer*: "Express inspects the function's arity (`fn.length`). If a function takes exactly 4 arguments `(err, req, res, next)`, Express marks it as an error-handling middleware. When any upstream middleware calls `next(new Error('...'))`, Express skips all normal 3-argument middlewares and immediately calls the next 4-argument error handler."

### PRACTICE
Inspect [`packages/shared/src/middleware/correlation.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/middleware/correlation.js). Observe how it reads `req.headers['x-correlation-id']`, generates a UUID if missing, sets it on the response header, and calls `next()`.

---

## 4. Relational Storage: PostgreSQL 16 & Database-per-Service

### CONCEPT
PostgreSQL is a world-class object-relational database. In this platform, rather than creating one gigantic database containing hundreds of tables for all services, we strictly enforce the **Database-per-Service** architectural pattern.

Each domain microservice owns its own isolated logical PostgreSQL database running inside the `ecommerce-postgres` container:
1. `identity_db`
2. `catalog_db`
3. `order_db`
4. `payment_db`
5. `fulfillment_db`
6. `notification_db`

### WHY
* **Zero Accidental Coupling**: A developer working on `catalog-svc` cannot write a SQL query joining `orders` and `users`. Cross-service joins destroy modularity and prevent services from being refactored or rewritten in another language.
* **Failure Blast Radius Isolation**: If a complex catalog search query causes database connection pool saturation, the `payment_db` remains completely unaffected, allowing checkouts to proceed normally.
* **Independent Schema Migrations**: `order-svc` can add columns or alter constraints without scheduling downtime or coordinating with the identity team.

### PREREQUISITES
1. **Relational Concepts**: Tables, primary keys, foreign keys, unique constraints.
2. **Transactions**: `BEGIN`, `COMMIT`, `ROLLBACK`.
3. **Connection Pooling**: Why opening a TCP connection to PostgreSQL on every HTTP request is too slow (process fork overhead in PostgreSQL).

### PROJECT IMPLEMENTATION
* **Container Definition**: [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml#L7-L34)
* **Initialization Script**: [`infra/postgres/init-databases.sql`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/postgres/init-databases.sql)
  ```sql
  CREATE DATABASE identity_db;
  CREATE DATABASE catalog_db;
  CREATE DATABASE order_db;
  CREATE DATABASE payment_db;
  CREATE DATABASE fulfillment_db;
  CREATE DATABASE notification_db;
  ```

### FLOW
```
order-svc (Port 3003)
      ↓ (TCP Connection to postgres:5432)
Authenticates as 'postgres' user
      ↓
Selects database 'order_db'
      ↓
Can ONLY access tables in order_db:
  - orders
  - order_items
  - outbox_events
  - processed_events
      ↓
Cannot see or query 'users' table in identity_db!
```

### EXAMPLE
In [`services/order-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/order-svc/prisma/schema.prisma):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // points specifically to order_db!
}

model Order {
  id          String      @id @default(uuid())
  userId      String      // Stored as a raw UUID, NOT a foreign key to identity_db!
  status      OrderStatus @default(PENDING)
  totalAmount Decimal     @db.Decimal(10, 2)
  items       OrderItem[]
  createdAt   DateTime    @default(now())
}
```
Notice `userId` is just a UUID string! It is **not** a database foreign key to another database, because in microservices, databases are physically isolated.

### FAILURE CASE
If an engineer attempts to execute:
```sql
SELECT * FROM orders JOIN identity_db.public.users ON orders.userId = users.id;
```
PostgreSQL throws an error. Standard PostgreSQL connections are bound to a single database; cross-database joins across different logical databases on the same instance are strictly rejected.

### INTERVIEW KNOWLEDGE
* *Question*: "If you have Database-per-Service, how do you handle customer name changes or display customer info on an order?"
* *Answer*: "Through Eventual Consistency and Event-Carried State Transfer. When an order is placed, `order-svc` receives the necessary customer snapshot (e.g. shipping address, email) in the request payload or via Kafka events. Services store what they need locally to remain completely autonomous even if the identity service goes offline."

### PRACTICE
Open [`infra/postgres/init-databases.sql`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/postgres/init-databases.sql) and inspect the 6 database creation statements.

---

## 5. Data Modeling & Access: Prisma ORM v5.16

### CONCEPT
Prisma is a next-generation Object-Relational Mapper (ORM) for Node.js. It replaces manual SQL string queries with:
1. A declarative modeling file (`schema.prisma`).
2. Automated database migrations (`prisma migrate`).
3. An auto-generated, type-safe query builder client (`@prisma/client`).

### WHY
* Writing raw SQL queries by hand often leads to **SQL injection vulnerabilities** if parameters are concatenated instead of parameterized.
* Manual schema migrations using raw `.sql` files are error-prone and hard to track across development and production environments.
* Prisma automatically generates JavaScript objects with exact field auto-completion, eliminating runtime typos like `user.emial` instead of `user.email`.

### PREREQUISITES
1. Basic understanding of schemas and migrations.
2. Understanding why SQL injection occurs (`"SELECT * FROM users WHERE name = '" + name + "'"`).

### PROJECT IMPLEMENTATION
Each microservice contains a `prisma/` folder with its own isolated schema:
* [`services/identity-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/prisma/schema.prisma)
* [`services/catalog-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/catalog-svc/prisma/schema.prisma)
* [`services/order-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/order-svc/prisma/schema.prisma)
* [`services/payment-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/payment-svc/prisma/schema.prisma)
* [`services/fulfillment-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/fulfillment-svc/prisma/schema.prisma)
* [`services/notification-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/notification-svc/prisma/schema.prisma)

### FLOW
```
Developer modifies schema.prisma
            ↓
Runs: npx prisma migrate dev
            ↓
Prisma compares schema with PostgreSQL schema
            ↓
Generates migration SQL file + applies it to DB
            ↓
Generates custom TypeScript/JavaScript query methods inside node_modules/@prisma/client
            ↓
Service imports PrismaClient -> executes safe parameterized queries
```

### EXAMPLE
In `services/identity-svc/src/services/identity.service.js`:
```javascript
// Safe parameterized query executed via Prisma
const user = await prisma.user.findUnique({
  where: { email: inputEmail.toLowerCase() }
});
```

### FAILURE CASE
If developers open a new `new PrismaClient()` inside every single route function instead of sharing a singleton:
```javascript
// DISASTROUS ANTI-PATTERN:
app.get('/users', async (req, res) => {
  const prisma = new PrismaClient(); // Creates 10 new DB connections!
  const users = await prisma.user.findMany();
  res.json(users);
});
```
Within 10 concurrent requests, PostgreSQL exceeds `max_connections` (default 100), throwing `FATAL: remaining connection slots are reserved for non-replication superuser connections`. The entire service crashes. In this codebase, Prisma is strictly instantiated as a **singleton**.

### INTERVIEW KNOWLEDGE
* *Question*: "How does Prisma prevent connection pool exhaustion?"
* *Answer*: "Prisma Client maintains an internal connection pool (defaulting to `num_physical_cpus * 2 + 1`). Reusing a single shared PrismaClient instance across the entire application ensures that requests borrow from and return to this managed pool, preventing unbounded database connection growth."

### PRACTICE
Open [`services/identity-svc/prisma/schema.prisma`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/prisma/schema.prisma). Look at the `User` model, the fields, and the `@unique` constraint on `email`.

---

## 6. In-Memory State & Caching: Redis 7 (RESP & LRU)

### CONCEPT
Redis (Remote Dictionary Server) is an ultra-fast, in-memory key-value data structure store. While PostgreSQL stores data on disk (with access latencies of 5–30 milliseconds), Redis keeps data in RAM, achieving sub-millisecond response times (<0.5 ms).

### WHY
* **Preventing Database Burnout**: During high-traffic events, 90% of requests are read-only searches for popular products. If 5,000 customers view the same smartphone simultaneously, querying PostgreSQL 5,000 times will bring the database to its knees.
* **Distributed Locks**: When two requests try to reserve the last item of inventory at the exact same millisecond, Redis provides atomic mutex locks (`SET key val NX PX`) to guarantee only one succeeds.
* **Rate Limiting**: Tracking request counters per IP address requires atomic increments (`INCR`) with automatic TTL expiration.

### PREREQUISITES
1. Understanding RAM vs Disk read speeds.
2. What a Key-Value store is (e.g. `GET user:123`, `SET user:123 "{...}" EX 300`).
3. What TTL (Time-To-Live) means.

### PROJECT IMPLEMENTATION
* **Container Definition**: `ecommerce-redis` in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml#L35-L59)
  - Configured with `--maxmemory 200mb`
  - Eviction policy: `--maxmemory-policy allkeys-lru` (Least Recently Used)
  - Persistence: `--appendonly yes` (AOF)
* **Client Code**:
  - Cache utility: [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js)
  - Distributed lock: [`packages/shared/src/utils/distributed-lock.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/distributed-lock.js)

### FLOW: The Cache-Aside Pattern
```
Incoming Client Request: GET /api/v1/catalog/products/prod_101
                      ↓
catalog-svc queries Redis: GET "catalog:product:prod_101"
                      ↓
         ┌────────────┴────────────┐
    [CACHE HIT]               [CACHE MISS]
         │                         │
Returns JSON from RAM        Queries PostgreSQL database
Takes 0.4 milliseconds!           Takes 15 milliseconds
         │                         │
         │                   Writes result to Redis:
         │                   SET "catalog:product:prod_101" payload EX 300
         │                         │
         └────────────┬────────────┘
                      ↓
               Sends response to user
```

### EXAMPLE
Look at [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js). It defines `getOrSet()`:
```javascript
export async function getOrSet(redisClient, key, ttlSeconds, fetchFn) {
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached);

  const fresh = await fetchFn();
  if (fresh !== null && fresh !== undefined) {
    // Add jitter to TTL to prevent cache stampedes!
    const jitter = Math.floor(Math.random() * 30);
    await redisClient.set(key, JSON.stringify(fresh), 'EX', ttlSeconds + jitter);
  }
  return fresh;
}
```

### FAILURE CASE
1. **Cache Stampede (Thundering Herd)**: If 1,000 products are cached with the exact same 300-second TTL, at second 300 all 1,000 keys expire at the exact same instant. 10,000 incoming requests hit cache misses simultaneously, causing a thundering herd that crashes the PostgreSQL database.  
   *How this project fixes it*: Notice the **TTL Jitter** above (`ttlSeconds + Math.random() * 30`), staggering expirations randomly over time!
2. **Caching Authoritative Balances**: Caching a user's wallet balance or remaining inventory without invalidation causes dirty reads, allowing users to spend money twice or purchase out-of-stock items. As documented in [`docs/BACKEND_CACHING_AUDIT_AND_RECOMMENDATIONS.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/BACKEND_CACHING_AUDIT_AND_RECOMMENDATIONS.md), transactional financial state is **never cached**.

### INTERVIEW KNOWLEDGE
* *Question*: "What is `allkeys-lru` in Redis?"
* *Answer*: "`allkeys-lru` instructs Redis that when memory reaches the configured ceiling (`maxmemory 200mb`), it should automatically evict the least-recently-used keys across all keys in the keyspace, regardless of whether they have a TTL. This guarantees Redis never crashes with Out-Of-Memory (OOM) errors."

### PRACTICE
Read [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js) and find the TTL jitter logic.

---

## 7. Distributed Streaming: Apache Kafka 7.6.1 & ZooKeeper

### CONCEPT
Apache Kafka is an open-source, distributed event store and stream-processing platform. It acts as an append-only, partitioned commit log.  
ZooKeeper manages cluster metadata, elects broker leaders, and maintains topic configuration.

### WHY
When a customer clicks "Place Order", several things must happen:
1. Deduct money from the bank.
2. Allocate inventory in the warehouse.
3. Print a packing slip.
4. Send an order confirmation email.
5. Send an SMS alert.

If `order-svc` had to make synchronous HTTP calls to all 5 services while the customer waited, the checkout button would take 10 seconds. Worse, if the email server had a network glitch, the entire checkout would fail!  
Kafka decouples these steps: `order-svc` publishes an `OrderCreated` event to Kafka and responds in **50 milliseconds**. Downstream workers consume and process the event at their own pace.

### PREREQUISITES
1. Pub/Sub (Publish/Subscribe) concept.
2. Producer vs Consumer.
3. Why queues decouple systems in time and space.

### PROJECT IMPLEMENTATION
* **Containers**: `ecommerce-zookeeper` (port 2181) and `ecommerce-kafka` (ports 9092, 29092) in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml#L60-L130).
* **Active Topics** (each configured with 3 partitions):
  1. `ecommerce.order-events`
  2. `ecommerce.payment-events`
  3. `ecommerce.fulfillment-events`
  4. `ecommerce.notification-events`
  5. `ecommerce.dead-letter-events`
  6. `ecommerce.review-events`
  Cataloged in [`docs/events/EVENT-CATALOG.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/events/EVENT-CATALOG.md).
* **Client Implementation**: KafkaJS wrappers in [`packages/shared/src/kafka/`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/).

### FLOW
```
order-svc produces event to partition:
[Offset 0] [Offset 1] [Offset 2] [Offset 3: OrderCreated #101]
                                        ↑
payment-svc consumer reads Offset 3 ─────┘
      ↓
Charges customer credit card
      ↓
Commits offset 3 to Kafka -> moves to Offset 4!
```

### EXAMPLE
In [`packages/shared/src/kafka/kafka-event-envelope.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/kafka-event-envelope.js), every event is wrapped in a strict governance envelope:
```javascript
export function createEventEnvelope({ eventType, source, data, correlationId, schemaVersion = 1 }) {
  return {
    eventId: crypto.randomUUID(),
    eventType,
    source,
    schemaVersion,
    timestamp: new Date().toISOString(),
    correlationId: correlationId || crypto.randomUUID(),
    data
  };
}
```

### FAILURE CASE: The Dual-Write Problem
What happens if `order-svc` writes the order to PostgreSQL, and right before calling `kafka.send()`, the server loses power?  
The order is saved in the database, but the event is **never sent to Kafka**! The customer is never charged, the warehouse never ships the box, and the order is permanently lost in limbo.  
*How this project fixes it*: The **Transactional Outbox Pattern**! (We will study this in detail in Stage 7).

### INTERVIEW KNOWLEDGE
* *Question*: "How does Kafka guarantee message ordering?"
* *Answer*: "Kafka guarantees strict message ordering **only within a single partition**, not across different partitions. To ensure all events for a specific order (Created -> Paid -> Shipped) are processed in exact chronological sequence, the producer must use `orderId` as the **Partition Key**, ensuring all related events hash to the same partition."

### PRACTICE
Open [`docs/events/EVENT-CATALOG.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/events/EVENT-CATALOG.md) and review the 6 active topics and their producer/consumer matrices.

---

## 8. Perimeter Security & Edge Proxy: Nginx (Alpine)

### CONCEPT
Nginx is a high-performance, asynchronous HTTP web server, reverse proxy, and edge load balancer written in C. It sits at the public boundary of the network (listening on standard internet ports 80 and 443).

### WHY
Node.js is great for application logic, but it is not optimized to handle raw internet-level attacks, slow-loris attacks, SSL/TLS handshake overhead, or serving static files. Nginx terminates SSL/TLS, buffers slow clients, enforces IP rate limits, and drops malformed HTTP packets before they ever touch Node.js.

### PREREQUISITES
1. Public IP vs Private IP.
2. Ports 80 (HTTP) and 443 (HTTPS).
3. Reverse Proxy vs Forward Proxy.

### PROJECT IMPLEMENTATION
* **Container**: `ecommerce-nginx` in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml#L450-L480).
* **Configuration**: [`infra/nginx/nginx.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/nginx.conf) and [`infra/nginx/conf.d/default.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/conf.d/default.conf).

### FLOW
```
Internet Client (Browser / Mobile App)
            ↓ (Public Port 80/443)
Nginx Edge Proxy
            ├─→ /static/* ────→ Serves React bundles directly from disk!
            └─→ /api/* ───────→ Forwards to Gateway (gateway:3000) over private network
```

### EXAMPLE
In [`infra/nginx/conf.d/default.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/conf.d/default.conf):
```nginx
upstream gateway_upstream {
    server gateway:3000 max_fails=3 fail_timeout=10s;
    keepalive 32;
}

server {
    listen 80;
    client_max_body_size 10M;

    location /api/ {
        proxy_pass http://gateway_upstream;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### FAILURE CASE
If someone uploads a 5GB file to flood your backend, without Nginx's `client_max_body_size 10M;`, that 5GB stream would enter the Node.js process, consuming heap memory until Node.js crashes with `JavaScript heap out of memory`. Nginx drops the request at the perimeter with `413 Request Entity Too Large` in 0.1 milliseconds.

### INTERVIEW KNOWLEDGE
* *Question*: "Why use `keepalive 32;` inside an Nginx upstream block?"
* *Answer*: "`keepalive` maintains an open pool of TCP connections between Nginx and the upstream Node.js servers. Without keepalive, Nginx opens and tears down a brand new TCP handshake for every single client request, which leads to ephemeral port exhaustion (`TIME_WAIT` socket buildup) under high load."

### PRACTICE
Open [`infra/nginx/conf.d/default.conf`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/nginx/conf.d/default.conf) and verify the `client_max_body_size` directive and the `gateway_upstream` configuration.

---

## 9. Application Gateway: Express API Gateway & Proxy

### CONCEPT
The API Gateway is the central software router for the microservice fleet. While Nginx acts as the **network edge**, the API Gateway acts as the **application edge**.

### WHY
Clients (web and mobile apps) should not need to know the IP addresses or port numbers of 7 different backend microservices. The API Gateway provides a **single unified endpoint** (`/api/v1/*`), handles authentication centrally, injects user identity headers, and routes traffic internally using `http-proxy-middleware`.

### PREREQUISITES
1. Path rewriting (`/api/v1/orders` -> `http://order-svc:3003/orders`).
2. Authentication verification at the gateway.

### PROJECT IMPLEMENTATION
* [`services/gateway/src/server.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/server.js)
* Proxy routing: [`services/gateway/src/routes/proxy.routes.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/routes/proxy.routes.js)

### FLOW
```
Incoming Client Request: GET /api/v1/orders/123
Header: Authorization: Bearer <JWT_TOKEN>
                   ↓
Gateway intercepts request on Port 3000
                   ↓
Verifies JWT signature using JWT_SECRET
Extracts: userId = "usr_99", role = "CUSTOMER"
                   ↓
Injects secure internal headers:
  x-user-id: usr_99
  x-user-role: CUSTOMER
  x-internal-gateway-secret: <SECRET>
                   ↓
Proxies request to: http://order-svc:3003/orders/123
                   ↓
order-svc trusts x-user-id and executes query!
```

### EXAMPLE
In [`services/gateway/src/routes/proxy.routes.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/routes/proxy.routes.js):
```javascript
const createServiceProxy = (target, pathRewrite) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      proxyReq: (proxyReq, req) => {
        // Propagate tracing and auth headers
        if (req.correlationId) proxyReq.setHeader('x-correlation-id', req.correlationId);
        if (req.user) {
          proxyReq.setHeader('x-user-id', req.user.id);
          proxyReq.setHeader('x-user-role', req.user.role);
        }
        // Protect services from direct spoofing
        proxyReq.setHeader('x-internal-gateway-secret', process.env.INTERNAL_GATEWAY_SECRET);
      }
    }
  });
};
```

### FAILURE CASE: Header Spoofing
If a malicious hacker bypasses the gateway and sends an HTTP request directly to `order-svc:3003` with `x-user-id: admin_account`, what stops them from stealing another user's orders?  
*How this project fixes it*: The **Internal Gateway Secret** (`INTERNAL_GATEWAY_SECRET`). Downstream services reject any request that does not contain this cryptographic shared secret, ensuring only verified Gateway traffic is accepted!

### INTERVIEW KNOWLEDGE
* *Question*: "Why validate JWTs at the Gateway instead of having every microservice validate them independently?"
* *Answer*: "Validating at the Gateway offloads repetitive crypto operations from downstream services, provides centralized token blacklisting/rate-limiting, and rejects unauthorized requests before they ever consume internal network bandwidth or database connections."

### PRACTICE
Open [`services/gateway/src/routes/proxy.routes.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/routes/proxy.routes.js) and examine how routes are mapped to each downstream service port.

---

## 10. Identity, Encryption & Auth: JWT & Bcrypt

### CONCEPT
* **Bcrypt**: An adaptive, slow, one-way cryptographic hash function designed specifically for passwords. It uses an internal salt and a configurable work factor (cost).
* **JWT (JSON Web Token)**: A compact, URL-safe container format (RFC 7519) consisting of 3 parts separated by dots: `Header.Payload.Signature`.

### WHY
* Passwords must **never** be stored in plain text or using fast algorithms like MD5/SHA256 (which can be cracked at billions of hashes per second using GPUs). Bcrypt forces calculation to take ~100ms per attempt, making brute-force attacks computationally impossible.
* JWTs provide **stateless authorization**. The server signs the user's ID and role into the token. Any microservice with the secret key can verify the token without looking up a session in the database.

### PREREQUISITES
1. Hashing vs Symmetric Encryption vs Asymmetric Encryption.
2. What a digital signature is.

### PROJECT IMPLEMENTATION
* Shared utilities in [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js).
* Password hashing in [`services/identity-svc/src/services/identity.service.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/identity-svc/src/services/identity.service.js).

### FLOW: Login & Token Lifecycle
```
User submits: POST /api/v1/auth/login { email, password: "SecretPassword123" }
                        ↓
identity-svc queries User from identity_db
Returns stored hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
                        ↓
bcrypt.compare("SecretPassword123", storedHash) === TRUE
                        ↓
jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })
                        ↓
Returns: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                        ↓
User stores token and sends it in future requests:
Header: Authorization: Bearer <token>
```

### EXAMPLE
In [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js):
```javascript
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload, secret, expiresIn = '1h') {
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error('JWT_SECRET must be explicitly configured in production');
  }
  return jwt.sign(payload, secret, { expiresIn });
}
```

### FAILURE CASE
If someone modifies the payload of a JWT token from `role: "CUSTOMER"` to `role: "ADMIN"`, the HMAC-SHA256 signature calculated with `JWT_SECRET` will **no longer match the signature attached to the token**. The gateway immediately detects the tampering and rejects the request with `HTTP 401 Unauthorized`.

### INTERVIEW KNOWLEDGE
* *Question*: "Why is Bcrypt resistant to rainbow table attacks?"
* *Answer*: "Bcrypt automatically generates a unique, cryptographically random salt (typically 16 bytes) that is embedded directly into the final hash output string. Because every password has a unique salt, precomputed rainbow tables are useless—an attacker must crack each user's password individually from scratch."

### PRACTICE
Read [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js) to see how password hashing and JWT token generation are implemented.

---

## 11. Structured Observability: Pino, Prometheus & Grafana

### CONCEPT
Observability is the ability to understand the internal state of a distributed system from its external outputs. It consists of the **Three Pillars of Observability**:
1. **Logs**: Discrete event records formatted as structured JSON via **Pino**.
2. **Metrics**: Aggregatable numerical time-series data scraped by **Prometheus**.
3. **Traces / Visualizations**: Dashboards and graphs displayed in **Grafana**.

### WHY
In a monolith, you read one log file. In a 7-service microservices architecture, a single user checkout involves 5 different containers, 3 databases, and 2 Kafka topics. Plain `console.log()` strings are useless when searching across millions of log lines. Structured JSON with a common `correlationId` allows you to trace a single request across all containers.

### PREREQUISITES
1. Log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`.
2. Metric types: Counter (always goes up), Gauge (goes up and down), Histogram (measures distributions like latency).

### PROJECT IMPLEMENTATION
* **Structured Logger**: [`packages/shared/src/utils/logger.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/logger.js)
* **Metrics Scraper**: [`infra/prometheus/prometheus.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/prometheus/prometheus.yml)
* **Dashboards**: Grafana container on port 3001 in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml#L510-L535).

### FLOW: End-to-End Tracing via Correlation ID
```
Client Request arrives at Gateway
       ↓
Gateway generates UUID: x-correlation-id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
       ↓
Logs: {"level":30,"time":"2026-09-08T12:00:00Z","correlationId":"9b1deb4d...","msg":"Incoming order request"}
       ↓
Gateway forwards header to order-svc
       ↓
order-svc logs with SAME correlationId!
       ↓
order-svc puts correlationId inside Kafka event envelope!
       ↓
payment-svc consumes event and logs with SAME correlationId!
```
*Result*: Searching for `9b1deb4d...` reveals the complete distributed transaction across all services!

### EXAMPLE
In [`packages/shared/src/utils/logger.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/logger.js):
```javascript
// Automatically redacts sensitive fields to prevent credential leaks in logs!
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['password', 'token', 'authorization', 'creditCard', '*.password'],
    censor: '[REDACTED]'
  }
});
```

### FAILURE CASE: High Cardinality Metric Explosion
If a developer tracks a Prometheus metric using a user's email address as a label:
```javascript
// FATAL ANTI-PATTERN:
httpRequestsTotal.inc({ userEmail: req.body.email }); // 1,000,000 users = 1,000,000 time-series!
```
Prometheus must allocate memory for each unique combination of labels. Tracking high-cardinality values (UUIDs, emails) causes Prometheus to run out of RAM and crash. Labels must strictly be low-cardinality (e.g. `method="POST"`, `status="200"`, `route="/api/v1/orders"`).

### INTERVIEW KNOWLEDGE
* *Question*: "What is the difference between P50, P95, and P99 latency?"
* *Answer*: "Average latency is misleading because 1,000 fast requests (10ms) can hide 10 terrible requests (5,000ms). Percentiles give the true user experience: P95 is the response time below which 95% of requests complete. The P99 reveals the worst 1% of transactions—often representing high-value customers with large carts whose requests hit slow database locks."

### PRACTICE
Open [`infra/prometheus/prometheus.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/prometheus/prometheus.yml) and see how Prometheus scrapes each microservice's `:300X/metrics` endpoint every 15 seconds.

---

## 12. Container Virtualization & Orchestration: Docker & Compose

### CONCEPT
* **Docker Image**: A read-only template with instructions for creating a Docker container (like a class in programming).
* **Docker Container**: A runnable instance of an image (like an object instantiated from a class).
* **Docker Compose**: A tool for defining and running multi-container Docker applications using a single YAML file.

### WHY
Without Docker, running this system requires installing PostgreSQL, creating 6 databases, installing Redis, downloading Kafka, configuring ZooKeeper, installing Nginx, installing Prometheus, and booting 7 Node.js services manually. With Docker Compose, everything spins up with guaranteed network connectivity in seconds:
```bash
docker compose -f infra/docker-compose.yml up -d
```

### PREREQUISITES
1. Containers vs Virtual Machines.
2. Port mapping syntax (`"host_port:container_port"`, e.g. `"5432:5432"`).
3. Docker volumes for data persistence.

### PROJECT IMPLEMENTATION
* Defined in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml).
* Network: `ecommerce-net` (bridge network).
* Volumes: `postgres_data`, `redis_data`, `zookeeper_data`, `kafka_data`, `prometheus_data`, `grafana_data`.

### FLOW: Container Networking & Service Discovery
```
Host Machine (Windows / Linux / macOS)
┌────────────────────────────────────────────────────────────┐
│ Docker Daemon Engine                                       │
│                                                            │
│   Bridge Network: ecommerce-net                            │
│   ┌───────────────────┐             ┌──────────────────┐   │
│   │ container_name:   │             │ container_name:  │   │
│   │ ecommerce-gateway │             │ order-svc        │   │
│   │                   │──HTTP/TCP──→│ IP: 172.20.0.8   │   │
│   └───────────────────┘             └──────────────────┘   │
│             │                                 │            │
│             │                                 │            │
│             ▼                                 ▼            │
│   ┌───────────────────┐             ┌──────────────────┐   │
│   │ container_name:   │             │ container_name:  │   │
│   │ ecommerce-redis   │             │ ecommerce-postgres   │
│   │ IP: 172.20.0.3    │             │ IP: 172.20.0.4   │   │
│   └───────────────────┘             └──────────────────┘   │
└────────────────────────────────────────────────────────────┘
```
Inside the container network, containers don't need to know each other's IP addresses; Docker's embedded DNS server automatically translates `http://order-svc:3003` to `172.20.0.8`.

### EXAMPLE
Look at [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml#L20-L24):
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 5s
  timeout: 5s
  retries: 5
```
This guarantees that dependent services (like `order-svc`) wait until PostgreSQL is genuinely accepting connections before attempting to boot!

### FAILURE CASE
If a developer does not map a named volume:
```yaml
# BAD: Missing volume mapping
postgres:
  image: postgres:16-alpine
  # volumes:
  #   - postgres_data:/var/lib/postgresql/data
```
When the container is stopped or recreated (`docker compose down`), **all 6 databases and all customer orders are wiped clean from disk**! Named volumes ensure database data is saved on the host machine's physical storage outside the container filesystem.

### INTERVIEW KNOWLEDGE
* *Question*: "What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?"
* *Answer*: "`ENTRYPOINT` sets the default binary/executable that will always run when the container starts (e.g. `docker-entrypoint.sh`). `CMD` sets default arguments passed to that entrypoint, which can easily be overridden from the command line when running `docker run <image> <override-args>`."

### PRACTICE
Open [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml) and inspect the volume definitions at lines 570–588.

---

## 13. Testing Harness: Jest v29 & Supertest v7

### CONCEPT
* **Jest**: A comprehensive JavaScript test runner providing assertion libraries (`expect`), test suites (`describe`, `it`), code coverage analysis, and mock functions (`jest.fn()`).
* **Supertest**: An HTTP assertion library that allows testing Express applications directly by injecting synthetic HTTP requests into the Express listener without binding to live network ports.

### WHY
In a distributed system, fixing a bug in one service can easily cause silent breakages in another service's assumptions. Automated tests provide a regression safety net. This repository has **106 test suites containing 800 automated tests**, all running with 100% pass rates.

### PREREQUISITES
1. Unit tests (testing a single function in isolation).
2. Integration tests (testing a route + middleware + database query together).
3. Mocking external I/O (Kafka, Redis, 3rd-party APIs).

### PROJECT IMPLEMENTATION
* Configuration: [`jest.config.cjs`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/jest.config.cjs)
* Test suites:
  - Unit tests: `npm run test:unit`
  - Integration tests: `npm run test:integration`
  - Full test suite: `npm test`

### FLOW: Supertest In-Memory Execution
```
Jest test launches
       ↓
Imports Express app from 'services/identity-svc/src/app.js'
       ↓
Supertest sends synthetic: POST /api/v1/auth/login
       ↓
Request passes through Express middleware -> controller -> mock DB
       ↓
Supertest receives response object
       ↓
expect(res.status).toBe(200);
expect(res.body).toHaveProperty('token');
```

### EXAMPLE
From an active test suite:
```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('POST /api/v1/auth/login', () => {
  it('should return 200 and a JWT token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@example.com', password: 'Password123!' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('token');
  });
});
```

### FAILURE CASE
If an asynchronous test forgets to `await` a Promise:
```javascript
// BAD TEST:
it('tests login', () => {
  request(app).post('/login').then(res => {
    expect(res.status).toBe(200); // Test finishes BEFORE this assertion runs!
  });
});
```
Jest marks the test as PASSED before the assertion even executes! If the code breaks later, the test will still falsely report green. All async tests must use `async`/`await`.

### INTERVIEW KNOWLEDGE
* *Question*: "Why should integration tests use `runInBand` in Jest?"
* *Answer*: "By default, Jest runs test files in parallel across multiple worker threads. If multiple integration tests execute against the same live PostgreSQL database simultaneously, they will suffer from race conditions, conflicting transactions, and foreign key deadlocks. `--runInBand` forces tests to execute sequentially in a single process."

### PRACTICE
Look at [`package.json`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/package.json#L16-L18). Notice how `npm run test:integration` explicitly includes `--runInBand`!

---

## 14. Summary Review & Self-Assessment Exercises

### What You Have Mastered in Stage 1
1. **Node.js ESM**: Asynchronous, event-loop driven runtime with modern import/export syntax.
2. **Express.js**: Middleware pipeline handling routing, security, parsing, and error trapping.
3. **PostgreSQL 16**: 6 isolated relational databases enforcing the Database-per-Service pattern.
4. **Prisma ORM**: Declarative modeling and safe, parameterized queries without SQL injection.
5. **Redis 7**: High-speed RAM caching using the Cache-Aside pattern, protected by TTL jitter and LRU eviction.
6. **Kafka & ZooKeeper**: Commit-log streaming with partitioned topics and consumer groups.
7. **Nginx**: Edge reverse proxy handling TLS, static assets, and DDoS request buffering.
8. **API Gateway**: Central application router performing JWT validation and header propagation.
9. **JWT & Bcrypt**: Salted password hashing and stateless token authorization.
10. **Observability**: Structured JSON logging (Pino), time-series metrics (Prometheus), and dashboards (Grafana).
11. **Docker Compose**: Container networking over `ecommerce-net` using DNS service discovery.
12. **Jest & Supertest**: Automated verification harness validating 800 tests.

---

### Stage 1 Knowledge Assessment (10 Questions)

Test your understanding by answering these questions:

1. **Why does Node.js not allocate a new operating system thread for every incoming HTTP connection?**
2. **What are the 4 arguments required for an Express error-handling middleware, and why does the argument count matter?**
3. **What is the Database-per-Service pattern, and why is an SQL JOIN between `orders` and `users` forbidden in this architecture?**
4. **In Redis caching, what is a "cache stampede" and how does "TTL jitter" prevent it?**
5. **Why is authoritative financial data (like payment balances or remaining product stock) forbidden from being cached in Redis without strict locks?**
6. **What is the difference between Nginx and the Express API Gateway in this platform?**
7. **Why does Kafka guarantee message ordering within a partition, but NOT across different partitions?**
8. **What stops a malicious user from bypassing the Gateway and sending fake headers directly to `order-svc`?**
9. **Why is Bcrypt intentionally designed to be computationally slow compared to SHA-256?**
10. **Inside a Docker container on `ecommerce-net`, why does connecting to `localhost:5432` fail to connect to PostgreSQL?**

---

### Practical Inspection Task

Perform this practical verification in the repository right now:
1. Open [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml).
2. Locate the service named `gateway`.
3. Identify:
   - What port does it expose to the host machine?
   - What internal network does it join?
   - Name 3 environment variables passed into it.
