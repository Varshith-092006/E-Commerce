import { v4 as uuidv4 } from 'uuid';

export const REQUEST_ID_HEADER = 'x-request-id';
export const TRACE_ID_HEADER = 'x-trace-id';
export const SPAN_ID_HEADER = 'x-span-id';

/**
 * Express middleware to ensure every request has correlation IDs (requestId, traceId, spanId)
 */
export function requestIdMiddleware(req, res, next) {
  const existingReqId =
    req.headers[REQUEST_ID_HEADER] || req.headers[REQUEST_ID_HEADER.toLowerCase()];
  const requestId =
    existingReqId && typeof existingReqId === 'string' && existingReqId.trim().length > 0
      ? existingReqId.trim()
      : uuidv4();

  const existingTraceId =
    req.headers[TRACE_ID_HEADER] || req.headers[TRACE_ID_HEADER.toLowerCase()];
  const traceId =
    existingTraceId && typeof existingTraceId === 'string' && existingTraceId.trim().length > 0
      ? existingTraceId.trim()
      : uuidv4();

  // Create a fresh span ID for this service execution
  const spanId = uuidv4().substring(0, 16);

  req.id = requestId;
  req.requestId = requestId;
  req.traceId = traceId;
  req.spanId = spanId;

  res.setHeader('X-Request-Id', requestId);
  res.setHeader('X-Trace-Id', traceId);
  res.setHeader('X-Span-Id', spanId);

  next();
}
