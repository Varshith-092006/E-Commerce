# Apache Kafka Operations & Operations Runbook

## 1. Quick Start & Cluster Execution

### Start Local Kafka Stack with Docker Compose
```bash
cd ecommerce-platform
npm run docker:up
```

### Reset Kafka Stack & Data Volumes
```bash
npm run docker:reset
```

---

## 2. Cluster Health & Diagnostics Commands

### Check Broker Connectivity from Container
```bash
docker exec -it ecommerce-kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### Inspect Health Endpoint Across Microservices
```bash
curl http://localhost:4003/health  # order-svc
curl http://localhost:4004/health  # payment-svc
curl http://localhost:4005/health  # fulfillment-svc
curl http://localhost:4006/health  # notification-svc
```

---

## 3. Topic & Consumer Group Management

### Create Default Topics Manually
```bash
docker exec -it ecommerce-kafka kafka-topics --bootstrap-server localhost:9092 --create --topic ecommerce.order-events --partitions 3 --replication-factor 1
docker exec -it ecommerce-kafka kafka-topics --bootstrap-server localhost:9092 --create --topic ecommerce.payment-events --partitions 3 --replication-factor 1
docker exec -it ecommerce-kafka kafka-topics --bootstrap-server localhost:9092 --create --topic ecommerce.fulfillment-events --partitions 3 --replication-factor 1
docker exec -it ecommerce-kafka kafka-topics --bootstrap-server localhost:9092 --create --topic ecommerce.notification-events --partitions 3 --replication-factor 1
docker exec -it ecommerce-kafka kafka-topics --bootstrap-server localhost:9092 --create --topic ecommerce.dead-letter-events --partitions 3 --replication-factor 1
```

### List Consumer Groups & Check Lag
```bash
docker exec -it ecommerce-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list

docker exec -it ecommerce-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group notification-group
```

### Tail Messages in Real-Time
```bash
docker exec -it ecommerce-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic ecommerce.order-events --from-beginning
```

---

## 4. Operational Troubleshooting

### Symptom 1: Consumer Lag Growing
1. Inspect service logs for error backoff loops.
2. Verify downstream PostgreSQL database connection pool health.
3. Check Prometheus metric `kafka_consumer_lag`.

### Symptom 2: Dead Letter Queue (DLQ) Accumulation
1. Inspect messages in topic `ecommerce.dead-letter-events`.
2. Query admin DLQ endpoint:
```bash
curl http://localhost:4006/api/v1/notifications/admin/dlq
```
3. Replay failed event:
```bash
curl -X POST http://localhost:4006/api/v1/notifications/admin/dlq/<EVENT_ID>/replay
```
