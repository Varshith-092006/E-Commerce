# Kafka Event Versioning Policy & Evolution Governance

**Document Version:** 1.0.0  
**Phase:** 11 — Kafka Event Schema Governance & Compatibility  
**Scope:** `@ecommerce/shared`, all domain service producers (`order-svc`, `payment-svc`, `fulfillment-svc`, `catalog-svc`), and consumer workers.  

---

## 1. Purpose & Core Principles

This document establishes the official event schema evolution policy for the asynchronous microservices platform. The objective is to ensure that event contracts evolve predictably and safely across distributed teams without causing pipeline crashes, message loss, poison pills, or semantic corruption, all without relying on heavyweight schema registries or external serialization engines.

### Foundational Invariants:
1. **Lightweight In-Code Governance:** Contract definitions and version compatibility checks live directly within `@ecommerce/shared/src/kafka/kafka-event-envelope.js`.
2. **Current Production Standard:** All active business events are fixed at `eventVersion: 1`. No business events are versioned at `v2` during this phase.
3. **Additive-First Evolution:** Changes that do not break consumers must not increment `eventVersion`.
4. **Permanent Failure Isolation:** Any message with an unsupported version or malformed envelope must be routed to `ecommerce.dead-letter-events` and its offset committed to prevent consumer lag or poison pill loops.

---

## 2. Event Version Meaning

Every Kafka event published within the ecosystem includes an integer `eventVersion` header/field in its `KafkaEventEnvelope`:

```json
{
  "eventId": "c8d19760-4963-45ea-908c-6ec2cb612a8e",
  "eventType": "order.placed",
  "eventVersion": 1,
  "occurredAt": "2026-09-08T00:30:00.000Z",
  "sourceService": "order-svc",
  "aggregateType": "order",
  "aggregateId": "ord_1001",
  "payload": { ... }
}
```

- **`eventVersion` represents the structural contract of the payload and envelope.**
- Minor additive additions do **NOT** increment `eventVersion`.
- An increment from `1` to `2` signals a **breaking contract change** requiring coordinated consumer updates or dual-publishing.

---

## 3. Compatibility Rules: Breaking vs Non-Breaking Changes

### 3.1 Non-Breaking Changes (Allowed within `eventVersion: 1`)

The following modifications do **not** require incrementing `eventVersion` and may be deployed autonomously by the producing service:

| Change Type | Description | Example |
| :--- | :--- | :--- |
| **Add Optional Field** | Adding a new key to `payload` that consumers can safely ignore. | Adding `"promotionCode": "SAVE20"` to `order.placed`. |
| **Add Non-Breaking Metadata** | Introducing new contextual tracing or correlation headers. | Adding `clientDeviceType` to envelope metadata. |
| **Additive Value Set** | Adding new values to an extensible enum (provided consumers handle unknown enum values gracefully). | Adding `"EXPRESS_PRIORITY"` to shipping methods. |
| **Wider Precision** | Providing more granular numerical precision where consumers parse as standard numbers. | `subtotal: 100.5` -> `100.50`. |

> **Crucial Rule:** Producers MUST NOT assume consumers immediately read or understand newly added optional fields.

---

### 3.2 Breaking Changes (Require New `eventVersion: 2+`)

Any change that violates existing consumer expectations or corrupts downstream state requires bumping `eventVersion`:

| Breaking Change Category | Violation Example | Downstream Impact |
| :--- | :--- | :--- |
| **Field Renaming** | Renaming `orderId` to `purchaseOrderId`. | Existing consumers fail contract assertions or look for `undefined`. |
| **Field Removal** | Removing `amount` from `payment.captured`. | Financial reconciliation systems crash or write null values. |
| **Type Incompatibility** | Changing `itemsCount` from `number` (e.g. `3`) to `string` (e.g. `"3"`) or array. | Arithmetic calculations in consumer workers fail or throw `NaN`. |
| **Semantic Inversion** | Changing `status: "failed"` to mean "retryable failure" instead of "terminal failure". | Consumer misinterprets order state machine transitions. |
| **Aggregate Identity Mutation** | Changing `aggregateId` from `orderId` to `customerId` on `order.placed`. | Destroys per-entity sequential partition ordering in Kafka. |
| **Partition Key Inversion** | Changing partition routing key from `orderId` to a random UUID. | Concurrent events for the same order arrive out of order across partitions. |

---

## 4. The Tolerant Reader Pattern

All consumers implemented with `@ecommerce/shared/src/kafka/kafka-consumer.js` must adhere strictly to the **Tolerant Reader Pattern**:

