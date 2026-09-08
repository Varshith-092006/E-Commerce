import {
  getTopologicalRecoveryOrder,
  validateReconstructionSafety,
  evaluateServiceReadiness,
  evaluateKafkaRecoveryTopology,
  evaluateRedisRecoveryState,
  calculateDisasterRecoveryMetrics,
  evaluateDataInvariantComparisons,
  RECOVERY_DEPENDENCY_GRAPH,
  REQUIRED_KAFKA_TOPICS,
  EXPECTED_PARTITIONS_PER_TOPIC,
  EXPECTED_REPLICATION_FACTOR,
} from '../../src/utils/dr-recovery-orchestrator.js';

describe('Phase 12: Disaster Recovery & Recovery Strategy Utilities', () => {
  describe('Topological Recovery Dependency Resolution', () => {
    it('produces a valid dependency-ordered recovery sequence', () => {
      const order = getTopologicalRecoveryOrder(RECOVERY_DEPENDENCY_GRAPH);

      expect(Array.isArray(order)).toBe(true);
      expect(order.length).toBe(Object.keys(RECOVERY_DEPENDENCY_GRAPH).length);

      // Verify essential ordering relationships
      const idxOf = (comp) => order.indexOf(comp);

      // Infrastructure before services
      expect(idxOf('network')).toBeLessThan(idxOf('postgres'));
      expect(idxOf('network')).toBeLessThan(idxOf('redis'));
      expect(idxOf('network')).toBeLessThan(idxOf('zookeeper'));

      // Kafka stack ordering
      expect(idxOf('zookeeper')).toBeLessThan(idxOf('kafka'));
      expect(idxOf('kafka')).toBeLessThan(idxOf('kafka-topics'));

      // Databases and caches before data-dependent microservices
      expect(idxOf('postgres')).toBeLessThan(idxOf('identity-svc'));
      expect(idxOf('postgres')).toBeLessThan(idxOf('catalog-svc'));
      expect(idxOf('postgres')).toBeLessThan(idxOf('order-svc'));
      expect(idxOf('redis')).toBeLessThan(idxOf('identity-svc'));
      expect(idxOf('redis')).toBeLessThan(idxOf('gateway'));

      // Core domain service order
      expect(idxOf('identity-svc')).toBeLessThan(idxOf('order-svc'));
      expect(idxOf('catalog-svc')).toBeLessThan(idxOf('order-svc'));
      expect(idxOf('order-svc')).toBeLessThan(idxOf('payment-svc'));
      expect(idxOf('order-svc')).toBeLessThan(idxOf('fulfillment-svc'));

      // Microservices before gateway and edge
      expect(idxOf('identity-svc')).toBeLessThan(idxOf('gateway'));
      expect(idxOf('catalog-svc')).toBeLessThan(idxOf('gateway'));
      expect(idxOf('order-svc')).toBeLessThan(idxOf('gateway'));
      expect(idxOf('payment-svc')).toBeLessThan(idxOf('gateway'));
      expect(idxOf('fulfillment-svc')).toBeLessThan(idxOf('gateway'));
      expect(idxOf('notification-svc')).toBeLessThan(idxOf('gateway'));

      // Gateway before Nginx and Observability
      expect(idxOf('gateway')).toBeLessThan(idxOf('nginx'));
      expect(idxOf('gateway')).toBeLessThan(idxOf('prometheus'));
      expect(idxOf('prometheus')).toBeLessThan(idxOf('grafana'));
    });

    it('detects cycles and aborts with clear error', () => {
      const cyclicGraph = {
        A: ['B'],
        B: ['C'],
        C: ['A'],
      };
      expect(() => getTopologicalRecoveryOrder(cyclicGraph)).toThrow(
        /Cyclic dependency detected/,
      );
    });
  });

  describe('Disaster Reconstruction Safety Guardrails', () => {
    it('blocks production environments unconditionally', () => {
      const result = validateReconstructionSafety({
        isDestructive: true,
        confirmFlag: true,
        isProduction: true,
      });

      expect(result.safe).toBe(false);
      expect(result.violations.some((v) => v.includes('strictly forbidden against production'))).toBe(
        true,
      );
    });

    it('rejects remote or unapproved target hosts', () => {
      const result = validateReconstructionSafety({
        targetHost: 'prod-db.us-east-1.aws.internal',
        confirmFlag: true,
      });

      expect(result.safe).toBe(false);
      expect(result.violations.some((v) => v.includes('Remote host'))).toBe(true);
    });

    it('defaults to dry-run when confirmation flag is absent', () => {
      const result = validateReconstructionSafety({
        isDestructive: false,
        confirmFlag: false,
      });

      expect(result.dryRun).toBe(true);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('blocks destructive execution if confirmation is omitted', () => {
      const result = validateReconstructionSafety({
        isDestructive: true,
        confirmFlag: false,
        envConfirmed: false,
      });

      expect(result.safe).toBe(false);
      expect(result.dryRun).toBe(true);
      expect(
        result.violations.some((v) => v.includes('CONFIRMATION REQUIRED: Destructive reconstruction')),
      ).toBe(true);
    });

    it('allows destructive execution when explicitly confirmed via CLI flag', () => {
      const result = validateReconstructionSafety({
        isDestructive: true,
        confirmFlag: true,
        envConfirmed: false,
      });

      expect(result.safe).toBe(true);
      expect(result.dryRun).toBe(false);
      expect(result.violations).toHaveLength(0);
    });

    it('allows destructive execution when explicitly confirmed via environment variable', () => {
      const result = validateReconstructionSafety({
        isDestructive: true,
        confirmFlag: false,
        envConfirmed: true,
      });

      expect(result.safe).toBe(true);
      expect(result.dryRun).toBe(false);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('Service Readiness & Liveness Evaluation', () => {
    it('approves a healthy service with positive liveness and readiness probes', () => {
      const liveness = { status: 'UP', alive: true, service: 'order-svc' };
      const readiness = {
        status: 'READY',
        ready: true,
        service: 'order-svc',
        checks: { db: 'ok', redis: 'ok', kafka: 'ok' },
      };

      const evalResult = evaluateServiceReadiness('order-svc', liveness, readiness);
      expect(evalResult.healthy).toBe(true);
      expect(evalResult.livenessOk).toBe(true);
      expect(evalResult.readinessOk).toBe(true);
      expect(evalResult.errors).toHaveLength(0);
    });

    it('rejects service when process liveness fails', () => {
      const liveness = { status: 'DOWN', alive: false, service: 'payment-svc' };
      const readiness = { status: 'READY', ready: true };

      const evalResult = evaluateServiceReadiness('payment-svc', liveness, readiness);
      expect(evalResult.healthy).toBe(false);
      expect(evalResult.livenessOk).toBe(false);
      expect(evalResult.errors.some((e) => e.includes('failed liveness probe'))).toBe(true);
    });

    it('rejects service when readiness dependency sub-check reports failure', () => {
      const liveness = { status: 'UP', alive: true };
      const readiness = {
        status: 'NOT_READY',
        ready: false,
        service: 'order-svc',
        checks: { db: 'failed', redis: 'ok', kafka: 'ok' },
      };

      const evalResult = evaluateServiceReadiness('order-svc', liveness, readiness);
      expect(evalResult.healthy).toBe(false);
      expect(evalResult.readinessOk).toBe(false);
      expect(evalResult.errors.some((e) => e.includes("dependency 'db' is unhealthy"))).toBe(true);
    });
  });

  describe('Kafka Recovery Topology & Partition Validation', () => {
    const validTopicMetadata = {
      'ecommerce.order-events': { partitions: 3, replicationFactor: 1 },
      'ecommerce.payment-events': { partitions: 3, replicationFactor: 1 },
      'ecommerce.fulfillment-events': { partitions: 3, replicationFactor: 1 },
      'ecommerce.notification-events': { partitions: 3, replicationFactor: 1 },
      'ecommerce.dead-letter-events': { partitions: 3, replicationFactor: 1 },
      'ecommerce.review-events': { partitions: 3, replicationFactor: 1 },
    };

    it('validates all 6 required topics, 3 partitions, and RF=1', () => {
      const result = evaluateKafkaRecoveryTopology({
        topics: REQUIRED_KAFKA_TOPICS,
        topicMetadata: validTopicMetadata,
        consumerGroupLag: { 'order-saga-group': 0, 'notification-group': 0 },
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.details.requiredTopicsFound).toBe(6);
      expect(result.details.totalLag).toBe(0);
    });

    it('detects missing Kafka topics', () => {
      const partialTopics = REQUIRED_KAFKA_TOPICS.slice(0, 4); // Missing 2 topics
      const result = evaluateKafkaRecoveryTopology({
        topics: partialTopics,
        topicMetadata: validTopicMetadata,
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Missing required Kafka topic'))).toBe(true);
    });

    it('detects incorrect partition count', () => {
      const badMetadata = {
        ...validTopicMetadata,
        'ecommerce.order-events': { partitions: 1, replicationFactor: 1 }, // Expected 3
      };

      const result = evaluateKafkaRecoveryTopology({
        topics: REQUIRED_KAFKA_TOPICS,
        topicMetadata: badMetadata,
      });

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('has 1 partitions, expected 3')),
      ).toBe(true);
    });
  });

  describe('Redis Recovery & Distributed Lock Evaluation', () => {
    it('verifies healthy Redis when ping and distributed locks succeed', () => {
      const result = evaluateRedisRecoveryState(true, true, true);
      expect(result.ready).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects Redis connectivity outage', () => {
      const result = evaluateRedisRecoveryState(false, false, false);
      expect(result.ready).toBe(false);
      expect(result.errors.some((e) => e.includes('Redis PING probe failed'))).toBe(true);
    });
  });

  describe('Disaster Recovery Metrics (RPO/RTO Local Benchmark vs. Production Target)', () => {
    it('calculates empirical local benchmark RPO and RTO', () => {
      const backupTimestamp = '2026-09-08T10:00:00.000Z';
      const disasterTimestamp = '2026-09-08T10:03:00.000Z'; // 3 minutes later
      const recoveryStartTimestamp = '2026-09-08T10:03:05.000Z';
      const recoveryEndTimestamp = '2026-09-08T10:03:13.000Z';
      const appReadyTimestamp = '2026-09-08T10:03:22.600Z'; // Total recovery 17.6s

      const metrics = calculateDisasterRecoveryMetrics({
        backupTimestamp,
        disasterTimestamp,
        recoveryStartTimestamp,
        recoveryEndTimestamp,
        appReadyTimestamp,
      });

      expect(metrics.rpo.type).toBe('MEASURED LOCAL BENCHMARK');
      expect(metrics.rpo.rpoSeconds).toBe(180);
      expect(metrics.rpo.rpoFormatted).toBe('3m 0s');
      expect(metrics.rpo.disclaimer).toMatch(/not a production cloud SLA/i);

      expect(metrics.rto.type).toBe('MEASURED LOCAL BENCHMARK');
      expect(metrics.rto.rtoDurationMs).toBe(17600);
      expect(metrics.rto.rtoFormatted).toBe('17.60s');
      expect(metrics.rto.disclaimer).toMatch(/not a production cloud SLA/i);
    });
  });

  describe('Data Invariant & Outbox Post-Recovery Comparison', () => {
    it('confirms intact data when baseline and recovered counts match', () => {
      const baseline = {
        'order_db.orders': 150,
        'order_db.order_items': 300,
        'order_db.order_outbox': 150,
        'payment_db.payments': 148,
      };
      const recovered = { ...baseline };

      const comparison = evaluateDataInvariantComparisons(baseline, recovered);
      expect(comparison.intact).toBe(true);
      expect(comparison.violations).toHaveLength(0);
      expect(comparison.discrepancies).toHaveLength(0);
    });

    it('detects and flags record loss during restore', () => {
      const baseline = {
        'order_db.orders': 150,
        'payment_db.payments': 148,
      };
      const recovered = {
        'order_db.orders': 140, // 10 orders lost!
        'payment_db.payments': 148,
      };

      const comparison = evaluateDataInvariantComparisons(baseline, recovered);
      expect(comparison.intact).toBe(false);
      expect(
        comparison.violations.some((v) =>
          v.includes("Data loss detected in 'order_db.orders'"),
        ),
      ).toBe(true);
      expect(comparison.discrepancies).toHaveLength(1);
    });
  });
});
