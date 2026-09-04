import { logger, metricsRegistry } from '@ecommerce/shared';

export const CircuitState = Object.freeze({
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN',
});

export class CircuitBreaker {
  constructor({ name = 'default-breaker', failureThreshold = 5, resetTimeoutMs = 30000 } = {}) {
    this.name = name;
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;

    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastStateChange = Date.now();
    this.lastError = null;

    // Initialize metric
    const metric = metricsRegistry.getMetric('circuit_breaker_state');
    if (metric) {
      metric.set({ service: 'notification-svc', breaker_name: this.name, state: this.state }, 0);
    }
  }

  /**
   * Executes an asynchronous operation through the circuit breaker
   */
  async execute(action) {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastStateChange >= this.resetTimeoutMs) {
        this.transitionTo(CircuitState.HALF_OPEN);
      } else {
        const error = new Error(
          `Circuit breaker "${this.name}" is OPEN (failing fast to protect provider)`,
        );
        error.circuitBreakerOpen = true;
        error.retryable = true;
        throw error;
      }
    }

    try {
      const result = await action();
      this.recordSuccess();
      return result;
    } catch (err) {
      this.recordFailure(err);
      throw err;
    }
  }

  /**
   * Records a successful execution and closes/resets breaker
   */
  recordSuccess() {
    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionTo(CircuitState.CLOSED);
    }
    this.failureCount = 0;
    this.lastError = null;
  }

  /**
   * Records a failure and trips breaker to OPEN if threshold reached
   */
  recordFailure(err) {
    this.failureCount += 1;
    this.lastError = err.message;

    if (this.state === CircuitState.HALF_OPEN || this.failureCount >= this.failureThreshold) {
      this.transitionTo(CircuitState.OPEN);
    }
  }

  /**
   * Transitions state and logs the transition
   */
  transitionTo(newState) {
    const oldState = this.state;
    this.state = newState;
    this.lastStateChange = Date.now();

    const stateCode = newState === CircuitState.CLOSED ? 0 : newState === CircuitState.OPEN ? 1 : 2;
    const metric = metricsRegistry.getMetric('circuit_breaker_state');
    if (metric) {
      metric.set(
        { service: 'notification-svc', breaker_name: this.name, state: newState },
        stateCode,
      );
    }

    logger.warn(
      { breaker: this.name, from: oldState, to: newState, failureCount: this.failureCount },
      `Circuit breaker state changed: ${oldState} -> ${newState}`,
    );
  }

  /**
   * Returns current state metadata
   */
  getState() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      lastStateChange: this.lastStateChange,
      lastError: this.lastError,
    };
  }

  /**
   * Manually resets breaker to CLOSED state
   */
  reset() {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastStateChange = Date.now();
    this.lastError = null;
  }
}
