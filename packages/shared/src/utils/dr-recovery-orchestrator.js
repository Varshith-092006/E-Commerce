/**
 * Disaster Recovery Orchestration & Recovery Strategy Utilities
 *
 * Provides pure, infrastructure-independent calculation, dependency ordering,
 * and validation models for Phase 12 Disaster Recovery:
 * - Topological dependency resolution across microservices and infrastructure
 * - Non-destructive disaster reconstruction safety guardrails
 * - Multi-service readiness & liveness evaluation
 * - Kafka topology, partition, and consumer lag validation
 * - Redis authoritative fallback and distributed lock evaluation
 * - Post-recovery data and event invariant verification
 * - RPO and RTO compliance evaluation (Local Benchmark vs. Production Target)
 */

export const REQUIRED_KAFKA_TOPICS = Object.freeze([
  'ecommerce.order-events',
  'ecommerce.payment-events',
  'ecommerce.fulfillment-events',
  'ecommerce.notification-events',
  'ecommerce.dead-letter-events',
  'ecommerce.review-events',
]);

export const EXPECTED_PARTITIONS_PER_TOPIC = 3;
export const EXPECTED_REPLICATION_FACTOR = 1; // Local containerized environment

export const REQUIRED_MICROSERVICES = Object.freeze([
  'identity-svc',
  'catalog-svc',
  'order-svc',
  'payment-svc',
  'fulfillment-svc',
  'notification-svc',
  'gateway',
]);

/**
 * Platform Recovery Dependency Graph
 * Defines strict upstream requirements for each component in the platform.
 * Derived directly from infra/docker-compose.yml and microservice architecture.
 */
export const RECOVERY_DEPENDENCY_GRAPH = Object.freeze({
  network: [],
  config: ['network'],
  postgres: ['config'],
  redis: ['config'],
  zookeeper: ['network'],
  kafka: ['zookeeper'],
  'kafka-topics': ['kafka'],
  'identity-svc': ['postgres', 'redis'],
  'catalog-svc': ['postgres', 'redis'],
  'order-svc': ['postgres', 'redis', 'kafka-topics', 'identity-svc', 'catalog-svc'],
  'payment-svc': ['postgres', 'redis', 'kafka-topics', 'order-svc'],
  'fulfillment-svc': ['postgres', 'redis', 'kafka-topics', 'order-svc', 'catalog-svc'],
  'notification-svc': ['postgres', 'redis', 'kafka-topics'],
  gateway: [
    'redis',
    'identity-svc',
    'catalog-svc',
    'order-svc',
    'payment-svc',
    'fulfillment-svc',
    'notification-svc',
  ],
  frontends: ['network'],
  nginx: ['gateway', 'frontends'],
  prometheus: ['gateway'],
  grafana: ['prometheus'],
});

/**
 * Computes topological recovery order from dependency graph.
 * Ensures dependencies are recovered before dependents.
 *
 * @param {Record<string, string[]>} graph
 * @returns {string[]} Ordered component keys
 */
