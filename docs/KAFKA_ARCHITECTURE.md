# Apache Kafka Event Bus Architecture Specification

## 1. System Overview & Topology

Apache Kafka serves as the high-throughput, durable, fault-tolerant event backbone across the e-commerce microservices platform.

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    order-svc    │       │   payment-svc   │       │ fulfillment-svc │
│ (Outbox Worker) │       │ (Outbox Worker) │       │ (Outbox Worker) │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ ecommerce.order-│       │ecommerce.payment│       │  ecommerce.     │
│     events      │       │     -events     │       │fulfillment-events
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         ├─────────────────────────┼─────────────────────────┤
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  fulfillment-svc │     │    order-svc     │     │ notification-svc │
│(fulfillment-group│     │(order-saga-group)│     │(notification-grp)│
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 2. Topic Topology & Partitioning Matrix

| Topic Name | Partition Key | Emitted Events | Primary Consumers |
| :--- | :--- | :--- | :--- |
| **`ecommerce.order-events`** | `orderId` | `order.placed`, `order.confirmed`, `order.shipped`, `order.out_for_delivery`, `order.delivered`, `order.cancelled` | `fulfillment-svc` (`fulfillment-order-group`), `notification-svc` (`notification-group`) |
| **`ecommerce.payment-events`** | `orderId` | `payment.created`, `payment.captured`, `payment.failed`, `payment.refunded` | `fulfillment-svc` (`fulfillment-payment-group`), `order-svc` (`order-saga-group`), `notification-svc` (`notification-group`) |
| **`ecommerce.fulfillment-events`** | `orderId` / `shipmentId` | `inventory.reserved`, `inventory.committed`, `inventory.released`, `inventory.low_stock`, `shipment.created`, `shipment.shipped`, `shipment.delivered`, `return.requested`, `return.pickedUp`, `return.received`, `return.completed` | `order-svc` (`order-saga-group`), `payment-svc` (`payment-return-group`), `notification-svc` (`notification-group`) |
| **`ecommerce.notification-events`** | `userId` | `notification.dispatch` | `notification-svc` (`notification-group`) |
| **`ecommerce.dead-letter-events`** | `originalTopic` | `event.failed_max_retries` | Operational DLQ Replay Subsystem |

---

## 3. Producer-Consumer Matrix

| Source Microservice | Topic Published To | Consuming Microservice | Consumer Group ID | Action Performed |
| :--- | :--- | :--- | :--- | :--- |
| `order-svc` | `ecommerce.order-events` | `fulfillment-svc` | `fulfillment-order-group` | Creates or releases 15-minute TTL atomic inventory reservations. |
| `order-svc` | `ecommerce.order-events` | `notification-svc` | `notification-group` | Dispatches `order.placed` / `order.shipped` Email, SMS & SSE notifications. |
| `payment-svc` | `ecommerce.payment-events` | `fulfillment-svc` | `fulfillment-payment-group` | Commits reservation & allocates multi-warehouse shipment on `payment.captured`. |
| `payment-svc` | `ecommerce.payment-events` | `order-svc` | `order-saga-group` | Synchronizes payment status in Order state machine. |
| `fulfillment-svc` | `ecommerce.fulfillment-events` | `order-svc` | `order-saga-group` | Updates order state machine (`SHIPPED`, `DELIVERED`, `RETURNED`). |
| `fulfillment-svc` | `ecommerce.fulfillment-events` | `payment-svc` | `payment-return-group` | Triggers automated Razorpay/COD customer refund on `return.completed`. |

---

## 4. Event Envelope & Tracing Propagation

All Kafka messages encapsulate data inside `KafkaEventEnvelope` (`packages/shared/src/kafka/kafka-event-envelope.js`):

```json
{
  "eventId": "evt_01917a2b-3c4d-7e8f-9a0b-1c2d3e4f5a6b",
  "eventType": "order.placed",
  "eventVersion": 1,
  "occurredAt": "2026-08-26T09:30:00.000Z",
  "sourceService": "order-svc",
  "aggregateType": "order",
  "aggregateId": "ord_98765",
  "correlationId": "corr_12345",
  "traceId": "trace_abc123",
  "requestId": "req_xyz789",
  "idempotencyKey": "evt_01917a2b-3c4d-7e8f-9a0b-1c2d3e4f5a6b",
  "payload": {
    "orderId": "ord_98765",
    "userId": "usr_4321",
    "totalAmount": "299.99",
    "items": []
  }
}
```

Kafka message headers automatically propagate `x-trace-id`, `x-request-id`, `correlation-id`, `source-service`, and `event-type`.

---

## 5. Idempotency & Delivery Guarantees

1. **At-Least-Once Delivery**: Producers publish to Kafka topics using `idempotent: true` settings with transactional outbox guarantees.
2. **Consumer Idempotency**: Consumers check composite keys formatted as `${consumerGroup}:${eventId}` before executing database side-effects.
3. **Atomic Execution**: Side-effects and consumer idempotency record insertions occur atomically in PostgreSQL database transactions.

---

## 6. Resilience, Retries, and Dead-Letter Queue (DLQ)

```text
Message Ingested
       ↓
Attempt 1 (Fails) ──> Wait 1s ──> Attempt 2 (Fails) ──> Wait 2s ──> Attempt 3 (Fails)
                                                                            ↓
DLQ (ecommerce.dead-letter-events) <── Max Retries (5) Exceeded <─────── Wait 4s / 8s
```

- **Exponential Backoff**: Retries occur with exponential delays (1s, 2s, 4s, 8s, 16s).
- **Error Classification**: Permanent schema or unparseable JSON errors skip retries and route directly to `ecommerce.dead-letter-events`.
- **Prometheus Metrics**: Instrumenting `kafka_messages_produced_total`, `kafka_messages_consumed_total`, `kafka_consumer_errors_total`, `kafka_consumer_lag`, `kafka_dlq_messages_total`, and `kafka_processing_duration_seconds`.
