import { ValidationError, ForbiddenError, NotFoundError, logger } from '@ecommerce/shared';

import { NotificationRepository } from '../repositories/notification.repository.js';

import { TemplateRendererService } from './template-renderer.service.js';
import { EmailProvider } from './providers/email.provider.js';
import { SmsProvider } from './providers/sms.provider.js';
import { InAppProvider } from './providers/in-app.provider.js';
import { CircuitBreaker } from './circuit-breaker.js';
import { channelRateLimiter as defaultRateLimiter } from './channel-rate-limiter.js';

export class NotificationService {
  constructor({
    notificationRepo = new NotificationRepository(),
    emailProvider = new EmailProvider(),
    smsProvider = new SmsProvider(),
    inAppProvider = null,
    rateLimiter = defaultRateLimiter,
    emailBreaker = new CircuitBreaker({
      name: 'email-provider',
      failureThreshold: 5,
      resetTimeoutMs: 30000,
    }),
    smsBreaker = new CircuitBreaker({
      name: 'sms-provider',
      failureThreshold: 5,
      resetTimeoutMs: 30000,
    }),
  } = {}) {
    this.notificationRepo = notificationRepo;
    this.emailProvider = emailProvider;
    this.smsProvider = smsProvider;
    this.inAppProvider =
      inAppProvider || new InAppProvider({ notificationRepo: this.notificationRepo });
    this.rateLimiter = rateLimiter;
    this.emailBreaker = emailBreaker;
    this.smsBreaker = smsBreaker;
  }

