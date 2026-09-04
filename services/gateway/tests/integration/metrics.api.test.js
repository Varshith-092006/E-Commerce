import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Gateway Prometheus Metrics API Integration Tests (Phase 5)', () => {
  let app;

  beforeAll(() => {
    app = createApp({
      checkRedisHealth: async () => ({ status: 'healthy', latencyMs: 1 }),
      getRedisClient: () => ({
        ping: async () => 'PONG',
      }),
    });
  });

  it('GET /metrics should expose valid Prometheus metrics format with Golden Signals', async () => {
    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('process_resident_memory_bytes');
    expect(res.text).toContain('http_requests_total');
    expect(res.text).toContain('http_request_duration_seconds');
    expect(res.text).toContain('http_active_requests');
  });
});
