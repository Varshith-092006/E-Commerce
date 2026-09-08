/**
 * Capacity Planning & Performance Evaluation Utilities
 *
 * Provides pure, infrastructure-independent calculation models for:
 * - Load-test result schema validation
 * - Capacity zone classification (GREEN, AMBER, RED)
 * - Scaling efficiency calculations (N-replica scaling factor)
 * - Resource headroom formulas
 * - Overload response classification (429 vs 503)
 * - Kafka lag drain rate & recovery estimation
 * - Benchmark sanity validation
 */

/**
 * Operating zone classifications.
 */
export const CapacityZone = Object.freeze({
  GREEN: 'GREEN', // Normal operating range: high stability, low queueing
  AMBER: 'AMBER', // Warning / high utilization range: scaling recommended
  RED: 'RED', // Saturation or failure range: unsafe, load shedding active
});

/**
 * Overload types.
 */
export const OverloadType = Object.freeze({
  NORMAL: 'NORMAL',
  RATE_LIMIT: 'RATE_LIMIT',
  LOAD_SHED: 'LOAD_SHED',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
});

/**
 * Validates the schema of a Phase 6 load-test result object.
 *
 * @param {Object} result - The result object to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateLoadTestResultSchema(result) {
  const errors = [];

  if (!result || typeof result !== 'object') {
    return { valid: false, errors: ['Result must be a non-null object'] };
  }

  const requiredFields = [
    'workload',
    'concurrency',
    'requests',
    'successful',
    'failed',
    'RPS',
    'P50',
    'P90',
    'P95',
    'P99',
    'maxLatency',
    '2xx',
    '4xx',
    '429',
    '503',
    '5xx',
    'loadShed',
  ];

  for (const field of requiredFields) {
    if (result[field] === undefined || result[field] === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof result[field] !== 'number' && field !== 'workload') {
      errors.push(`Field '${field}' must be a number`);
    }
  }

  // Value range validations
  if (result.concurrency !== undefined && result.concurrency < 1) {
    errors.push('Concurrency must be >= 1');
  }

  if (result.requests !== undefined && result.requests < 0) {
    errors.push('Total requests cannot be negative');
  }

  // Monotonic percentiles invariant
  if (
    result.P50 !== undefined &&
    result.P90 !== undefined &&
    result.P95 !== undefined &&
    result.P99 !== undefined &&
    result.maxLatency !== undefined
  ) {
    if (result.P50 > result.P90) {
      errors.push(`P50 (${result.P50}) cannot exceed P90 (${result.P90})`);
    }
    if (result.P90 > result.P95) {
      errors.push(`P90 (${result.P90}) cannot exceed P95 (${result.P95})`);
    }
    if (result.P95 > result.P99) {
      errors.push(`P95 (${result.P95}) cannot exceed P99 (${result.P99})`);
    }
    if (result.P99 > result.maxLatency) {
      errors.push(`P99 (${result.P99}) cannot exceed maxLatency (${result.maxLatency})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates multi-replica scaling efficiency.
 *
 * Efficiency(N) = Throughput(N) / (N * Throughput(1))
 *
 * @param {number} throughputN - Observed throughput with N replicas
 * @param {number} n - Replica count (>= 1)
 * @param {number} throughput1 - Observed baseline throughput with 1 replica
 * @returns {number} Scaling efficiency ratio (e.g. 0.85 = 85%)
 */
export function calculateScalingEfficiency(throughputN, n, throughput1) {
  if (n <= 0 || throughput1 <= 0 || throughputN < 0) {
    return 0;
  }
  const efficiency = throughputN / (n * throughput1);
  return Number(efficiency.toFixed(4));
}

/**
 * Calculates resource headroom based on observed utilization and safe operational threshold.
 *
 * Headroom = 1 - (observedUtilization / safeThreshold)
 *
 * @param {number} observed - Observed utilization (e.g. 65% CPU or 18 connections)
 * @param {number} safeThreshold - Maximum safe operating limit (e.g. 80% CPU or 20 connections)
 * @returns {number} Headroom fraction between 0 and 1 (or negative if threshold exceeded)
 */
