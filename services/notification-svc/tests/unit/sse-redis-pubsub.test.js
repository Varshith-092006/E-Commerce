import { jest } from '@jest/globals';
import { EventEmitter } from 'events';

import { SSEConnectionManager } from '../../src/services/sse-connection-manager.js';

describe('SSEConnectionManager with Redis Pub/Sub', () => {
  let publisher;
  let subscriber;
  let subscriberEvents;

  beforeEach(() => {
    subscriberEvents = new EventEmitter();
    publisher = {
      publish: jest.fn().mockResolvedValue(1),
    };
    subscriber = {
      subscribe: jest.fn((channel, cb) => {
        if (cb) cb(null);
      }),
      on: jest.fn((event, handler) => {
        subscriberEvents.on(event, handler);
      }),
      unsubscribe: jest.fn().mockResolvedValue('OK'),
    };
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('subscribes to Redis SSE broadcast channel on initialization', () => {
    const manager = new SSEConnectionManager({
      redisPublisher: publisher,
      redisSubscriber: subscriber,
      pubSubChannel: 'sse:notifications:broadcast',
    });

    expect(subscriber.subscribe).toHaveBeenCalledWith(
      'sse:notifications:broadcast',
      expect.any(Function),
    );
    manager.closeAll();
  });

  test('publishes to Redis Pub/Sub when broadcasting notification', () => {
    const manager = new SSEConnectionManager({
      redisPublisher: publisher,
      redisSubscriber: subscriber,
    });

    const mockRes = {
      write: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      end: jest.fn(),
    };
    manager.register('user-1', mockRes);

    const notification = {
      id: 'notif-100',
      user_id: 'user-1',
      channel: 'IN_APP',
      category: 'ORDERS',
      subject: 'Order Confirmed',
      content: 'Your order is ready',
    };

    const result = manager.broadcast('user-1', notification);
    expect(result.deliveredCount).toBe(1);
    expect(publisher.publish).toHaveBeenCalledWith(
      'sse:notifications:broadcast',
      expect.stringContaining('"userId":"user-1"'),
    );

    manager.closeAll();
  });

  test('delivers notification to local connection when Redis Pub/Sub message received from another node', () => {
    const manager = new SSEConnectionManager({
      redisPublisher: publisher,
      redisSubscriber: subscriber,
    });

    const mockRes = {
      write: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      end: jest.fn(),
    };
    manager.register('user-remote', mockRes);

    // Simulate incoming message from another cluster node
    const incomingMessage = JSON.stringify({
      userId: 'user-remote',
      notification: {
        id: 'notif-remote-1',
        user_id: 'user-remote',
        channel: 'IN_APP',
        subject: 'Cluster Broadcast',
        content: 'Cross-node message',
      },
      broadcastId: 'bcast_remote_123',
    });

    subscriberEvents.emit('message', 'sse:notifications:broadcast', incomingMessage);

    // Verify local write was called for user-remote
    expect(mockRes.write).toHaveBeenCalledWith(
      expect.stringContaining('Cross-node message'),
    );

    manager.closeAll();
  });

  test('preserves strict user isolation: User A never receives User B event from Pub/Sub', () => {
    const manager = new SSEConnectionManager({
      redisPublisher: publisher,
      redisSubscriber: subscriber,
    });

    const mockResA = {
      write: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      end: jest.fn(),
    };
    const mockResB = {
      write: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      end: jest.fn(),
    };

    manager.register('user-A', mockResA);
    manager.register('user-B', mockResB);

    // Clear initial connected message
    mockResA.write.mockClear();
    mockResB.write.mockClear();

    // Message destined ONLY for user-A
    const messageForA = JSON.stringify({
      userId: 'user-A',
      notification: {
        id: 'notif-secret-A',
        user_id: 'user-A',
        subject: 'Private Alert',
      },
      broadcastId: 'bcast_user_A_1',
    });

    subscriberEvents.emit('message', 'sse:notifications:broadcast', messageForA);

    expect(mockResA.write).toHaveBeenCalledTimes(1);
    expect(mockResB.write).not.toHaveBeenCalled();

    manager.closeAll();
  });

  test('deduplicates incoming broadcast messages if already handled locally', () => {
    const manager = new SSEConnectionManager({
      redisPublisher: publisher,
      redisSubscriber: subscriber,
    });

    const mockRes = {
      write: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      end: jest.fn(),
    };
    manager.register('user-dup', mockRes);
    mockRes.write.mockClear();

    const notif = {
      id: 'notif-dup-1',
      user_id: 'user-dup',
      subject: 'Deduplicated event',
    };

    // 1. Broadcast triggers local delivery + saves broadcast ID
    manager.broadcast('user-dup', notif);
    expect(mockRes.write).toHaveBeenCalledTimes(1);

    // 2. Redis loopback message arrives with the same broadcast ID that this node published
    const publishPayload = JSON.parse(publisher.publish.mock.calls[0][1]);
    subscriberEvents.emit('message', 'sse:notifications:broadcast', JSON.stringify(publishPayload));

    // Must NOT deliver a second time
    expect(mockRes.write).toHaveBeenCalledTimes(1);

    manager.closeAll();
  });
});
