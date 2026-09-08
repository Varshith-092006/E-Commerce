#!/usr/bin/env node

/**
 * Phase 6 Unified Load Testing Engine
 *
 * Supports:
 * - Configurable concurrency (-c / --concurrency)
 * - Configurable duration (-d / --duration in seconds)
 * - Configurable target rate (-r / --rate in RPS)
 * - Controlled workloads A through G (Catalog, Detail, Orders, Notifications, Analytics, Admin, Mixed)
 * - HTTP Keep-Alive & pooled sockets
 * - Rotating virtual client IPs (X-Forwarded-For)
 * - Authenticated identities (CUSTOMER, SELLER, ADMIN)
 * - Prometheus live resource sampling
 * - Percentiles (P50, P90, P95, P99, Max)
 * - Graceful SIGINT/SIGTERM shutdown
 * - JSON and CSV reporting
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAccessToken } from '../packages/shared/src/utils/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Environment & Defaults ──────────────────────────────────────────────────
const DEFAULT_GATEWAY = process.env.GATEWAY_URL || 'http://localhost:4000';
const DEFAULT_PROMETHEUS = process.env.PROMETHEUS_URL || 'http://localhost:9090';
const JWT_SECRET = process.env.JWT_SECRET || 'ecom_jwt_secret_dev_2026_test_key_32_chars';

// Pre-generated JWT tokens with matching roles
const customerToken = generateAccessToken(
  { id: '55555555-5555-5555-5555-555555555555', userId: '55555555-5555-5555-5555-555555555555', role: 'CUSTOMER' },
  JWT_SECRET
);
const sellerToken = generateAccessToken(
  { id: '33333333-3333-3333-3333-333333333333', userId: '33333333-3333-3333-3333-333333333333', role: 'SELLER', sellerId: '33333333-3333-3333-3333-333333333333' },
  JWT_SECRET
);
const adminToken = generateAccessToken(
  { id: '99999999-9999-9999-9999-999999999999', userId: '99999999-9999-9999-9999-999999999999', role: 'ADMIN' },
  JWT_SECRET
);

// Workload specifications
export const WORKLOAD_DEFS = {
  A: {
    id: 'A',
    name: 'CATALOG READ',
    method: 'GET',
    path: '/api/v1/products',
    headers: {},
  },
  B: {
    id: 'B',
    name: 'PRODUCT DETAIL',
    method: 'GET',
    path: '/api/v1/products/22222222-2222-2222-2222-222222222222',
    headers: {},
  },
  C: {
    id: 'C',
    name: 'ORDER READ',
    method: 'GET',
    path: '/api/v1/orders',
    headers: { Authorization: `Bearer ${customerToken}` },
  },
  D: {
    id: 'D',
    name: 'NOTIFICATION READ',
    method: 'GET',
    path: '/api/v1/notifications',
    headers: { Authorization: `Bearer ${customerToken}` },
  },
  E: {
    id: 'E',
    name: 'SELLER ANALYTICS',
    method: 'GET',
    path: '/api/v1/orders/seller/analytics/overview',
    headers: { Authorization: `Bearer ${sellerToken}` },
  },
  F: {
    id: 'F',
    name: 'ADMIN SUMMARY',
    method: 'GET',
    path: '/api/v1/orders/admin/summary',
    headers: { Authorization: `Bearer ${adminToken}` },
  },
};

// Mixed workload distribution: 40% A, 15% B, 15% C, 10% D, 10% E, 10% F
export const MIXED_DISTRIBUTION = [
  ...Array(40).fill(WORKLOAD_DEFS.A),
  ...Array(15).fill(WORKLOAD_DEFS.B),
  ...Array(15).fill(WORKLOAD_DEFS.C),
  ...Array(10).fill(WORKLOAD_DEFS.D),
  ...Array(10).fill(WORKLOAD_DEFS.E),
  ...Array(10).fill(WORKLOAD_DEFS.F),
];

// Parse CLI Arguments
export function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    concurrency: 25,
    duration: 10,
    rate: null,
    workload: 'G',
    endpoint: null,
    gateway: DEFAULT_GATEWAY,
    prometheus: DEFAULT_PROMETHEUS,
    outputJson: null,
    outputCsv: null,
    rotateIps: true,
    keepAlive: true,
    silent: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-c' || arg === '--concurrency') {
      options.concurrency = parseInt(argv[++i], 10) || 25;
    } else if (arg === '-d' || arg === '--duration') {
      options.duration = parseInt(argv[++i], 10) || 10;
    } else if (arg === '-r' || arg === '--rate') {
      options.rate = parseFloat(argv[++i]) || null;
    } else if (arg === '--workload') {
      options.workload = (argv[++i] || 'G').toUpperCase();
    } else if (arg === '--endpoint') {
      options.endpoint = argv[++i];
    } else if (arg === '--gateway') {
      options.gateway = argv[++i];
    } else if (arg === '--prometheus') {
      options.prometheus = argv[++i];
    } else if (arg === '--output-json') {
      options.outputJson = argv[++i];
    } else if (arg === '--output-csv') {
      options.outputCsv = argv[++i];
    } else if (arg === '--no-ip-rotation') {
      options.rotateIps = false;
    } else if (arg === '--no-keep-alive') {
      options.keepAlive = false;
    } else if (arg === '--silent') {
      options.silent = true;
    }
  }

  return options;
}

// ─── Prometheus Metrics Helper ────────────────────────────────────────────────
export async function queryPrometheusMetric(prometheusUrl, query) {
  try {
    const res = await fetch(`${prometheusUrl}/api/v1/query?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.status === 'success' && data.data?.result?.length > 0) {
      return parseFloat(data.data.result[0].value[1]) || 0;
    }
  } catch {
    // Prometheus query failed
  }
  return 0;
}

export async function collectResourceTelemetry(prometheusUrl = DEFAULT_PROMETHEUS) {
  try {
    const [cpu, memoryBytes, dbConn, redisClients, kafkaLag, eventLoopLag] = await Promise.all([
      queryPrometheusMetric(prometheusUrl, 'sum(rate(process_cpu_seconds_total[1m])) * 100'),
      queryPrometheusMetric(prometheusUrl, 'sum(process_resident_memory_bytes)'),
      queryPrometheusMetric(prometheusUrl, 'sum(db_pool_connections_active)'),
      queryPrometheusMetric(prometheusUrl, 'sum(redis_connected_clients)'),
      queryPrometheusMetric(prometheusUrl, 'sum(kafka_consumer_lag)'),
      queryPrometheusMetric(prometheusUrl, 'avg(nodejs_eventloop_lag_seconds) * 1000'),
    ]);

    return {
      cpu: Number(cpu.toFixed(1)),
      memoryMB: Number((memoryBytes / (1024 * 1024)).toFixed(1)),
      dbConnections: Math.round(dbConn),
      redisClients: Math.round(redisClients),
      kafkaLag: Math.round(kafkaLag),
      eventLoopLagMs: Number(eventLoopLag.toFixed(2)),
    };
  } catch {
    return {
      cpu: 0,
      memoryMB: 0,
      dbConnections: 0,
      redisClients: 0,
      kafkaLag: 0,
      eventLoopLagMs: 0,
    };
  }
}

// ─── Latency Percentiles Calculation ──────────────────────────────────────────
export function calculatePercentiles(latencies) {
  if (!latencies || latencies.length === 0) {
    return { p50: 0, p90: 0, p95: 0, p99: 0, min: 0, max: 0, avg: 0 };
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);

  const pick = (pct) => {
    const idx = Math.min(Math.floor(sorted.length * pct), sorted.length - 1);
    return Number(sorted[idx].toFixed(2));
  };

  return {
    p50: pick(0.50),
    p90: pick(0.90),
    p95: pick(0.95),
    p99: pick(0.99),
    min: Number(sorted[0].toFixed(2)),
    max: Number(sorted[sorted.length - 1].toFixed(2)),
    avg: Number((sum / sorted.length).toFixed(2)),
  };
}

// ─── HTTP Request Dispatcher ──────────────────────────────────────────────────
function executeRequest({ gatewayUrl, target, virtualIp, agent, timeoutMs = 8000 }) {
  return new Promise((resolve) => {
    const start = process.hrtime();
    const url = new URL(`${gatewayUrl}${target.path}`);

    const reqHeaders = {
      Connection: agent ? 'keep-alive' : 'close',
      Accept: 'application/json',
      ...target.headers,
    };

    if (virtualIp) {
      reqHeaders['X-Forwarded-For'] = virtualIp;
    }

    const req = http.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: target.method || 'GET',
        headers: reqHeaders,
        agent,
        timeout: timeoutMs,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const diff = process.hrtime(start);
          const durationMs = diff[0] * 1000 + diff[1] / 1e6;
          const isLoadShed = res.statusCode === 503 && body.includes('OVERLOAD_LOAD_SHED');
          const isRateLimited = res.statusCode === 429;

          resolve({
            statusCode: res.statusCode,
            durationMs,
            isLoadShed,
            isRateLimited,
            is2xx: res.statusCode >= 200 && res.statusCode < 300,
            is4xx: res.statusCode >= 400 && res.statusCode < 500 && !isRateLimited,
            is5xx: res.statusCode >= 500 && !isLoadShed,
            isSuccess: res.statusCode >= 200 && res.statusCode < 400,
          });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      const diff = process.hrtime(start);
      resolve({
        statusCode: 504,
        durationMs: diff[0] * 1000 + diff[1] / 1e6,
        isLoadShed: false,
        isRateLimited: false,
        is2xx: false,
        is4xx: false,
        is5xx: true,
        isSuccess: false,
        error: 'TIMEOUT',
      });
    });

    req.on('error', (err) => {
      const diff = process.hrtime(start);
      resolve({
        statusCode: 500,
        durationMs: diff[0] * 1000 + diff[1] / 1e6,
        isLoadShed: false,
        isRateLimited: false,
        is2xx: false,
        is4xx: false,
        is5xx: true,
        isSuccess: false,
        error: err.code || err.message,
      });
    });

    if (target.body) {
      req.write(typeof target.body === 'string' ? target.body : JSON.stringify(target.body));
    }
    req.end();
  });
}

// ─── Main Load Test Runner ────────────────────────────────────────────────────
export async function runLoadTest(options) {
  const {
    concurrency = 25,
    duration = 10,
    rate = null,
    workload = 'G',
    endpoint = null,
    gateway = DEFAULT_GATEWAY,
    prometheus = DEFAULT_PROMETHEUS,
    rotateIps = true,
    keepAlive = true,
    silent = false,
  } = options;

  let isInterrupted = false;
  const onSignal = () => {
    if (!silent) console.log('\n⚠ Signal received, initiating graceful load test shutdown...');
    isInterrupted = true;
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);

  // Setup HTTP Agent
  const agent = keepAlive
    ? new http.Agent({
        keepAlive: true,
        maxSockets: Math.max(300, concurrency * 4),
        maxFreeSockets: 100,
        timeout: 10000,
      })
    : false;

  // Resolve target workload items
  let targetGenerator;
  if (endpoint) {
    const customTarget = {
      id: 'CUSTOM',
      name: endpoint,
      method: 'GET',
      path: endpoint,
      headers: endpoint.includes('/orders') || endpoint.includes('/notifications')
        ? { Authorization: `Bearer ${customerToken}` }
        : {},
    };
    targetGenerator = () => customTarget;
  } else if (workload === 'G') {
    let mixedIdx = 0;
    targetGenerator = () => {
      const item = MIXED_DISTRIBUTION[mixedIdx % MIXED_DISTRIBUTION.length];
      mixedIdx++;
      return item;
    };
  } else if (WORKLOAD_DEFS[workload]) {
    const staticTarget = WORKLOAD_DEFS[workload];
    targetGenerator = () => staticTarget;
  } else {
    throw new Error(`Unknown workload '${workload}'. Valid choices: A, B, C, D, E, F, G`);
  }

  // Pre-test resource baseline
  const startTelemetry = await collectResourceTelemetry(prometheus);

  if (!silent) {
    console.log('────────────────────────────────────────────────────────────────────────');
    console.log(`▶ Starting Load Test: Workload ${workload} (${endpoint || WORKLOAD_DEFS[workload]?.name || 'Mixed'})`);
    console.log(`  Concurrency: ${concurrency} | Duration: ${duration}s | Target RPS: ${rate ? rate : 'Uncapped'}`);
    console.log(`  IP Rotation: ${rotateIps} | Keep-Alive: ${keepAlive} | Target: ${gateway}`);
    console.log(`  Start Telemetry: CPU ${startTelemetry.cpu}% | Mem ${startTelemetry.memoryMB}MB | DB ${startTelemetry.dbConnections} | Redis ${startTelemetry.redisClients} | Lag ${startTelemetry.kafkaLag}`);
    console.log('────────────────────────────────────────────────────────────────────────');
  }

  // Tracking metrics
  const latencies = [];
  let totalRequests = 0;
  let count2xx = 0;
  let count4xx = 0;
  let count429 = 0;
  let count5xx = 0;
  let count503 = 0;
  let loadShedCount = 0;
  let errors = 0;

  const testStartTime = Date.now();
  const testEndTime = testStartTime + duration * 1000;

  // Pacing interval if rate is specified
  const delayBetweenRequestsMs = rate ? Math.max(0, (concurrency * 1000) / rate) : 0;

  // Worker loop
  const runWorker = async (workerId) => {
    let localReqId = 0;
    while (Date.now() < testEndTime && !isInterrupted) {
      localReqId++;
      totalRequests++;

      const target = targetGenerator();
      const virtualIp = rotateIps
        ? `10.${workerId % 250}.${Math.floor(localReqId / 50) % 250}.${(localReqId % 250) + 1}`
        : '10.0.0.1';

      const res = await executeRequest({
        gatewayUrl: gateway,
        target,
        virtualIp,
        agent,
      });

      latencies.push(res.durationMs);

      if (res.is2xx) {
        count2xx++;
      } else if (res.isRateLimited) {
        count429++;
      } else if (res.isLoadShed) {
        count503++;
        loadShedCount++;
      } else if (res.statusCode === 503) {
        count503++;
      } else if (res.is4xx) {
        count4xx++;
      } else if (res.is5xx) {
        count5xx++;
      } else {
        errors++;
      }

      if (delayBetweenRequestsMs > 0) {
        await new Promise((r) => setTimeout(r, delayBetweenRequestsMs));
      }
    }
  };

  // Launch concurrent workers
  const workerPromises = [];
  for (let i = 0; i < concurrency; i++) {
    workerPromises.push(runWorker(i + 1));
  }
  await Promise.all(workerPromises);

  const actualDurationMs = Date.now() - testStartTime;
  const actualDurationSec = actualDurationMs / 1000;

  // Cleanup agent
  if (agent && agent.destroy) {
    agent.destroy();
  }
  process.removeListener('SIGINT', onSignal);
  process.removeListener('SIGTERM', onSignal);

  // Post-test resource telemetry
  const endTelemetry = await collectResourceTelemetry(prometheus);

  // Metrics summary
  const percentiles = calculatePercentiles(latencies);
  const successfulRequests = count2xx;
  const failedRequests = count4xx + count429 + count5xx + count503 + errors;
  const actualRPS = Number((totalRequests / actualDurationSec).toFixed(1));
  const errorPercentage = totalRequests > 0
    ? Number((((count5xx + errors) / totalRequests) * 100).toFixed(2))
    : 0;

  const results = {
    timestamp: new Date().toISOString(),
    environment: 'local-docker',
    workload,
    endpoint: endpoint || (WORKLOAD_DEFS[workload]?.path || 'mixed'),
    concurrency,
    configuredDurationSec: duration,
    actualDurationSec: Number(actualDurationSec.toFixed(2)),
    requests: totalRequests,
    successful: successfulRequests,
    failed: failedRequests,
    '2xx': count2xx,
    '4xx': count4xx,
    '429': count429,
    '503': count503,
    '5xx': count5xx,
    errors,
    loadShed: loadShedCount,
    RPS: actualRPS,
    P50: percentiles.p50,
    P90: percentiles.p90,
    P95: percentiles.p95,
    P99: percentiles.p99,
    minLatency: percentiles.min,
    maxLatency: percentiles.max,
    avgLatency: percentiles.avg,
    errorPercentage,
    telemetry: {
      start: startTelemetry,
      end: endTelemetry,
      delta: {
        cpuDelta: Number((endTelemetry.cpu - startTelemetry.cpu).toFixed(1)),
        memoryDeltaMB: Number((endTelemetry.memoryMB - startTelemetry.memoryMB).toFixed(1)),
        dbConnectionsPeak: Math.max(startTelemetry.dbConnections, endTelemetry.dbConnections),
        redisClientsPeak: Math.max(startTelemetry.redisClients, endTelemetry.redisClients),
        kafkaLagPeak: Math.max(startTelemetry.kafkaLag, endTelemetry.kafkaLag),
      },
    },
    // Flattened resource values for easy table consumption
    CPU: endTelemetry.cpu,
    memory: endTelemetry.memoryMB,
    dbConnections: endTelemetry.dbConnections,
    redisClients: endTelemetry.redisClients,
    kafkaLag: endTelemetry.kafkaLag,
    eventLoopLagMs: endTelemetry.eventLoopLagMs,
  };

  if (!silent) {
    console.log('────────────────────────────────────────────────────────────────────────');
    console.log(`✔ Completed in ${results.actualDurationSec}s:`);
    console.log(`  Requests: ${results.requests} | RPS: ${results.RPS} | Error %: ${results.errorPercentage}%`);
    console.log(`  2xx: ${results['2xx']} | 429: ${results['429']} | 503: ${results['503']} | LoadShed: ${results.loadShed}`);
    console.log(`  P50: ${results.P50}ms | P90: ${results.P90}ms | P95: ${results.P95}ms | P99: ${results.P99}ms | Max: ${results.maxLatency}ms`);
    console.log(`  CPU: ${results.CPU}% | Memory: ${results.memory}MB | DB Conn: ${results.dbConnections} | Redis Clients: ${results.redisClients} | Lag: ${results.kafkaLag}`);
    console.log('────────────────────────────────────────────────────────────────────────\n');
  }

  // Export JSON if requested
  if (options.outputJson) {
    const outDir = path.dirname(options.outputJson);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(options.outputJson, JSON.stringify(results, null, 2));
    if (!silent) console.log(`Saved JSON results to ${options.outputJson}`);
  }

  // Export CSV if requested
  if (options.outputCsv) {
    const outDir = path.dirname(options.outputCsv);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const headers = [
      'timestamp',
      'workload',
      'concurrency',
      'durationSec',
      'requests',
      'RPS',
      'P50',
      'P90',
      'P95',
      'P99',
      'maxLatency',
      '2xx',
      '4xx',
      '429',
      '503',
      '5xx',
      'loadShed',
      'errorPercentage',
      'CPU',
      'memoryMB',
      'dbConnections',
      'redisClients',
      'kafkaLag',
    ];
    const row = [
      results.timestamp,
      results.workload,
      results.concurrency,
      results.actualDurationSec,
      results.requests,
      results.RPS,
      results.P50,
      results.P90,
      results.P95,
      results.P99,
      results.maxLatency,
      results['2xx'],
      results['4xx'],
      results['429'],
      results['503'],
      results['5xx'],
      results.loadShed,
      results.errorPercentage,
      results.CPU,
      results.memory,
      results.dbConnections,
      results.redisClients,
      results.kafkaLag,
    ];
    const csvContent = `${headers.join(',')}\n${row.join(',')}\n`;
    fs.writeFileSync(options.outputCsv, csvContent);
    if (!silent) console.log(`Saved CSV results to ${options.outputCsv}`);
  }

  return results;
}

// Direct CLI invocation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArgs();
  runLoadTest(options).catch((err) => {
    console.error('❌ Load test failed:', err);
    process.exit(1);
  });
}
