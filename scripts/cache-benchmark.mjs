import http from 'http';
import { execSync } from 'child_process';
import { generateAccessToken } from '../packages/shared/src/utils/jwt.js';

const BASE_URL = process.env.GATEWAY_URL || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_SECRET || 'ecom_jwt_secret_dev_2026_test_key_32_chars';

const customerToken = generateAccessToken(
  { id: '55555555-5555-5555-5555-555555555555', userId: '55555555-5555-5555-5555-555555555555', role: 'CUSTOMER' },
  JWT_SECRET
);
const sellerToken = generateAccessToken(
  { id: '33333333-3333-3333-3333-333333333333', userId: '33333333-3333-3333-3333-333333333333', role: 'SELLER', sellerId: '33333333-3333-3333-3333-333333333333' },
  JWT_SECRET
);

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 20,
});

function flushRedisKeys(pattern) {
  try {
    execSync(`docker exec ecommerce-redis sh -c "redis-cli --scan --pattern '${pattern}' | xargs -r redis-cli del"`, {
      stdio: 'pipe',
    });
  } catch {
    // Non-fatal if keys don't exist
  }
}

function requestHttp(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    const url = new URL(`${BASE_URL}${path}`);
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
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const diff = process.hrtime(start);
          const durationMs = diff[0] * 1000 + diff[1] / 1e6;
          resolve({
            statusCode: res.statusCode,
            durationMs,
            body,
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

const CACHE_TARGETS = [
  {
    name: 'Product Lookup',
    path: '/api/v1/products/22222222-2222-2222-2222-222222222222',
    headers: {},
    redisPattern: 'catalog:product:*',
  },
  {
    name: 'Product Listing',
    path: '/api/v1/products',
    headers: {},
    redisPattern: 'catalog:products:*',
  },
  {
    name: 'Categories',
    path: '/api/v1/categories',
    headers: {},
    redisPattern: 'catalog:categories:*',
  },
  {
    name: 'Profile',
    path: '/api/v1/users/me',
    headers: { Authorization: `Bearer ${customerToken}` },
    redisPattern: 'identity:user:55555555-5555-5555-5555-555555555555*',
  },
  {
    name: 'Notification Preferences',
    path: '/api/v1/notifications/preferences',
    headers: { Authorization: `Bearer ${customerToken}` },
    redisPattern: 'notification:prefs:*',
  },
  {
    name: 'Seller Analytics',
    path: '/api/v1/orders/seller/analytics/overview',
    headers: { Authorization: `Bearer ${sellerToken}` },
    redisPattern: 'seller:analytics:overview:*',
  },
];

async function main() {
  console.log('========================================================================');
  console.log('PHASE 5: REDIS CACHE-ASIDE BENCHMARK (MEASURED IN LOCAL DOCKER)');
  console.log('Target Gateway:', BASE_URL);
  console.log('Warm Iterations per Target: 30 requests');
  console.log('========================================================================\n');

  console.log('| Target                   | Cold (ms) | Warm P50 (ms) | Warm Mean (ms) | Hits | Misses | Hit Ratio | Improvement % |');
  console.log('|--------------------------|-----------|---------------|----------------|------|--------|-----------|---------------|');

  const WARM_RUNS = 30;

  for (const target of CACHE_TARGETS) {
    // 1. Evict cache key to guarantee cold cache state
    flushRedisKeys(target.redisPattern);
    await new Promise((r) => setTimeout(r, 100));

    // 2. Cold request (miss)
    const coldResult = await requestHttp(target.path, target.headers);
    const coldLatency = coldResult.durationMs;

    // 3. Warm requests (hits)
    const warmLatencies = [];
    let hits = 0;
    let misses = 0;

    for (let i = 0; i < WARM_RUNS; i++) {
      const warmResult = await requestHttp(target.path, target.headers);
      warmLatencies.push(warmResult.durationMs);
      if (warmResult.statusCode === 200) {
        hits++;
      } else {
        misses++;
      }
    }

    warmLatencies.sort((a, b) => a - b);
    const warmP50 = warmLatencies[Math.floor(warmLatencies.length * 0.5)];
    const warmMean = warmLatencies.reduce((a, b) => a + b, 0) / warmLatencies.length;
    const hitRatio = Number(((hits / WARM_RUNS) * 100).toFixed(1));
    const improvementPct = Number((((coldLatency - warmP50) / coldLatency) * 100).toFixed(1));

    console.log(
      `| ${target.name.padEnd(24)} | ` +
      `${coldLatency.toFixed(2).padStart(9)} | ` +
      `${warmP50.toFixed(2).padStart(13)} | ` +
      `${warmMean.toFixed(2).padStart(14)} | ` +
      `${String(hits).padStart(4)} | ` +
      `${String(misses).padStart(6)} | ` +
      `${(hitRatio + '%').padStart(9)} | ` +
      `${(improvementPct + '%').padStart(13)} |`
    );
  }

  console.log('========================================================================');
  console.log('Note: Measured in local Docker environment on single host.');
  agent.destroy();
}

main().catch((err) => {
  console.error('Error during cache benchmark:', err);
  agent.destroy();
  process.exit(1);
});
