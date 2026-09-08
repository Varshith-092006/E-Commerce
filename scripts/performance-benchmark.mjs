import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAccessToken } from '../packages/shared/src/utils/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.GATEWAY_URL || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_SECRET || 'ecom_jwt_secret_dev_2026_test_key_32_chars';
const DURATION_PER_STAGE_MS = parseInt(process.env.BENCHMARK_STAGE_DURATION_MS, 10) || 3000;

// Tokens for protected endpoints
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

const ENDPOINTS = [
  { name: 'GET /api/v1/products', path: '/api/v1/products', service: 'catalog-svc' },
  { name: 'GET /api/v1/products/:id', path: '/api/v1/products/22222222-2222-2222-2222-222222222222', service: 'catalog-svc' },
  { name: 'GET /api/v1/categories', path: '/api/v1/categories', service: 'catalog-svc' },
  { name: 'GET /api/v1/orders', path: '/api/v1/orders', service: 'order-svc', headers: { Authorization: `Bearer ${customerToken}` } },
  { name: 'GET /api/v1/notifications', path: '/api/v1/notifications', service: 'notification-svc', headers: { Authorization: `Bearer ${customerToken}` } },
  { name: 'GET /api/v1/orders/seller/analytics/overview', path: '/api/v1/orders/seller/analytics/overview', service: 'order-svc', headers: { Authorization: `Bearer ${sellerToken}` } },
  { name: 'GET /api/v1/orders/admin/summary', path: '/api/v1/orders/admin/summary', service: 'order-svc', headers: { Authorization: `Bearer ${adminToken}` } },
];

const CONCURRENCY_LEVELS = [5, 10, 25, 50, 75, 100];

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 200,
  maxFreeSockets: 50,
  timeout: 10000,
});

