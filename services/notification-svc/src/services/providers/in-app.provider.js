import { logger } from '@ecommerce/shared';

import { sseConnectionManager as defaultSseManager } from '../sse-connection-manager.js';

export class InAppProvider {
  constructor({ notificationRepo, sseManager = defaultSseManager } = {}) {
    this.notificationRepo = notificationRepo;
    this.sseManager = sseManager;
  }

  /**
   * For in-app notifications, delivery confirms DB persistence and broadcasts to live SSE clients
   */
  async send({ notification, _recipient, _subject, _content, _metadata = {} } = {}) {
    try {
      if (notification && this.sseManager) {
        this.sseManager.broadcastNotification(notification);
      }
    } catch (err) {
      logger.warn(
        { err: err.message, userId: notification?.user_id },
        'Failed to stream in-app notification via SSE (persistence remains valid)',
      );
    }

    return await Promise.resolve({
      success: true,
      providerMessageId: null,
      errorReason: null,
      retryable: false,
    });
  }
}
