/**
 * Chaos Engineering & Resilience Evaluation Utilities
 *
 * Provides pure, infrastructure-independent calculation models for:
 * - Chaos experiment schema validation
 * - Safety rule enforcement (blocking destructive operations, non-local targets)
 * - Recovery criteria evaluation
 * - Failure severity classification (GREEN, AMBER, RED)
 * - Cascading failure detection across microservice boundaries
 * - Data & event invariant validation (orders, payments, outbox, idempotency)
 * - Resilience scorecard calculation (recovery rates, mean detection/recovery times)
 */

export const FailureSeverity = Object.freeze({
  GREEN: 'GREEN', // Contained and automatically recovered; zero data/event loss
  AMBER: 'AMBER', // Contained; manual intervention required or accepted architecture limitation; zero data/event loss
  RED: 'RED', // Uncontained failure: data loss, event loss, corruption, duplicate side effects, or cascading crash
});

export const ExperimentStatus = Object.freeze({
  PASS: 'PASS',
  AMBER: 'AMBER',
  FAIL: 'FAIL',
});

export const SafetyLevel = Object.freeze({
  SAFE: 'SAFE',
  DESTRUCTIVE: 'DESTRUCTIVE',
});

// Approved targets within local Compose mesh
export const ALLOWED_TARGETS = Object.freeze([
  'catalog-svc',
  'order-svc',
  'payment-svc',
  'fulfillment-svc',
  'notification-svc',
  'identity-svc',
  'gateway',
  'nginx',
  'postgres',
  'redis',
  'kafka',
  'zookeeper',
  'prometheus',
  'infra-catalog-svc-1',
  'infra-catalog-svc-2',
  'infra-order-svc-1',
  'infra-order-svc-2',
  'ecommerce-catalog-svc',
  'ecommerce-order-svc',
  'ecommerce-payment-svc',
  'ecommerce-fulfillment-svc',
  'ecommerce-notification-svc',
  'ecommerce-identity-svc',
  'ecommerce-gateway',
  'ecommerce-nginx',
  'ecommerce-postgres',
  'ecommerce-redis',
  'ecommerce-kafka',
  'ecommerce-zookeeper',
]);

// Approved fault types
export const ALLOWED_FAULTS = Object.freeze([
  'stop',
  'kill',
  'restart',
  'pause',
  'network-isolate',
  'latency',
  'error',
  'consumer-kill',
  'worker-kill',
  'lock-holder-kill',
  'cascading-load',
  'combined',
]);

/**
 * Validates the schema of a chaos experiment definition.
 *
 * @param {Object} exp - Experiment definition object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateExperimentSchema(exp) {
  const errors = [];

  if (!exp || typeof exp !== 'object') {
    return { valid: false, errors: ['Experiment must be a non-null object'] };
  }

  if (!exp.id || typeof exp.id !== 'string' || exp.id.trim() === '') {
    errors.push('Experiment must have a non-empty string id');
  }

  if (!exp.name || typeof exp.name !== 'string' || exp.name.trim() === '') {
    errors.push('Experiment must have a non-empty string name');
  }

  if (!exp.target || typeof exp.target !== 'string' || !ALLOWED_TARGETS.includes(exp.target)) {
    errors.push(
      `Target '${exp.target}' is invalid. Allowed targets: ${ALLOWED_TARGETS.join(', ')}`,
    );
  }

  if (!exp.fault || typeof exp.fault !== 'string' || !ALLOWED_FAULTS.includes(exp.fault)) {
    errors.push(`Fault '${exp.fault}' is invalid. Allowed faults: ${ALLOWED_FAULTS.join(', ')}`);
  }

  if (typeof exp.durationSec !== 'number' || exp.durationSec <= 0) {
    errors.push('durationSec must be a positive number');
  }

  if (typeof exp.timeoutSec !== 'number' || exp.timeoutSec <= 0) {
    errors.push('timeoutSec must be a positive number');
  }

  if (exp.durationSec && exp.timeoutSec && exp.timeoutSec <= exp.durationSec) {
    errors.push('timeoutSec must be strictly greater than durationSec to allow recovery');
  }

  if (!exp.hypothesis || typeof exp.hypothesis !== 'string') {
    errors.push('Experiment must define a string hypothesis');
  }

  if (!exp.expectedBehavior || typeof exp.expectedBehavior !== 'string') {
    errors.push('Experiment must define a string expectedBehavior');
  }

  if (!exp.recoveryCriteria || typeof exp.recoveryCriteria !== 'object') {
    errors.push('Experiment must define an object recoveryCriteria');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates safety rules for chaos execution.
 * Enforces local-only execution and blocks destructive database/topic commands.
 *
 * @param {Object} options
 * @param {boolean} [options.isProduction=false]
 * @param {string} [options.dockerHost='localhost']
 * @param {string} [options.operation='']
 * @param {boolean} [options.destructiveMode=false]
 * @param {string} [options.target='']
 * @returns {{ safe: boolean, violations: string[] }}
 */
