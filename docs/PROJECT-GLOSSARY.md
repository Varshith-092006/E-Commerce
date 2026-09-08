# E-Commerce Platform — Technical Architecture Glossary

> **Comprehensive Dictionary of Distributed Systems, Architecture & Engineering Terms**  
> *Target Audience*: Developers learning this codebase from the ground up.  
> *Format*: Simple Definition -> Technical Definition -> Concrete Project Example.

---

### 1. API (Application Programming Interface)
* **Simple Definition**: A menu of options that allows one software program to ask another software program to do something or give it information.
* **Technical Definition**: A formal contract specifying data structures, request formats, URIs, and protocols used to exchange information between software systems.
* **Project Example**: `POST /api/v1/auth/login` accepts `{ email, password }` and returns `{ user, token }` from `services/identity-svc`.

---

### 2. REST (Representational State Transfer)
* **Simple Definition**: A standardized style for designing web APIs using normal web actions like GET (read), POST (create), PUT (replace), and DELETE (remove).
* **Technical Definition**: An architectural style for stateless, client-server distributed hypermedia systems utilizing standard HTTP methods and status codes.
* **Project Example**: `GET /api/v1/catalog/products/123` retrieves product state without creating side-effects on the server.

---

### 3. JWT (JSON Web Token)
* **Simple Definition**: A digitally signed passport in text format that a user presents with every request to prove who they are without having to log in again.
* **Technical Definition**: An open standard (RFC 7519) defining a compact, URL-safe container format for securely transmitting claims between parties, signed using HMAC SHA-256 or RSA/ECDSA.
* **Project Example**: Created in [`packages/shared/src/utils/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/auth.js) via `jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' })`.

---

### 4. RBAC (Role-Based Access Control)
* **Simple Definition**: Restricting what pages and actions a user can perform based on their assigned job title (e.g. customer vs admin vs seller).
* **Technical Definition**: An access control policy where system permissions are grouped into roles and assigned to subjects, evaluated by middleware before route handler execution.
* **Project Example**: Evaluated in [`services/gateway/src/middleware/auth.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/services/gateway/src/middleware/auth.js) to block normal `CUSTOMER` roles from accessing admin endpoints.

---

### 5. TTL (Time-To-Live)
* **Simple Definition**: An expiration countdown timer attached to cached data so old data automatically deletes itself.
* **Technical Definition**: A numeric timestamp or millisecond duration setting the lifespan of a cache entry or message before eviction from memory or storage.
* **Project Example**: Product catalog cached in Redis with a 300-second TTL in [`packages/shared/src/utils/cache.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/cache.js).

---

### 6. Cache-Aside Pattern
* **Simple Definition**: Look for data on the quick whiteboard first; if it's not there, get it from the file cabinet and write it on the whiteboard for next time.
* **Technical Definition**: A caching strategy where the application code first queries the cache. On a cache miss, it reads from the primary database, writes the result to the cache with a TTL, and returns the response.
* **Project Example**: `catalog-svc` checking Redis key `product:123` before executing a Prisma query to `catalog_db`.

---

### 7. N+1 Query Problem
* **Simple Definition**: Accidental bad code that asks the database 1 question to get a list, and then makes 100 extra individual questions to get details for each item in the list, making everything very slow.
* **Technical Definition**: A data access anti-pattern where an application executes 1 initial query to fetch $N$ parent records, followed by $N$ separate queries to fetch related child records, rather than a single batched query or join.
* **Project Example**: Prevented in `order-svc` by using Prisma's `include: { items: true }` to fetch an order and all its line items in a single query.

---

### 8. Connection Pool
* **Simple Definition**: A team of pre-opened phone lines to the database so workers don't waste time dialing the phone from scratch every single time they need to talk.
* **Technical Definition**: A cache of active database connection objects maintained by the application runtime, allowing multiple concurrent requests to borrow and return connections without TCP handshake and authentication overhead.
* **Project Example**: Prisma maintains a default connection pool of 10 connections per service instance connecting to PostgreSQL.

---

### 9. Apache Kafka
* **Simple Definition**: A massive, ultra-fast electronic bulletin board where services post notices about things that happened and other services read them when they are ready.
* **Technical Definition**: A distributed, partitioned, replicated commit log service providing high-throughput, low-latency, fault-tolerant publish-subscribe messaging.
* **Project Example**: The Kafka container running on port 9092 in [`infra/docker-compose.yml`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/infra/docker-compose.yml).

---

### 10. Topic
* **Simple Definition**: A named category or folder on the bulletin board (e.g. "Order Announcements", "Payment Announcements").
* **Technical Definition**: A logical stream of related messages in Kafka to which records are published and from which consumers read.
* **Project Example**: `ecommerce.order-events` stores all order-related domain events.

---

### 11. Partition
* **Simple Definition**: Dividing a folder into multiple sub-bins (bin 1, bin 2, bin 3) so multiple workers can read and write at the same time without bumping into each other.
* **Technical Definition**: The fundamental unit of scalability and parallelism in Kafka. An ordered, immutable sequence of messages continuously appended to a commit log.
* **Project Example**: Every topic in this project is configured with 3 partitions (`num.partitions=3`).

---

### 12. Offset
* **Simple Definition**: A sequential line number in a logbook (0, 1, 2, 3...) that tells a reader exactly which line they last read.
* **Technical Definition**: A 64-bit integer uniquely identifying a message within a specific Kafka topic partition, marking the read progress of a consumer group.
* **Project Example**: Tracked automatically by KafkaJS and committed after successful message processing.

---

### 13. Consumer Group
* **Simple Definition**: A team of workers sharing the work of reading messages from a topic so each message is only handled by one worker on the team.
* **Technical Definition**: A set of consumers cooperating to consume messages from a set of Kafka topic partitions, where each partition is assigned to exactly one consumer within the group.
* **Project Example**: `order-service-group`, `payment-service-group`, `fulfillment-service-group`.

---

### 14. Consumer Lag
* **Simple Definition**: How many unread messages are piling up in the inbox waiting to be processed.
* **Technical Definition**: The delta between the latest message offset produced to a partition (high-water mark) and the latest offset committed by a consumer group.
* **Project Example**: Monitored via Prometheus; high lag indicates a downstream service is slowing down or crashed.

---

### 15. DLQ (Dead Letter Queue)
* **Simple Definition**: A special recycle bin for broken or poisoned letters that cannot be read after multiple retries, keeping them safe for inspection without stopping the whole mail room.
* **Technical Definition**: A designated secondary topic or queue where malformed, unparseable, or repeatedly failing messages are routed after exhausting retry budgets.
* **Project Example**: `ecommerce.dead-letter-events` stores unprocessable events for administrative triage.

---

### 16. Transactional Outbox Pattern
* **Simple Definition**: Saving your work and your "to-send" mail in the exact same database transaction, ensuring the message is never lost even if the power cuts out immediately.
* **Technical Definition**: An architectural pattern guaranteeing at-least-once message delivery by persisting the domain entity change and the event message atomically in the same local database transaction, followed by an asynchronous worker polling and publishing the message to the broker.
* **Project Example**: Implemented in [`packages/shared/src/kafka/transactional-outbox.js`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/kafka/transactional-outbox.js).

---

### 17. Idempotency
* **Simple Definition**: Designing an operation so that doing it five times produces the exact same result as doing it once (e.g. clicking the "Place Order" button twice does not charge your card twice).
* **Technical Definition**: A mathematical and architectural property where an operation can be applied multiple times without changing the result beyond the initial application.
* **Project Example**: Consuming microservices record each processed `eventId` in a `processed_events` PostgreSQL table; duplicate deliveries are silently acknowledged without repeating business actions.

---

### 18. Saga Pattern
* **Simple Definition**: An organized relay race across multiple microservices where each service does its part and passes the baton; if someone drops the baton, everyone undoes their steps.
* **Technical Definition**: A design pattern for managing distributed transactions across multiple microservices without 2-phase commit, using a sequence of local transactions coordinated via events (choreography) or an orchestrator, with compensating actions on failure.
* **Project Example**: Order Created -> Payment Captured -> Fulfillment Reserved; if payment fails, order status transitions to `PAYMENT_FAILED`.

---

### 19. Circuit Breaker
* **Simple Definition**: An electrical safety switch that automatically trips and stops sending requests to a broken service so you don't keep banging your head against a brick wall.
* **Technical Definition**: A design pattern that monitors remote calls for failures. When failures exceed a threshold, the breaker trips to "Open" state, immediately returning fallback errors without burdening the failing dependency, and periodically tests recovery ("Half-Open").
* **Project Example**: Gateway circuit breaker protecting downstreams from cascading socket exhaustion.

---

### 20. Bulkhead
* **Simple Definition**: Watertight compartments inside a ship so that if one compartment floods, the entire ship does not sink.
* **Technical Definition**: An isolation pattern partitioning resources (threads, sockets, memory, connection pools) so that failure or saturation in one component cannot consume all resources and starve others.
* **Project Example**: Separate database connection pools and distinct Express route worker limits per microservice.

---

### 21. Backpressure & Load Shedding
* **Simple Definition**: Politely telling new customers "We are full, please try again in a few seconds" instead of accepting everyone and having the entire building collapse under the weight.
* **Technical Definition**: Backpressure slows down ingress producers to match consumer capacity; Load Shedding proactively drops excess incoming requests (returning HTTP 503 or 429) when queue depths or CPU utilization breach safety thresholds.
* **Project Example**: Express load-shedding middleware dropping low-priority requests when latency spikes.

---

### 22. RPO (Recovery Point Objective) & RTO (Recovery Time Objective)
* **Simple Definition**:
  * **RPO**: How many minutes of recent data you are willing to lose if a disaster happens.
  * **RTO**: How many minutes it takes your engineers to get the system back up and running.
* **Technical Definition**:
  * **RPO**: Maximum acceptable age of unrecoverable data following an unplanned outage.
  * **RTO**: Maximum acceptable duration of system downtime before service restoration.
* **Project Example**: This platform targets RPO $\le$ 5 minutes and RTO $\le$ 15 minutes; local dry-run reconstruction verified RTO at **26.79 seconds** in Phase 12.

---

### 23. SLO (Service Level Objective) & SLI (Service Level Indicator)
* **Simple Definition**:
  * **SLI**: The actual thermometer reading of your server (e.g. "99.2% of requests succeeded today").
  * **SLO**: The target goal agreed upon with the business (e.g. "We must keep success above 99.0%").
* **Technical Definition**:
  * **SLI**: A quantifiable metric tracking service performance over time.
  * **SLO**: A target value or range of values for an SLI specified within a service commitment.
* **Project Example**: Documented in [`docs/observability/SLOs.md`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/docs/observability/SLOs.md).

---

### 24. P95 & P99 Latency Percentiles
* **Simple Definition**: If you rank 100 customer requests from fastest to slowest:
  * **P95**: The speed experienced by the 95th customer (only 5% had it worse).
  * **P99**: The speed experienced by the 99th customer (the worst 1% of users).
* **Technical Definition**: Quantiles calculated over a latency distribution representing the threshold below which a given percentage of requests fall, avoiding misleading arithmetic averages skewed by fast requests.
* **Project Example**: Gateway metrics track `http_request_duration_seconds{quantile="0.95"}` and `{quantile="0.99"}`.

---

### 25. High Availability (HA) & Replication Factor (RF)
* **Simple Definition**:
  * **HA**: Running backup copies of servers so if one catches fire, the others keep serving without interruption.
  * **RF**: How many identical copies of each message Kafka keeps stored across different computers.
* **Technical Definition**:
  * **HA**: A system characteristic ensuring operational performance and uptime above agreed thresholds during component failures.
  * **RF**: The number of copies of topic partitions maintained across distinct Kafka broker nodes in a cluster.
* **Project Example**: In local Docker Compose, RF=1 (single broker); enterprise production targets RF=3 across availability zones.
