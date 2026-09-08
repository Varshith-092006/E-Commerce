import { ServiceUnavailableError } from '../errors/specific-errors.js';

/**
 * Executes an async mapper function over items with bounded concurrency.
 * Prevents overwhelming downstream microservices with unbounded parallel requests.
 *
 * @template T, R
 * @param {T[]} items - Array of items to process
 * @param {(item: T, index: number) => Promise<R>} fn - Async worker function
 * @param {number} [concurrency=5] - Maximum parallel in-flight promises
 * @returns {Promise<R[]>}
 */
export async function mapConcurrent(items, fn, concurrency = 5) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const limit = Math.max(1, parseInt(concurrency, 10) || 5);
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  const workerCount = Math.min(limit, items.length);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  return results;
}

/**
 * Calculates exponential backoff delay with bounded full jitter.
 * Prevents synchronized retry storms when multiple consumers or operations fail simultaneously.
 *
 * @param {Object} options
 * @param {number} [options.attempt=1] - 1-based attempt count
 * @param {number} [options.baseDelayMs=1000] - Base delay in milliseconds
 * @param {number} [options.maxDelayMs=30000] - Maximum delay cap in milliseconds
 * @param {number} [options.jitterPercent] - Configurable jitter percentage (default: RETRY_JITTER_PERCENT || 20)
 * @returns {number} Delay in milliseconds with bounded random jitter
 */
export function calculateRetryDelayWithJitter({
  attempt = 1,
  baseDelayMs = 1000,
  maxDelayMs = 30000,
  jitterPercent = null,
  jitterMaxMs = undefined,
} = {}) {
  const safeAttempt = Math.max(1, parseInt(attempt, 10) || 1);
  const exponential = Math.min(baseDelayMs * Math.pow(2, safeAttempt - 1), maxDelayMs);

  if (jitterMaxMs !== undefined && jitterMaxMs !== null) {
    const maxJitter = Math.max(0, Number(jitterMaxMs));
    const jitterOffset = maxJitter === 0 ? 0 : Math.floor(Math.random() * maxJitter);
    return Math.min(maxDelayMs, Math.max(1, exponential + jitterOffset));
  }

  const envJitter = process.env.RETRY_JITTER_PERCENT;
  const effectiveJitterPercent = Math.min(
    100,
    Math.max(
      0,
      jitterPercent !== null && jitterPercent !== undefined
        ? Number(jitterPercent)
        : envJitter !== undefined
          ? Number(envJitter)
          : 20,
    ),
  );

  const jitterRange = exponential * (effectiveJitterPercent / 100);
  const jitterOffset = (Math.random() * 2 - 1) * jitterRange;
  const finalDelay = Math.round(exponential + jitterOffset);

  return Math.min(maxDelayMs, Math.max(1, finalDelay));
}

/**
 * Bulkhead Pattern implementation for workload isolation and concurrency limits.
 * Protects core resources (DB connections, memory, external rate limits) by bounding
 * active concurrent operations and queuing excess requests up to a safe threshold.
 */
export class Bulkhead {
  constructor({ name = 'bulkhead', maxConcurrent = 10, maxQueue = 100, timeoutMs = 5000 } = {}) {
    this.name = name;
    const parsedConcurrent = parseInt(maxConcurrent, 10);
    this.maxConcurrent = !isNaN(parsedConcurrent) && parsedConcurrent > 0 ? parsedConcurrent : 10;

    const parsedQueue = parseInt(maxQueue, 10);
    this.maxQueue = !isNaN(parsedQueue) && parsedQueue >= 0 ? parsedQueue : 100;

    const parsedTimeout = parseInt(timeoutMs, 10);
    this.timeoutMs = !isNaN(parsedTimeout) && parsedTimeout >= 0 ? parsedTimeout : 5000;

    this.activeCount = 0;
    this.queue = [];
  }