  /**
   * Dispatches a multi-channel notification with granular preference filtering, rate limiting, and circuit breakers
   */
  async dispatchNotification({
    userId,
    templateCode,
    channels = ['IN_APP'],
    category = 'ORDERS',
    recipient = {},
    templateData = {},
    idempotencyKey = null,
    eventId = null,
    sourceService = null,
  }) {
    if (!userId) {
      throw new ValidationError('userId is required for notification dispatch');
    }
    if (!templateCode) {
      throw new ValidationError('templateCode is required for notification dispatch');
    }
    if (!Array.isArray(channels) || channels.length === 0) {
      throw new ValidationError('At least one channel must be specified');
    }

    // Retrieve user preferences
    const rawPreferences = await this.notificationRepo.findPreferencesByUserId(userId);
    const preferences = {
      emailEnabled: rawPreferences ? rawPreferences.email_enabled : true,
      smsEnabled: rawPreferences ? rawPreferences.sms_enabled : true,
      inAppEnabled: rawPreferences ? rawPreferences.in_app_enabled : true,
      ordersEmail: rawPreferences?.orders_email !== undefined ? rawPreferences.orders_email : true,
      ordersSms: rawPreferences?.orders_sms !== undefined ? rawPreferences.orders_sms : true,
      paymentsEmail:
        rawPreferences?.payments_email !== undefined ? rawPreferences.payments_email : true,
      paymentsSms: rawPreferences?.payments_sms !== undefined ? rawPreferences.payments_sms : true,
      marketingEmail:
        rawPreferences?.marketing_email !== undefined ? rawPreferences.marketing_email : true,
      marketingSms:
        rawPreferences?.marketing_sms !== undefined ? rawPreferences.marketing_sms : false,
    };

    const dispatches = [];
    let isOverallIdempotent = true;

    for (const channel of channels) {
      if (channel === 'PUSH') {
        throw new ValidationError(
          'Web Push (VAPID) is an optional future enhancement and is not supported in this release. Supported channels are EMAIL, SMS, and IN_APP',
        );
      }

      // Check if channel is supported
      if (!['EMAIL', 'SMS', 'IN_APP'].includes(channel)) {
        throw new ValidationError(
          `Unsupported notification channel: "${channel}". Supported channels are EMAIL, SMS, IN_APP`,
        );
      }

      // Check preference suppression (except for mandatory ACCOUNT category)
      const isMandatory = category === 'ACCOUNT';
      if (!isMandatory) {
        // Global channel check
        if (channel === 'EMAIL' && !preferences.emailEnabled) {
          logger.info(
            { userId, templateCode, channel },
            'Suppressed notification due to email_enabled preference',
          );
          continue;
        }
        if (channel === 'SMS' && !preferences.smsEnabled) {
          logger.info(
            { userId, templateCode, channel },
            'Suppressed notification due to sms_enabled preference',
          );
          continue;
        }
        if (channel === 'IN_APP' && !preferences.inAppEnabled) {
          logger.info(
            { userId, templateCode, channel },
            'Suppressed notification due to in_app_enabled preference',
          );
          continue;
        }

        // Granular category checks
        if (category === 'ORDERS') {
          if (channel === 'EMAIL' && !preferences.ordersEmail) {
            logger.info(
              { userId, templateCode, channel },
              'Suppressed notification due to orders_email preference',
            );
            continue;
          }
          if (channel === 'SMS' && !preferences.ordersSms) {
            logger.info(
              { userId, templateCode, channel },
              'Suppressed notification due to orders_sms preference',
            );
            continue;
          }
        } else if (category === 'PAYMENTS') {
          if (channel === 'EMAIL' && !preferences.paymentsEmail) {
            logger.info(
              { userId, templateCode, channel },
              'Suppressed notification due to payments_email preference',
            );
            continue;
          }
          if (channel === 'SMS' && !preferences.paymentsSms) {
            logger.info(
              { userId, templateCode, channel },
              'Suppressed notification due to payments_sms preference',
            );
            continue;
          }
        } else if (category === 'MARKETING') {
          if (channel === 'EMAIL' && !preferences.marketingEmail) {
            logger.info(
              { userId, templateCode, channel },
              'Suppressed notification due to marketing_email preference',
            );
            continue;
          }
          if (channel === 'SMS' && !preferences.marketingSms) {
            logger.info(
              { userId, templateCode, channel },
              'Suppressed notification due to marketing_sms preference',
            );
            continue;
          }
        }
      }

      // Idempotency check per channel
      if (idempotencyKey) {
        const existing = await this.notificationRepo.findByUserChannelIdempotencyKey(
          userId,
          channel,
          idempotencyKey,
        );

        if (existing) {
          dispatches.push({
            channel,
            status: existing.status,
            notificationId: existing.id,
            providerMessageId: existing.provider_message_id,
            errorReason: existing.error_reason,
            idempotent: true,
          });
          continue;
        }
      }

      isOverallIdempotent = false;

      // Rate limit check for non-mandatory notifications
      if (!isMandatory && this.rateLimiter) {
        const rateCheck = await this.rateLimiter.checkRateLimit(userId, channel);
        if (!rateCheck.allowed) {
          logger.warn(
            { userId, channel, resetTimeMs: rateCheck.resetTimeMs },
            'Notification throttled: channel rate limit exceeded',
          );

          // Persist failed notification record
          const throttledRecord = await this.notificationRepo.createNotification({
            userId,
            idempotencyKey,
            eventId,
            sourceService,
            templateCode,
            templateVersion: 1,
            channel,
            category,
            recipient: recipient.email || recipient.phone || userId,
            subject: 'Rate Limit Exceeded',
            content: 'Notification suppressed due to rate limiting',
            metadata: templateData,
            status: 'FAILED',
            errorReason: 'Channel rate limit exceeded',
          });

          dispatches.push({
            channel,
            status: 'FAILED',
            notificationId: throttledRecord.id,
            providerMessageId: null,
            errorReason: 'Channel rate limit exceeded',
            idempotent: false,
          });
          continue;
        }
      }

      // Determine recipient address for channel
      let recipientAddress = userId;
      if (channel === 'EMAIL') {
        recipientAddress = recipient.email || templateData.user?.email || null;
      } else if (channel === 'SMS') {
        recipientAddress = recipient.phone || templateData.user?.phone || null;
      }

      if (!recipientAddress) {
        dispatches.push({
          channel,
          status: 'FAILED',
          notificationId: null,
          providerMessageId: null,
          errorReason: `Missing recipient address for channel "${channel}"`,
        });
        continue;
      }

      // Resolve template from DB or built-in catalog
      const dbTemplate = await this.notificationRepo.findTemplateByCodeAndChannel(
        templateCode,
        channel,
        1,
      );

      let templateSubject = dbTemplate?.subject;
      let templateBody = dbTemplate?.body;

      if (!templateBody) {
        const builtin = TemplateRendererService.getBuiltinTemplate(templateCode, channel);
        if (builtin) {
          templateSubject = builtin.subject;
          templateBody = builtin.body;
        }
      }

      if (!templateBody) {
        dispatches.push({
          channel,
          status: 'FAILED',
          notificationId: null,
          providerMessageId: null,
          errorReason: `No template found for code "${templateCode}" and channel "${channel}"`,
        });
        continue;
      }

      // Render template content
      const { subject, body } = TemplateRendererService.render({
        templateSubject,
        templateBody,
        data: templateData,
        channel,
      });

      // Persist notification as PENDING in notification_db
      let notificationRecord;
      try {
        notificationRecord = await this.notificationRepo.createNotification({
          userId,
          idempotencyKey,
          eventId,
          sourceService,
          templateCode,
          templateVersion: 1,
          channel,
          category,
          recipient: recipientAddress,
          subject,
          content: body,
          metadata: templateData,
          status: 'PENDING',
        });
      } catch (err) {
        if (idempotencyKey && err.code === 'P2002') {
          const existing = await this.notificationRepo.findByUserChannelIdempotencyKey(
            userId,
            channel,
            idempotencyKey,
          );
          if (existing) {
            dispatches.push({
              channel,
              status: existing.status,
              notificationId: existing.id,
              providerMessageId: existing.provider_message_id,
              errorReason: existing.error_reason,
              idempotent: true,
            });
            continue;
          }
        }
        throw err;
      }

      // Record rate limit attempt
      if (this.rateLimiter) {
        await this.rateLimiter.recordDispatch(userId, channel);
      }

      // Execute provider dispatch through circuit breaker outside DB transaction
      let providerResult = {
        success: false,
        providerMessageId: null,
        errorReason: 'Unknown provider',
        retryable: false,
      };

      try {
        if (channel === 'EMAIL') {
          providerResult = await this.emailBreaker.execute(async () => {
            const res = await this.emailProvider.send({
              recipient: recipientAddress,
              subject,
              content: body,
              metadata: templateData,
            });
            if (!res.success && res.retryable) {
              throw new Error(res.errorReason || 'SMTP Provider Error');
            }
            return res;
          });
        } else if (channel === 'SMS') {
          providerResult = await this.smsBreaker.execute(async () => {
            const res = await this.smsProvider.send({
              recipient: recipientAddress,
              content: body,
              metadata: templateData,
            });
            if (!res.success && res.retryable) {
              throw new Error(res.errorReason || 'SMS Provider Error');
            }
            return res;
          });
        } else if (channel === 'IN_APP') {
          providerResult = await this.inAppProvider.send({
            notification: notificationRecord,
            recipient: recipientAddress,
            subject,
            content: body,
            metadata: templateData,
          });
        }
      } catch (providerErr) {
        providerResult = {
          success: false,
          providerMessageId: null,
          errorReason: providerErr.message,
          retryable: true,
        };
      }

      // Update notification record status in notification_db
      const finalStatus = providerResult.success ? 'SENT' : 'FAILED';
      await this.notificationRepo.updateNotificationStatus(notificationRecord.id, {
        status: finalStatus,
        errorReason: providerResult.errorReason,
        providerMessageId: providerResult.providerMessageId,
        sentAt: providerResult.success ? new Date() : null,
      });

      dispatches.push({
        channel,
        status: finalStatus,
        notificationId: notificationRecord.id,
        providerMessageId: providerResult.providerMessageId,
        errorReason: providerResult.errorReason,
        idempotent: false,
      });
    }

    return {
      dispatches,
      idempotent: isOverallIdempotent,
    };
  }

