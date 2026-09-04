import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { NotificationController } from '../../src/controllers/notification.controller.js';
import { notificationEventWorker } from '../../src/workers/notification-event.worker.js';

describe('Notification Event Ingestion API Integration Tests (Phase 4D)', () => {
  let app;
  let mockNotificationService;
  const trustedGatewaySecret =
    process.env.INTERNAL_GATEWAY_SECRET ||
    'ecommerce_dev_internal_secret_2026_super_secure_gateway_passcode';

  beforeEach(() => {
    mockNotificationService = {
      dispatchNotification: jest.fn().mockResolvedValue({
        dispatches: [{ channel: 'IN_APP', status: 'SENT' }],
      }),
      findPreferencesByUserId: jest.fn().mockResolvedValue(null),
    };

    const notificationController = new NotificationController(
      mockNotificationService,
      trustedGatewaySecret,
    );
    app = createApp({ notificationController });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/notifications/events/ingest', () => {
    it('should reject unauthenticated external event injection with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/events/ingest')
        .send({ eventId: 'evt-1', eventType: 'order.placed' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should accept event from internal service with valid secret and return 200 OK', async () => {
      jest.spyOn(notificationEventWorker, 'processEvent').mockResolvedValue({
        status: 'PROCESSED',
        eventId: 'evt-valid-1',
      });

      const res = await request(app)
        .post('/api/v1/notifications/events/ingest')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .send({
          eventId: 'evt-valid-1',
          eventType: 'order.placed',
          payload: { userId: 'user-1', orderNumber: 'ORD-1' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PROCESSED');
    });

    it('should accept event from authenticated ADMIN and return 200 OK', async () => {
      jest.spyOn(notificationEventWorker, 'processEvent').mockResolvedValue({
        status: 'PROCESSED',
        eventId: 'evt-admin-1',
      });

      const res = await request(app)
        .post('/api/v1/notifications/events/ingest')
        .set('x-user-id', 'admin-user-id')
        .set('x-user-role', 'ADMIN')
        .send({
          eventId: 'evt-admin-1',
          eventType: 'shipment.shipped',
          payload: { userId: 'user-1' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
