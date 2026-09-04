import { logger } from '@ecommerce/shared';

export class SSEConnectionManager {
  constructor({
    heartbeatIntervalMs = 25000,
    redisPublisher = null,
    redisSubscriber = null,
    pubSubChannel = 'sse:notifications:broadcast',
  } = {}) {
    // Map<userId, Set<express.Response>>
    this.userConnections = new Map();
    this.heartbeatIntervalMs = heartbeatIntervalMs;
    this.heartbeatTimer = null;
    this.pubSubChannel = pubSubChannel;

    // LRU-style set to track processed broadcast IDs and prevent duplicate local delivery
    this.processedBroadcastIds = new Set();
    this.maxTrackedBroadcasts = 5000;

    this.redisPublisher = redisPublisher;
    this.redisSubscriber = redisSubscriber;

    if (this.redisSubscriber && typeof this.redisSubscriber.subscribe === 'function') {
      this._setupRedisSubscription();
    }

    this.startHeartbeat();
  }

  /**
   * Configures Redis Pub/Sub subscription for multi-replica notification broadcasting
   */
  _setupRedisSubscription() {
    try {
      this.redisSubscriber.subscribe(this.pubSubChannel, (err) => {
        if (err) {
          logger.warn({ err: err.message }, 'Failed to subscribe to Redis SSE broadcast channel');
        } else {
          logger.info(
            { channel: this.pubSubChannel },
            'Subscribed to Redis SSE notification broadcast channel',
          );
        }
      });

      this.redisSubscriber.on('message', (channel, message) => {
        if (channel !== this.pubSubChannel) {
          return;
        }

        try {
          const { userId, notification, broadcastId } = JSON.parse(message);
          if (!userId || !notification) {
            return;
          }

          // Deduplicate if already processed by this node
          if (broadcastId && this.processedBroadcastIds.has(broadcastId)) {
            return;
          }

          if (broadcastId) {
            this._recordBroadcastId(broadcastId);
          }

          // Deliver strictly to local connections belonging to target userId
          this._deliverLocally(userId, notification);
        } catch (parseErr) {
          logger.warn({ err: parseErr.message }, 'Failed to parse Redis SSE broadcast message');
        }
      });
    } catch (err) {
      logger.warn({ err: err.message }, 'Error setting up Redis SSE subscriber listeners');
    }
  }

  /**
   * Connects or updates Redis Pub/Sub clients dynamically
   */
  initRedisPubSub({ redisPublisher, redisSubscriber }) {
    this.redisPublisher = redisPublisher;
    this.redisSubscriber = redisSubscriber;
    if (this.redisSubscriber && typeof this.redisSubscriber.subscribe === 'function') {
      this._setupRedisSubscription();
    }
  }

  _recordBroadcastId(broadcastId) {
    this.processedBroadcastIds.add(broadcastId);
    if (this.processedBroadcastIds.size > this.maxTrackedBroadcasts) {
      const oldest = this.processedBroadcastIds.values().next().value;
      this.processedBroadcastIds.delete(oldest);
    }
  }

