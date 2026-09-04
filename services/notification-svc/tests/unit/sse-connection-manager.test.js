import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { SSEConnectionManager } from '../../src/services/sse-connection-manager.js';

describe('SSEConnectionManager Unit Tests', () => {
  let manager;

  beforeEach(() => {
    manager = new SSEConnectionManager({ heartbeatIntervalMs: 500 });
  });

  afterEach(() => {
    manager.closeAll();
    jest.clearAllMocks();
  });

  const createMockResponse = () => {
    const listeners = {};
    return {
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn((event, cb) => {
        listeners[event] = cb;
      }),
      emit: (event, ...args) => {
        if (listeners[event]) {
          listeners[event](...args);
        }
      },
    };
  };

  describe('Registration & Connection Management', () => {
    it('should register connection and send initial connected event', () => {
      const res = createMockResponse();
      manager.register('user-1', res);

      expect(manager.getUserConnectionCount('user-1')).toBe(1);
      expect(manager.getTotalConnectionCount()).toBe(1);
      expect(res.write).toHaveBeenCalledWith('event: connected\ndata: {"connected":true}\n\n');
    });

    it('should support multiple connections (tabs) for the same user', () => {
      const res1 = createMockResponse();
      const res2 = createMockResponse();

      manager.register('user-1', res1);
      manager.register('user-1', res2);

      expect(manager.getUserConnectionCount('user-1')).toBe(2);
      expect(manager.getTotalConnectionCount()).toBe(2);
    });

    it('should register distinct connections for different users', () => {
      const resA = createMockResponse();
      const resB = createMockResponse();

      manager.register('user-A', resA);
      manager.register('user-B', resB);

      expect(manager.getUserConnectionCount('user-A')).toBe(1);
      expect(manager.getUserConnectionCount('user-B')).toBe(1);
      expect(manager.getTotalConnectionCount()).toBe(2);
    });

    it('should remove connection on disconnect event', () => {
      const res = createMockResponse();
      manager.register('user-1', res);
      expect(manager.getUserConnectionCount('user-1')).toBe(1);

      res.emit('close');

      expect(manager.getUserConnectionCount('user-1')).toBe(0);
      expect(manager.getTotalConnectionCount()).toBe(0);
    });

    it('should allow repeated removals without throwing', () => {
      const res = createMockResponse();
      manager.register('user-1', res);
      manager.remove('user-1', res);
      expect(() => manager.remove('user-1', res)).not.toThrow();
      expect(() => manager.remove('non-existent-user', res)).not.toThrow();
    });
  });

  describe('Notification Broadcasting & User Isolation', () => {
    it('should broadcast notification to all tabs of the targeted user', () => {
      const resTab1 = createMockResponse();
      const resTab2 = createMockResponse();
      const resOtherUser = createMockResponse();

      manager.register('user-target', resTab1);
      manager.register('user-target', resTab2);
      manager.register('user-other', resOtherUser);

      const notification = {
        id: 'notif-123',
        user_id: 'user-target',
        channel: 'IN_APP',
        category: 'ORDERS',
        subject: 'Order Confirmed',
        content: 'Your order is confirmed.',
      };

      const result = manager.broadcastNotification(notification);

      expect(result.deliveredCount).toBe(2);
      expect(resTab1.write).toHaveBeenCalledWith(
        expect.stringContaining('"id":"notif-123"'),
      );
      expect(resTab2.write).toHaveBeenCalledWith(
        expect.stringContaining('"id":"notif-123"'),
      );
      expect(resOtherUser.write).not.toHaveBeenCalledWith(
        expect.stringContaining('"id":"notif-123"'),
      );
    });

    it('should gracefully handle and clean up dead connections during broadcast write failure', () => {
      const resDead = createMockResponse();
      let callCount = 0;
      resDead.write.mockImplementation(() => {
        callCount++;
        if (callCount > 1) {
          throw new Error('Socket write error');
        }
      });

      manager.register('user-dead', resDead);
      expect(manager.getUserConnectionCount('user-dead')).toBe(1);

      const notification = {
        id: 'notif-456',
        user_id: 'user-dead',
        channel: 'IN_APP',
      };

      manager.broadcastNotification(notification);

      expect(manager.getUserConnectionCount('user-dead')).toBe(0);
    });
  });

  describe('Heartbeat Keep-Alive', () => {
    it('should send heartbeat comments to all active clients', () => {
      const res1 = createMockResponse();
      const res2 = createMockResponse();

      manager.register('user-1', res1);
      manager.register('user-2', res2);

      manager.sendHeartbeatToAll();

      expect(res1.write).toHaveBeenCalledWith(': keep-alive\n\n');
      expect(res2.write).toHaveBeenCalledWith(': keep-alive\n\n');
    });
  });
});