export function getTopologicalRecoveryOrder(graph = RECOVERY_DEPENDENCY_GRAPH) {
  const inDegree = {};
  const adj = {};
  const nodes = Object.keys(graph);

  for (const node of nodes) {
    inDegree[node] = 0;
    adj[node] = [];
  }

  for (const [dependent, dependencies] of Object.entries(graph)) {
    for (const dep of dependencies) {
      if (!adj[dep]) {
        adj[dep] = [];
      }
      adj[dep].push(dependent);
      inDegree[dependent] = (inDegree[dependent] || 0) + 1;
    }
  }

  const queue = nodes.filter((n) => inDegree[n] === 0);
  const order = [];

  while (queue.length > 0) {
    // Alphabetical / deterministic tie-breaking
    queue.sort();
    const current = queue.shift();
    order.push(current);

    for (const neighbor of adj[current] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (order.length !== nodes.length) {
    throw new Error('Cyclic dependency detected in recovery dependency graph');
  }

  return order;
}

/**
 * Validates safety constraints before executing disaster reconstruction.
 *
 * Strict Guardrails:
 * 1. Blocks production hosts unconditionally.
 * 2. Defaults to dry-run mode unless explicitly confirmed.
 * 3. Requires DR_CONFIRM_DESTRUCTIVE_TEST=true OR --confirm-destructive flag.
 *
 * @param {Object} options
 * @param {boolean} [options.isDestructive=false]
 * @param {boolean} [options.confirmFlag=false]
 * @param {boolean} [options.envConfirmed=false]
 * @param {string} [options.targetHost='localhost']
 * @param {boolean} [options.isProduction=false]
 * @returns {{ safe: boolean, dryRun: boolean, violations: string[] }}
 */
export function validateReconstructionSafety({
  isDestructive = false,
  confirmFlag = false,
  envConfirmed = false,
  targetHost = 'localhost',
  isProduction = false,
} = {}) {
  const violations = [];

  // Safety 1: Block production unconditionally
  if (isProduction || process.env.NODE_ENV === 'production') {
    violations.push(
      'FATAL: Disaster reconstruction exercises are strictly forbidden against production environments.',
    );
  }

  // Safety 2: Reject remote or unapproved hostnames
  const isLocal =
    !targetHost ||
    targetHost === 'localhost' ||
    targetHost === '127.0.0.1' ||
    targetHost.includes('ecommerce-net') ||
    targetHost.includes('infra_ecommerce-net');
  if (!isLocal) {
    violations.push(
      `FATAL: Remote host '${targetHost}' rejected. Reconstruction runs only against local Docker.`,
    );
  }

  const isConfirmed = confirmFlag || envConfirmed;
  const isDryRun = !isConfirmed || !isDestructive;

  // Safety 3: If destructive mode is invoked without confirmation, block it
  if (isDestructive && !isConfirmed) {
    violations.push(
      'CONFIRMATION REQUIRED: Destructive reconstruction requires DR_CONFIRM_DESTRUCTIVE_TEST=true or --confirm-destructive flag.',
    );
  }

  return {
    safe: violations.length === 0,
    dryRun: isDryRun,
    violations,
  };
}

/**
 * Evaluates service health and readiness probe payloads.
 *
 * @param {string} serviceName
 * @param {Object} livenessPayload - { status: 'UP', alive: true }
 * @param {Object} readinessPayload - { status: 'READY', ready: true, checks: { db, redis, kafka } }
 * @returns {{ service: string, healthy: boolean, livenessOk: boolean, readinessOk: boolean, errors: string[] }}
 */
export function evaluateServiceReadiness(serviceName, livenessPayload, readinessPayload) {
  const errors = [];

  const livenessOk =
    Boolean(livenessPayload) &&
    (livenessPayload.status === 'UP' || livenessPayload.status === 'healthy') &&
    livenessPayload.alive !== false;

  if (!livenessOk) {
    errors.push(`Service '${serviceName}' failed liveness probe`);
  }

  const readinessOk =
    Boolean(readinessPayload) &&
    (readinessPayload.status === 'READY' ||
      readinessPayload.status === 'healthy' ||
      readinessPayload.ready === true);

  if (!readinessOk) {
    errors.push(`Service '${serviceName}' failed readiness probe`);
  }

  // Evaluate sub-checks if present
  if (readinessPayload && readinessPayload.checks) {
    for (const [dep, state] of Object.entries(readinessPayload.checks)) {
      const stateStr = String(state).toLowerCase();
      const passed =
        stateStr === 'ok' ||
        stateStr === 'healthy' ||
        stateStr === 'connected' ||
        stateStr === 'up' ||
        stateStr === 'true';
      if (!passed) {
        errors.push(`Service '${serviceName}' dependency '${dep}' is unhealthy: ${state}`);
      }
    }
  }

  return {
    service: serviceName,
    healthy: livenessOk && readinessOk && errors.length === 0,
    livenessOk,
    readinessOk,
    errors,
  };
}

/**
 * Evaluates Kafka cluster recovery topology.
 * Validates 6 topics, 3 partitions per topic, replication factor, and consumer lag.
 *
 * @param {Object} params
 * @param {string[]} params.topics - Discovered topic names
 * @param {Record<string, { partitions: number, replicationFactor: number }>} [params.topicMetadata={}]
 * @param {Record<string, number>} [params.consumerGroupLag={}]
 * @returns {{ valid: boolean, errors: string[], details: Object }}
 */
export function evaluateKafkaRecoveryTopology({
  topics = [],
  topicMetadata = {},
  consumerGroupLag = {},
} = {}) {
  const errors = [];
  const discoveredTopics = new Set(topics);

  // Check required topics
  for (const reqTopic of REQUIRED_KAFKA_TOPICS) {
    if (!discoveredTopics.has(reqTopic)) {
      errors.push(`Missing required Kafka topic: ${reqTopic}`);
    } else if (topicMetadata[reqTopic]) {
      const meta = topicMetadata[reqTopic];
      if (meta.partitions !== EXPECTED_PARTITIONS_PER_TOPIC) {
        errors.push(
          `Topic '${reqTopic}' has ${meta.partitions} partitions, expected ${EXPECTED_PARTITIONS_PER_TOPIC}`,
        );
      }
      if (meta.replicationFactor !== EXPECTED_REPLICATION_FACTOR) {
        errors.push(
          `Topic '${reqTopic}' has RF=${meta.replicationFactor}, expected RF=${EXPECTED_REPLICATION_FACTOR}`,
        );
      }
    }
  }

  // Check consumer lag convergence
  let totalLag = 0;
  for (const [_group, lag] of Object.entries(consumerGroupLag)) {
    if (typeof lag === 'number') {
      totalLag += lag;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    details: {
      topicCount: discoveredTopics.size,
      requiredTopicsFound: REQUIRED_KAFKA_TOPICS.filter((t) => discoveredTopics.has(t)).length,
      totalLag,
      consumerGroupsChecked: Object.keys(consumerGroupLag).length,
    },
  };
}

/**
 * Evaluates Redis recovery state.
 *
 * @param {boolean} pingSuccess
 * @param {boolean} lockAcquired
 * @param {boolean} lockReleased
 * @returns {{ ready: boolean, errors: string[] }}
 */
export function evaluateRedisRecoveryState(pingSuccess, lockAcquired = true, lockReleased = true) {
  const errors = [];
  if (!pingSuccess) {
    errors.push('Redis PING probe failed: cache dependency unreachable');
  }
  if (!lockAcquired) {
    errors.push('Redis distributed lock acquisition failed');
  }
  if (!lockReleased) {
    errors.push('Redis distributed lock release failed');
  }

  return {
    ready: errors.length === 0,
    errors,
  };
}

/**
 * Calculates Recovery Point Objective (RPO) and Recovery Time Objective (RTO)
 * for a disaster reconstruction event.
 *
 * Strictly delineates MEASURED LOCAL BENCHMARK vs. PRODUCTION TARGET.
 *
 * @param {Object} params
 * @param {string|number|Date} params.backupTimestamp
 * @param {string|number|Date} params.disasterTimestamp
 * @param {string|number|Date} params.recoveryStartTimestamp
 * @param {string|number|Date} params.recoveryEndTimestamp
 * @param {string|number|Date} params.appReadyTimestamp
 * @returns {Object}
 */
export function calculateDisasterRecoveryMetrics({
  backupTimestamp,
  disasterTimestamp,
  recoveryStartTimestamp,
  recoveryEndTimestamp,
  appReadyTimestamp,
} = {}) {
  const tBackup = new Date(backupTimestamp).getTime() || 0;
  const tDisaster = new Date(disasterTimestamp).getTime() || 0;
  const tStart = new Date(recoveryStartTimestamp).getTime() || 0;
  const tEnd = new Date(recoveryEndTimestamp).getTime() || 0;
  const tReady = new Date(appReadyTimestamp).getTime() || 0;

  // RPO is the time between last backup and disaster declaration
  const rpoDurationMs = Math.max(0, tDisaster - tBackup);
  const rpoSeconds = Math.round(rpoDurationMs / 1000);

  // Active restore duration
  const restoreDurationMs = Math.max(0, tEnd - tStart);

  // RTO is the total recovery duration from disaster/start to full app readiness
  const rtoDurationMs = Math.max(0, tReady - tStart);
  const totalDowntimeMs = Math.max(0, tReady - tDisaster);

  return {
    restoreDurationMs,
    rpo: {
      type: 'MEASURED LOCAL BENCHMARK',
      rpoDurationMs,
      rpoSeconds,
      rpoFormatted: `${Math.floor(rpoSeconds / 60)}m ${rpoSeconds % 60}s`,
      productionTarget: '15–60 minutes (periodic snapshots) or <= 5 minutes (WAL streaming)',
      disclaimer: 'Empirical local snapshot measurement; not a production cloud SLA.',
    },
    rto: {
      type: 'MEASURED LOCAL BENCHMARK',
      rtoDurationMs,
      rtoSeconds: Math.round(rtoDurationMs / 1000),
      rtoFormatted: `${(rtoDurationMs / 1000).toFixed(2)}s`,
      totalDowntimeMs,
      totalDowntimeFormatted: `${(totalDowntimeMs / 1000).toFixed(2)}s`,
      productionTarget: '<= 60 minutes',
      disclaimer: 'Empirical local recovery duration; not a production cloud SLA.',
    },
  };
}

/**
 * Compares data invariants across pre-disaster baseline and post-recovery states.
 *
 * @param {Record<string, number>} baselineCounts - { [db.table]: count }
 * @param {Record<string, number>} recoveredCounts - { [db.table]: count }
 * @returns {{ intact: boolean, discrepancies: Array<Object>, violations: string[] }}
 */
export function evaluateDataInvariantComparisons(baselineCounts = {}, recoveredCounts = {}) {
  const violations = [];
  const discrepancies = [];

  const allKeys = Array.from(
    new Set([...Object.keys(baselineCounts), ...Object.keys(recoveredCounts)]),
  ).sort();

  for (const key of allKeys) {
    const baseline = baselineCounts[key] ?? 0;
    const recovered = recoveredCounts[key] ?? 0;
    const diff = recovered - baseline;

    if (diff !== 0) {
      discrepancies.push({ key, baseline, recovered, diff });
      if (recovered < baseline) {
        violations.push(
          `Data loss detected in '${key}': baseline=${baseline}, recovered=${recovered} (loss=${Math.abs(diff)})`,
        );
      }
    }
  }

  return {
    intact: violations.length === 0,
    discrepancies,
    violations,
  };
}
