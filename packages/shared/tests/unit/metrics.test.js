import { MetricsRegistry, metricsMiddleware, normalizeRoute } from '../../src/index.js';

describe('Prometheus Metrics Engine & Middleware Unit Tests (Phase 5)', () => {
  let registry;

  beforeEach(() => {
    registry = new MetricsRegistry();
  });

  describe('MetricsRegistry & Metric Types', () => {
    it('should register and increment counters with multi-dimensional labels', () => {
      const counter = registry.registerCounter({
        name: 'test_counter_total',
        help: 'Test counter help text',
        labelNames: ['service', 'method', 'status'],
      });

      counter.inc({ service: 'gateway', method: 'GET', status: '200' }, 1);
      counter.inc({ service: 'gateway', method: 'GET', status: '200' }, 2);
      counter.inc({ service: 'gateway', method: 'POST', status: '500' }, 1);

      const text = counter.toPrometheusString();
      expect(text).toContain('# HELP test_counter_total Test counter help text');
      expect(text).toContain('# TYPE test_counter_total counter');
      expect(text).toContain('test_counter_total{service="gateway",method="GET",status="200"} 3');
      expect(text).toContain('test_counter_total{service="gateway",method="POST",status="500"} 1');
    });

    it('should set, increment, and decrement gauges accurately', () => {
      const gauge = registry.registerGauge({
        name: 'test_gauge',
        help: 'Test gauge help text',
        labelNames: ['service'],
      });

      gauge.set({ service: 'order-svc' }, 10);
      gauge.inc({ service: 'order-svc' }, 2);
      gauge.dec({ service: 'order-svc' }, 5);

      const text = gauge.toPrometheusString();
      expect(text).toContain('# TYPE test_gauge gauge');
      expect(text).toContain('test_gauge{service="order-svc"} 7');
    });

    it('should observe latency in histograms and calculate bucket cumulative counts and sums', () => {
      const histogram = registry.registerHistogram({
        name: 'test_duration_seconds',
        help: 'Test histogram help text',
        labelNames: ['route'],
        buckets: [0.01, 0.05, 0.1, 0.5, 1.0],
      });

      histogram.observe({ route: '/api/v1/orders' }, 0.02);
      histogram.observe({ route: '/api/v1/orders' }, 0.08);
      histogram.observe({ route: '/api/v1/orders' }, 0.25);

      const text = histogram.toPrometheusString();
      expect(text).toContain('test_duration_seconds_bucket{route="/api/v1/orders",le="0.01"} 0');
      expect(text).toContain('test_duration_seconds_bucket{route="/api/v1/orders",le="0.05"} 1');
      expect(text).toContain('test_duration_seconds_bucket{route="/api/v1/orders",le="0.1"} 2');
      expect(text).toContain('test_duration_seconds_bucket{route="/api/v1/orders",le="0.5"} 3');
      expect(text).toContain('test_duration_seconds_bucket{route="/api/v1/orders",le="+Inf"} 3');
      expect(text).toContain('test_duration_seconds_count{route="/api/v1/orders"} 3');
      expect(text).toContain('test_duration_seconds_sum{route="/api/v1/orders"} 0.35');
    });

    it('should output full valid Prometheus exposition text with runtime metrics', () => {
      const output = registry.toPrometheusText();
      expect(output).toContain('process_resident_memory_bytes');
      expect(output).toContain('process_uptime_seconds');
      expect(output).toContain('http_requests_total');
      expect(output).toContain('http_request_duration_seconds');
      expect(output).toContain('http_active_requests');
    });
  });

  describe('Route Normalization & Cardinality Protection', () => {
    it('should normalize UUIDs and numeric IDs to :id', () => {
      const req1 = {
        route: { path: '/api/v1/orders/:id' },
        baseUrl: '',
      };
      expect(normalizeRoute(req1)).toBe('/api/v1/orders/:id');

      const req2 = {
        path: '/api/v1/orders/123e4567-e89b-12d3-a456-426614174000',
        originalUrl: '/api/v1/orders/123e4567-e89b-12d3-a456-426614174000?filter=active',
      };
      expect(normalizeRoute(req2)).toBe('/api/v1/orders/:id');
    });
  });

  describe('metricsMiddleware', () => {
    it('should track active requests, status code, and duration upon response finish', (done) => {
      const middleware = metricsMiddleware({
        serviceName: 'test-svc',
        registry,
      });

      const req = {
        method: 'GET',
        path: '/api/v1/products',
        route: { path: '/api/v1/products' },
      };

      const finishCallbacks = [];
      const res = {
        statusCode: 200,
        on: (event, cb) => {
          if (event === 'finish') finishCallbacks.push(cb);
        },
      };

      middleware(req, res, () => {
        const activeGauge = registry.getMetric('http_active_requests');
        expect(activeGauge.values.get('service="test-svc"')).toBe(1);

        // Simulate response finished
        for (const cb of finishCallbacks) cb();

        expect(activeGauge.values.get('service="test-svc"')).toBe(0);

        const counter = registry.getMetric('http_requests_total');
        expect(
          counter.values.get('service="test-svc",method="GET",route="/api/v1/products",status_code="200"'),
        ).toBe(1);

        done();
      });
    });
  });
});
