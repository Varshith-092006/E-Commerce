import { describe, it, expect } from '@jest/globals';
import request from 'supertest';

import { createApp } from '../../src/app.js';

describe('Gateway Health Endpoint', () => {
  const mockRedisClient = {
    multi: () => ({
      incr: () => {},
      ttl: () => {},
      exec: async () => [[null, 1], [null, 60]],
    }),
    expire: async () => 1,
  };

  const app = createApp({
    checkRedisHealth: async () => true,
    getRedisClient: () => mockRedisClient,
  });

  it('GET /health returns 200 with standard success envelope and service metadata', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.services.gateway).toBeDefined();
    expect(res.body.data.services.redis.status).toBe('connected');
    expect(res.body.meta.requestId).toBeDefined();
    expect(res.headers['x-request-id']).toBeDefined();
  });
});
