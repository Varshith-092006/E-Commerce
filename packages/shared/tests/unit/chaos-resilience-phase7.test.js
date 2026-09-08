import {
  validateExperimentSchema,
  validateSafetyRules,
  evaluateRecoveryCriteria,
  classifyFailureSeverity,
  detectCascadingFailure,
  validateDataInvariants,
  calculateResilienceScorecard,
  FailureSeverity,
  ExperimentStatus,
  ALLOWED_TARGETS,
  ALLOWED_FAULTS,
} from '../../src/utils/chaos-planning.js';

describe('Phase 7: Chaos Engineering & Resilience Utilities', () => {
  describe('Experiment Schema Validation', () => {
    it('accepts a fully compliant experiment definition', () => {
      const experiment = {
        id: 'catalog-replica-failure',
        name: 'Catalog Replica 2 Termination',
        target: 'catalog-svc',
        fault: 'kill',
        durationSec: 30,
        timeoutSec: 60,
        hypothesis: 'Remaining catalog replica will absorb traffic without persistent 5xx',
        expectedBehavior: 'Gateway routes to remaining replica; error rate stays < 1%',
        recoveryCriteria: {
          targetHealthy: true,
          readinessOk: true,
          maxPostRecovery5xx: 0,
        },
      };

      const result = validateExperimentSchema(experiment);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects invalid or missing experiment objects', () => {
      expect(validateExperimentSchema(null).valid).toBe(false);
      expect(validateExperimentSchema(undefined).valid).toBe(false);
      expect(validateExperimentSchema({}).valid).toBe(false);
    });

    it('rejects unapproved target containers/services', () => {
      const experiment = {
        id: 'unauthorized-target-test',
        name: 'Target Test',
        target: 'some-random-external-host',
        fault: 'kill',
        durationSec: 10,
        timeoutSec: 20,
        hypothesis: 'Test',
        expectedBehavior: 'Test',
        recoveryCriteria: {},
      };

      const result = validateExperimentSchema(experiment);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Allowed targets'))).toBe(true);
    });

    it('rejects unapproved fault types', () => {
      const experiment = {
        id: 'bad-fault-test',
        name: 'Bad Fault',
        target: 'catalog-svc',
        fault: 'format-c-drive',
        durationSec: 10,
        timeoutSec: 20,
        hypothesis: 'Test',
        expectedBehavior: 'Test',
        recoveryCriteria: {},
      };

      const result = validateExperimentSchema(experiment);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Allowed faults'))).toBe(true);
    });

    it('enforces timeoutSec > durationSec to guarantee recovery window', () => {
      const experiment = {
        id: 'timeout-test',
        name: 'Timeout Test',
        target: 'order-svc',
        fault: 'stop',
        durationSec: 30,
        timeoutSec: 20, // Invalid: timeout must be greater than duration
        hypothesis: 'Test',
        expectedBehavior: 'Test',
        recoveryCriteria: {},
      };

      const result = validateExperimentSchema(experiment);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('timeoutSec must be strictly greater'))).toBe(true);
    });
  });

  describe('Safety Rules Enforcement', () => {
    it('prohibits chaos execution in production mode', () => {
      const result = validateSafetyRules({
        isProduction: true,
        dockerHost: 'localhost',
        operation: 'docker stop ecommerce-catalog-svc',
      });
      expect(result.safe).toBe(false);
      expect(result.violations.some((v) => v.includes('strictly prohibited in production'))).toBe(true);
    });

    it('rejects remote or non-local Docker hosts', () => {
      const result = validateSafetyRules({
        isProduction: false,
        dockerHost: 'tcp://192.168.1.100:2375',
        operation: 'docker stop catalog-svc',
      });
      expect(result.safe).toBe(false);
      expect(result.violations.some((v) => v.includes('Remote Docker host'))).toBe(true);
    });

    it('strictly blocks destructive SQL commands (DROP, TRUNCATE)', () => {
      const dangerousCommands = [
        'DROP DATABASE order_db',
        'drop table orders cascade',
        'TRUNCATE TABLE payment_records',
      ];

      for (const cmd of dangerousCommands) {
        const result = validateSafetyRules({
          isProduction: false,
          dockerHost: 'localhost',
          operation: cmd,
        });
        expect(result.safe).toBe(false);
        expect(result.violations.some((v) => v.includes('strictly prohibited'))).toBe(true);
      }
    });

    it('strictly blocks Kafka topic deletion commands', () => {
      const dangerousCmd = 'kafka-topics --delete --topic ecommerce.order-events';
      const result = validateSafetyRules({
        isProduction: false,
        dockerHost: 'localhost',
        operation: dangerousCmd,
      });
      expect(result.safe).toBe(false);
      expect(result.violations.some((v) => v.includes('strictly prohibited'))).toBe(true);
    });

    it('strictly blocks Redis FLUSHALL / FLUSHDB commands', () => {
      const dangerousCmd = 'redis-cli FLUSHALL';
      const result = validateSafetyRules({
        isProduction: false,
        dockerHost: 'localhost',
        operation: dangerousCmd,
      });
      expect(result.safe).toBe(false);
      expect(result.violations.some((v) => v.includes('strictly prohibited'))).toBe(true);
    });

    it('allows benign container stop/start operations on local host', () => {
      const result = validateSafetyRules({
        isProduction: false,
        dockerHost: 'localhost',
        operation: 'docker stop infra-catalog-svc-2',
        destructiveMode: false,
      });
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('Recovery Criteria Evaluation', () => {
    it('evaluates fully recovered experiment as passing', () => {
      const result = {
        recovery: {
          targetHealthy: true,
          readinessOk: true,
          kafkaLag: 0,
          postRecovery5xx: 0,
          dbConnectionsLeaked: false,
          redisClientsLeaked: false,
          dlqGrowth: 0,
        },
      };

      const criteria = {
        targetHealthy: true,
        readinessOk: true,
        maxKafkaLag: 0,
        maxPostRecovery5xx: 0,
        dbConnectionsNormal: true,
        redisClientsNormal: true,
        allowDlqGrowth: false,
      };

      const evalResult = evaluateRecoveryCriteria(result, criteria);
      expect(evalResult.recovered).toBe(true);
      expect(evalResult.failures).toHaveLength(0);
    });

    it('fails when target service fails to return healthy', () => {
      const result = {
        recovery: {
          targetHealthy: false,
          readinessOk: false,
        },
      };

      const evalResult = evaluateRecoveryCriteria(result, { targetHealthy: true });
      expect(evalResult.recovered).toBe(false);
      expect(evalResult.failures.some((f) => f.includes('failed to return to healthy state'))).toBe(true);
    });

    it('fails when Kafka lag fails to drain below threshold', () => {
      const result = {
        recovery: {
          targetHealthy: true,
          readinessOk: true,
          kafkaLag: 45,
        },
      };

      const evalResult = evaluateRecoveryCriteria(result, { maxKafkaLag: 5 });
      expect(evalResult.recovered).toBe(false);
      expect(evalResult.failures.some((f) => f.includes('exceeded maximum threshold'))).toBe(true);
    });

    it('fails when connection pool leaks are detected', () => {
      const result = {
        recovery: {
          targetHealthy: true,
          readinessOk: true,
          dbConnectionsLeaked: true,
        },
      };

      const evalResult = evaluateRecoveryCriteria(result, { dbConnectionsNormal: true });
      expect(evalResult.recovered).toBe(false);
      expect(evalResult.failures.some((f) => f.includes('connection pool leaked'))).toBe(true);
    });
  });

  describe('Failure Severity Classification', () => {
    it('classifies cleanly recovered experiments as GREEN', () => {
      const severity = classifyFailureSeverity({
        dataCorrupted: false,
        eventsLost: false,
        duplicateSideEffects: false,
        unrecoverableState: false,
        cascadingFailure: false,
        automaticallyRecovered: true,
        acceptedLimitation: false,
      });
      expect(severity).toBe(FailureSeverity.GREEN);
    });

    it('classifies accepted single-replica architectural limitations as AMBER', () => {
      const severity = classifyFailureSeverity({
        dataCorrupted: false,
        eventsLost: false,
        duplicateSideEffects: false,
        unrecoverableState: false,
        cascadingFailure: false,
        automaticallyRecovered: true,
        acceptedLimitation: true, // e.g. Gateway single-replica outage
      });
      expect(severity).toBe(FailureSeverity.AMBER);
    });

    it('classifies experiments requiring manual intervention as AMBER', () => {
      const severity = classifyFailureSeverity({
        dataCorrupted: false,
        eventsLost: false,
        duplicateSideEffects: false,
        unrecoverableState: false,
        cascadingFailure: false,
        automaticallyRecovered: false,
      });
      expect(severity).toBe(FailureSeverity.AMBER);
    });

    it('classifies data corruption as RED', () => {
      const severity = classifyFailureSeverity({
        dataCorrupted: true,
      });
      expect(severity).toBe(FailureSeverity.RED);
    });

    it('classifies lost events as RED', () => {
      const severity = classifyFailureSeverity({
        eventsLost: true,
      });
      expect(severity).toBe(FailureSeverity.RED);
    });

    it('classifies duplicate financial transactions as RED', () => {
      const severity = classifyFailureSeverity({
        duplicateSideEffects: true,
      });
      expect(severity).toBe(FailureSeverity.RED);
    });

    it('classifies persistent cascading failures as RED', () => {
      const severity = classifyFailureSeverity({
        cascadingFailure: true,
      });
      expect(severity).toBe(FailureSeverity.RED);
    });
  });

  describe('Cascading Failure Detection', () => {
    it('detects healthy containment when unrelated services are unaffected', () => {
      const detection = detectCascadingFailure({
        target: 'catalog-svc',
        unrelatedServices: ['order-svc', 'payment-svc', 'identity-svc'],
        serviceStatusMap: {
          'order-svc': { crashed: false, errorRate: 0.0, unhealthy: false },
          'payment-svc': { crashed: false, errorRate: 0.0, unhealthy: false },
          'identity-svc': { crashed: false, errorRate: 0.0, unhealthy: false },
        },
      });

      expect(detection.isCascading).toBe(false);
      expect(detection.affectedUnrelated).toHaveLength(0);
    });

    it('detects cascading failure when unrelated services crash or spike errors', () => {
      const detection = detectCascadingFailure({
        target: 'catalog-svc',
        unrelatedServices: ['order-svc', 'payment-svc', 'identity-svc'],
        serviceStatusMap: {
          'order-svc': { crashed: false, errorRate: 0.0, unhealthy: false },
          'payment-svc': { crashed: true, errorRate: 0.8, unhealthy: true }, // Collateral failure!
          'identity-svc': { crashed: false, errorRate: 0.0, unhealthy: false },
        },
      });

      expect(detection.isCascading).toBe(true);
      expect(detection.affectedUnrelated).toContain('payment-svc');
    });
  });

  describe('Data & Event Invariant Validation', () => {
    it('validates intact state when business invariants hold', () => {
      const pre = { orderCount: 10 };
      const post = {
        orderCount: 12,
        duplicateOrderCount: 0,
        duplicatePaymentCount: 0,
        orphanedOutboxCount: 0,
        invalidStatusTransitions: 0,
      };

      const result = validateDataInvariants(pre, post);
      expect(result.intact).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('detects decreased order count (lost database records)', () => {
      const pre = { orderCount: 15 };
      const post = {
        orderCount: 14,
        duplicateOrderCount: 0,
      };

      const result = validateDataInvariants(pre, post);
      expect(result.intact).toBe(false);
      expect(result.violations.some((v) => v.includes('decreased from 15 to 14'))).toBe(true);
    });

    it('detects duplicate orders violating idempotency', () => {
      const pre = { orderCount: 5 };
      const post = {
        orderCount: 7,
        duplicateOrderCount: 2,
      };

      const result = validateDataInvariants(pre, post);
      expect(result.intact).toBe(false);
      expect(result.violations.some((v) => v.includes('duplicate order number'))).toBe(true);
    });

    it('detects duplicate payments', () => {
      const pre = { orderCount: 5 };
      const post = {
        orderCount: 6,
        duplicateOrderCount: 0,
        duplicatePaymentCount: 1,
      };

      const result = validateDataInvariants(pre, post);
      expect(result.intact).toBe(false);
      expect(result.violations.some((v) => v.includes('duplicate payment captures'))).toBe(true);
    });

    it('detects orphaned outbox records', () => {
      const pre = { orderCount: 5 };
      const post = {
        orderCount: 6,
        orphanedOutboxCount: 3,
      };

      const result = validateDataInvariants(pre, post);
      expect(result.intact).toBe(false);
      expect(result.violations.some((v) => v.includes('orphaned/lost outbox events'))).toBe(true);
    });
  });

  describe('Resilience Scorecard Calculation', () => {
    it('computes scorecard metrics accurately across multiple experiments', () => {
      const mockResults = [
        {
          experimentId: 'exp-1',
          status: ExperimentStatus.PASS,
          severity: FailureSeverity.GREEN,
          detectionTimeMs: 1200,
          recoveryTimeMs: 4500,
          cascadingFailure: false,
          recovery: { targetHealthy: true, readinessOk: true },
          integrity: { dataSafe: true, eventsSafe: true },
        },
        {
          experimentId: 'exp-2',
          status: ExperimentStatus.AMBER,
          severity: FailureSeverity.AMBER,
          detectionTimeMs: 800,
          recoveryTimeMs: 5200,
          cascadingFailure: false,
          recovery: { targetHealthy: true, readinessOk: true },
          integrity: { dataSafe: true, eventsSafe: true },
        },
        {
          experimentId: 'exp-3',
          status: ExperimentStatus.PASS,
          severity: FailureSeverity.GREEN,
          detectionTimeMs: 1500,
          recoveryTimeMs: 3800,
          cascadingFailure: false,
          recovery: { targetHealthy: true, readinessOk: true },
          integrity: { dataSafe: true, eventsSafe: true },
        },
      ];

      const scorecard = calculateResilienceScorecard(mockResults);

      expect(scorecard.experimentsExecuted).toBe(3);
      expect(scorecard.passed).toBe(2);
      expect(scorecard.amber).toBe(1);
      expect(scorecard.failed).toBe(0);
      expect(scorecard.redFailures).toBe(0);
      expect(scorecard.cascadingFailures).toBe(0);
      expect(scorecard.recoverySuccessRate).toBe(100.0);
      expect(scorecard.dataIntegritySuccessRate).toBe(100.0);
      expect(scorecard.eventIntegritySuccessRate).toBe(100.0);
      expect(scorecard.meanDetectionTimeMs).toBe(Math.round((1200 + 800 + 1500) / 3));
      expect(scorecard.meanRecoveryTimeMs).toBe(Math.round((4500 + 5200 + 3800) / 3));
    });

    it('handles empty results safely', () => {
      const scorecard = calculateResilienceScorecard([]);
      expect(scorecard.experimentsExecuted).toBe(0);
      expect(scorecard.recoverySuccessRate).toBe(0);
    });
  });
});
