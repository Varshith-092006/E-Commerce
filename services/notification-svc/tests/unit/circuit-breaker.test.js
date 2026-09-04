import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CircuitBreaker, CircuitState } from '../../src/services/circuit-breaker.js';

describe('CircuitBreaker Unit Tests', () => {
  let breaker;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      name: 'test-breaker',
      failureThreshold: 3,
      resetTimeoutMs: 200,
    });
  });

  it('should start in CLOSED state and execute successful actions', async () => {
    expect(breaker.state).toBe(CircuitState.CLOSED);

    const action = jest.fn().mockResolvedValue('success');
    const result = await breaker.execute(action);

    expect(result).toBe('success');
    expect(breaker.state).toBe(CircuitState.CLOSED);
    expect(breaker.failureCount).toBe(0);
  });

  it('should trip from CLOSED to OPEN after failureThreshold consecutive failures', async () => {
    const failingAction = jest.fn().mockRejectedValue(new Error('Downstream Error'));

    for (let i = 0; i < 2; i++) {
      await expect(breaker.execute(failingAction)).rejects.toThrow('Downstream Error');
      expect(breaker.state).toBe(CircuitState.CLOSED);
      expect(breaker.failureCount).toBe(i + 1);
    }

    // 3rd failure trips the breaker to OPEN
    await expect(breaker.execute(failingAction)).rejects.toThrow('Downstream Error');
    expect(breaker.state).toBe(CircuitState.OPEN);
  });

  it('should fail-fast in OPEN state without invoking the underlying action', async () => {
    const failingAction = jest.fn().mockRejectedValue(new Error('Downstream Error'));

    for (let i = 0; i < 3; i++) {
      await expect(breaker.execute(failingAction)).rejects.toThrow();
    }
    expect(breaker.state).toBe(CircuitState.OPEN);

    const newAction = jest.fn().mockResolvedValue('should not run');
    await expect(breaker.execute(newAction)).rejects.toThrow('is OPEN');
    expect(newAction).not.toHaveBeenCalled();
  });

  it('should transition from OPEN to HALF_OPEN after resetTimeoutMs', async () => {
    const failingAction = jest.fn().mockRejectedValue(new Error('Downstream Error'));

    for (let i = 0; i < 3; i++) {
      await expect(breaker.execute(failingAction)).rejects.toThrow();
    }
    expect(breaker.state).toBe(CircuitState.OPEN);

    // Wait for reset timeout
    await new Promise((resolve) => setTimeout(resolve, 250));

    const successAction = jest.fn().mockResolvedValue('recovered');
    const result = await breaker.execute(successAction);

    expect(result).toBe('recovered');
    expect(breaker.state).toBe(CircuitState.CLOSED);
    expect(breaker.failureCount).toBe(0);
  });

  it('should trip back to OPEN if execution fails during HALF_OPEN state', async () => {
    const failingAction = jest.fn().mockRejectedValue(new Error('Downstream Error'));

    for (let i = 0; i < 3; i++) {
      await expect(breaker.execute(failingAction)).rejects.toThrow();
    }
    expect(breaker.state).toBe(CircuitState.OPEN);

    // Wait for reset timeout
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Action still fails during HALF_OPEN
    await expect(breaker.execute(failingAction)).rejects.toThrow('Downstream Error');
    expect(breaker.state).toBe(CircuitState.OPEN);
  });

  it('should manually reset to CLOSED when reset() is invoked', () => {
    breaker.state = CircuitState.OPEN;
    breaker.failureCount = 5;

    breaker.reset();

    expect(breaker.state).toBe(CircuitState.CLOSED);
    expect(breaker.failureCount).toBe(0);
  });
});
