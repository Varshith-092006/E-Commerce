import { describe, it, expect, jest } from '@jest/globals';
import { requestIdMiddleware, REQUEST_ID_HEADER } from '../../src/index.js';

describe('RequestId Middleware', () => {
  it('generates a new UUID if no header is present', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();

    requestIdMiddleware(req, res, next);

    expect(req.id).toBeDefined();
    expect(typeof req.id).toBe('string');
    expect(req.id.length).toBeGreaterThan(10);
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', req.id);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('preserves existing x-request-id header', () => {
    const req = { headers: { [REQUEST_ID_HEADER]: 'custom-client-id-123' } };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();

    requestIdMiddleware(req, res, next);

    expect(req.id).toBe('custom-client-id-123');
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'custom-client-id-123');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
