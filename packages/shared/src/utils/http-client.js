import http from 'http';
import https from 'https';

/**
 * Shared HTTP Connection Pooling and Agent Management.
 * Reuses TCP sockets, limits maximum sockets, and enforces keep-alive to prevent
 * socket exhaustion and port starvation across microservice and external HTTP calls.
 */

export const defaultHttpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 10000,
  maxSockets: parseInt(process.env.HTTP_MAX_SOCKETS, 10) || 100,
  maxFreeSockets: parseInt(process.env.HTTP_MAX_FREE_SOCKETS, 10) || 20,
  timeout: parseInt(process.env.HTTP_SOCKET_TIMEOUT_MS, 10) || 15000,
});

export const defaultHttpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 10000,
  maxSockets: parseInt(process.env.HTTP_MAX_SOCKETS, 10) || 100,
  maxFreeSockets: parseInt(process.env.HTTP_MAX_FREE_SOCKETS, 10) || 20,
  timeout: parseInt(process.env.HTTP_SOCKET_TIMEOUT_MS, 10) || 15000,
});

/**
 * Resilient fetch wrapper with timeout and socket reuse.
 *
 * @param {string|URL} url - Target URL
 * @param {RequestInit} [options={}] - Fetch options
 * @param {number} [timeoutMs=10000] - Request timeout in milliseconds
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(
  url,
  options = {},
  timeoutMs = parseInt(process.env.HTTP_REQUEST_TIMEOUT_MS, 10) || 10000,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const parsedUrl = typeof url === 'string' ? new URL(url) : url;
  const isHttps = parsedUrl.protocol === 'https:';

  const agent = isHttps ? defaultHttpsAgent : defaultHttpAgent;

  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal
        ? AbortSignal.any([options.signal, controller.signal])
        : controller.signal,
      agent, // Compatible with Node custom fetch/undici
    });
    return response;
  } catch (err) {
    if (err.name === 'AbortError' || controller.signal.aborted) {
      const timeoutErr = new Error(
        `HTTP request to '${parsedUrl.origin}${parsedUrl.pathname}' timed out after ${timeoutMs}ms`,
      );
      timeoutErr.name = 'TimeoutError';
      timeoutErr.code = 'ETIMEDOUT';
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
