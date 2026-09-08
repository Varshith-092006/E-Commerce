# Kafka Event Catalog & Contract Specification
**Phase 11: Kafka Event Schema Governance & Compatibility**
*Document Version:* 1.0.0  
*Evaluation Date:* 2026-09-08  
*Governance Model:* Lightweight In-Code Schema Enforcement (No Schema Registry / No Avro)

---

## 1. Executive Summary & Inventory Classification

This catalog formalizes all event contracts published across the e-commerce platform. In strict accordance with Phase 11 governance, all events are classified into explicit lifecycle states based on physical codebase evidence:

| Event Type | Version | Status | Primary Topic | Producer Service |
|:-----------|:--------|:-------|:--------------|:-----------------|
| `order.placed` | 1 | **ACTIVE** | `ecommerce.order-events` | `order-svc` |
| `order.cancelled` | 1 | **ACTIVE** | `ecommerce.order-events` | `order-svc` |
| `order.delivered` | 1 | **ACTIVE** | `ecommerce.order-events` | `order-svc` |
| `order.cancellationRequested` | 1 | **PLANNED** | `ecommerce.order-events` | — |
| `order.returnApproved` | 1 | **PLANNED** | `ecommerce.order-events` | — |
| `payment.authorized` | 1 | **ACTIVE** | `ecommerce.payment-events` | `payment-svc` |
| `payment.captured` | 1 | **ACTIVE** | `ecommerce.payment-events` | `payment-svc` |
| `payment.failed` | 1 | **ACTIVE** | `ecommerce.payment-events` | `payment-svc` |
| `payment.refunded` | 1 | **ACTIVE** | `ecommerce.payment-events` | `payment-svc` |
| `inventory.reserved` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `inventory.committed` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `inventory.released` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `shipment.created` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `shipment.shipped` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `shipment.delivered` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `return.pickedUp` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `return.received` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `return.completed` | 1 | **ACTIVE** | `ecommerce.fulfillment-events` | `fulfillment-svc` |
| `review.created` | 1 | **ACTIVE** | `ecommerce.review-events` | `catalog-svc` |
| `review.updated` | 1 | **ACTIVE** | `ecommerce.review-events` | `catalog-svc` |
| `review.deleted` | 1 | **ACTIVE** | `ecommerce.review-events` | `catalog-svc` |
| `event.dead_letter` | 1 | **ACTIVE** | `ecommerce.dead-letter-events` | `packages/shared (consumer)` |

---

## 2. Standard Event Envelope Specification

Every Kafka message across all topics is wrapped in the standardized `KafkaEventEnvelope`:

```json
{
  "eventId": "370ef1da-8f9a-4efa-88ed-efe42a93b8db",
  "eventType": "order.placed",
  "eventVersion": 1,
  "occurredAt": "2026-09-08T00:00:00.000Z",
  "sourceService": "order-svc",
  "aggregateType": "order",
  "aggregateId": "order-uuid-123",
  "correlationId": "corr-uuid-456",
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "requestId": "req-uuid-789",
  "idempotencyKey": "370ef1da-8f9a-4efa-88ed-efe42a93b8db",
  "payload": { ... }
}
```

---

## 3. Detailed Active Event Specifications

### 3.1 Order Domain (`ecommerce.order-events`)

#### `order.placed`
- **Version:** `1`
- **Producer:** `order-svc` (`order-outbox.worker.js`)
- **Consumers:**
  - `fulfillment-svc` (`fulfillment-order-group`): Reserves initial stock.
  - `notification-svc` (`notification-group`): Emits customer order confirmation.
- **Partition Key:** `orderId` (ensures total ordering of all state transitions for this order).
- **Required Payload Fields:**
  - `orderId` (string, UUID)
  - `totalAmount` (number)
- **Optional Payload Fields:**
  - `customerId` (string, UUID)
  - `items` (array of objects with `productId`, `quantity`, `price`)
  - `shippingAddress` (object)
- **Failure & Retry Behavior:** 3 consumer retries with exponential backoff and jitter.
- **DLQ Routing:** Routed to `ecommerce.dead-letter-events` after max retries or schema error.
- **Idempotency:** Tracked via `ProcessedEvent` unique constraint `[consumer_group, event_id]`.

#### `order.cancelled`
- **Version:** `1`
- **Producer:** `order-svc` (`order-outbox.worker.js`)
- **Consumers:** `fulfillment-svc`, `notification-svc`
- **Partition Key:** `orderId`
- **Required Payload Fields:** `orderId` (string)
- **Optional Payload Fields:** `reason` (string), `cancelledAt` (ISO timestamp)
- **Failure & DLQ:** Same as `order.placed`.

#### `order.delivered`
- **Version:** `1`
- **Producer:** `order-svc` (`order-outbox.worker.js`)
- **Consumers:** `notification-svc`
- **Partition Key:** `orderId`
- **Required Payload Fields:** `orderId` (string)
- **Optional Payload Fields:** `deliveredAt` (ISO timestamp)