1. **Ignore Unknown Keys:** Consumers extract only the fields they require for their domain logic. Additional unknown properties present in the event payload must not trigger validation errors or crashes.
2. **Preserve Raw Payload:** When consumer logic re-emits, forwards, or logs events, it must not strip or mutate extra fields unless performing an explicit transformation.
3. **Graceful Defaulting:** Optional fields not present in older events must default cleanly in consumer logic (e.g., `event.payload.notes ?? null`).
4. **Schema Contract Tolerance:** `validatePayloadContract(eventType, payload, eventVersion)` in `@ecommerce/shared` ensures required fields exist without rejecting unknown extra fields.

---

## 5. Producer Ownership & Consumer Responsibility

### Producer Ownership
- **Contract Definition:** The producing service team owns the schema definition and documentation in `docs/events/EVENT-CATALOG.md`.
- **Outbox Durability:** The producer must publish all events via the Transactional Outbox pattern to guarantee at-least-once delivery with PostgreSQL ACID consistency.
- **Partition Key Guarantee:** The producer is strictly responsible for setting the Kafka message key to the domain entity ID (`orderId`, `productId`, `paymentId`) to ensure strict partition ordering.
- **Envelope Integrity:** The producer must utilize `KafkaEventEnvelope.create()` to generate valid, standardized envelopes.

### Consumer Responsibility
- **Explicit Version Support:** Every consumer must declare its `supportedVersions` array (e.g., `supportedVersions: [1]`).
- **Idempotent Processing:** Consumers must record processed message IDs (`event_id` or entity transaction status) to ensure safe handling of at-least-once Kafka deliveries.
- **Safe Version Rejection:** If a message arrives with an unsupported version (e.g., `eventVersion: 99`), the consumer must route it to DLQ with `failureReason: "UNSUPPORTED_EVENT_VERSION"` and commit the offset.

---

## 6. Schema Evolution Lifecycle (Deprecation & Migration Policy)

When a breaking change is unavoidable and requires transitioning from `v1` to `v2`, services must follow this four-stage governance lifecycle:

```
[Phase A: Deprecation Notice]
              │
              ▼
[Phase B: Dual Publishing & Dual Consumption]
              │
              ▼
[Phase C: Consumer Migration & Metric Validation]
              │
              ▼
[Phase D: Sunset & Decommission of v1]
```

### Phase A: Deprecation Notice
- Produce an RFC detailing the motivation for the breaking change.
- Mark the `v1` event contract as `DEPRECATED` in `docs/events/EVENT-CATALOG.md` with a defined sunset date (minimum 90 days).
- Add deprecation warning logs to producer metrics when generating `v1` events.

### Phase B: Dual Publishing / Dual Consumption
- **Producer:** Producer begins dual-publishing both `v1` and `v2` envelopes to the Kafka topic, or publishes `v2` while continuing `v1` outbox generation.
- **Consumer:** Consumers update their configuration to accept `supportedVersions: [1, 2]`. Handlers implement dual-path processing:
  ```javascript
  if (envelope.eventVersion === 2) {
    handleV2Event(envelope.payload);
  } else {
    handleV1Event(envelope.payload);
  }
  ```

### Phase C: Consumer Migration
- Downstream consumer teams migrate their logic to rely exclusively on `v2` fields.
- Metrics monitor consumer lag and DLQ counts for both versions:
  - `kafka_consumer_version_total{version="1"}`
  - `kafka_consumer_version_total{version="2"}`
- Once all active consumer groups process `v2` cleanly, downstream services remove `1` from their `supportedVersions`.

### Phase D: Sunset
- Producer halts publishing of `v1` events.
- In-code contract registry removes `v1` definition.
- `docs/events/EVENT-CATALOG.md` updates status to `RETIRED`.

---

## 7. DLQ Routing & Poison Pill Prevention

To ensure at-least-once delivery without deadlocks:
1. **Never Throw on Malformed Envelopes:** Consumers must never repeatedly throw uncaught exceptions on malformed envelopes, which would trigger infinite replay loops.
2. **Permanent Routing:** Messages failing envelope validation or version compatibility checks are routed to `ecommerce.dead-letter-events` with metadata:
   - `failureReason: "SCHEMA_VALIDATION_FAILED"` or `"UNSUPPORTED_EVENT_VERSION"`
   - `originalTopic`, `originalPartition`, `originalOffset`
   - `rawPayload`
3. **Acknowledge and Commit:** The consumer commits the offset immediately after DLQ publication to advance the partition cursor safely.
