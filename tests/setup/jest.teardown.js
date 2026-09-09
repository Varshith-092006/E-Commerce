import { closeRedisClient } from '@ecommerce/shared';

afterAll(async () => {
  try {
    await closeRedisClient();
  } catch {
    // Ignore teardown errors
  }
});
