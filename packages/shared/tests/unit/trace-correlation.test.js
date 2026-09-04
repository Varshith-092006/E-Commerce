import { requestIdMiddleware, createLogger } from '../../src/index.js';

describe('Distributed Tracing & Correlation Context Unit Tests (Phase 5)', () => {
  it('should generate traceId, spanId, and requestId when none are provided', (done) => {
    const req = { headers: {} };
    const resHeaders = {};
    const res = {
      setHeader: (key, val) => {
        resHeaders[key] = val;
      },
    };

    requestIdMiddleware(req, res, () => {
      expect(req.id).toBeDefined();
      expect(req.traceId).toBeDefined();
      expect(req.spanId).toBeDefined();
      expect(resHeaders['X-Request-Id']).toBe(req.id);
      expect(resHeaders['X-Trace-Id']).toBe(req.traceId);
      expect(resHeaders['X-Span-Id']).toBe(req.spanId);
      done();
    });
  });

  it('should preserve incoming x-trace-id and x-request-id across downstream service boundaries', (done) => {
    const incomingTrace = 'trace-w3c-abc-123';
    const incomingReq = 'req-client-xyz-789';

    const req = {
      headers: {
        'x-trace-id': incomingTrace,
        'x-request-id': incomingReq,
      },
    };
    const resHeaders = {};
    const res = {
      setHeader: (key, val) => {
        resHeaders[key] = val;
      },
    };

    requestIdMiddleware(req, res, () => {
      expect(req.traceId).toBe(incomingTrace);
      expect(req.requestId).toBe(incomingReq);
      expect(resHeaders['X-Trace-Id']).toBe(incomingTrace);
      expect(resHeaders['X-Request-Id']).toBe(incomingReq);
      done();
    });
  });

  it('should produce context-bound child logger with traceId and spanId', () => {
    const logger = createLogger({ service: 'test-logger' });
    const childLogger = logger.withContext({
      traceId: 'trace-test-123',
      spanId: 'span-test-456',
      requestId: 'req-test-789',
    });

    expect(childLogger).toBeDefined();
    expect(typeof childLogger.info).toBe('function');
  });
});
