#!/usr/bin/env node

/**
 * Phase 6 Capacity & Performance Reporter
 *
 * Reads Phase 6 JSON benchmark outputs and formats clean, machine-readable
 * and human-readable terminal/markdown tables:
 * - Load Test Table (Phase 6.23)
 * - Multi-Replica Scaling Table (Phase 6.24)
 * - Spike Test Table (Phase 6.25)
 * - Soak Test Table (Phase 6.26)
 * - Capacity Classification Table (Phase 6.27)
 * - Failure Envelope Table (Phase 6.28)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_RESULTS_PATH = path.join(__dirname, '..', 'reports', 'performance', 'phase6-results.json');
const DEFAULT_SCALING_PATH = path.join(__dirname, '..', 'reports', 'performance', 'phase6-scaling-results.json');

export function formatLoadTestTable(loadResults = []) {
  const lines = [];
  lines.push('| Test Type | Load | Duration | RPS | P50 | P95 | P99 | 429 | 503 | Error % | First Bottleneck |');
  lines.push('|-----------|------|----------|-----|-----|-----|-----|-----|-----|---------|------------------|');

  for (const item of loadResults) {
    const testType = (item.testType || 'Load Matrix').padEnd(9);
    const load = String(item.load || `${item.concurrency} conn`).padEnd(4);
    const duration = `${item.actualDurationSec || item.duration || 10}s`.padEnd(8);
    const rps = String(item.RPS).padStart(4);
    const p50 = `${item.P50}ms`.padStart(4);
    const p95 = `${item.P95}ms`.padStart(4);
    const p99 = `${item.P99}ms`.padStart(4);
    const c429 = String(item['429'] ?? 0).padStart(3);
    const c503 = String(item['503'] ?? item.loadShed ?? 0).padStart(3);
    const errPct = `${item.errorPercentage ?? 0}%`.padStart(7);
    const bottleneck = item.firstBottleneck || (item.P95 > 250 ? 'Gateway Event Loop' : 'None (Headroom OK)');

    lines.push(`| ${testType} | ${load} | ${duration} | ${rps} | ${p50} | ${p95} | ${p99} | ${c429} | ${c503} | ${errPct} | ${bottleneck} |`);
  }

  return lines.join('\n');
}

export function formatScalingTable(scalingResults = []) {
  const lines = [];
  lines.push('| Service | Replicas | RPS | P95 | CPU | Memory | DB Connections | Kafka Lag | Scaling Efficiency |');
  lines.push('|---------|----------|-----|-----|-----|--------|----------------|-----------|--------------------|');

  for (const item of scalingResults) {
    const service = (item.service || 'catalog-svc').padEnd(7);
    const reps = String(item.replicas || 1).padStart(8);
    const rps = String(item.RPS).padStart(4);
    const p95 = `${item.P95}ms`.padStart(4);
    const cpu = `${item.CPU}%`.padStart(4);
    const mem = `${item.memory}MB`.padStart(6);
    const dbConn = String(item.dbConnections ?? 0).padStart(14);
    const lag = String(item.kafkaLag ?? 0).padStart(9);
    const eff = `${((item.scalingEfficiency ?? 1.0) * 100).toFixed(1)}%`.padStart(18);

    lines.push(`| ${service} | ${reps} | ${rps} | ${p95} | ${cpu} | ${mem} | ${dbConn} | ${lag} | ${eff} |`);
  }

  return lines.join('\n');
}

export function formatSpikeTable(spikeResults = []) {
  const lines = [];
  lines.push('| Spike Pattern | Peak Load | Peak P95 | Peak P99 | 429 | 503 | Peak CPU | Peak Memory | Recovery Time |');
  lines.push('|---------------|-----------|----------|----------|-----|-----|----------|-------------|---------------|');

  for (const item of spikeResults) {
    const pattern = (item.pattern || '50 -> 500 -> 50').padEnd(13);
    const load = String(item.peakLoad || '500 RPS').padEnd(9);
    const p95 = `${item.peakP95}ms`.padStart(8);
    const p99 = `${item.peakP99}ms`.padStart(8);
    const c429 = String(item['429'] ?? 0).padStart(3);
    const c503 = String(item['503'] ?? item.loadShed ?? 0).padStart(3);
    const cpu = `${item.peakCPU}%`.padStart(8);
    const mem = `${item.peakMemory}MB`.padStart(11);
    const rec = `${item.recoveryTimeSec}s`.padStart(13);

    lines.push(`| ${pattern} | ${load} | ${p95} | ${p99} | ${c429} | ${c503} | ${cpu} | ${mem} | ${rec} |`);
  }

  return lines.join('\n');
}

export function formatSoakTable(soakSnapshots = []) {
  const lines = [];
  lines.push('| Metric | Start | 25% | 50% | 75% | 100% | Cooldown |');
  lines.push('|--------|-------|-----|-----|-----|------|----------|');

  const metrics = [
    { key: 'cpu', label: 'CPU (%)', format: (v) => `${v}%` },
    { key: 'memoryMB', label: 'Memory (MB)', format: (v) => `${v}MB` },
    { key: 'dbConnections', label: 'DB Connections', format: (v) => String(v) },
    { key: 'redisClients', label: 'Redis Clients', format: (v) => String(v) },
    { key: 'kafkaLag', label: 'Kafka Lag', format: (v) => String(v) },
    { key: 'p95', label: 'P95 (ms)', format: (v) => `${v}ms` },
    { key: 'p99', label: 'P99 (ms)', format: (v) => `${v}ms` },
    { key: 'errorRate', label: 'Error Rate (%)', format: (v) => `${v}%` },
  ];

  const stages = ['start', 'p25', 'p50', 'p75', 'p100', 'cooldown'];

  for (const m of metrics) {
    const row = [m.label.padEnd(14)];
    for (const stage of stages) {
      const snap = soakSnapshots[stage] || {};
      const val = snap[m.key] !== undefined ? m.format(snap[m.key]) : 'N/A';
      row.push(val.padStart(6));
    }
    lines.push(`| ${row.join(' | ')} |`);
  }

  return lines.join('\n');
}

export function formatCapacityTable(capacityRows = []) {
  const lines = [];
  lines.push('| Service | Normal | Sustainable | Warning | Saturation | Failure | First Bottleneck |');
  lines.push('|---------|--------|-------------|---------|------------|---------|------------------|');

  for (const row of capacityRows) {
    const svc = row.service.padEnd(7);
    const norm = `${row.normal} RPS`.padStart(6);
    const sust = `${row.sustainable} RPS`.padStart(11);
    const warn = `${row.warning} RPS`.padStart(7);
    const sat = `${row.saturation} RPS`.padStart(10);
    const fail = `${row.failure} RPS`.padStart(7);
    const bneck = row.bottleneck;

    lines.push(`| ${svc} | ${norm} | ${sust} | ${warn} | ${sat} | ${fail} | ${bneck} |`);
  }

  return lines.join('\n');
}

export function formatFailureEnvelopeTable(failureRows = []) {
  const lines = [];
  lines.push('| Test | First Degradation | Saturation | Failure/Safety Threshold | Recovery | State Corruption |');
  lines.push('|------|-------------------|------------|--------------------------|----------|------------------|');

  for (const row of failureRows) {
    lines.push(`| ${row.test.padEnd(10)} | ${row.firstDegradation.padEnd(17)} | ${row.saturation.padEnd(10)} | ${row.safetyThreshold.padEnd(24)} | ${row.recovery.padEnd(8)} | ${row.stateCorruption.padEnd(16)} |`);
  }

  return lines.join('\n');
}

function main() {
  console.log('========================================================================');
  console.log('PHASE 6: CAPACITY REPORTING ENGINE');
  console.log('========================================================================\n');

  let results = {};
  let scaling = {};

  if (fs.existsSync(DEFAULT_RESULTS_PATH)) {
    results = JSON.parse(fs.readFileSync(DEFAULT_RESULTS_PATH, 'utf-8'));
    console.log(`Loaded results from ${DEFAULT_RESULTS_PATH}`);
  }
  if (fs.existsSync(DEFAULT_SCALING_PATH)) {
    scaling = JSON.parse(fs.readFileSync(DEFAULT_SCALING_PATH, 'utf-8'));
    console.log(`Loaded scaling data from ${DEFAULT_SCALING_PATH}`);
  }

  if (results.loadMatrix) {
    console.log('\n### 1. Load Test Table (Phase 6.23)');
    console.log(formatLoadTestTable(results.loadMatrix));
  }

  if (scaling.scalingData) {
    console.log('\n### 2. Multi-Replica Scaling Table (Phase 6.24)');
    console.log(formatScalingTable(scaling.scalingData));
  }

  if (results.spikeTests) {
    console.log('\n### 3. Spike Test Table (Phase 6.25)');
    console.log(formatSpikeTable(results.spikeTests));
  }

  if (results.soakSnapshots) {
    console.log('\n### 4. Soak Test Table (Phase 6.26)');
    console.log(formatSoakTable(results.soakSnapshots));
  }

  if (results.capacityTable) {
    console.log('\n### 5. Capacity Table (Phase 6.27)');
    console.log(formatCapacityTable(results.capacityTable));
  }

  if (results.failureEnvelope) {
    console.log('\n### 6. Failure Envelope Table (Phase 6.28)');
    console.log(formatFailureEnvelopeTable(results.failureEnvelope));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
