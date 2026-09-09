# CI Integration Test Hang — Diagnosis and Resolution Report

## 1. Symptom
The GitHub Actions `CI Pipeline` workflow hung indefinitely at the **"Run Integration Tests"** step:
```
CI Pipeline
→ Install Dependencies ✅
→ Generate Prisma Clients ✅
→ Check Formatting & Lint ✅
→ Run Unit Tests ✅
→ Run Integration Tests 🟡 HUNG (15+ hours until cancelled)
→ Build Frontend Applications ⏳
→ Post Setup Node.js ⏳
→ Post Checkout Code ⏳
→ Stop containers ⏳
```

## 2. Duration of Hang
- **Initial Stuck Workflow**: Workflow Run ID `34248536270` on branch `main` ran for **14 hours 39 minutes** before manual cancellation.
- **Hang Behavior**: Individual test assertions passed, but the Jest test runner never terminated or returned exit code 0, blocking all subsequent workflow steps.

## 3. Root Cause
In commit `9c8bfd4`, caching via `getRedisClient()` from `@ecommerce/shared` was introduced to `user-repository.js` in `identity-svc` (as well as other services).

1. In CI, a `redis:7-alpine` container service is provisioned at `localhost:6379`.
2. When `identity-svc` integration tests run (`services/identity-svc/tests/integration/auth-routes.test.js`), `createApp()` invokes `UserRepository`, which instantiates `CacheService` and calls `getRedisClient('redis://localhost:6379')`.
3. `ioredis` establishes a persistent TCP connection to `localhost:6379`.
4. Integration tests run with `--runInBand` in the main Node.js process:
   ```json
   "test:integration": "node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathPattern=\"tests/integration\" --passWithNoTests --runInBand"
   ```
5. Jest waits for Node's event loop to drain. Because neither the test suite nor `@ecommerce/shared` provided a teardown hook to close the shared Redis client, `ioredis` kept active TCP sockets and internal reconnect/heartbeat timers open.
6. Node.js never drained its event loop, producing the Jest warning:
   `Jest did not exit one second after the test run has completed.`
   And the test process hung indefinitely waiting for the socket to close.

### Why Local Tests Appeared to Pass
Locally, `.env` defined `REDIS_URL=redis://redis:6379`. On host machines outside Docker networks, the hostname `redis` fails DNS resolution (`ENOTFOUND`) and fails fast without keeping an active connected TCP socket open. However, when tested locally against `redis://localhost:6379` (matching CI container networking), the exact same hang was 100% reproducible.

## 4. Evidence
- **Active Handles Inspection**: Running Jest with `--detectOpenHandles` and inspecting Node active handles via `process._getActiveHandles()` revealed:
  - An active `Socket` TCP connection to `::1:6379` owned by `ioredis`'s event loop.
- **Commit History**: Commit `9c8bfd4` modified `user-repository.js` to add `this.cache = new CacheService(...)` which calls `getRedisClient()`.
- **Workflow Configuration**: `.github/workflows/ci.yml` exposes Redis port `6379:6379` and runs integration tests with `--runInBand`.
- **Reproduction**: Simulating CI environment variables (`REDIS_URL=redis://localhost:6379`) caused `auth-routes.test.js` to hang indefinitely after test completion.

## 5. Files Involved
- `packages/shared/src/utils/redis.js`: Missing graceful connection termination and reference cleanup function `closeRedisClient()`.
- `services/gateway/src/lib/redis.js`: Missing `closeRedisClient()` for gateway's isolated Redis client.
- `tests/setup/jest.teardown.js` (NEW): Global test teardown hook in Jest `setupFilesAfterEnv` ensuring any opened Redis connection is cleanly closed after each test suite.
- `jest.config.cjs`: Configured `setupFilesAfterEnv` to automatically load `tests/setup/jest.teardown.js`.
- `services/identity-svc/tests/integration/auth-routes.test.js`: Added explicit `afterAll` hook to close Redis client and disconnect Prisma client cleanly.
- `packages/shared/tests/unit/redis-lifecycle.test.js` (NEW): Regression tests for Redis lifecycle management.

## 6. Minimal Fix
1. **Added `closeRedisClient()` to `@ecommerce/shared`**:
   - Safely calls `client.quit()` or falls back to `client.disconnect()`.
   - Clears `sharedRedisClient = null` so subsequent tests can reinitialize clean clients.
2. **Added `setupFilesAfterEnv` teardown hook**:
   - Registered `tests/setup/jest.teardown.js` in `jest.config.cjs` so that regardless of test execution order, active Redis connections are terminated when test suites complete.
3. **Explicit Teardown in `auth-routes.test.js`**:
   - Added `afterAll` hook closing Redis client and invoking `prisma.$disconnect()`.
4. **No `--forceExit` Band-aid**:
   - The root cause (unclosed TCP socket) was fixed cleanly at the resource lifecycle level without using `--forceExit` or altering business logic.

## 7. Local Verification
- **Unit Tests**:
  - Command: `npm run test:unit`
  - Result: 71 passed, 71 total suites; 651 passed, 651 total tests (Duration: 76.37 s)
  - Exit Code: 0 (clean natural exit)
- **Integration Tests**:
  - Command: `npm run test:integration`
  - Result: 36 passed, 36 total suites; 152 passed, 152 total tests (Duration: 96.34 s)
  - Exit Code: 0 (clean natural exit, no open handle warnings)
- **Code Quality**:
  - `npm run lint`: PASSED (0 errors, 0 warnings)
  - `npm run format:check`: PASSED (All files match Prettier code style)
- **Docker Containers**:
  - `docker compose ps`: All 21 services running and healthy.

## 8. CI Verification
- Workflow triggered via push to `main`.
- Monitored workflow execution across all steps:
  - Install Dependencies: Passed
  - Generate Prisma Clients: Passed
  - Check Formatting & Lint: Passed
  - Run Unit Tests: Passed
  - Run Integration Tests: Passed (terminated cleanly, no hang)
  - Build Frontend Applications: Passed
  - Stop containers: Cleanly stopped

## 9. Exact Final Test Counts
- **Unit Test Suites**: 71 passed, 71 total
- **Unit Tests**: 651 passed, 651 total
- **Integration Test Suites**: 36 passed, 36 total
- **Integration Tests**: 152 passed, 152 total
- **Total Test Suites**: 107 passed, 107 total
- **Total Tests**: 803 passed, 803 total

## 10. Final Runtime
- **Local Unit Tests**: ~76 s
- **Local Integration Tests**: ~96 s
- **Local Total Test Time**: ~172 s

## 11. Any Remaining Limitations
- None. Redis connection handles are now deterministically released after test suites complete, eliminating socket leaks while preserving full test fidelity and application behavior.
