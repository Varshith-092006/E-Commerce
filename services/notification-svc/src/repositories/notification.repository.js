import { prisma as defaultPrisma } from '../lib/prisma.js';

export class NotificationRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Find existing notification by unique constraint (userId, channel, idempotencyKey)
   */
  async findByUserChannelIdempotencyKey(userId, channel, idempotencyKey) {
    if (!idempotencyKey) {
      return null;
    }
    return await this.prisma.notification.findUnique({
      where: {
        user_id_channel_idempotency_key: {
          user_id: userId,
          channel,
          idempotency_key: idempotencyKey,
        },
      },
    });
  }

  /**
   * Create a new notification entry in notification_db
   */
  async createNotification({
    userId,
    idempotencyKey = null,
    eventId = null,
    sourceService = null,
    templateCode,
    templateVersion = 1,
    channel,
    category = 'ORDERS',
    recipient,
    subject = null,
    content,
    metadata = null,
    status = 'PENDING',
    errorReason = null,
    providerMessageId = null,
    sentAt = null,
  }) {
    return await this.prisma.notification.create({
      data: {
        user_id: userId,
        idempotency_key: idempotencyKey,
        event_id: eventId,
        source_service: sourceService,
        template_code: templateCode,
        template_version: templateVersion,
        channel,
        category,
        recipient,
        subject,
        content,
        metadata,
        status,
        error_reason: errorReason,
        provider_message_id: providerMessageId,
        sent_at: sentAt,
      },
    });
  }

  /**
   * Update delivery status and provider reference
   */
  async updateNotificationStatus(
    id,
    { status, errorReason = null, providerMessageId = null, sentAt = null },
  ) {
    return await this.prisma.notification.update({
      where: { id },
      data: {
        status,
        error_reason: errorReason,
        provider_message_id: providerMessageId,
        sent_at: sentAt,
        last_attempted_at: new Date(),
      },
    });
  }

  /**
   * Find notification by primary ID
   */
  async findById(id) {
    return await this.prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * Find paginated notifications for a specific user
   */
  async findUserNotifications({ userId, channel = 'IN_APP', isRead = null, page = 1, limit = 20 }) {
    const where = {
      user_id: userId,
      channel,
    };

    if (isRead !== null && isRead !== undefined) {
      where.is_read = isRead;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Count unread in-app notifications for user
   */
  async countUnreadUserNotifications(userId, channel = 'IN_APP') {
    return await this.prisma.notification.count({
      where: {
        user_id: userId,
        channel,
        is_read: false,
      },
    });
  }

  /**
   * Mark a specific notification as read for a given user
   */
  async markAsRead(id, userId) {
    return await this.prisma.notification.updateMany({
      where: {
        id,
        user_id: userId,
      },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
  }

  /**
   * Mark all unread in-app notifications as read for a given user
   */
  async markAllAsRead(userId, channel = 'IN_APP') {
    const result = await this.prisma.notification.updateMany({
      where: {
        user_id: userId,
        channel,
        is_read: false,
      },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });

    return { updatedCount: result.count };
  }

  /**
   * Find user notification preferences
   */
  async findPreferencesByUserId(userId) {
    return await this.prisma.notificationPreference.findUnique({
      where: { user_id: userId },
    });
  }

  /**
   * Upsert user notification preferences
   */
  async upsertPreferences(userId, data) {
    return await this.prisma.notificationPreference.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        email_enabled: data.emailEnabled !== undefined ? data.emailEnabled : true,
        sms_enabled: data.smsEnabled !== undefined ? data.smsEnabled : true,
        in_app_enabled: data.inAppEnabled !== undefined ? data.inAppEnabled : true,
        orders_email: data.ordersEmail !== undefined ? data.ordersEmail : true,
        orders_sms: data.ordersSms !== undefined ? data.ordersSms : true,
        payments_email: data.paymentsEmail !== undefined ? data.paymentsEmail : true,
        payments_sms: data.paymentsSms !== undefined ? data.paymentsSms : true,
        marketing_email: data.marketingEmail !== undefined ? data.marketingEmail : true,
        marketing_sms: data.marketingSms !== undefined ? data.marketingSms : false,
      },
      update: {
        email_enabled: data.emailEnabled !== undefined ? data.emailEnabled : undefined,
        sms_enabled: data.smsEnabled !== undefined ? data.smsEnabled : undefined,
        in_app_enabled: data.inAppEnabled !== undefined ? data.inAppEnabled : undefined,
        orders_email: data.ordersEmail !== undefined ? data.ordersEmail : undefined,
        orders_sms: data.ordersSms !== undefined ? data.ordersSms : undefined,
        payments_email: data.paymentsEmail !== undefined ? data.paymentsEmail : undefined,
        payments_sms: data.paymentsSms !== undefined ? data.paymentsSms : undefined,
        marketing_email: data.marketingEmail !== undefined ? data.marketingEmail : undefined,
        marketing_sms: data.marketingSms !== undefined ? data.marketingSms : undefined,
      },
    });
  }

  /**
   * Find Dead-Letter (failed) notifications
   */
  async findDeadLetters({ page = 1, limit = 20, channel = null, category = null } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      status: 'FAILED',
      ...(channel ? { channel } : {}),
      ...(category ? { category } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Reset dead-letter notification to PENDING for manual replay
   */
  async resetDeadLetter(notificationId) {
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'PENDING',
        error_reason: null,
        attempt_count: { increment: 1 },
        last_attempted_at: new Date(),
      },
    });
  }

  /**
   * Find template by code, channel, and version
   */
  async findTemplateByCodeAndChannel(code, channel, version = 1) {
    return await this.prisma.notificationTemplate.findFirst({
      where: {
        code,
        channel,
        version,
        is_active: true,
      },
    });
  }

  /**
   * Upsert notification template (idempotent seed / register)
   */
  async upsertTemplate({ code, channel, version = 1, subject = null, body, isActive = true }) {
    return await this.prisma.notificationTemplate.upsert({
      where: {
        code_channel_version: {
          code,
          channel,
          version,
        },
      },
      create: {
        code,
        channel,
        version,
        subject,
        body,
        is_active: isActive,
      },
      update: {
        subject,
        body,
        is_active: isActive,
      },
    });
  }
}