export function calculateCapacityHeadroom(observed, safeThreshold) {
  if (safeThreshold <= 0) {
    return 0;
  }
  const headroom = 1 - observed / safeThreshold;
  return Number(headroom.toFixed(4));
}

/**
 * Classifies an operating metric into GREEN, AMBER, or RED capacity zones.
 *
 * @param {number} value - Measured metric value (e.g. RPS or CPU %)
 * @param {Object} thresholds
 * @param {number} thresholds.sustainable - Max value for GREEN zone
 * @param {number} thresholds.warning - Max value for AMBER zone
 * @returns {'GREEN' | 'AMBER' | 'RED'}
 */
export function classifyCapacityZone(value, { sustainable, warning }) {
  if (value <= sustainable) {
    return CapacityZone.GREEN;
  }
  if (value <= warning) {
    return CapacityZone.AMBER;
  }
  return CapacityZone.RED;
}

/**
 * Classifies HTTP response as normal, rate-limited (429), or load-shed (503).
 *
 * @param {number} statusCode
 * @param {Object|string} [body]
 * @returns {'NORMAL' | 'RATE_LIMIT' | 'LOAD_SHED' | 'SERVER_ERROR' | 'UNKNOWN'}
 */
export function classifyOverloadResponseType(statusCode, body = {}) {
  if (statusCode >= 200 && statusCode < 400) {
    return OverloadType.NORMAL;
  }
  if (statusCode === 429) {
    return OverloadType.RATE_LIMIT;
  }
  if (statusCode === 503) {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    if (
      rawBody.includes('OVERLOAD_LOAD_SHED') ||
      rawBody.includes('load shedding') ||
      rawBody.includes('Service is currently overloaded')
    ) {
      return OverloadType.LOAD_SHED;
    }
    return OverloadType.SERVER_ERROR;
  }
  if (statusCode >= 500) {
    return OverloadType.SERVER_ERROR;
  }
  return OverloadType.UNKNOWN;
}

/**
 * Calculates Kafka lag drain rate in events per second.
 *
 * DrainRate = DrainedEvents / TimeSeconds
 *
 * @param {number} drainedEvents - Number of accumulated events processed
 * @param {number} durationSeconds - Elapsed duration in seconds
 * @returns {number} Events per second
 */
export function calculateKafkaDrainRate(drainedEvents, durationSeconds) {
  if (durationSeconds <= 0 || drainedEvents <= 0) {
    return 0;
  }
  return Number((drainedEvents / durationSeconds).toFixed(2));
}

/**
 * Estimates recovery time from backlog.
 *
 * Time = BacklogSize / DrainRate
 *
 * @param {number} backlogSize - Total events in backlog
 * @param {number} drainRate - Drain rate in events/sec
 * @returns {number} Estimated recovery seconds
 */
export function estimateRecoveryTime(backlogSize, drainRate) {
  if (backlogSize <= 0) {
    return 0;
  }
  if (drainRate <= 0) {
    return Infinity;
  }
  return Number((backlogSize / drainRate).toFixed(2));
}

/**
 * Validates benchmark sanity rules.
 *
 * @param {Object} result
 * @returns {{ sane: boolean, violations: string[] }}
 */
export function validateBenchmarkSanity(result) {
  const violations = [];

  if (!result || typeof result !== 'object') {
    return { sane: false, violations: ['Invalid benchmark result'] };
  }

  if (result.RPS !== undefined && result.RPS < 0) {
    violations.push('RPS cannot be negative');
  }

  if (
    result.errorPercentage !== undefined &&
    (result.errorPercentage < 0 || result.errorPercentage > 100)
  ) {
    violations.push('Error percentage must be between 0 and 100');
  }

  if (
    result.minLatency !== undefined &&
    result.maxLatency !== undefined &&
    result.minLatency > result.maxLatency
  ) {
    violations.push(
      `minLatency (${result.minLatency}) cannot exceed maxLatency (${result.maxLatency})`,
    );
  }

  if (
    result.requests !== undefined &&
    result.successful !== undefined &&
    result.failed !== undefined
  ) {
    if (result.successful + result.failed !== result.requests) {
      violations.push(
        `Sum of successful (${result.successful}) and failed (${result.failed}) does not match requests (${result.requests})`,
      );
    }
  }

  return {
    sane: violations.length === 0,
    violations,
  };
}