  /**
   * Executes an async operation within the bulkhead boundary.
   *
   * @param {() => Promise<any>} fn - The operation to execute
   * @returns {Promise<any>}
   */
  async execute(fn) {
    if (this.activeCount < this.maxConcurrent) {
      this.activeCount++;
      try {
        return await fn();
      } finally {
        this.activeCount--;
        this._drain();
      }
    }

    if (this.queue.length >= this.maxQueue) {
      throw new ServiceUnavailableError(
        `Workload bulkhead capacity exceeded for '${this.name}' (active: ${this.activeCount}/${this.maxConcurrent}, queued: ${this.queue.length}/${this.maxQueue})`,
        {
          bulkhead: this.name,
          activeCount: this.activeCount,
          maxConcurrent: this.maxConcurrent,
          queuedCount: this.queue.length,
          maxQueue: this.maxQueue,
        },
      );
    }

    return new Promise((resolve, reject) => {
      let timer = null;
      const queueItem = {
        fn,
        resolve: (val) => {
          if (timer) {
            clearTimeout(timer);
          }
          resolve(val);
        },
        reject: (err) => {
          if (timer) {
            clearTimeout(timer);
          }
          reject(err);
        },
      };

      if (this.timeoutMs > 0) {
        timer = setTimeout(() => {
          const idx = this.queue.indexOf(queueItem);
          if (idx !== -1) {
            this.queue.splice(idx, 1);
            reject(
              new ServiceUnavailableError(
                `Timed out waiting for bulkhead slot in '${this.name}' (${this.timeoutMs}ms)`,
                { bulkhead: this.name, timeoutMs: this.timeoutMs },
              ),
            );
          }
        }, this.timeoutMs);
      }

      this.queue.push(queueItem);
    });
  }

  _drain() {
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const nextTask = this.queue.shift();
      this.activeCount++;
      Promise.resolve()
        .then(() => nextTask.fn())
        .then(
          (result) => {
            this.activeCount--;
            nextTask.resolve(result);
            this._drain();
          },
          (err) => {
            this.activeCount--;
            nextTask.reject(err);
            this._drain();
          },
        );
    }
  }

  /**
   * Returns current bulkhead utilization metrics
   */
  getMetrics() {
    return {
      name: this.name,
      active: this.activeCount,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent,
      maxQueue: this.maxQueue,
      availableSlots: Math.max(0, this.maxConcurrent - this.activeCount),
    };
  }
}

export const paymentBulkhead = new Bulkhead({
  name: 'payment',
  maxConcurrent: parseInt(process.env.MAX_PAYMENT_CONCURRENCY, 10) || 8,
  maxQueue: parseInt(process.env.MAX_PAYMENT_QUEUE, 10) || 50,
  timeoutMs: 10000,
});

export const orderBulkhead = new Bulkhead({
  name: 'order',
  maxConcurrent: parseInt(process.env.MAX_ORDER_CONCURRENCY, 10) || 10,
  maxQueue: parseInt(process.env.MAX_ORDER_QUEUE, 10) || 100,
  timeoutMs: 10000,
});

export const inventoryBulkhead = new Bulkhead({
  name: 'inventory',
  maxConcurrent: parseInt(process.env.MAX_INVENTORY_CONCURRENCY, 10) || 8,
  maxQueue: parseInt(process.env.MAX_INVENTORY_QUEUE, 10) || 100,
  timeoutMs: 10000,
});

export const courierBulkhead = new Bulkhead({
  name: 'courier',
  maxConcurrent: parseInt(process.env.MAX_COURIER_CONCURRENCY, 10) || 5,
  maxQueue: parseInt(process.env.MAX_COURIER_QUEUE, 10) || 50,
  timeoutMs: 15000,
});

export const notificationBulkhead = new Bulkhead({
  name: 'notification',
  maxConcurrent: parseInt(process.env.MAX_NOTIFICATION_CONCURRENCY, 10) || 5,
  maxQueue: parseInt(process.env.MAX_NOTIFICATION_QUEUE, 10) || 200,
  timeoutMs: 15000,
});
