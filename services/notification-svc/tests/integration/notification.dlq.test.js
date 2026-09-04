import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import {
  generateAccessToken,
  errorHandlerMiddleware,
  NotFoundError,
  ValidationError,
  BusinessRuleError,
} from '@ecommerce/shared';
import { NotificationService } from '../../src/services/notification.service.js';
import { NotificationController } from '../../src/controllers/notification.controller.js';
import { createNotificationRouter } from '../../src/routes/notification.routes.js';
import express from 'express';

describe('Notification Service DLQ & Granular Preferences Integration Tests', () => {
  let app;
  let mockNotificationRepo;
  let mockEmailProvider;
  let mockSmsProvider;
  let notificationService;
  let notificationController;

  const internalSecret = 'ecommerce_dev_internal_secret_2026_super_secure_gateway_passcode';
  const adminToken = generateAccessToken({
    userId: 'admin-uuid-1',
    role: 'ADMIN',
    email: 'admin@ecommerce.local',
  });
  const customerToken = generateAccessToken({
    userId: 'cust-uuid-1',
    role: 'CUSTOMER',
    email: 'cust@ecommerce.local',
  });

  beforeEach(() => {
    mockNotificationRepo = {
      findDeadLetters: jest.fn().mockResolvedValue({
        items: [
          {
            id: 'dlq-notif-1',
            user_id: 'cust-uuid-1',
            channel: 'SMS',
            category: 'ORDERS',
            status: 'FAILED',
            error_reason: 'SMS Gateway 500 error',
            created_at: new Date().toISOString(),
          },
        ],
        total: 1,
      }),
      resetDeadLetter: jest.fn().mockResolvedValue({ id: 'dlq-notif-1', status: 'PENDING' }),
      findById: jest.fn().mockResolvedValue({
        id: 'dlq-notif-1',
        user_id: 'cust-uuid-1',
        channel: 'SMS',
        category: 'ORDERS',
        recipient: '+919876543210',
        content: 'Order placed',
        metadata: {},
      }),
      updateNotificationStatus: jest.fn().mockResolvedValue({
        id: 'dlq-notif-1',
        status: 'SENT',
        attempt_count: 2,
        error_reason: null,
      }),
      findPreferencesByUserId: jest.fn().mockResolvedValue({
        user_id: 'cust-uuid-1',
        email_enabled: true,
        sms_enabled: true,
        in_app_enabled: true,
        orders_email: true,
        orders_sms: false, // SMS disabled for orders
        marketing_email: false, // Email disabled for marketing
        marketing_sms: false,
      }),
      upsertPreferences: jest.fn().mockResolvedValue({
        user_id: 'cust-uuid-1',
        email_enabled: true,
        sms_enabled: true,
        in_app_enabled: true,
        orders_email: true,
        orders_sms: false,
        payments_email: true,
        payments_sms: true,
        marketing_email: false,
        marketing_sms: false,
      }),
      findByUserChannelIdempotencyKey: jest.fn().mockResolvedValue(null),
      findTemplateByCodeAndChannel: jest.fn().mockResolvedValue(null),
      createNotification: jest.fn().mockImplementation((data) => ({
        id: 'notif-created-1',
        ...data,
      })),
      findUserNotifications: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      countUnreadUserNotifications: jest.fn().mockResolvedValue(0),
      markAsRead: jest.fn().mockResolvedValue({ id: 'notif-1' }),
      markAllAsRead: jest.fn().mockResolvedValue({ updatedCount: 0 }),
    };

    mockEmailProvider = {
      send: jest.fn().mockResolvedValue({ success: true, providerMessageId: 'email_ok' }),
    };
    mockSmsProvider = {
      send: jest.fn().mockResolvedValue({ success: true, providerMessageId: 'sms_ok' }),
    };

    notificationService = new NotificationService({
      notificationRepo: mockNotificationRepo,
      emailProvider: mockEmailProvider,
      smsProvider: mockSmsProvider,
    });

    notificationController = new NotificationController(
      notificationService,
      internalSecret,
    );

    const router = createNotificationRouter({ controller: notificationController });
    app = express();
    app.use(express.json());
    app.use('/api/v1/notifications', router);
    app.use(errorHandlerMiddleware);
  });

  describe('GET /api/v1/notifications/admin/dlq (DLQ Inspection)', () => {
    it('should reject non-admin customer request with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/notifications/admin/dlq')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('should allow admin request and return dead-letter items with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/notifications/admin/dlq')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].id).toBe('dlq-notif-1');
      expect(res.body.meta.pagination.total).toBe(1);
    });

    it('should allow internal service request using x-internal-gateway-secret', async () => {
      const res = await request(app)
        .get('/api/v1/notifications/admin/dlq')
        .set('x-internal-gateway-secret', internalSecret)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/v1/notifications/admin/dlq/:id/retry (DLQ Replay)', () => {
    it('should replay dead-letter notification and re-dispatch to provider', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/admin/dlq/dlq-notif-1/retry')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockNotificationRepo.resetDeadLetter).toHaveBeenCalledWith('dlq-notif-1');
      expect(mockSmsProvider.send).toHaveBeenCalled();
      expect(res.body.data.status).toBe('SENT');
    });
  });

  describe('GET & POST /api/v1/notifications/admin/kafka/dlq (Kafka DLQ Replay Engine)', () => {
    let mockKafkaDlqService;

    beforeEach(() => {
      mockKafkaDlqService = {
        listDlqRecords: jest.fn().mockResolvedValue({
          records: [
            {
              id: 'kafka-dlq-1',
              event_id: 'evt-failed-1',
              original_topic: 'ecommerce.order-events',
              original_offset: '42',
              status: 'DEAD_LETTERED',
            },
          ],
          meta: { total: 1, page: 1, limit: 20 },
        }),
        replayDlqRecord: jest.fn().mockImplementation(({ dlqId, targetTopic }) => {
          if (dlqId === 'invalid-id') {
            throw new NotFoundError("Kafka DLQ record with ID 'invalid-id' not found");
          }
          if (targetTopic === 'forbidden-topic') {
            throw new ValidationError("Invalid target topic 'forbidden-topic'");
          }
          if (dlqId === 'already-replayed') {
            throw new BusinessRuleError("Kafka DLQ record 'already-replayed' has already been replayed");
          }
          return Promise.resolve({
            success: true,
            dlqId,
            replayedToTopic: targetTopic || 'ecommerce.order-events',
            eventId: 'evt-failed-1',
          });
        }),
      };

      notificationController.kafkaDlqService = mockKafkaDlqService;
    });

    it('should list dead-lettered Kafka records for admin', async () => {
      const res = await request(app)
        .get('/api/v1/notifications/admin/kafka/dlq')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].id).toBe('kafka-dlq-1');
      expect(mockKafkaDlqService.listDlqRecords).toHaveBeenCalled();
    });

    it('should replay a dead-lettered Kafka message to domain topic', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/admin/kafka/dlq/kafka-dlq-1/replay')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ targetTopic: 'ecommerce.order-events' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.replayedToTopic).toBe('ecommerce.order-events');
      expect(mockKafkaDlqService.replayDlqRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          dlqId: 'kafka-dlq-1',
          targetTopic: 'ecommerce.order-events',
        }),
      );
    });

    it('should reject replay to invalid/unauthorized target topic', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/admin/kafka/dlq/kafka-dlq-1/replay')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ targetTopic: 'forbidden-topic' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should prevent duplicate replay of an already replayed Kafka event', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/admin/kafka/dlq/already-replayed/replay')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ targetTopic: 'ecommerce.order-events' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Granular Category Preferences & Mandatory Bypass', () => {
    it('should suppress orders SMS when orders_sms is false', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/send')
        .set('x-internal-gateway-secret', internalSecret)
        .send({
          userId: 'cust-uuid-1',
          templateCode: 'order.placed',
          channels: ['EMAIL', 'SMS'],
          category: 'ORDERS',
          recipient: { email: 'cust@example.com', phone: '+919876543210' },
          templateData: { order: { orderNumber: 'ORD-123' }, user: { name: 'Customer' } },
        })
        .expect(200);

      // Email should be dispatched, SMS suppressed
      expect(res.body.data.dispatches).toHaveLength(1);
      expect(res.body.data.dispatches[0].channel).toBe('EMAIL');
    });

    it('should bypass user preference suppression for mandatory ACCOUNT notifications', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/send')
        .set('x-internal-gateway-secret', internalSecret)
        .send({
          userId: 'cust-uuid-1',
          templateCode: 'auth.welcome',
          channels: ['EMAIL', 'SMS'],
          category: 'ACCOUNT', // Mandatory bypass
          recipient: { email: 'cust@example.com', phone: '+919876543210' },
          templateData: { user: { firstName: 'Alice' } },
        })
        .expect(200);

      // Both Email and SMS should be dispatched despite SMS preference being disabled
      expect(res.body.data.dispatches).toHaveLength(2);
    });
  });
});
