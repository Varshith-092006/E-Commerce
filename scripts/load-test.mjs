import http from 'http';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const CONCURRENCY_LEVELS = [25, 50, 75, 100];
const TEST_DURATION_MS = parseInt(process.env.TEST_DURATION_MS || '6000', 10); // 6 seconds per concurrency level

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 200,
  maxFreeSockets: 100,
  timeout: 10000,
});

function runConcurrencyTest({ name, path, concurrency, durationMs, varyIp = false }) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(path, BASE_URL);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      agent: httpAgent,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': 'E-Commerce-Load-Tester/1.0',
      },
    };

    const latencies = [];
    const statusCounts = {};
    let totalCompleted = 0;
    let totalErrors = 0;
    let stop = false;
    let activeWorkers = 0;
    const startTime = Date.now();

    function makeRequest(workerId) {
      if (stop) {
        activeWorkers--;
        if (activeWorkers === 0) {
          finish();
        }
        return;
      }

      const reqHeaders = { ...options.headers };
      if (varyIp) {
        // Vary client IP per request/worker so platform rate limiters don't throttle
        const clientIp = `192.168.${Math.floor(workerId / 254) + 1}.${(workerId % 254) + 1}`;
        reqHeaders['x-forwarded-for'] = clientIp;
      }

      const reqStart = process.hrtime.bigint();
      const req = http.request({ ...options, headers: reqHeaders }, (res) => {
        // Drain response body
        res.on('data', () => {});
        res.on('end', () => {
          const reqEnd = process.hrtime.bigint();
          const latencyMs = Number(reqEnd - reqStart) / 1e6;
          latencies.push(latencyMs);

          const code = res.statusCode;
          statusCounts[code] = (statusCounts[code] || 0) + 1;
          totalCompleted++;

          makeRequest(workerId);
        });
      });

      req.on('error', (err) => {
        const reqEnd = process.hrtime.bigint();
        const latencyMs = Number(reqEnd - reqStart) / 1e6;
        latencies.push(latencyMs);

        statusCounts['ERR'] = (statusCounts['ERR'] || 0) + 1;
        totalErrors++;
        totalCompleted++;

        makeRequest(workerId);
      });

      req.setTimeout(8000, () => {
        req.destroy(new Error('Request timed out'));
      });

      req.end();
    }

    function finish() {
      const totalElapsedSec = (Date.now() - startTime) / 1000;
      latencies.sort((a, b) => a - b);

      const count = latencies.length;
      const p = (pct) => (count > 0 ? latencies[Math.min(Math.floor((count * pct) / 100), count - 1)] : 0);
      const sum = latencies.reduce((acc, v) => acc + v, 0);
      const avg = count > 0 ? sum / count : 0;
      const min = count > 0 ? latencies[0] : 0;
      const max = count > 0 ? latencies[count - 1] : 0;
      const rps = totalElapsedSec > 0 ? totalCompleted / totalElapsedSec : 0;

      resolve({
        name,
        path,
        concurrency,
        durationSec: totalElapsedSec.toFixed(2),
        totalRequests: totalCompleted,
        totalErrors,
        rps: Math.round(rps),
        latency: {
          min: min.toFixed(2),
          avg: avg.toFixed(2),
          p50: p(50).toFixed(2),
          p90: p(90).toFixed(2),
          p95: p(95).toFixed(2),
          p99: p(99).toFixed(2),
          max: max.toFixed(2),
        },
        statusCodes: statusCounts,
      });
    }

    activeWorkers = concurrency;
    for (let i = 0; i < concurrency; i++) {
      makeRequest(i + 1);
    }

    setTimeout(() => {
      stop = true;
    }, durationMs);
  });
}

async function runAllTests() {
  console.log('='.repeat(70));
  console.log('🚀 E-COMMERCE GATEWAY & MULTI-REPLICA LOAD TEST SUITE');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Duration per concurrency level: ${TEST_DURATION_MS / 1000}s`);
  console.log(`Concurrency levels: ${CONCURRENCY_LEVELS.join(', ')}`);
  console.log('='.repeat(70));

  const allResults = [];

  // 1. Health Endpoint Load Testing (Edge protection, event loop lag, load shedding)
  console.log('\n--- SUITE 1: Gateway /health (Load Shedding, Memory, Event Loop) ---');
  for (const c of CONCURRENCY_LEVELS) {
    process.stdout.write(`Benchmarking /health at Concurrency ${c}... `);
    const res = await runConcurrencyTest({
      name: 'Gateway /health',
      path: '/health',
      concurrency: c,
      durationMs: TEST_DURATION_MS,
      varyIp: false,
    });
    allResults.push(res);
    console.log(`Done! RPS: ${res.rps}, p95: ${res.latency.p95}ms, 2xx: ${res.statusCodes[200] || 0}, 503: ${res.statusCodes[503] || 0}`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 2. Catalog API Load Testing (Gateway -> Multi-Replica catalog-svc load balancing)
  console.log('\n--- SUITE 2: Catalog /api/v1/products (Multi-Replica Load Balancing) ---');
  for (const c of CONCURRENCY_LEVELS) {
    process.stdout.write(`Benchmarking /api/v1/products at Concurrency ${c}... `);
    const res = await runConcurrencyTest({
      name: 'Catalog /api/v1/products',
      path: '/api/v1/products',
      concurrency: c,
      durationMs: TEST_DURATION_MS,
      varyIp: true,
    });
    allResults.push(res);
    console.log(`Done! RPS: ${res.rps}, p95: ${res.latency.p95}ms, 2xx: ${res.statusCodes[200] || 0}, 429: ${res.statusCodes[429] || 0}, 503: ${res.statusCodes[503] || 0}`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL CONSOLIDATED LOAD TEST RESULTS');
  console.log('='.repeat(70));
  console.table(
    allResults.map((r) => ({
      Target: r.name,
      Concurrency: r.concurrency,
      TotalReqs: r.totalRequests,
      RPS: r.rps,
      'Avg (ms)': r.latency.avg,
      'p50 (ms)': r.latency.p50,
      'p90 (ms)': r.latency.p90,
      'p95 (ms)': r.latency.p95,
      'p99 (ms)': r.latency.p99,
      'Status Codes': JSON.stringify(r.statusCodes),
    }))
  );

  httpAgent.destroy();
}

runAllTests().catch((err) => {
  console.error('Load test failure:', err);
  process.exit(1);
});