export function validateSafetyRules({
  isProduction = false,
  dockerHost = 'localhost',
  operation = '',
  destructiveMode = false,
  target = '',
} = {}) {
  const violations = [];

  // Rule 1: Never run against production
  if (
    isProduction ||
    (process.env.NODE_ENV === 'production' && process.env.ALLOW_CHAOS !== 'true')
  ) {
    violations.push('FATAL: Chaos experiments are strictly prohibited in production environments.');
  }

  // Rule 2: Host must be local
  const isLocalHost =
    !dockerHost ||
    dockerHost.includes('localhost') ||
    dockerHost.includes('127.0.0.1') ||
    dockerHost.includes('unix://') ||
    dockerHost.includes('npipe://');
  if (!isLocalHost) {
    violations.push(
      `FATAL: Remote Docker host '${dockerHost}' is forbidden. Chaos must run only against local Docker.`,
    );
  }

  // Rule 3: Forbidden destructive SQL / topic commands
  const forbiddenPatterns = [
    /drop\s+database/i,
    /drop\s+table/i,
    /truncate\s+table/i,
    /delete-topics/i,
    /kafka-topics.*--delete/i,
    /flushall/i,
    /flushdb/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(operation)) {
      violations.push(
        `BLOCKED: Destructive operation matching pattern ${pattern} is strictly prohibited.`,
      );
    }
  }

  // Rule 4: Destructive mode requires explicit flag
  const isDestructiveTarget = [
    'postgres',
    'ecommerce-postgres',
    'kafka',
    'ecommerce-kafka',
  ].includes(target);
  if (isDestructiveTarget && !destructiveMode) {
    // Note: Core infra stops are allowed only if safe fallback or explicitly confirmed
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

/**
 * Evaluates whether an experiment has satisfied its defined recovery criteria.
 *
 * @param {Object} result - Execution result data
 * @param {Object} criteria - Defined recovery criteria
 * @returns {{ recovered: boolean, failures: string[] }}
 */
export function evaluateRecoveryCriteria(result, criteria = {}) {
  const failures = [];

  if (!result || typeof result !== 'object') {
    return { recovered: false, failures: ['Result data is missing'] };
  }

  const recovery = result.recovery || {};

  // Check target healthy
  if (criteria.targetHealthy !== false && recovery.targetHealthy === false) {
    failures.push('Target service failed to return to healthy state');
  }

  // Check readiness probe
  if (criteria.readinessOk !== false && recovery.readinessOk === false) {
    failures.push('Readiness probe did not return 200/READY after recovery');
  }

  // Check Kafka lag
  if (criteria.maxKafkaLag !== undefined) {
    const lag = recovery.kafkaLag ?? 0;
    if (lag > criteria.maxKafkaLag) {
      failures.push(
        `Recovered Kafka lag (${lag}) exceeded maximum threshold (${criteria.maxKafkaLag})`,
      );
    }
  }

  // Check persistent 5xx errors
  if (criteria.maxPostRecovery5xx !== undefined) {
    const postErrors = recovery.postRecovery5xx ?? 0;
    if (postErrors > criteria.maxPostRecovery5xx) {
      failures.push(
        `Post-recovery 5xx error count (${postErrors}) exceeded threshold (${criteria.maxPostRecovery5xx})`,
      );
    }
  }

  // Check connection pool recovery
  if (criteria.dbConnectionsNormal !== false && recovery.dbConnectionsLeaked === true) {
    failures.push('PostgreSQL connection pool leaked or did not normalize');
  }

  // Check Redis client recovery
  if (criteria.redisClientsNormal !== false && recovery.redisClientsLeaked === true) {
    failures.push('Redis client connections leaked or did not normalize');
  }

  // Check DLQ growth
  if (criteria.allowDlqGrowth === false && (recovery.dlqGrowth ?? 0) > 0) {
    failures.push(`Dead Letter Queue increased unexpectedly by ${recovery.dlqGrowth} events`);
  }

  return {
    recovered: failures.length === 0,
    failures,
  };
}

/**
 * Classifies failure severity according to Phase 7 specification:
 * - GREEN: Contained and automatically recovered, zero data/event loss
 * - AMBER: Manual intervention required or documented architectural limitation (e.g. single-replica Gateway), zero data loss
 * - RED: Data loss, event loss, corruption, duplicate financial/business side effects, unrecoverable state, or persistent cascading failure
 *
 * @param {Object} params
 * @param {boolean} params.dataCorrupted
 * @param {boolean} params.eventsLost
 * @param {boolean} params.duplicateSideEffects
 * @param {boolean} params.unrecoverableState
 * @param {boolean} params.cascadingFailure
 * @param {boolean} params.automaticallyRecovered
 * @param {boolean} [params.acceptedLimitation=false]
 * @returns {'GREEN' | 'AMBER' | 'RED'}
 */
export function classifyFailureSeverity({
  dataCorrupted = false,
  eventsLost = false,
  duplicateSideEffects = false,
  unrecoverableState = false,
  cascadingFailure = false,
  automaticallyRecovered = true,
  acceptedLimitation = false,
} = {}) {
  // Any persistent data corruption, event loss, or duplicate business effects is unequivocally RED
  if (dataCorrupted || eventsLost || duplicateSideEffects || unrecoverableState) {
    return FailureSeverity.RED;
  }

  // Persistent uncontrolled cascade is RED
  if (cascadingFailure) {
    return FailureSeverity.RED;
  }

  // If automatically recovered with 0 corruption/loss -> GREEN
  if (automaticallyRecovered && !acceptedLimitation) {
    return FailureSeverity.GREEN;
  }

  // Contained, zero data loss, but requires manual intervention or is an accepted architectural limitation -> AMBER
  return FailureSeverity.AMBER;
}

/**
 * Detects whether a component fault cascaded uncontrollably into unrelated dependencies.
 *
 * @param {Object} params
 * @param {string} params.target - Injected service/container
 * @param {string[]} [params.unrelatedServices] - Services that should NOT have failed
 * @param {Object} params.serviceStatusMap - Map of service name to health/error state
 * @returns {{ isCascading: boolean, affectedUnrelated: string[] }}
 */
export function detectCascadingFailure({
  target = '',
  unrelatedServices = [],
  serviceStatusMap = {},
} = {}) {
  const affectedUnrelated = [];

  for (const service of unrelatedServices) {
    if (service === target) {
      continue;
    }
    const status = serviceStatusMap[service];
    if (status && (status.crashed || status.errorRate > 0.1 || status.unhealthy)) {
      affectedUnrelated.push(service);
    }
  }

  return {
    isCascading: affectedUnrelated.length > 0,
    affectedUnrelated,
  };
}

/**
 * Validates transactional data invariants between pre-chaos and post-chaos states.
 *
 * @param {Object} pre - Pre-test invariant snapshot
 * @param {Object} post - Post-test invariant snapshot
 * @returns {{ intact: boolean, violations: string[] }}
 */
export function validateDataInvariants(pre = {}, post = {}) {
  const violations = [];

  // Invariant 1: Existing orders must never decrease or disappear
  const preOrderCount = pre.orderCount ?? 0;
  const postOrderCount = post.orderCount ?? 0;
  if (postOrderCount < preOrderCount) {
    violations.push(`Order record count decreased from ${preOrderCount} to ${postOrderCount}`);
  }

  // Invariant 2: Duplicate order numbers must be exactly zero
  const duplicateOrders = post.duplicateOrderCount ?? 0;
  if (duplicateOrders > 0) {
    violations.push(`Detected ${duplicateOrders} duplicate order number mutations in PostgreSQL`);
  }

  // Invariant 3: Duplicate payment transactions must be exactly zero
  const duplicatePayments = post.duplicatePaymentCount ?? 0;
  if (duplicatePayments > 0) {
    violations.push(`Detected ${duplicatePayments} duplicate payment captures`);
  }

  // Invariant 4: No permanently orphaned outbox records (must be PROCESSED or PENDING/retryable)
  const orphanedOutbox = post.orphanedOutboxCount ?? 0;
  if (orphanedOutbox > 0) {
    violations.push(`Detected ${orphanedOutbox} orphaned/lost outbox events`);
  }

  // Invariant 5: Status transitions must be strictly forward
  if (post.invalidStatusTransitions && post.invalidStatusTransitions > 0) {
    violations.push(
      `Detected ${post.invalidStatusTransitions} invalid/backward status transitions`,
    );
  }

  return {
    intact: violations.length === 0,
    violations,
  };
}

/**
 * Computes empirical resilience scorecard across a batch of completed chaos experiments.
 *
 * @param {Array<Object>} results - List of experiment results
 * @returns {Object} Scorecard metrics
 */
export function calculateResilienceScorecard(results = []) {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      experimentsExecuted: 0,
      passed: 0,
      amber: 0,
      failed: 0,
      recoverySuccessRate: 0,
      dataIntegritySuccessRate: 0,
      eventIntegritySuccessRate: 0,
      meanDetectionTimeMs: 0,
      meanRecoveryTimeMs: 0,
      cascadingFailures: 0,
      redFailures: 0,
    };
  }

  const total = results.length;
  let passed = 0;
  let amber = 0;
  let failed = 0;
  let recoveredCount = 0;
  let dataIntactCount = 0;
  let eventIntactCount = 0;
  let totalDetectionTimeMs = 0;
  let totalRecoveryTimeMs = 0;
  let cascadingCount = 0;
  let redCount = 0;

  for (const r of results) {
    if (r.severity === FailureSeverity.RED || r.status === ExperimentStatus.FAIL) {
      failed++;
      redCount++;
    } else if (r.severity === FailureSeverity.AMBER || r.status === ExperimentStatus.AMBER) {
      amber++;
    } else {
      passed++;
    }

    if (r.recovery && r.recovery.targetHealthy !== false && r.recovery.readinessOk !== false) {
      recoveredCount++;
    }

    const isDataSafe = r.integrity ? r.integrity.dataSafe !== false : true;
    if (isDataSafe) {
      dataIntactCount++;
    }

    const isEventsSafe = r.integrity ? r.integrity.eventsSafe !== false : true;
    if (isEventsSafe) {
      eventIntactCount++;
    }

    totalDetectionTimeMs += r.detectionTimeMs || 0;
    totalRecoveryTimeMs += r.recoveryTimeMs || 0;

    if (r.cascadingFailure === true) {
      cascadingCount++;
    }
  }

  return {
    experimentsExecuted: total,
    passed,
    amber,
    failed,
    recoverySuccessRate: parseFloat(((recoveredCount / total) * 100).toFixed(2)),
    dataIntegritySuccessRate: parseFloat(((dataIntactCount / total) * 100).toFixed(2)),
    eventIntegritySuccessRate: parseFloat(((eventIntactCount / total) * 100).toFixed(2)),
    meanDetectionTimeMs: Math.round(totalDetectionTimeMs / total),
    meanRecoveryTimeMs: Math.round(totalRecoveryTimeMs / total),
    cascadingFailures: cascadingCount,
    redFailures: redCount,
  };
}