  /**
   * Retrieves paginated notifications and unread count for user
   */
  async getUserNotifications({ userId, channel = 'IN_APP', isRead = null, page = 1, limit = 20 }) {
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    let parsedIsRead = null;
    if (isRead === 'true' || isRead === true) {
      parsedIsRead = true;
    }
    if (isRead === 'false' || isRead === false) {
      parsedIsRead = false;
    }

    const [{ items, total }, unreadCount] = await Promise.all([
      this.notificationRepo.findUserNotifications({
        userId,
        channel,
        isRead: parsedIsRead,
        page: safePage,
        limit: safeLimit,
      }),
      this.notificationRepo.countUnreadUserNotifications(userId, channel),
    ]);

    const formattedItems = items.map((item) => ({
      id: item.id,
      channel: item.channel,
      category: item.category,
      subject: item.subject,
      content: item.content,
      metadata: item.metadata,
      status: item.status,
      isRead: item.is_read,
      readAt: item.read_at,
      createdAt: item.created_at,
    }));

    return {
      items: formattedItems,
      unreadCount,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }

  /**
   * Mark a single in-app notification as read
   */
  async markNotificationAsRead({ notificationId, userId }) {
    if (!notificationId) {
      throw new ValidationError('notificationId is required');
    }
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new ForbiddenError('You are not authorized to update this notification');
    }

    await this.notificationRepo.markAsRead(notificationId, userId);

    return {
      id: notificationId,
      isRead: true,
      readAt: new Date(),
    };
  }

