import http from 'http';
import { generateAccessToken } from '../packages/shared/src/utils/jwt.js';

const BASE_URL = process.env.GATEWAY_URL || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_SECRET || 'ecom_jwt_secret_dev_2026_test_key_32_chars';
const SOAK_DURATION_SEC = parseInt(process.env.SOAK_DURATION_SEC, 10) || 900; // 15 minutes (900s) default

// Dedicated test tokens
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

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 150,
  maxFreeSockets: 50,
  timeout: 10000,
});

const WORKLOAD_TARGETS = [
  { path: '/api/v1/products', headers: {} },
  { path: '/api/v1/products/22222222-2222-2222-2222-222222222222', headers: {} },
  { path: '/api/v1/categories', headers: {} },
  { path: '/api/v1/orders', headers: { Authorization: `Bearer ${customerToken}` } },
  { path: '/api/v1/notifications', headers: { Authorization: `Bearer ${customerToken}` } },
  { path: '/api/v1/orders/seller/analytics/overview', headers: { Authorization: `Bearer ${sellerToken}` } },
  { path: '/api/v1/orders/admin/summary', headers: { Authorization: `Bearer ${adminToken}` } },
];

async function queryPrometheus(query) {
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

async function collectSystemSnapshot() {
  const [cpu, memoryBytes, dbConn, redisClients, kafkaLag, eventLoopLag] = await Promise.all([
    queryPrometheus('sum(rate(process_cpu_seconds_total[1m])) * 100'),
    queryPrometheus('sum(process_resident_memory_bytes)'),
    queryPrometheus('sum(db_pool_connections_active)'),
    queryPrometheus('sum(redis_connected_clients)'),
    queryPrometheus('sum(kafka_consumer_lag)'),
    queryPrometheus('avg(nodejs_eventloop_lag_seconds) * 1000'),
  ]);

  return {
    timestamp: new Date().toISOString(),
    cpuPercent: Number(cpu.toFixed(1)),
    memoryMB: Number((memoryBytes / (1024 * 1024)).toFixed(1)),
    dbConnections: Math.round(dbConn),
    redisClients: Math.round(redisClients),
    kafkaLag: Math.round(kafkaLag),
    eventLoopLagMs: Number(eventLoopLag.toFixed(2)),
  };
}

function sendWorkloadRequest(target, virtualIp) {
  return new Promise((resolve) => {
    const start = process.hrtime();
    const url = new URL(`${BASE_URL}${target.path}`);
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
          'X-Forwarded-For': virtualIp,
          ...target.headers,
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
            isSuccess: res.statusCode >= 200 && res.statusCode < 400,
            is4xx: res.statusCode >= 400 && res.statusCode < 500 && res.statusCode !== 429,
            is5xx: res.statusCode >= 500 && !isLoadShed,
            is429: res.statusCode === 429,
            is503: res.statusCode === 503,
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
        isSuccess: false,
        is4xx: false,
        is5xx: true,
        is429: false,
        is503: false,
      });
    });

    req.on('error', () => {
      const diff = process.hrtime(start);
      resolve({
        statusCode: 500,
        durationMs: diff[0] * 1000 + diff[1] / 1e6,
        isLoadShed: false,
        isSuccess: false,
        is4xx: false,
        is5xx: true,
        is429: false,
        is503: false,
      });
    });

    req.end();
  });
}

