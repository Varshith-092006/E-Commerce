import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { NotificationService } from '../../src/services/notification.service.js';
import { ValidationError, ForbiddenError, NotFoundError } from '@ecommerce/shared';

describe('NotificationService Unit Tests', () => {
  let notificationService;
  let mockNotificationRepo;
  let mockEmailProvider;
  let mockSmsProvider;
  let mockInAppProvider;

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
  });

  describe('Multi-Channel Dispatch', () => {
    it('should dispatch to EMAIL and IN_APP when both are enabled', async () => {
      mockNotificationRepo.findPreferencesByUserId.mockResolvedValue({
        email_enabled: true,
        sms_enabled: false,
        in_app_enabled: true,
      });

      mockNotificationRepo.createNotification
        .mockResolvedValueOnce({ id: 'notif-email' })
        .mockResolvedValueOnce({ id: 'notif-inapp' });

      const res = await notificationService.dispatchNotification({
        userId,
        templateCode: 'order.placed',
        channels: ['EMAIL', 'SMS', 'IN_APP'],
        category: 'ORDERS',
        recipient: {
          email: 'customer@example.com',
          phone: '+919876543210',
        },
        templateData: {
          user: { name: 'John' },
          order: { orderNumber: 'ORD-123', totalAmount: '100.00' },
        },
        idempotencyKey: 'evt_123',
      });

      expect(res.dispatches).toHaveLength(2); // SMS was suppressed by preference
      expect(res.dispatches.map((d) => d.channel)).toEqual(['EMAIL', 'IN_APP']);
      expect(mockEmailProvider.send).toHaveBeenCalledTimes(1);
      expect(mockSmsProvider.send).not.toHaveBeenCalled();
    });

    it('should bypass preference suppression if category is ACCOUNT (mandatory)', async () => {
      mockNotificationRepo.findPreferencesByUserId.mockResolvedValue({
        email_enabled: false,
        sms_enabled: false,
        in_app_enabled: false,
      });

      mockNotificationRepo.createNotification.mockResolvedValue({ id: 'notif-account' });

      const res = await notificationService.dispatchNotification({
        userId,
        templateCode: 'auth.welcome',
        channels: ['EMAIL'],
        category: 'ACCOUNT',
        recipient: { email: 'customer@example.com' },
        templateData: { user: { firstName: 'Alice' } },
      });

      expect(res.dispatches).toHaveLength(1);
      expect(res.dispatches[0].status).toBe('SENT');
      expect(mockEmailProvider.send).toHaveBeenCalledTimes(1);
    });

    it('should return idempotent status without resending if already exists in DB', async () => {
      mockNotificationRepo.findPreferencesByUserId.mockResolvedValue(null);
      mockNotificationRepo.findByUserChannelIdempotencyKey.mockResolvedValue({
        id: 'existing-notif-id',
        status: 'SENT',
        provider_message_id: 'prev_msg_id',
        error_reason: null,
      });

      const res = await notificationService.dispatchNotification({
        userId,
        templateCode: 'order.placed',
        channels: ['EMAIL'],
        recipient: { email: 'customer@example.com' },
        templateData: { user: { name: 'John' } },
        idempotencyKey: 'evt_dup_key',
      });

      expect(res.idempotent).toBe(true);
      expect(res.dispatches[0].idempotent).toBe(true);
      expect(res.dispatches[0].notificationId).toBe('existing-notif-id');
      expect(mockEmailProvider.send).not.toHaveBeenCalled();
    });

    it('should isolate provider failures so that an EMAIL error does not block IN_APP delivery', async () => {
      mockNotificationRepo.findPreferencesByUserId.mockResolvedValue(null);
      mockEmailProvider.send.mockRejectedValue(new Error('SMTP connection timed out'));
      mockNotificationRepo.createNotification
        .mockResolvedValueOnce({ id: 'notif-email' })
        .mockResolvedValueOnce({ id: 'notif-inapp' });

      const res = await notificationService.dispatchNotification({
        userId,
        templateCode: 'order.placed',
        channels: ['EMAIL', 'IN_APP'],
        recipient: { email: 'customer@example.com' },
        templateData: { user: { name: 'John' }, order: { orderNumber: 'ORD-1', totalAmount: '10' } },
      });

      expect(res.dispatches).toHaveLength(2);
      expect(res.dispatches[0].channel).toBe('EMAIL');
      expect(res.dispatches[0].status).toBe('FAILED');
      expect(res.dispatches[0].errorReason).toContain('SMTP connection timed out');

      expect(res.dispatches[1].channel).toBe('IN_APP');
      expect(res.dispatches[1].status).toBe('SENT');
    });
  });

  describe('User Inbox & Read Controls', () => {
    it('should return paginated notifications and unread count', async () => {
      mockNotificationRepo.findUserNotifications.mockResolvedValue({
        items: [
          {
            id: 'notif-1',
            channel: 'IN_APP',
            category: 'ORDERS',
            subject: 'Order Shipped',
            content: 'Shipped via BlueDart',
            metadata: {},
            status: 'SENT',
            is_read: false,
            read_at: null,
            created_at: new Date(),
          },
        ],
        total: 1,
      });
      mockNotificationRepo.countUnreadUserNotifications.mockResolvedValue(1);

      const res = await notificationService.getUserNotifications({
        userId,
        page: 1,
        limit: 20,
      });

      expect(res.items).toHaveLength(1);
      expect(res.unreadCount).toBe(1);
      expect(res.pagination.total).toBe(1);
    });

    it('should reject markAsRead if notification does not belong to user with ForbiddenError', async () => {
      mockNotificationRepo.findById.mockResolvedValue({
        id: 'notif-other',
        user_id: 'foreign-user-id',
      });

      await expect(
        notificationService.markNotificationAsRead({
          notificationId: 'notif-other',
          userId,
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw NotFoundError if notification does not exist on markAsRead', async () => {
      mockNotificationRepo.findById.mockResolvedValue(null);

      await expect(
        notificationService.markNotificationAsRead({
          notificationId: 'notif-missing',
          userId,
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should mark all unread notifications as read', async () => {
      mockNotificationRepo.markAllAsRead.mockResolvedValue({ updatedCount: 5 });

      const res = await notificationService.markAllNotificationsAsRead({ userId });

      expect(res.success).toBe(true);
      expect(res.updatedCount).toBe(5);
      expect(mockNotificationRepo.markAllAsRead).toHaveBeenCalledWith(userId, 'IN_APP');
    });
  });

  describe('Preferences', () => {
    it('should return default preferences when no DB record exists', async () => {
      mockNotificationRepo.findPreferencesByUserId.mockResolvedValue(null);

      const res = await notificationService.getUserPreferences({ userId });

      expect(res).toEqual({
        emailEnabled: true,
        smsEnabled: true,
        inAppEnabled: true,
        ordersEmail: true,
        ordersSms: true,
        paymentsEmail: true,
        paymentsSms: true,
        marketingEmail: true,
        marketingSms: false,
      });
    });

    it('should update preferences properly', async () => {
      mockNotificationRepo.upsertPreferences.mockResolvedValue({
        email_enabled: false,
        sms_enabled: true,
        in_app_enabled: true,
        orders_email: true,
        orders_sms: false,
        payments_email: true,
        payments_sms: true,
        marketing_email: false,
        marketing_sms: false,
      });

      const res = await notificationService.updateUserPreferences({
        userId,
        preferences: { emailEnabled: false },
      });

      expect(res.emailEnabled).toBe(false);
      expect(mockNotificationRepo.upsertPreferences).toHaveBeenCalledWith(userId, {
        emailEnabled: false,
      });
    });
  });
});