---

### 3.2 Payment Domain (`ecommerce.payment-events`)

#### `payment.captured`
- **Version:** `1`
- **Producer:** `payment-svc` (`payment-outbox.worker.js`)
- **Consumers:**
  - `order-svc` (`order-saga-group`): Confirms order and triggers fulfillment saga.
  - `fulfillment-svc` (`fulfillment-payment-group`): Commits reserved inventory.
  - `notification-svc` (`notification-group`): Sends payment receipt.
- **Partition Key:** `orderId` (links payment sequence directly with order partition).
- **Required Payload Fields:**
  - `paymentId` (string, UUID)
  - `orderId` (string, UUID)
  - `amount` (number)
- **Optional Payload Fields:**
  - `currency` (string, default: `INR`)
  - `razorpayPaymentId` (string)
- **Failure & DLQ:** Standard 3 retries, dead-letter routing upon permanent failure.
- **Idempotency:** Enforced via `payment_processed_events` and database unique constraints.

#### `payment.failed`
- **Version:** `1`
- **Producer:** `payment-svc` (`payment-outbox.worker.js`)
- **Consumers:** `order-svc` (`order-saga-group`), `notification-svc`
- **Partition Key:** `orderId`
- **Required Payload Fields:** `orderId` (string)
- **Optional Payload Fields:** `paymentId` (string), `reason` (string)

#### `payment.refunded`
- **Version:** `1`
- **Producer:** `payment-svc` (`payment-outbox.worker.js`)
- **Consumers:** `order-svc` (`order-saga-group`), `notification-svc`
- **Partition Key:** `orderId`
- **Required Payload Fields:** `paymentId` (string), `orderId` (string), `amount` (number)

---

### 3.3 Fulfillment Domain (`ecommerce.fulfillment-events`)

#### `inventory.reserved` / `inventory.committed` / `inventory.released`
- **Version:** `1`
- **Producer:** `fulfillment-svc` (`fulfillment-outbox.worker.js`)
- **Consumers:** `order-svc` (`order-saga-group`), `notification-svc`
- **Partition Key:** `orderId`
- **Required Payload Fields:** `orderId` (string)
- **Optional Payload Fields:** `items` (array), `warehouseId` (string)

#### `shipment.shipped` / `shipment.delivered`
- **Version:** `1`
- **Producer:** `fulfillment-svc` (`fulfillment-outbox.worker.js`)
- **Consumers:** `order-svc` (`order-saga-group`), `notification-svc`
- **Partition Key:** `orderId`
- **Required Payload Fields:** `orderId` (string)
- **Optional Payload Fields:** `trackingNumber` (string), `carrier` (string)

#### `return.completed`
- **Version:** `1`
- **Producer:** `fulfillment-svc` (`fulfillment-outbox.worker.js`)
- **Consumers:** `payment-svc` (`payment-return-group`), `order-svc`
- **Partition Key:** `orderId`
- **Required Payload Fields:** `orderId` (string)
- **Optional Payload Fields:** `returnId` (string), `refundAmount` (number)
- **Effect:** Triggers automated customer refund processing in `payment-svc`.

---

### 3.4 Catalog & Review Domain (`ecommerce.review-events`)

#### `review.created` / `review.updated` / `review.deleted`
- **Version:** `1`
- **Producer:** `catalog-svc` (`catalog-outbox.worker.js`)
- **Consumers:** `catalog-svc` (`catalog-review-group`), `notification-svc`
- **Partition Key:** `productId` (ensures single-partition review aggregations per product).
- **Required Payload Fields:** `productId` (string)
- **Optional Payload Fields:** `rating` (number 1-5), `reviewId` (string), `comment` (string)

---

### 3.5 Dead Letter Queue (`ecommerce.dead-letter-events`)

#### `event.dead_letter`
- **Version:** `1`
- **Producer:** `packages/shared/src/kafka/kafka-consumer.js`
- **Consumers:** `notification-svc` (`notification-dlq-group`)
- **Partition Key:** Original event key or `originalTopic:partition:offset`
- **Required Payload Fields:**
  - `originalTopic` (string)
  - `originalOffset` (string)
  - `reason` (string: `SCHEMA_VALIDATION_FAILED`, `UNSUPPORTED_EVENT_VERSION`, `MAX_RETRIES_EXCEEDED`)
  - `error` (string)
  - `originalEnvelope` (object)

---

## 4. Planned / Unimplemented Events (Non-Active)
The following event types are declared in `EventTypes` constants but are **not currently produced** by active outbox workers in the codebase:
- `order.cancellationRequested`
- `order.returnApproved`
- `inventory.reservationFailed`
- `inventory.adjusted`
- `inventory.low_stock`
- `return.requested`
- `return.rejected`
- `return.refundInitiated`

*Policy:* These are documented as planned future additions. No consumer may rely on them as active production contracts until outbox producers are formally implemented.
