import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Order Service Health Check', () => {
  const app = createApp();

  it('GET /health returns 200 with healthy service status and requestId', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.service).toBe('order-svc');
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.meta.requestId).toBeDefined();
    expect(res.headers['x-request-id']).toBeDefined();
  });
});
