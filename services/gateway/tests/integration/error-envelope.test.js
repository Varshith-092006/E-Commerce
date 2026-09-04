import { describe, it, expect } from '@jest/globals';
import request from 'supertest';

import { createApp } from '../../src/app.js';

describe('Gateway Error Envelope Standards', () => {
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

  it('Unknown routes return 404 with standardized error envelope', async () => {
    const res = await request(app).get('/api/v1/non-existent-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toContain('Route not found');
    expect(res.body.meta.requestId).toBeDefined();
    expect(res.headers['x-request-id']).toBe(res.body.meta.requestId);
  });
});
