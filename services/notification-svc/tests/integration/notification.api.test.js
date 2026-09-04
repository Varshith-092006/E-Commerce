import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { createNotificationRouter } from '../../src/routes/notification.routes.js';
import { NotificationController } from '../../src/controllers/notification.controller.js';
import { NotificationService } from '../../src/services/notification.service.js';

describe('Notification Service API Integration Tests', () => {
  let app;
  let mockNotificationRepo;
  let mockEmailProvider;
  let mockSmsProvider;
  let mockInAppProvider;
  let notificationService;
  let notificationController;

  const internalSecret = 'test_internal_secret_123';
  const userId = 'u1a2b3c4-0000-0000-0000-000000000001';

  beforeEach(() => {
    mockNotificationRepo = {
      findByUserChannelIdempotencyKey: jest.fn(),
      createNotification: jest.fn(),
      updateNotificationStatus: jest.fn(),
      findById: jest.fn(),
      findUserNotifications: jest.fn(),
      countUnreadUserNotifications: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      findPreferencesByUserId: jest.fn(),
      upsertPreferences: jest.fn(),
      findTemplateByCodeAndChannel: jest.fn(),
    };

    mockEmailProvider = {
      send: jest.fn().mockResolvedValue({
        success: true,
        providerMessageId: 'mock_email_123',
        errorReason: null,
      }),
    };

    mockSmsProvider = {
      send: jest.fn().mockResolvedValue({
        success: true,
        providerMessageId: 'mock_sms_123',
        errorReason: null,
      }),
    };

    mockInAppProvider = {
      send: jest.fn().mockResolvedValue({
        success: true,
        providerMessageId: null,
        errorReason: null,
      }),
    };

    notificationService = new NotificationService({
      notificationRepo: mockNotificationRepo,
      emailProvider: mockEmailProvider,
      smsProvider: mockSmsProvider,
      inAppProvider: mockInAppProvider,
    });

    notificationController = new NotificationController(
      notificationService,
      internalSecret,
    );

    app = express();
    app.use(express.json());
    app.use(
      '/api/v1/notifications',
      createNotificationRouter({ controller: notificationController }),
    );

    // Global Error Handler
    app.use((err, req, res, _next) => {
      const status =
        err.statusCode ||
        (err.name === 'ForbiddenError'
          ? 403
          : err.name === 'ValidationError' || err.name === 'BusinessRuleError'
          ? 422
          : err.name === 'NotFoundError'
          ? 404
          : err.name === 'UnauthorizedError'
          ? 401
          : 500);
      res.status(status).json({
        success: false,
        error: { message: err.message, code: err.code || 'ERROR' },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/notifications/send (Internal Dispatch)', () => {
    it('should dispatch notification when valid internal secret is provided', async () => {
      mockNotificationRepo.findPreferencesByUserId.mockResolvedValue(null);
      mockNotificationRepo.createNotification.mockResolvedValue({
        id: 'notif-1',
      });

      const res = await request(app)
        .post('/api/v1/notifications/send')
        .set('x-internal-gateway-secret', internalSecret)
        .send({
          userId,
          templateCode: 'order.placed',
          channels: ['IN_APP', 'EMAIL'],
          recipient: { email: 'customer@example.com' },
          templateData: {
            user: { name: 'John Doe' },
            order: { orderNumber: 'ORD-100', totalAmount: '200.00' },
          },
          idempotencyKey: 'evt_test_1',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dispatches).toHaveLength(2);
      expect(res.body.data.idempotent).toBe(false);
    });

    it('should reject dispatch if internal secret is missing with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/send')
        .send({
          userId,
          templateCode: 'order.placed',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject dispatch if internal secret is incorrect with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/send')
        .set('x-internal-gateway-secret', 'wrong-secret')
        .send({
          userId,
          templateCode: 'order.placed',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/v1/notifications (User Inbox)', () => {
    it('should return paginated user notifications with unread count', async () => {
      mockNotificationRepo.findUserNotifications.mockResolvedValue({
        items: [
          {
            id: 'notif-1',
            channel: 'IN_APP',
            category: 'ORDERS',
            subject: 'Order Shipped',
            content: 'Your order has shipped',
            metadata: {},
            status: 'SENT',
            is_read: false,
            read_at: null,
            created_at: new Date().toISOString(),
          },
        ],
        total: 1,
      });
      mockNotificationRepo.countUnreadUserNotifications.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/notifications?page=1&limit=10')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.unreadCount).toBe(1);
      expect(res.body.meta.pagination.total).toBe(1);
    });

    it('should reject unauthenticated request with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/notifications');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/notifications/:id/read', () => {
    it('should mark own notification as read', async () => {
      mockNotificationRepo.findById.mockResolvedValue({
        id: 'notif-1',
        user_id: userId,
      });

      const res = await request(app)
        .patch('/api/v1/notifications/notif-1/read')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body.data.isRead).toBe(true);
      expect(mockNotificationRepo.markAsRead).toHaveBeenCalledWith('notif-1', userId);
    });

    it('should reject marking another user notification as read with 403 Forbidden', async () => {
      mockNotificationRepo.findById.mockResolvedValue({
        id: 'notif-other',
        user_id: 'foreign-user-id',
      });

      const res = await request(app)
        .patch('/api/v1/notifications/notif-other/read')
        .set('x-user-id', userId);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/notifications/read-all', () => {
    it('should mark all unread notifications as read for authenticated user', async () => {
      mockNotificationRepo.markAllAsRead.mockResolvedValue({ updatedCount: 3 });

      const res = await request(app)
        .post('/api/v1/notifications/read-all')
        .set('x-user-id', userId)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.data.updatedCount).toBe(3);
    });
  });

  describe('GET & PUT /api/v1/notifications/preferences', () => {
    it('should return preferences for authenticated user', async () => {
      mockNotificationRepo.findPreferencesByUserId.mockResolvedValue({
        email_enabled: true,
        sms_enabled: false,
        in_app_enabled: true,
      });

      const res = await request(app)
        .get('/api/v1/notifications/preferences')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body.data.emailEnabled).toBe(true);
      expect(res.body.data.smsEnabled).toBe(false);
    });

    it('should update preferences for authenticated user', async () => {
      mockNotificationRepo.upsertPreferences.mockResolvedValue({
        email_enabled: false,
        sms_enabled: false,
        in_app_enabled: true,
      });

      const res = await request(app)
        .put('/api/v1/notifications/preferences')
        .set('x-user-id', userId)
        .send({ emailEnabled: false, smsEnabled: false });

      expect(res.status).toBe(200);
      expect(res.body.data.emailEnabled).toBe(false);
      expect(res.body.data.smsEnabled).toBe(false);
    });
  });
});
