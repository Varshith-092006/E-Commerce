import zlib from 'zlib';

/**
 * Native Response Compression Middleware
 *
 * Supports Brotli (br), Gzip (gzip), and Deflate (deflate) without external dependencies.
 * Bypasses SSE streams, HEAD requests, already-compressed content, and payloads below threshold.
 *
 * @param {Object} [options]
 * @param {number} [options.threshold=1024] - Minimum byte length to trigger compression
 * @param {boolean} [options.brotli=true] - Enable Brotli compression
 * @returns {import('express').RequestHandler}
 */
export function createCompressionMiddleware(options = {}) {
  const threshold = options.threshold !== undefined ? Number(options.threshold) : 1024;
  const enableBrotli = options.brotli !== false;

  return function compressionMiddleware(req, res, next) {
    // 1. Bypass HEAD requests
    if (req.method === 'HEAD') {
      return next();
    }

    // 2. Bypass SSE (Server-Sent Events)
    const acceptHeader = req.headers.accept || '';
    if (acceptHeader.includes('text/event-stream')) {
      return next();
    }

    // Always set Vary: Accept-Encoding so caches distinguish representations
    res.setHeader('Vary', 'Accept-Encoding');

    // Determine supported compression algorithm
    const acceptEncoding = req.headers['accept-encoding'] || '';
    let selectedEncoding = null;
    if (enableBrotli && /\bbr\b/i.test(acceptEncoding)) {
      selectedEncoding = 'br';
    } else if (/\bgzip\b/i.test(acceptEncoding)) {
      selectedEncoding = 'gzip';
    } else if (/\bdeflate\b/i.test(acceptEncoding)) {
      selectedEncoding = 'deflate';
    }

    if (!selectedEncoding) {
      return next();
    }

    // Intercept res.send / res.end
    const originalSend = res.send.bind(res);
    const originalEnd = res.end.bind(res);

    let isHandled = false;

    res.send = function (body) {
      if (isHandled) {
        return originalSend(body);
      }

      // Check if response is SSE or already encoded
      const contentType = res.getHeader('Content-Type') || '';
      if (String(contentType).includes('text/event-stream') || res.getHeader('Content-Encoding')) {
        return originalSend(body);
      }

      let buffer;
      if (Buffer.isBuffer(body)) {
        buffer = body;
      } else if (typeof body === 'string') {
        buffer = Buffer.from(body);
      } else if (body !== null && typeof body === 'object') {
        buffer = Buffer.from(JSON.stringify(body));
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
      } else {
        return originalSend(body);
      }

      // Skip compression for small payloads
      if (buffer.length < threshold) {
        return originalSend(buffer);
      }

      isHandled = true;

      const callback = (err, compressed) => {
        if (err || !compressed) {
          return originalSend(buffer);
        }
        res.setHeader('Content-Encoding', selectedEncoding);
        res.removeHeader('Content-Length');
        res.setHeader('Content-Length', String(compressed.length));
        return originalEnd(compressed);
      };

      if (selectedEncoding === 'br') {
        zlib.brotliCompress(buffer, callback);
      } else if (selectedEncoding === 'gzip') {
        zlib.gzip(buffer, callback);
      } else if (selectedEncoding === 'deflate') {
        zlib.deflate(buffer, callback);
      } else {
        return originalSend(buffer);
      }
    };

    next();
  };
}
