#!/usr/bin/env node

/**
 * Phase 12 Microservice & Edge Recovery Validation Tool
 *
 * Probes each recovered microservice, the API gateway, and Nginx edge proxy:
 * - /liveness: verifies process health & event-loop responsiveness
 * - /ready: verifies dependency-aware readiness (DB pool, Redis, Kafka broker)
 * - Nginx reverse proxy routing and SSL/TLS endpoint
 * - Flags degraded or non-ready dependencies
 * - Auto-detects container names in Docker network or host ports
 */

import http from 'http';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { evaluateServiceReadiness } from '../../packages/shared/src/utils/dr-recovery-orchestrator.js';

export const SERVICE_DEFINITIONS = [
  { name: 'identity-svc', port: 4001, containerFilter: 'identity-svc' },
  { name: 'catalog-svc', port: 4002, containerFilter: 'catalog-svc' },
  { name: 'order-svc', port: 4003, containerFilter: 'order-svc' },
  { name: 'payment-svc', port: 4004, containerFilter: 'payment-svc' },
  { name: 'fulfillment-svc', port: 4005, containerFilter: 'fulfillment-svc' },
  { name: 'notification-svc', port: 4006, containerFilter: 'notification-svc' },
  { name: 'gateway', port: 4000, containerFilter: 'gateway', hostAccessible: true },
  { name: 'nginx-http', port: 80, path: '/nginx-health', protocol: 'http', hostAccessible: true },
  { name: 'nginx-https', port: 443, path: '/api/v1/products?limit=1', protocol: 'https', rejectUnauthorized: false, hostAccessible: true },
];

function fetchHostHttp(url, options = {}) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    const reqOptions = {
      timeout: options.timeoutMs || 4000,
      rejectUnauthorized: options.rejectUnauthorized !== false,
    };

    const req = client.get(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = { raw: data };
        }
        resolve({
          statusCode: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          data: json,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ statusCode: 0, ok: false, error: err.message, data: null });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: 0, ok: false, error: 'Request timed out', data: null });
    });
  });
}

function fetchContainerProbe(containerName, port, path) {
  try {
    const cmd = `docker exec ${containerName} wget -qO- http://localhost:${port}${path}`;
    const raw = execSync(cmd, { encoding: 'utf-8', timeout: 5000 }).trim();
    const json = JSON.parse(raw);
    return {
      statusCode: 200,
      ok: true,
      data: json,
    };
  } catch (err) {
    return {
      statusCode: 503,
      ok: false,
      error: err.message,
      data: null,
    };
  }
}

function resolveContainerName(filter) {
  try {
    const names = execSync(`docker ps --filter "name=${filter}" --format "{{.Names}}"`, {
      encoding: 'utf-8',
    })
      .trim()
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    return names.length > 0 ? names[0] : null;
  } catch {
    return null;
  }
}

export async function validateServiceRecovery(host = 'localhost') {
  console.log('========================================================================');
  console.log(`▶ [DR SERVICE RECOVERY VALIDATION] Probing Microservices & Edge`);
  console.log('========================================================================');

  const results = [];
  let allHealthy = true;

  for (const def of SERVICE_DEFINITIONS) {
    if (def.name.startsWith('nginx')) {
      const url = `${def.protocol}://${host}:${def.port}${def.path}`;
      const res = await fetchHostHttp(url, { rejectUnauthorized: def.rejectUnauthorized });
      const healthy = res.ok;
      if (!healthy) allHealthy = false;
      results.push({
        service: def.name,
        healthy,
        livenessOk: healthy,
        readinessOk: healthy,
        subChecks: {},
        statusCode: res.statusCode,
        errors: healthy ? [] : [res.error || `HTTP ${res.statusCode}`],
      });
      continue;
    }

    let livenessRes;
    let readinessRes;

    if (def.hostAccessible) {
      const baseUrl = `http://${host}:${def.port}`;
      [livenessRes, readinessRes] = await Promise.all([
        fetchHostHttp(`${baseUrl}/liveness`),
        fetchHostHttp(`${baseUrl}/ready`),
      ]);
    } else {
      const container = resolveContainerName(def.containerFilter);
      if (!container) {
        results.push({
          service: def.name,
          healthy: false,
          livenessOk: false,
          readinessOk: false,
          subChecks: {},
          statusCode: 0,
          errors: [`No running container found matching '${def.containerFilter}'`],
        });
        allHealthy = false;
        continue;
      }

      livenessRes = fetchContainerProbe(container, def.port, '/liveness');
      readinessRes = fetchContainerProbe(container, def.port, '/ready');
    }

    const evalResult = evaluateServiceReadiness(
      def.name,
      livenessRes.data || { status: livenessRes.ok ? 'UP' : 'DOWN' },
      readinessRes.data || { status: readinessRes.ok ? 'READY' : 'NOT_READY' },
    );

    const isHealthy = livenessRes.ok && readinessRes.ok && evalResult.healthy;
    if (!isHealthy) {
      allHealthy = false;
    }

    const subChecks = readinessRes.data?.checks || (readinessRes.data?.redis ? { redis: readinessRes.data.redis } : {});

    results.push({
      service: def.name,
      healthy: isHealthy,
      livenessOk: livenessRes.ok,
      readinessOk: readinessRes.ok,
      subChecks,
      statusCode: readinessRes.statusCode,
      errors: evalResult.errors,
    });
  }

  console.log('\n--- SERVICE READINESS STATUS ---');
  for (const r of results) {
    const livenessIcon = r.livenessOk ? '✓ UP' : '✗ DOWN';
    const readinessIcon = r.readinessOk ? '✓ READY' : '✗ NOT READY';
    const overallIcon = r.healthy ? '[HEALTHY]' : '[DEGRADED]';

    const checksStr = Object.entries(r.subChecks || {})
      .map(([k, v]) => `${k}:${v}`)
      .join(', ');

    console.log(
      `  ${r.service.padEnd(20)} | Liveness: ${livenessIcon.padEnd(8)} | Readiness: ${readinessIcon.padEnd(12)} | Status: ${overallIcon.padEnd(11)} ${checksStr ? `(${checksStr})` : ''}`,
    );

    if (r.errors && r.errors.length > 0) {
      r.errors.forEach((e) => console.log(`      ↳ Error: ${e}`));
    }
  }

  if (allHealthy) {
    console.log('\n✓ SUCCESS: All microservices, API gateway, and Nginx edge are 100% HEALTHY and READY.');
  } else {
    console.error('\n✗ SERVICE RECOVERY FAILED: One or more services are not ready or degraded.');
  }

  return {
    healthy: allHealthy,
    services: results,
  };
}

// CLI Execution
async function main() {
  const host = process.env.DR_TARGET_HOST || 'localhost';
  try {
    const res = await validateServiceRecovery(host);
    process.exit(res.healthy ? 0 : 1);
  } catch (err) {
    console.error('Fatal Service Validation Error:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
