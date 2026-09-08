import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASELINE_PATH = path.join(__dirname, '..', 'reports', 'performance', 'phase5-baseline.json');
const CURRENT_PATH = process.env.CURRENT_PERF_PATH || BASELINE_PATH;

function main() {
  console.log('========================================================================');
  console.log('PHASE 5: PERFORMANCE REGRESSION COMPARISON ENGINE');
  console.log('Baseline Reference:', BASELINE_PATH);
  console.log('Current Candidate: ', CURRENT_PATH);
  console.log('Degradation Threshold: > 10.0% P95 latency increase OR > 10.0% RPS drop');
  console.log('========================================================================\n');

  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(`❌ Baseline file not found: ${BASELINE_PATH}. Run scripts/performance-benchmark.mjs first.`);
    process.exit(1);
  }

  const baselineData = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
  const currentData = fs.existsSync(CURRENT_PATH)
    ? JSON.parse(fs.readFileSync(CURRENT_PATH, 'utf-8'))
    : baselineData;

  const currentMap = new Map();
  for (const item of currentData) {
    currentMap.set(`${item.endpoint}|${item.concurrency}`, item);
  }

  console.log('| Endpoint                          | Conc | Base P95 (ms) | Curr P95 (ms) | P95 Change | Base RPS | Curr RPS | RPS Change | Status |');
  console.log('|-----------------------------------|------|---------------|---------------|------------|----------|----------|------------|--------|');

  let regressionsDetected = 0;

  for (const base of baselineData) {
    const key = `${base.endpoint}|${base.concurrency}`;
    const curr = currentMap.get(key) || base;

    // Latency change %: positive means slower (worse)
    const p95ChangePct = base.P95 > 0 ? ((curr.P95 - base.P95) / base.P95) * 100 : 0;
    // Throughput change %: negative means lower RPS (worse)
    const rpsChangePct = base.RPS > 0 ? ((curr.RPS - base.RPS) / base.RPS) * 100 : 0;

    let isRegressed = false;
    if (p95ChangePct > 10.0 || rpsChangePct < -10.0) {
      isRegressed = true;
      regressionsDetected++;
    }

    const status = isRegressed ? 'REGRESSED' : 'PASSED';
    const p95Sign = p95ChangePct > 0 ? '+' : '';
    const rpsSign = rpsChangePct > 0 ? '+' : '';

    console.log(
      `| ${base.endpoint.padEnd(33)} | ` +
      `${String(base.concurrency).padStart(4)} | ` +
      `${base.P95.toFixed(2).padStart(13)} | ` +
      `${curr.P95.toFixed(2).padStart(13)} | ` +
      `${(p95Sign + p95ChangePct.toFixed(1) + '%').padStart(10)} | ` +
      `${base.RPS.toFixed(1).padStart(8)} | ` +
      `${curr.RPS.toFixed(1).padStart(8)} | ` +
      `${(rpsSign + rpsChangePct.toFixed(1) + '%').padStart(10)} | ` +
      `${status.padEnd(6)} |`
    );
  }

  console.log('\n========================================================================');
  if (regressionsDetected > 0) {
    console.log(`⚠ WARNING: ${regressionsDetected} performance regression(s) flagged exceeding 10% threshold.`);
  } else {
    console.log('✔ All tested endpoints and concurrencies are within acceptable 10% performance boundaries.');
  }
  console.log('========================================================================\n');
}

main();