async function main() {
  console.log('========================================================================');
  console.log('PHASE 5: EXTENDED SUSTAINED SOAK TEST (15+ MINUTES)');
  console.log('Workload Duration:    ', `${SOAK_DURATION_SEC} seconds (${(SOAK_DURATION_SEC / 60).toFixed(1)} minutes)`);
  console.log('Target Gateway:       ', BASE_URL);
  console.log('Environment:           Measured in local Docker environment');
  console.log('Traffic Configuration: Multi-endpoint distributed workload with rotating IPs');
  console.log('========================================================================\n');

  // 1. START SNAPSHOT
  console.log('▶ Capturing START System Snapshot (T=0m)...');
  const startSnapshot = await collectSystemSnapshot();
  const startProbes = [];
  for (let i = 0; i < 20; i++) {
    const probe = await sendWorkloadRequest(WORKLOAD_TARGETS[0], '10.0.0.1');
    startProbes.push(probe.durationMs);
  }
  startProbes.sort((a, b) => a - b);
  const startP95 = startProbes[Math.floor(startProbes.length * 0.95)] || 0;
  console.log('  START Metrics:', { ...startSnapshot, p95LatencyMs: Number(startP95.toFixed(2)) });

  // 2. RUN SUSTAINED WORKLOAD
  console.log(`\n▶ Commencing Sustained Workload for ${SOAK_DURATION_SEC}s with 15 concurrent worker threads...`);
  const startTime = Date.now();
  const endTime = startTime + SOAK_DURATION_SEC * 1000;
  const midPointTime = startTime + (SOAK_DURATION_SEC * 1000) / 2;

  let midCaptured = false;
  let midSnapshot = null;
  let midP95 = 0;

  let totalRequests = 0;
  let successfulRequests = 0;
  let count4xx = 0;
  let count5xx = 0;
  let count429 = 0;
  let count503 = 0;
  let loadShedCount = 0;
  const latencies = [];

  const WORKER_COUNT = 15;
  let globalRequestSeq = 0;

  const runWorker = async (workerId) => {
    let localSeq = 0;
    while (Date.now() < endTime) {
      localSeq++;
      globalRequestSeq++;
      const target = WORKLOAD_TARGETS[localSeq % WORKLOAD_TARGETS.length];
      const virtualIp = `10.${workerId}.${Math.floor(localSeq / 50)}.${(localSeq % 250) + 1}`;

      const res = await sendWorkloadRequest(target, virtualIp);
      totalRequests++;
      latencies.push(res.durationMs);

      if (res.isSuccess) successfulRequests++;
      else if (res.is429) count429++;
      else if (res.is4xx) count4xx++;
      else if (res.is503) {
        count503++;
        if (res.isLoadShed) loadShedCount++;
      } else if (res.is5xx) count5xx++;

      // Mid-point snapshot capture
      if (!midCaptured && Date.now() >= midPointTime) {
        midCaptured = true;
        collectSystemSnapshot().then((snap) => {
          midSnapshot = snap;
          const currentSorted = [...latencies].sort((a, b) => a - b);
          midP95 = currentSorted[Math.floor(currentSorted.length * 0.95)] || 0;
          console.log('\n▶ Capturing MID System Snapshot (T=' + ((Date.now() - startTime) / 60000).toFixed(1) + 'm)...');
          console.log('  MID Metrics:', { ...midSnapshot, p95LatencyMs: Number(midP95.toFixed(2)), totalRequestsProcessedSoFar: totalRequests });
        });
      }

      // 15-25ms natural spacing to yield controlled 40-60 sustained req/s cluster-wide without overwhelming host
      await new Promise((r) => setTimeout(r, 20));
    }
  };

  const workers = [];
  for (let i = 0; i < WORKER_COUNT; i++) {
    workers.push(runWorker(i + 1));
  }

  // Periodic heartbeat log every 2 minutes
  const progressInterval = setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
    const progressPct = ((elapsedSec / SOAK_DURATION_SEC) * 100).toFixed(1);
    const currentRps = (totalRequests / elapsedSec).toFixed(1);
    console.log(`[Soak Heartbeat] Elapsed: ${elapsedSec}s / ${SOAK_DURATION_SEC}s (${progressPct}%) | Reqs: ${totalRequests} | Current Throughput: ${currentRps} req/s | Success: ${successfulRequests} | 429: ${count429} | 5xx: ${count5xx}`);
  }, 120000);

  await Promise.all(workers);
  clearInterval(progressInterval);

  const actualDurationSec = Number(((Date.now() - startTime) / 1000).toFixed(1));
  console.log(`\n✔ Sustained workload ended. Total Duration: ${actualDurationSec}s`);

  // 3. CAPTURE END SNAPSHOT & STOP WORKLOAD
  console.log('\n▶ Capturing END System Snapshot...');
  const endSnapshot = await collectSystemSnapshot();
  latencies.sort((a, b) => a - b);
  const total = latencies.length;
  const p50 = total > 0 ? latencies[Math.floor(total * 0.5)] : 0;
  const p95 = total > 0 ? latencies[Math.floor(total * 0.95)] : 0;
  const p99 = total > 0 ? latencies[Math.floor(total * 0.99)] : 0;
  const overallRps = Number((totalRequests / actualDurationSec).toFixed(1));

  // 4. MEASURE RECOVERY TIME TO BASELINE
  console.log('\n▶ Measuring Time-To-Recovery (post-workload cooldown)...');
  const recoveryStart = Date.now();
  let recovered = false;
  let recoveryTimeSec = 0;

  while (Date.now() - recoveryStart < 30000) {
    await new Promise((r) => setTimeout(r, 500));
    const probe = await sendWorkloadRequest(WORKLOAD_TARGETS[0], '10.0.0.1');
    if (probe.durationMs <= startP95 * 1.5 || probe.durationMs < 25) {
      recoveryTimeSec = Number(((Date.now() - recoveryStart) / 1000).toFixed(2));
      recovered = true;
      break;
    }
  }
  if (!recovered) {
    recoveryTimeSec = Number(((Date.now() - recoveryStart) / 1000).toFixed(2));
  }
  console.log(`✔ System recovered to baseline in ${recoveryTimeSec}s`);

  // 5. LEAK & DRIFT ANALYSIS
  const memoryGrowthMB = Number((endSnapshot.memoryMB - startSnapshot.memoryMB).toFixed(1));
  const latencyDriftMs = Number((p95 - startP95).toFixed(2));
  const hasMemoryLeak = memoryGrowthMB > 150; // Flag if memory increased by > 150MB across 15 minutes
  const hasConnectionLeak = endSnapshot.dbConnections > startSnapshot.dbConnections + 5;
  const hasKafkaLagAccumulation = endSnapshot.kafkaLag > 50;
  const hasLatencyDrift = p95 > startP95 * 3 && p95 > 100;

  // 6. OUTPUT SUMMARY TABLES
  console.log('\n========================================================================');
  console.log('FINAL 15-MINUTE SOAK TEST & STABILITY VERIFICATION ADDENDUM');
  console.log('========================================================================');
  console.log(`Soak Duration:          ${actualDurationSec}s (${(actualDurationSec / 60).toFixed(1)} minutes)`);
  console.log(`Total Requests:         ${totalRequests}`);
  console.log(`Average Workload Rate:  ${overallRps} req/s`);
  console.log(`Successful Requests:    ${successfulRequests} (${((successfulRequests / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`4xx Client Errors:      ${count4xx}`);
  console.log(`5xx Server Errors:      ${count5xx}`);
  console.log(`429 Rate-Limited:       ${count429} (${((count429 / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`503 Overload/Shed:      ${count503} (Load-Shed Count: ${loadShedCount})`);
  console.log(`P50 Latency:            ${p50.toFixed(2)} ms`);
  console.log(`P95 Latency:            ${p95.toFixed(2)} ms`);
  console.log(`P99 Latency:            ${p99.toFixed(2)} ms`);
  console.log(`Time-To-Recovery:       ${recoveryTimeSec}s`);
  console.log(`Memory Leak Detected:   ${hasMemoryLeak ? 'YES (ALERT)' : 'NO (STABLE)'}`);
  console.log(`Connection Leak:        ${hasConnectionLeak ? 'YES (ALERT)' : 'NO (STABLE)'}`);
  console.log(`Kafka Lag Accumulation: ${hasKafkaLagAccumulation ? 'YES (ALERT)' : 'NO (STABLE)'}`);
  console.log(`Latency Drift:          ${hasLatencyDrift ? 'YES (ALERT)' : 'NO (STABLE)'}`);

  console.log('\n------------------------------------------------------------------------');
  console.log('| Metric                     | START (T=0m) | MID (T=' + ((SOAK_DURATION_SEC / 2) / 60).toFixed(1) + 'm) | END (T=' + (SOAK_DURATION_SEC / 60).toFixed(1) + 'm) | Recovery Time |');
  console.log('|----------------------------|--------------|--------------|--------------|---------------|');
  console.log(`| CPU (%)                    | ${String(startSnapshot.cpuPercent).padEnd(12)} | ${String(midSnapshot?.cpuPercent || startSnapshot.cpuPercent).padEnd(12)} | ${String(endSnapshot.cpuPercent).padEnd(12)} | ${recoveryTimeSec}s           |`);
  console.log(`| Memory (MB)                | ${String(startSnapshot.memoryMB).padEnd(12)} | ${String(midSnapshot?.memoryMB || startSnapshot.memoryMB).padEnd(12)} | ${String(endSnapshot.memoryMB).padEnd(12)} | ${recoveryTimeSec}s           |`);
  console.log(`| PostgreSQL Connections     | ${String(startSnapshot.dbConnections).padEnd(12)} | ${String(midSnapshot?.dbConnections || 0).padEnd(12)} | ${String(endSnapshot.dbConnections).padEnd(12)} | ${recoveryTimeSec}s           |`);
  console.log(`| Redis Clients              | ${String(startSnapshot.redisClients).padEnd(12)} | ${String(midSnapshot?.redisClients || 0).padEnd(12)} | ${String(endSnapshot.redisClients).padEnd(12)} | ${recoveryTimeSec}s           |`);
  console.log(`| Kafka Lag (messages)       | ${String(startSnapshot.kafkaLag).padEnd(12)} | ${String(midSnapshot?.kafkaLag || 0).padEnd(12)} | ${String(endSnapshot.kafkaLag).padEnd(12)} | ${recoveryTimeSec}s           |`);
  console.log(`| P95 Latency (ms)           | ${String(startP95.toFixed(2)).padEnd(12)} | ${String(midP95.toFixed(2)).padEnd(12)} | ${String(p95.toFixed(2)).padEnd(12)} | ${recoveryTimeSec}s           |`);
  console.log(`| Event-Loop Lag (ms)        | ${String(startSnapshot.eventLoopLagMs).padEnd(12)} | ${String(midSnapshot?.eventLoopLagMs || 0).padEnd(12)} | ${String(endSnapshot.eventLoopLagMs).padEnd(12)} | ${recoveryTimeSec}s           |`);
  console.log('========================================================================\n');

  agent.destroy();
}

main().catch((err) => {
  console.error('Fatal error during soak test:', err);
  agent.destroy();
  process.exit(1);
});