  /**
   * Mark all unread in-app notifications as read for user
   */
  async markAllNotificationsAsRead({ userId, channel = 'IN_APP' }) {
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const { updatedCount } = await this.notificationRepo.markAllAsRead(userId, channel);

    return {
      updatedCount,
      success: true,
    };
  }

  /**
   * Get user notification preferences with granular category flags
   */
  async getUserPreferences({ userId }) {
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const raw = await this.notificationRepo.findPreferencesByUserId(userId);

    return {
      emailEnabled: raw ? raw.email_enabled : true,
      smsEnabled: raw ? raw.sms_enabled : true,
      inAppEnabled: raw ? raw.in_app_enabled : true,
      ordersEmail: raw?.orders_email !== undefined ? raw.orders_email : true,
      ordersSms: raw?.orders_sms !== undefined ? raw.orders_sms : true,
      paymentsEmail: raw?.payments_email !== undefined ? raw.payments_email : true,
      paymentsSms: raw?.payments_sms !== undefined ? raw.payments_sms : true,
      marketingEmail: raw?.marketing_email !== undefined ? raw.marketing_email : true,
      marketingSms: raw?.marketing_sms !== undefined ? raw.marketing_sms : false,
    };
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences({ userId, preferences = {} }) {
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const updated = await this.notificationRepo.upsertPreferences(userId, preferences);

    return {
      emailEnabled: updated.email_enabled,
      smsEnabled: updated.sms_enabled,
      inAppEnabled: updated.in_app_enabled,
      ordersEmail: updated.orders_email,
      ordersSms: updated.orders_sms,
      paymentsEmail: updated.payments_email,
      paymentsSms: updated.payments_sms,
      marketingEmail: updated.marketing_email,
      marketingSms: updated.marketing_sms,
    };
  }

  /**
   * Admin DLQ Query: List failed notifications
   */
  async getDeadLetterQueue({ page = 1, limit = 20, channel = null, category = null } = {}) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    const { items, total } = await this.notificationRepo.findDeadLetters({
      page: safePage,
      limit: safeLimit,
      channel,
      category,
    });

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }

  /**
   * Admin DLQ Replay: Reset and re-dispatch failed notification
   */
  async replayDeadLetter({ notificationId }) {
    if (!notificationId) {
      throw new ValidationError('notificationId is required');
    }

    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // Reset status to PENDING
    await this.notificationRepo.resetDeadLetter(notificationId);

    // Re-execute dispatch
    let providerResult = { success: false, providerMessageId: null, errorReason: null };
    try {
      if (notification.channel === 'EMAIL') {
        providerResult = await this.emailProvider.send({
          recipient: notification.recipient,
          subject: notification.subject,
          content: notification.content,
          metadata: notification.metadata,
        });
      } else if (notification.channel === 'SMS') {
        providerResult = await this.smsProvider.send({
          recipient: notification.recipient,
          content: notification.content,
          metadata: notification.metadata,
        });
      } else if (notification.channel === 'IN_APP') {
        providerResult = await this.inAppProvider.send({
          notification,
          recipient: notification.recipient,
          subject: notification.subject,
          content: notification.content,
          metadata: notification.metadata,
        });
      }
    } catch (err) {
      providerResult = { success: false, errorReason: err.message };
    }

    const finalStatus = providerResult.success ? 'SENT' : 'FAILED';
    const updated = await this.notificationRepo.updateNotificationStatus(notificationId, {
      status: finalStatus,
      errorReason: providerResult.errorReason,
      providerMessageId: providerResult.providerMessageId,
      sentAt: providerResult.success ? new Date() : null,
    });

    return {
      id: updated.id,
      status: updated.status,
      attemptCount: updated.attempt_count,
      errorReason: updated.error_reason,
      replayedAt: new Date(),
    };
  }
}

export const notificationService = new NotificationService();
