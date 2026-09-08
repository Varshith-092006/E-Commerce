import {
  successResponse,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  SecurityHeaders,
} from '@ecommerce/shared';

import { notificationService as defaultNotificationService } from '../services/notification.service.js';
import { sseConnectionManager as defaultSseManager } from '../services/sse-connection-manager.js';
import { kafkaDlqService as defaultKafkaDlqService } from '../services/kafka-dlq.service.js';

export class NotificationController {
  constructor(
    notificationService = defaultNotificationService,
    internalSecret = process.env.INTERNAL_GATEWAY_SECRET ||
      'ecommerce_dev_internal_secret_2026_super_secure_gateway_passcode',
    sseManager = defaultSseManager,
    kafkaDlqService = defaultKafkaDlqService,
  ) {
    this.notificationService = notificationService;
    this.internalSecret = internalSecret;
    this.sseManager = sseManager;
    this.kafkaDlqService = kafkaDlqService;
  }

  getUserId(req) {
    const userId = req.user?.id || req.headers[SecurityHeaders.USER_ID] || req.headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }
    return userId;
  }

  /**
   * Admin Kafka DLQ Query: List failed Kafka messages
   */
  getKafkaDlq = async (req, res, next) => {
    try {
      const { page, limit, topic, status } = req.query;

      const result = await this.kafkaDlqService.listDlqRecords({
        page,
        limit,
        topic,
        status,
      });

      return res.status(200).json(
        successResponse({
          data: result.records,
          requestId: req.id,
          extraMeta: {
            pagination: result.meta,
          },
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Admin Kafka DLQ Replay: Replay dead-lettered event back to domain topic
   */
  replayKafkaDlq = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { targetTopic } = req.body || {};
      const replayedBy = req.user?.id || req.user?.email || 'admin';

      const result = await this.kafkaDlqService.replayDlqRecord({
        dlqId: id,
        targetTopic,
        replayedBy,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * SSE Live In-App Notification Stream
   */
  streamNotifications = (req, res, next) => {
    try {
      const userId = this.getUserId(req);

      // Set standard SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
      }

      this.sseManager.register(userId, res);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Internal notification dispatch API (Protected by x-internal-gateway-secret)
   */
  sendNotification = async (req, res, next) => {
    try {
      const incomingSecret =
        req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET] ||
        req.headers['x-internal-gateway-secret'];

      if (!incomingSecret || incomingSecret !== this.internalSecret) {
        throw new ForbiddenError('Access denied: Invalid internal service secret');
      }

      const {
        userId,
        templateCode,
        channels,
        category,
        recipient,
        templateData,
        idempotencyKey,
        eventId,
        sourceService,
      } = req.body;

      if (!userId) {
        throw new ValidationError('userId is required');
      }
      if (!templateCode) {
        throw new ValidationError('templateCode is required');
      }

      const result = await this.notificationService.dispatchNotification({
        userId,
        templateCode,
        channels: channels || ['IN_APP'],
        category: category || 'ORDERS',
        recipient: recipient || {},
        templateData: templateData || {},
        idempotencyKey,
        eventId,
        sourceService,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * User in-app notifications query
   */
  getNotifications = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { page, limit, isRead, channel, cursor } = req.query;

      const result = await this.notificationService.getUserNotifications({
        userId,
        channel: channel || 'IN_APP',
        isRead,
        page,
        limit,
        cursor,
      });

      return res.status(200).json(
        successResponse({
          data: result.items,
          requestId: req.id,
          extraMeta: {
            unreadCount: result.unreadCount,
            pagination: result.pagination,
          },
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Mark single notification read
   */
  markAsRead = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { id } = req.params;

      const result = await this.notificationService.markNotificationAsRead({
        notificationId: id,
        userId,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Mark all unread in-app notifications as read
   */
  markAllAsRead = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { channel } = req.body;

      const result = await this.notificationService.markAllNotificationsAsRead({
        userId,
        channel: channel || 'IN_APP',
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get user preferences
   */
  getPreferences = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);

      const result = await this.notificationService.getUserPreferences({ userId });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update user preferences (supporting granular category channel flags)
   */
  updatePreferences = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const {
        emailEnabled,
        smsEnabled,
        inAppEnabled,
        ordersEmail,
        ordersSms,
        paymentsEmail,
        paymentsSms,
        marketingEmail,
        marketingSms,
      } = req.body;

      const result = await this.notificationService.updateUserPreferences({
        userId,
        preferences: {
          emailEnabled,
          smsEnabled,
          inAppEnabled,
          ordersEmail,
          ordersSms,
          paymentsEmail,
          paymentsSms,
          marketingEmail,
          marketingSms,
        },
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Admin DLQ Query: List failed notifications
   */
  getDlq = async (req, res, next) => {
    try {
      const { page, limit, channel, category } = req.query;

      const result = await this.notificationService.getDeadLetterQueue({
        page,
        limit,
        channel,
        category,
      });

      return res.status(200).json(
        successResponse({
          data: result.items,
          requestId: req.id,
          extraMeta: {
            pagination: result.pagination,
          },
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Admin DLQ Replay: Retry failed notification
   */
  replayDlq = async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await this.notificationService.replayDeadLetter({
        notificationId: id,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Phase 4D Event Ingestion API (Protected by internal gateway secret or Admin)
   */
  ingestEvent = async (req, res, next) => {
    try {
      const incomingSecret =
        req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET] ||
        req.headers['x-internal-gateway-secret'];

      const isAdmin = req.user?.role === 'ADMIN' || req.headers['x-user-role'] === 'ADMIN';

      if (!isAdmin && incomingSecret !== this.internalSecret) {
        throw new ForbiddenError('Internal service credentials or Admin privileges required');
      }

      const { notificationEventWorker } = await import('../workers/notification-event.worker.js');
      const result = await notificationEventWorker.processEvent(req.body);

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const notificationController = new NotificationController();
