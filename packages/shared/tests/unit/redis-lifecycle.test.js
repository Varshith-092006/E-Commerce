import { jest } from '@jest/globals';
import { getRedisClient, closeRedisClient, isRedisReady } from '../../src/utils/redis.js';

describe('Redis Lifecycle & Resource Management Regression Tests', () => {
  afterEach(async () => {
    await closeRedisClient();
  });

  it('closeRedisClient is safe to call when client is not initialized', async () => {
    await expect(closeRedisClient()).resolves.not.toThrow();
  });

  it('closeRedisClient gracefully terminates active client and resets shared reference', async () => {
    const client = getRedisClient('redis://localhost:6379');
    expect(client).toBeDefined();

    // Mock quit to verify it gets invoked
    let quitCalled = false;
    const originalQuit = client.quit.bind(client);
    client.quit = async () => {
      quitCalled = true;
      return originalQuit();
    };

    await closeRedisClient();
    expect(quitCalled).toBe(true);

    // After close, a subsequent getRedisClient call creates a fresh client
    const newClient = getRedisClient('redis://localhost:6379');
    expect(newClient).not.toBe(client);
    await closeRedisClient();
  });

  it('closeRedisClient handles client in end state without throwing', async () => {
    const client = getRedisClient('redis://localhost:6379');
    await closeRedisClient();
    // Second call on already closed client
    await expect(closeRedisClient()).resolves.not.toThrow();
  });
});
