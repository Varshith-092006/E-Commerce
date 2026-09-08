import express from 'express';

import { successResponse } from './response.js';

/**
 * Creates an Express router with standard /health, /ready, and /liveness semantics.
 *
 * Liveness (/liveness):
 *   - Verifies process is alive and event loop responds.
 *   - Does NOT fail merely because downstream/Kafka/DB is temporarily unavailable.
 *
 * Readiness (/ready):
 *   - Verifies whether the service can currently accept customer traffic.
 *   - Checks database connectivity, redis, and shutdown status.
 *   - Returns 503 immediately if service is shutting down.
 *
 * Health (/health):
 *   - Aggregated status preserving backward compatibility.
 *
 * @param {Object} options
 * @param {string} options.serviceName
 * @param {() => boolean} [options.getIsShuttingDown] - Returns true if graceful shutdown in progress
 * @param {() => Promise<{ [key: string]: any }>} [options.checkReadiness] - Custom async readiness check
 * @param {() => Promise<boolean>|boolean} [options.checkLiveness] - Custom liveness check
 * @returns {express.Router}
 */
export function createServiceHealthRouter({
  serviceName = process.env.SERVICE_NAME || 'service',
  getIsShuttingDown = () => false,
  checkReadiness = () => Promise.resolve({ db: 'ok' }),
  checkLiveness = () => true,
} = {}) {
  const router = express.Router();

  // LIVENESS probe: is process running?
  router.get('/liveness', async (req, res) => {
    let alive = true;
    try {
      alive = await checkLiveness();
    } catch {
      alive = false;
    }

    if (!alive) {
      return res.status(500).json({
        status: 'DOWN',
        alive: false,
        service: serviceName,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      status: 'UP',
      alive: true,
      service: serviceName,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  const executeReadiness = async () => {
    let timer = null;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Readiness check timed out')), 6000);
      });
      return await Promise.race([checkReadiness(), timeoutPromise]);
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  };

  const isHealthyCheck = (val) => {
    if (typeof val === 'boolean') {
      return val;
    }
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      return (
        lower === 'ok' ||
        lower === 'connected' ||
        lower === 'healthy' ||
        lower === 'up' ||
        lower === 'ready'
      );
    }
    if (val && typeof val === 'object') {
      return (
        val.status === 'ok' ||
        val.status === 'connected' ||
        val.status === 'up' ||
        val.healthy !== false
      );
    }
    return Boolean(val);
  };

  // READINESS probe: can service accept production traffic?
  router.get('/ready', async (req, res) => {
    if (getIsShuttingDown && getIsShuttingDown()) {
      return res.status(503).json({
        status: 'SHUTTING_DOWN',
        ready: false,
        service: serviceName,
        message: 'Service is terminating and not accepting new traffic',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const checks = await executeReadiness();
      const allHealthy = Object.values(checks).every(isHealthyCheck);

      if (!allHealthy) {
        return res.status(503).json({
          status: 'NOT_READY',
          ready: false,
          service: serviceName,
          checks,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        status: 'READY',
        ready: true,
        service: serviceName,
        checks,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(503).json({
        status: 'NOT_READY',
        ready: false,
        service: serviceName,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Aggregated /health endpoint (backward compatible)
  router.get('/health', async (req, res) => {
    const isShuttingDown = getIsShuttingDown ? getIsShuttingDown() : false;
    let readinessChecks = {};
    let isReady = false;

    if (!isShuttingDown) {
      try {
        readinessChecks = await executeReadiness();
        isReady = Object.values(readinessChecks).every(isHealthyCheck);
      } catch {
        isReady = false;
      }
    }

    const isHealthy = isReady && !isShuttingDown;
    const statusCode = isHealthy ? 200 : 503;

    return res.status(statusCode).json(
      successResponse({
        data: {
          service: serviceName,
          status: isHealthy ? 'healthy' : isShuttingDown ? 'shutting_down' : 'degraded',
          ready: isReady,
          alive: true,
          checks: readinessChecks,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
        requestId: req.id,
      }),
    );
  });

  return router;
}