  /**
   * Starts periodic heartbeat to keep client connections open
   */
  startHeartbeat() {
    if (this.heartbeatTimer) {
      return;
    }
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeatToAll();
    }, this.heartbeatIntervalMs);

    // Ensure timer doesn't keep node process alive in tests
    if (this.heartbeatTimer.unref) {
      this.heartbeatTimer.unref();
    }
  }

  /**
   * Stops heartbeat timer and cleans up resources
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Sends heartbeat comment to all active client responses
   */
  sendHeartbeatToAll() {
    const deadConnections = [];

    for (const [userId, connections] of this.userConnections.entries()) {
      for (const res of connections) {
        try {
          res.write(': keep-alive\n\n');
        } catch {
          deadConnections.push({ userId, res });
        }
      }
    }

    for (const { userId, res } of deadConnections) {
      this.remove(userId, res);
    }
  }

  /**
   * Registers an active SSE client response for a given user
   */
  register(userId, res) {
    if (!userId || !res) {
      return;
    }

    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }

    const connections = this.userConnections.get(userId);
    connections.add(res);

    logger.info(
      {
        userId,
        userActiveConnections: connections.size,
        totalConnections: this.getTotalConnectionCount(),
      },
      'SSE client connected',
    );

    // Send initial connected confirmation event
    try {
      res.write('event: connected\ndata: {"connected":true}\n\n');
    } catch (err) {
      logger.warn({ userId, err: err.message }, 'Failed to send initial SSE connected event');
      this.remove(userId, res);
      return;
    }

    // Clean up when client disconnects
    res.on('close', () => {
      this.remove(userId, res);
    });
  }

  /**
   * Removes a client connection and cleans up empty user sets
   */
  remove(userId, res) {
    if (!userId || !this.userConnections.has(userId)) {
      return;
    }

    const connections = this.userConnections.get(userId);
    if (res) {
      connections.delete(res);
    }

    if (connections.size === 0) {
      this.userConnections.delete(userId);
    }

    logger.info(
      {
        userId,
        userActiveConnections: connections.size,
        totalConnections: this.getTotalConnectionCount(),
      },
      'SSE client disconnected / connection removed',
    );
  }

  /**
   * Delivers notification payload strictly to local connections for that userId
   */
  _deliverLocally(userId, notification) {
    const connections = this.userConnections.get(userId);
    if (!connections || connections.size === 0) {
      return 0;
    }

    const payload = {
      id: notification.id,
      user_id: notification.user_id,
      channel: notification.channel,
      category: notification.category,
      subject: notification.subject,
      content: notification.content,
      metadata: notification.metadata,
      status: notification.status,
      created_at: notification.created_at,
    };

    const sseMessage = `event: notification\ndata: ${JSON.stringify(payload)}\n\n`;
    let deliveredCount = 0;
    const deadConnections = [];

    for (const res of connections) {
      try {
        res.write(sseMessage);
        deliveredCount++;
      } catch (err) {
        logger.warn({ userId, err: err.message }, 'Failed to write to SSE client socket');
        deadConnections.push(res);
      }
    }

    for (const deadRes of deadConnections) {
      this.remove(userId, deadRes);
    }

    return deliveredCount;
  }

  /**
   * Broadcasts a notification locally and publishes to Redis Pub/Sub for other cluster nodes
   */
  broadcast(userId, notification) {
    if (!userId || !notification) {
      return { deliveredCount: 0 };
    }

    const broadcastId = `bcast_${notification.id || Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this._recordBroadcastId(broadcastId);

    // 1. Deliver to local active sockets
    const localDelivered = this._deliverLocally(userId, notification);

    // 2. Publish to Redis Pub/Sub cluster if publisher available
    if (this.redisPublisher && typeof this.redisPublisher.publish === 'function') {
      try {
        const message = JSON.stringify({
          userId,
          notification,
          broadcastId,
        });
        this.redisPublisher.publish(this.pubSubChannel, message).catch((err) => {
          logger.warn(
            { err: err.message, userId },
            'Redis SSE publish failed; local delivery succeeded',
          );
        });
      } catch (err) {
        logger.warn(
          { err: err.message, userId },
          'Redis SSE publish error; local delivery succeeded',
        );
      }
    }

    logger.info(
      { userId, notificationId: notification.id, localDelivered, broadcastId },
      'Broadcast in-app notification via SSE',
    );

    return { deliveredCount: localDelivered };
  }

  /**
   * Convenience wrapper that extracts userId from notification
   */
  broadcastNotification(notification) {
    if (!notification || !notification.user_id) {
      return { deliveredCount: 0 };
    }
    return this.broadcast(notification.user_id, notification);
  }

  /**
   * Returns active connection count for a specific user
   */
  getUserConnectionCount(userId) {
    const connections = this.userConnections.get(userId);
    return connections ? connections.size : 0;
  }

  /**
   * Returns total active SSE connections across all users
   */
  getTotalConnectionCount() {
    let total = 0;
    for (const connections of this.userConnections.values()) {
      total += connections.size;
    }
    return total;
  }

  /**
   * Closes all connections, stops heartbeat, and unsubscribes Redis
   */
  async closeAll() {
    this.stopHeartbeat();
    for (const connections of this.userConnections.values()) {
      for (const res of connections) {
        try {
          res.end();
        } catch {
          // Ignored on teardown
        }
      }
    }
    this.userConnections.clear();
    this.processedBroadcastIds.clear();

    if (this.redisSubscriber && typeof this.redisSubscriber.unsubscribe === 'function') {
      try {
        await this.redisSubscriber.unsubscribe(this.pubSubChannel);
      } catch {
        // Ignored on teardown
      }
    }
  }
}

export const sseConnectionManager = new SSEConnectionManager();
