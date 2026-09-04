import { Router } from 'express';
import {
  UnauthorizedError,
  ForbiddenError,
  verifyAccessToken,
  SecurityHeaders,
} from '@ecommerce/shared';

import { notificationController as defaultNotificationController } from '../controllers/notification.controller.js';

export function createNotificationRouter({ controller = defaultNotificationController } = {}) {
  const router = Router();

  const internalSecret =
    process.env.INTERNAL_GATEWAY_SECRET ||
    'ecommerce_dev_internal_secret_2026_super_secure_gateway_passcode';

  // Unified user auth middleware
  const requireAuth = (req, res, next) => {
    if (req.user?.id) {
      return next();
    }
    if (req.headers['x-user-id']) {
      req.user = { id: req.headers['x-user-id'], role: req.headers['x-user-role'] || 'CUSTOMER' };
      return next();
    }

    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = {
          id: decoded.sub || decoded.id || decoded.userId,
          role: decoded.role,
          email: decoded.email,
        };
        return next();
      } catch (err) {
        return next(err);
      }
    }

    return next(new UnauthorizedError('Authentication required'));
  };

  // Admin or Internal Service Auth Middleware
  const requireAdminOrInternal = (req, res, next) => {
    const incomingSecret =
      req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET] ||
      req.headers['x-internal-gateway-secret'];

    if (incomingSecret === internalSecret) {
      return next();
    }

    // Otherwise check for Admin JWT or Admin header
    const role = req.user?.role || req.headers['x-user-role'];
    if (role === 'ADMIN') {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = verifyAccessToken(token);
        if (decoded.role === 'ADMIN') {
          req.user = {
            id: decoded.sub || decoded.id,
            role: decoded.role,
          };
          return next();
        }
      } catch {
        // Fall through to ForbiddenError
      }
    }

    return next(new ForbiddenError('Admin privileges required'));
  };

  // Internal dispatch endpoint (protected by x-internal-gateway-secret in controller)
  router.post('/send', controller.sendNotification);

  // Phase 4D: Event ingestion endpoint
  router.post('/events/ingest', requireAdminOrInternal, controller.ingestEvent);

  // Admin notification DLQ inspection and manual replay endpoints
  router.get('/admin/dlq', requireAdminOrInternal, controller.getDlq);
  router.post('/admin/dlq/:id/retry', requireAdminOrInternal, controller.replayDlq);

  // Kafka DLQ inspection and replay endpoints
  router.get('/admin/kafka/dlq', requireAdminOrInternal, controller.getKafkaDlq);
  router.post('/admin/kafka/dlq/:id/replay', requireAdminOrInternal, controller.replayKafkaDlq);

  // Live SSE streaming endpoint (authenticated via JWT bearer, query token, or gateway headers)
  router.get('/stream', requireAuth, controller.streamNotifications);

  // User preference endpoints (must be defined before /:id parameter)
  router.get('/preferences', requireAuth, controller.getPreferences);
  router.put('/preferences', requireAuth, controller.updatePreferences);

  // Bulk mark all as read (must be defined before /:id parameter)
  router.post('/read-all', requireAuth, controller.markAllAsRead);

  // User notification list query
  router.get('/', requireAuth, controller.getNotifications);

  // Mark individual notification as read
  router.patch('/:id/read', requireAuth, controller.markAsRead);

  return router;
}

export const notificationRouter = createNotificationRouter();