async function queryPrometheusMetric(query) {
  try {
    const res = await fetch(`http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.status === 'success' && data.data?.result?.length > 0) {
      return parseFloat(data.data.result[0].value[1]) || 0;
    }
  } catch {
    // Return fallback if Prometheus is unreachable
  }
  return 0;
}

async function getLiveResourceMetrics() {
  const [cpu, memoryBytes, dbConn, redisClients, kafkaLag] = await Promise.all([
    queryPrometheusMetric('sum(rate(process_cpu_seconds_total[1m])) * 100'),
    queryPrometheusMetric('sum(process_resident_memory_bytes)'),
    queryPrometheusMetric('sum(db_pool_connections_active)'),
    queryPrometheusMetric('sum(redis_connected_clients)'),
    queryPrometheusMetric('sum(kafka_consumer_lag)'),
  ]);

  return {
    cpu: Number(cpu.toFixed(1)),
    memoryMB: Number((memoryBytes / (1024 * 1024)).toFixed(1)),
    dbConnections: Math.round(dbConn),
    redisClients: Math.round(redisClients),
    kafkaLag: Math.round(kafkaLag),
  };
}

function runSingleRequest(endpointUrl, headers) {
  return new Promise((resolve) => {
    const start = process.hrtime();
    const url = new URL(endpointUrl);
    const req = http.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          Connection: 'keep-alive',
          Accept: 'application/json',
          ...headers,
        },
        agent,
        timeout: 5000,
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
          resolve({
            statusCode: res.statusCode,
            durationMs,
            isLoadShed,
            isError: res.statusCode >= 500 && !isLoadShed,
            isRateLimited: res.statusCode === 429,
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
        isError: true,
        isRateLimited: false,
      });
    });

    req.on('error', () => {
      const diff = process.hrtime(start);
      resolve({
        statusCode: 500,
        durationMs: diff[0] * 1000 + diff[1] / 1e6,
        isLoadShed: false,
        isError: true,
        isRateLimited: false,
      });
    });

    req.end();
  });
}

async function runStage(endpoint, concurrency, durationMs) {
  const targetUrl = `${BASE_URL}${endpoint.path}`;
  const latencies = [];
  let successful = 0;
  let errors = 0;
  let count429 = 0;
  let count503 = 0;
  let loadShedCount = 0;

  const endTime = Date.now() + durationMs;

  const worker = async () => {
    while (Date.now() < endTime) {
      const result = await runSingleRequest(targetUrl, endpoint.headers || {});
      latencies.push(result.durationMs);
      if (result.statusCode >= 200 && result.statusCode < 400) {
        successful++;
      } else if (result.isRateLimited) {
        count429++;
      } else if (result.statusCode === 503) {
        count503++;
        if (result.isLoadShed) {
          loadShedCount++;
        }
      } else {
        errors++;
      }
    }
  };

  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  latencies.sort((a, b) => a - b);
  const total = latencies.length;
  const p50 = total > 0 ? latencies[Math.floor(total * 0.5)] : 0;
  const p95 = total > 0 ? latencies[Math.floor(total * 0.95)] : 0;
  const p99 = total > 0 ? latencies[Math.floor(total * 0.99)] : 0;
  const max = total > 0 ? latencies[total - 1] : 0;
  const rps = total / (durationMs / 1000);

  return {
    totalRequests: total,
    successful,
    errors,
    count429,
    count503,
    loadShedCount,
    rps: Number(rps.toFixed(1)),
    p50: Number(p50.toFixed(2)),
    p95: Number(p95.toFixed(2)),
    p99: Number(p99.toFixed(2)),
    maxLatency: Number(max.toFixed(2)),
  };
}

async function main() {
  console.log('========================================================================');
  console.log('PHASE 5: PERFORMANCE BENCHMARK & CAPACITY SUITE');
  console.log('Target Gateway:       ', BASE_URL);
  console.log('Stage Duration:       ', `${DURATION_PER_STAGE_MS}ms per concurrency level`);
  console.log('Tested Concurrencies: ', CONCURRENCY_LEVELS.join(', '));
  console.log('Environment:           Measured in local Docker environment');
  console.log('========================================================================\n');

  const allResults = [];
  const baselineEntries = [];

  for (const endpoint of ENDPOINTS) {
    console.log(`\n▶ Benchmarking: ${endpoint.name}`);
    console.log('------------------------------------------------------------------------');
    console.log('| Conc | Total Req |   RPS   |  P50 (ms) |  P95 (ms) |  P99 (ms) |  Max (ms) | 429 | 503 | Shed |');
    console.log('------------------------------------------------------------------------');

    for (const concurrency of CONCURRENCY_LEVELS) {
      const stats = await runStage(endpoint, concurrency, DURATION_PER_STAGE_MS);
      const resMetrics = await getLiveResourceMetrics();

      console.log(
        `| ${String(concurrency).padStart(4)} | ` +
        `${String(stats.totalRequests).padStart(9)} | ` +
        `${String(stats.rps).padStart(7)} | ` +
        `${String(stats.p50).padStart(9)} | ` +
        `${String(stats.p95).padStart(9)} | ` +
        `${String(stats.p99).padStart(9)} | ` +
        `${String(stats.maxLatency).padStart(9)} | ` +
        `${String(stats.count429).padStart(3)} | ` +
        `${String(stats.count503).padStart(3)} | ` +
        `${String(stats.loadShedCount).padStart(4)} |`
      );

      const record = {
        timestamp: new Date().toISOString(),
        environment: 'local-docker',
        service: endpoint.service,
        endpoint: endpoint.name,
        concurrency,
        requests: stats.totalRequests,
        successful: stats.successful,
        RPS: stats.rps,
        P50: stats.p50,
        P95: stats.p95,
        P99: stats.p99,
        maxLatency: stats.maxLatency,
        errors: stats.errors,
        429: stats.count429,
        503: stats.count503,
        loadShed: stats.loadShedCount,
        CPU: resMetrics.cpu,
        memory: resMetrics.memoryMB,
        dbConnections: resMetrics.dbConnections,
        redisClients: resMetrics.redisClients,
        kafkaLag: resMetrics.kafkaLag,
      };

      allResults.push(record);
      baselineEntries.push(record);

      // Brief 500ms stabilization pause between high concurrency stages
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Save baseline to reports/performance/phase5-baseline.json
  const reportsDir = path.join(__dirname, '..', 'reports', 'performance');
  fs.mkdirSync(reportsDir, { recursive: true });

  const baselinePath = path.join(reportsDir, 'phase5-baseline.json');
  fs.writeFileSync(baselinePath, JSON.stringify(baselineEntries, null, 2), 'utf-8');
  console.log(`\n✔ Baseline successfully stored to: ${baselinePath}`);

  agent.destroy();
}

main().catch((err) => {
  console.error('Fatal error during benchmark:', err);
  agent.destroy();
  process.exit(1);
});
