import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Catalog Service Prometheus Metrics (Phase 5)', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  it('GET /metrics should return valid Prometheus metrics text', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('process_resident_memory_bytes');
    expect(res.text).toContain('http_requests_total');
  });
});
