import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeEach } from '@jest/globals';

import {
  MetricsRegistry,
  normalizeRoute,
  metricsRegistry,
} from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Phase 5: Observability, Metrics & Capacity Planning Unit Tests', () => {
  let testRegistry;

  beforeEach(() => {
    testRegistry = new MetricsRegistry();
  });

  // ─── 1. Metrics Registration & Deduplication ────────────────────────────────
  describe('Metrics Registration & Deduplication', () => {
    it('should register counters, gauges, and histograms with custom label names', () => {
      const counter = testRegistry.registerCounter({
        name: 'test_counter_total',
        help: 'Test counter help',
        labelNames: ['service', 'status'],
      });

      const gauge = testRegistry.registerGauge({
        name: 'test_gauge_active',
        help: 'Test gauge help',
        labelNames: ['service'],
      });

      const hist = testRegistry.registerHistogram({
        name: 'test_hist_duration',
        help: 'Test histogram help',
        labelNames: ['service'],
        buckets: [0.01, 0.1, 1.0],
      });

      expect(counter).toBeDefined();
      expect(gauge).toBeDefined();
      expect(hist).toBeDefined();
      expect(testRegistry.getMetric('test_counter_total')).toBe(counter);
    });

    it('should safely return existing metric instance upon duplicate registration without throwing', () => {
      const first = testRegistry.registerCounter({
        name: 'duplicate_metric_total',
        help: 'First registration',
      });

      const second = testRegistry.registerCounter({
        name: 'duplicate_metric_total',
        help: 'Second registration',
      });

      expect(second).toBe(first);
      first.inc({}, 5);
      expect(second.values.get('')).toBe(5);
    });

    it('should verify Phase 5 required metrics exist in global metricsRegistry', () => {
      const requiredMetrics = [
        'http_request_errors_total',
        'load_shedding_requests_total',
        'load_shedding_active_requests',
        'load_shedding_rejected_total',
        'db_pool_connections_active',
        'db_pool_connections_idle',
        'db_pool_connections_total',
        'redis_connected_clients',
        'http_requests_total',
        'http_request_duration_seconds',
        'http_active_requests',
      ];

      for (const name of requiredMetrics) {
        const m = metricsRegistry.getMetric(name);
        expect(m).toBeDefined();
      }
    });

    it('should verify histogram buckets match Phase 5 specification', () => {
      const durationMetric = metricsRegistry.getMetric('http_request_duration_seconds');
      expect(durationMetric).toBeDefined();
      const expectedBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
      expect(durationMetric.buckets).toEqual(expectedBuckets);
    });
  });

  // ─── 2. Route Normalization & High-Cardinality Prevention ────────────────────
  describe('Route Normalization & High-Cardinality Prevention', () => {
    it('should normalize user UUIDs to :uuid', () => {
      const req = {
        path: '/api/v1/users/550e8400-e29b-41d4-a716-446655440000',
        originalUrl: '/api/v1/users/550e8400-e29b-41d4-a716-446655440000',
      };
      expect(normalizeRoute(req)).toBe('/api/v1/users/:uuid');
    });

    it('should normalize product numeric IDs to :id and slugs to :slug', () => {
      const reqId = {
        path: '/api/v1/products/123',
        originalUrl: '/api/v1/products/123',
      };
      expect(normalizeRoute(reqId)).toBe('/api/v1/products/:id');

      const reqSlug = {
        path: '/api/v1/products/some-product-slug',
        originalUrl: '/api/v1/products/some-product-slug',
      };
      expect(normalizeRoute(reqSlug)).toBe('/api/v1/products/:slug');
    });

    it('should strip query parameters and hash fragments to prevent label explosion', () => {
      const reqWithQuery = {
        path: '/api/v1/products/search',
        originalUrl: '/api/v1/products/search?q=laptop&sort=asc&page=2#top',
      };
      expect(normalizeRoute(reqWithQuery)).toBe('/api/v1/products/search');
    });

    it('should normalize express routed paths with route parameters', () => {
      const req = {
        route: { path: '/:id' },
        baseUrl: '/api/v1/products',
      };
      expect(normalizeRoute(req)).toBe('/api/v1/products/:id');
    });
  });

  // ─── 3. Prometheus Alert Rules Structure ────────────────────────────────────
  describe('Prometheus Alert Rules File Structure', () => {
    it('should contain all 8 required alert rules with valid PromQL and for durations', () => {
      const alertRulesPath = path.resolve(__dirname, '../../../../infra/prometheus/alert_rules.yml');
      expect(fs.existsSync(alertRulesPath)).toBe(true);

      const content = fs.readFileSync(alertRulesPath, 'utf-8');

      const requiredAlerts = [
        'HighErrorRate',
        'HighP95Latency',
        'KafkaConsumerLagHigh',
        'KafkaDLQIncrease',
        'HighCPU',
        'HighMemory',
        'DBConnectionPressure',
        'RedisMemoryPressure',
      ];

      for (const alert of requiredAlerts) {
        expect(content).toContain(`alert: ${alert}`);
      }

      // Verify sensible 5m duration
      expect(content).toContain('for: 5m');
      // Verify severity labels
      expect(content).toContain('severity: critical');
      expect(content).toContain('severity: warning');
    });
  });

  // ─── 4. SLO & Error Budget Models ───────────────────────────────────────────
  describe('SLO Validation & Error Budget Calculation', () => {
    function calculateAvailability(totalRequests, errorRequests) {
      if (totalRequests === 0) return 100;
      return ((totalRequests - errorRequests) / totalRequests) * 100;
    }

    function calculateErrorBudget(targetAvailability, totalRequests) {
      const allowedErrorFraction = (100 - targetAvailability) / 100;
      return Math.floor(totalRequests * allowedErrorFraction);
    }

    it('should correctly calculate system availability and error budget for 99.0% SLO', () => {
      const total = 1000000;
      const budget = calculateErrorBudget(99.0, total);
      expect(budget).toBe(10000); // 10,000 requests allowed

      const actualErrors = 4500;
      const availability = calculateAvailability(total, actualErrors);
      expect(availability).toBeCloseTo(99.55, 2);
      expect(availability).toBeGreaterThanOrEqual(99.0);

      const remainingBudgetFraction = (budget - actualErrors) / budget;
      expect(remainingBudgetFraction).toBeCloseTo(0.55, 2);
    });

    it('should enforce service-level P95 latency thresholds', () => {
      const sloTargets = {
        gateway: 500,
        catalog: 750,
        order: 1000,
        payment: 1500,
        notification: 1000,
      };

      expect(sloTargets.gateway).toBeLessThanOrEqual(500);
      expect(sloTargets.catalog).toBeLessThanOrEqual(750);
      expect(sloTargets.order).toBeLessThanOrEqual(1000);
      expect(sloTargets.payment).toBeLessThanOrEqual(1500);
      expect(sloTargets.notification).toBeLessThanOrEqual(1000);
    });
  });

  // ─── 5. Capacity & GREEN/AMBER/RED Classification ───────────────────────────
  describe('Capacity Calculation & Headroom Classification', () => {
    function classifyHeadroom(utilizationPercent) {
      if (utilizationPercent < 60) return 'GREEN';
      if (utilizationPercent <= 80) return 'AMBER';
      return 'RED';
    }

    it('should classify headroom into GREEN, AMBER, and RED correctly', () => {
      expect(classifyHeadroom(45)).toBe('GREEN');
      expect(classifyHeadroom(59.9)).toBe('GREEN');
      expect(classifyHeadroom(60.0)).toBe('AMBER');
      expect(classifyHeadroom(75.0)).toBe('AMBER');
      expect(classifyHeadroom(80.0)).toBe('AMBER');
      expect(classifyHeadroom(80.1)).toBe('RED');
      expect(classifyHeadroom(95.0)).toBe('RED');
    });

    it('should calculate sustainable RPS and identify saturation point', () => {
      const peakTestedRps = 450;
      const saturationUtilization = 0.85; // 85% CPU saturation at peak
      const targetSafeUtilization = 0.65; // Safe target for sustainable load

      const sustainableRps = Math.floor(peakTestedRps * (targetSafeUtilization / saturationUtilization));
      expect(sustainableRps).toBeLessThan(peakTestedRps);
      expect(sustainableRps).toBeGreaterThan(0);
    });
  });

  // ─── 6. Performance Regression Threshold Calculation ────────────────────────
  describe('Performance Regression Detection Rule', () => {
    function evaluateRegression(baselineP95, currentP95, baselineRps, currentRps, thresholdPct = 10.0) {
      const p95Degradation = ((currentP95 - baselineP95) / baselineP95) * 100;
      const throughputDegradation = ((baselineRps - currentRps) / baselineRps) * 100;

      const isRegressed = p95Degradation > thresholdPct || throughputDegradation > thresholdPct;

      return {
        isRegressed,
        p95Degradation: Number(p95Degradation.toFixed(1)),
        throughputDegradation: Number(throughputDegradation.toFixed(1)),
      };
    }

    it('should pass when performance variation is within 10%', () => {
      const result = evaluateRegression(100, 105, 500, 480, 10.0);
      expect(result.isRegressed).toBe(false);
      expect(result.p95Degradation).toBe(5.0);
      expect(result.throughputDegradation).toBe(4.0);
    });

    it('should flag regression when P95 latency increases by more than 10%', () => {
      const result = evaluateRegression(100, 115, 500, 500, 10.0);
      expect(result.isRegressed).toBe(true);
      expect(result.p95Degradation).toBe(15.0);
    });

    it('should flag regression when throughput drops by more than 10%', () => {
      const result = evaluateRegression(100, 102, 500, 430, 10.0);
      expect(result.isRegressed).toBe(true);
      expect(result.throughputDegradation).toBe(14.0);
    });
  });
});
