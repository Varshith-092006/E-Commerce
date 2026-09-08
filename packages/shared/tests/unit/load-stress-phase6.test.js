import { describe, it, expect } from '@jest/globals';
import {
  validateLoadTestResultSchema,
  calculateScalingEfficiency,
  calculateCapacityHeadroom,
  classifyCapacityZone,
  classifyOverloadResponseType,
  calculateKafkaDrainRate,
  estimateRecoveryTime,
  validateBenchmarkSanity,
  CapacityZone,
  OverloadType,
} from '../../src/index.js';

describe('Phase 6: Load, Stress, Capacity & Recovery Unit Tests', () => {
  // ─── 1. Load-Test Result Schema Validation ──────────────────────────────────
  describe('Load-Test Result Schema Validation', () => {
    const validSample = {
      workload: 'G',
      concurrency: 50,
      requests: 1200,
      successful: 1180,
      failed: 20,
      RPS: 240.0,
      P50: 18.5,
      P90: 42.1,
      P95: 58.2,
      P99: 89.0,
      maxLatency: 145.2,
      '2xx': 1180,
      '4xx': 10,
      '429': 5,
      '503': 5,
      '5xx': 0,
      loadShed: 5,
    };

    it('should validate a complete and well-formed result object', () => {
      const res = validateLoadTestResultSchema(validSample);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it('should fail when required fields are missing', () => {
      const invalid = { ...validSample };
      delete invalid.RPS;
      delete invalid.loadShed;

      const res = validateLoadTestResultSchema(invalid);
      expect(res.valid).toBe(false);
      expect(res.errors).toContain('Missing required field: RPS');
      expect(res.errors).toContain('Missing required field: loadShed');
    });

    it('should enforce concurrency >= 1', () => {
      const invalid = { ...validSample, concurrency: 0 };
      const res = validateLoadTestResultSchema(invalid);
      expect(res.valid).toBe(false);
      expect(res.errors).toContain('Concurrency must be >= 1');
    });

    it('should enforce non-negative requests', () => {
      const invalid = { ...validSample, requests: -1 };
      const res = validateLoadTestResultSchema(invalid);
      expect(res.valid).toBe(false);
      expect(res.errors).toContain('Total requests cannot be negative');
    });

    it('should reject non-monotonic percentiles (e.g., P50 > P95)', () => {
      const invalid = { ...validSample, P50: 100, P90: 50 };
      const res = validateLoadTestResultSchema(invalid);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes('P50') && e.includes('cannot exceed P90'))).toBe(true);
    });

    it('should reject when P99 exceeds maxLatency', () => {
      const invalid = { ...validSample, P99: 200, maxLatency: 150 };
      const res = validateLoadTestResultSchema(invalid);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes('P99') && e.includes('maxLatency'))).toBe(true);
    });
  });

  // ─── 2. Multi-Replica Scaling Efficiency ────────────────────────────────────
  describe('Scaling Efficiency Calculations', () => {
    it('should calculate 1.0 (100%) efficiency for linear 2-replica scaling', () => {
      // 1 replica produces 100 RPS, 2 replicas produce 200 RPS
      const efficiency = calculateScalingEfficiency(200, 2, 100);
      expect(efficiency).toBe(1.0);
    });

    it('should calculate accurate sub-linear efficiency for realistic contention', () => {
      // 1 replica produces 150 RPS, 2 replicas produce 270 RPS (90% efficiency)
      const efficiency = calculateScalingEfficiency(270, 2, 150);
      expect(efficiency).toBe(0.9);
    });

    it('should calculate 3-replica scaling efficiency correctly', () => {
      // 1 replica produces 120 RPS, 3 replicas produce 306 RPS (85% efficiency)
      const efficiency = calculateScalingEfficiency(306, 3, 120);
      expect(efficiency).toBe(0.85);
    });

    it('should return 0 when inputs are invalid or zero', () => {
      expect(calculateScalingEfficiency(0, 0, 100)).toBe(0);
      expect(calculateScalingEfficiency(100, 2, 0)).toBe(0);
      expect(calculateScalingEfficiency(-50, 2, 100)).toBe(0);
    });
  });

  // ─── 3. Resource Headroom Calculations ───────────────────────────────────────
  describe('Resource Headroom Calculations', () => {
    it('should calculate correct headroom when observed is well below safe threshold', () => {
      // 40% CPU observed, safe threshold is 80% -> Headroom = 1 - (40/80) = 0.50 (50%)
      const headroom = calculateCapacityHeadroom(40, 80);
      expect(headroom).toBe(0.5);
    });

    it('should return 0.0 when observed exactly matches safe threshold', () => {
      const headroom = calculateCapacityHeadroom(80, 80);
      expect(headroom).toBe(0.0);
    });

    it('should return negative headroom when safe threshold is breached', () => {
      // 90% observed vs 80% threshold -> Headroom = 1 - (90/80) = -0.125
      const headroom = calculateCapacityHeadroom(90, 80);
      expect(headroom).toBe(-0.125);
    });

    it('should return 0 when safe threshold is zero or negative', () => {
      expect(calculateCapacityHeadroom(50, 0)).toBe(0);
    });
  });

  // ─── 4. Capacity Zone Classification ────────────────────────────────────────
  describe('Capacity Zone Classification', () => {
    const thresholds = {
      sustainable: 300,
      warning: 450,
    };

    it('should classify values below or equal to sustainable as GREEN', () => {
      expect(classifyCapacityZone(200, thresholds)).toBe(CapacityZone.GREEN);
      expect(classifyCapacityZone(300, thresholds)).toBe(CapacityZone.GREEN);
    });

    it('should classify values between sustainable and warning as AMBER', () => {
      expect(classifyCapacityZone(350, thresholds)).toBe(CapacityZone.AMBER);
      expect(classifyCapacityZone(450, thresholds)).toBe(CapacityZone.AMBER);
    });

    it('should classify values exceeding warning as RED', () => {
      expect(classifyCapacityZone(451, thresholds)).toBe(CapacityZone.RED);
      expect(classifyCapacityZone(600, thresholds)).toBe(CapacityZone.RED);
    });
  });

  // ─── 5. Overload Classification: 429 vs 503 ─────────────────────────────────
  describe('Rate Limiting vs Load Shedding Overload Distinction', () => {
    it('should classify HTTP 200 as NORMAL', () => {
      expect(classifyOverloadResponseType(200)).toBe(OverloadType.NORMAL);
      expect(classifyOverloadResponseType(204)).toBe(OverloadType.NORMAL);
    });

    it('should strictly classify HTTP 429 as RATE_LIMIT (not system instability)', () => {
      const type = classifyOverloadResponseType(429, { code: 'RATE_LIMIT_EXCEEDED' });
      expect(type).toBe(OverloadType.RATE_LIMIT);
    });

    it('should classify HTTP 503 with OVERLOAD_LOAD_SHED as LOAD_SHED', () => {
      const type = classifyOverloadResponseType(503, {
        error: { code: 'OVERLOAD_LOAD_SHED', message: 'Service is currently overloaded.' },
      });
      expect(type).toBe(OverloadType.LOAD_SHED);
    });

    it('should classify general 503 or 500 without load-shed payload as SERVER_ERROR', () => {
      expect(classifyOverloadResponseType(503, { message: 'Database unreachable' })).toBe(
        OverloadType.SERVER_ERROR
      );
      expect(classifyOverloadResponseType(500, { error: 'Internal Server Error' })).toBe(
        OverloadType.SERVER_ERROR
      );
    });
  });

  // ─── 6. Kafka Lag Drain Rate & Recovery Calculations ────────────────────────
  describe('Kafka Backlog Drain & Recovery Calculations', () => {
    it('should calculate correct drain rate in events per second', () => {
      // 3000 events drained across 10 seconds -> 300 eps drain rate
      const rate = calculateKafkaDrainRate(3000, 10);
      expect(rate).toBe(300);
    });

    it('should return 0 when elapsed time or events are non-positive', () => {
      expect(calculateKafkaDrainRate(0, 10)).toBe(0);
      expect(calculateKafkaDrainRate(100, 0)).toBe(0);
    });

    it('should estimate time-to-zero-lag accurately given backlog and drain rate', () => {
      // 1500 backlog at 300 eps -> 5.0 seconds
      const recoverySec = estimateRecoveryTime(1500, 300);
      expect(recoverySec).toBe(5.0);
    });

    it('should return 0 when backlog is 0', () => {
      expect(estimateRecoveryTime(0, 300)).toBe(0);
    });

    it('should return Infinity when drain rate is 0 and backlog exists', () => {
      expect(estimateRecoveryTime(500, 0)).toBe(Infinity);
    });
  });

  // ─── 7. Benchmark Sanity & Monotonicity Validation ──────────────────────────
  describe('Benchmark Sanity Validation', () => {
    it('should pass sanity validation on consistent data', () => {
      const sample = {
        RPS: 320.5,
        minLatency: 4.2,
        maxLatency: 88.0,
        requests: 1000,
        successful: 950,
        failed: 50,
        errorPercentage: 5.0,
      };
      const res = validateBenchmarkSanity(sample);
      expect(res.sane).toBe(true);
      expect(res.violations).toHaveLength(0);
    });

    it('should flag negative RPS', () => {
      const res = validateBenchmarkSanity({ RPS: -10 });
      expect(res.sane).toBe(false);
      expect(res.violations).toContain('RPS cannot be negative');
    });

    it('should flag error percentage exceeding 100%', () => {
      const res = validateBenchmarkSanity({ errorPercentage: 105 });
      expect(res.sane).toBe(false);
      expect(res.violations).toContain('Error percentage must be between 0 and 100');
    });

    it('should flag minLatency exceeding maxLatency', () => {
      const res = validateBenchmarkSanity({ minLatency: 50, maxLatency: 20 });
      expect(res.sane).toBe(false);
      expect(res.violations.some((v) => v.includes('minLatency') && v.includes('maxLatency'))).toBe(true);
    });

    it('should flag request sum mismatch (successful + failed != total requests)', () => {
      const res = validateBenchmarkSanity({
        requests: 100,
        successful: 80,
        failed: 10, // 80 + 10 != 100
      });
      expect(res.sane).toBe(false);
      expect(res.violations.some((v) => v.includes('Sum of successful'))).toBe(true);
    });
  });
});
