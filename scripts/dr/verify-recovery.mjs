#!/usr/bin/env node

/**
 * Phase 12 Comprehensive Disaster Recovery Verification Tool
 *
 * Validates the full platform state following a disaster restore:
 * 1. PostgreSQL Database & Schema Integrity:
 *    - Connects to all 6 service databases
 *    - Captures table row counts across all 16 entity tables
 *    - Verifies relational invariants (e.g. order items point to valid orders)
 *    - Verifies transactional outbox tables and processed event logs
 * 2. Kafka Event Mesh & Consumer State:
 *    - Verifies 6 topics, 3 partitions, consumer groups, lag
 * 3. Microservice Readiness & Edge Health:
 *    - Verifies /liveness and /ready across all services
 * 4. Invariant Comparison:
 *    - Compares post-recovery state against pre-disaster baseline if provided
 */

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import {
  captureDatabaseRowCounts,
  verifyRelationalInvariants,
  queryContainerDb,
} from '../verify-restore.mjs';
import { validateKafkaRecovery } from './validate-kafka-recovery.mjs';
import { validateServiceRecovery } from './validate-service-recovery.mjs';
import { evaluateDataInvariantComparisons } from '../../packages/shared/src/utils/dr-recovery-orchestrator.js';

export async function verifyComprehensiveRecovery({
  targetContainer = 'ecommerce-postgres',
  baselineFile = null,
} = {}) {
  console.log('========================================================================');
  console.log(`▶ [PHASE 12 POST-RECOVERY VERIFICATION] Target: ${targetContainer}`);
  console.log('========================================================================');

  const report = {
    timestamp: new Date().toISOString(),
    database: { passed: false },
    kafka: { passed: false },
    services: { passed: false },
    invariants: { passed: false },
  };

  // 1. Database Row Counts & Tables
  console.log('\n1. Inspecting PostgreSQL service databases and table row counts...');
  const rowCounts = captureDatabaseRowCounts(targetContainer);
  const totalRows = Object.values(rowCounts).reduce((sum, c) => sum + c, 0);

  console.log(`   Captured row counts across 27 tables. Total records: ${totalRows}`);
  for (const [key, count] of Object.entries(rowCounts).slice(0, 10)) {
    console.log(`   - ${key.padEnd(35)}: ${count}`);
  }
  if (Object.keys(rowCounts).length > 10) {
    console.log(`   - ... and ${Object.keys(rowCounts).length - 10} additional entity tables`);
  }

  // 2. Relational Invariants
  console.log('\n2. Verifying relational invariants and foreign key constraints...');
  const relInvariants = verifyRelationalInvariants(targetContainer);
  console.log(
    `   Relational checks: ${relInvariants.checks.length} executed, valid: ${relInvariants.valid}`,
  );
  relInvariants.checks.forEach((c) => {
    console.log(`   - ${c.name.padEnd(35)}: [${c.status}] (${c.description})`);
  });

  // 3. Outbox Event Records
  console.log('\n3. Inspecting Transactional Outbox queues across databases...');
  const outboxTables = [
    { db: 'order_db', table: 'order_outbox' },
    { db: 'payment_db', table: 'payment_outbox' },
    { db: 'fulfillment_db', table: 'fulfillment_outbox' },
    { db: 'notification_db', table: 'notification_outbox' },
  ];
  const outboxStatus = {};
  for (const item of outboxTables) {
    const raw = queryContainerDb(
      targetContainer,
      item.db,
      `SELECT status, count(*) FROM ${item.table} GROUP BY status;`,
    );
    outboxStatus[`${item.db}.${item.table}`] = raw || 'NO_RECORDS';
    console.log(`   - ${item.db}.${item.table}:`);
    if (raw) {
      raw.split('\n').forEach((line) => console.log(`       ↳ ${line}`));
    } else {
      console.log('       ↳ 0 records / empty');
    }
  }

  report.database = {
    passed: totalRows > 0 && relInvariants.valid,
    totalRows,
    rowCounts,
    relationalInvariants: relInvariants,
    outboxStatus,
  };

  // 4. Baseline Invariant Comparison (if baseline provided)
  if (baselineFile && fs.existsSync(baselineFile)) {
    console.log(`\n4. Comparing against pre-disaster baseline: ${baselineFile}`);
    try {
      const baselineData = JSON.parse(fs.readFileSync(baselineFile, 'utf-8'));
      const baseCounts = baselineData.rowCounts || baselineData;
      const comparison = evaluateDataInvariantComparisons(baseCounts, rowCounts);
      report.invariants = {
        passed: comparison.intact,
        comparison,
      };
      console.log(`   Baseline match: ${comparison.intact ? 'INTACT (100% match)' : 'DISCREPANCIES DETECTED'}`);
      if (!comparison.intact) {
        comparison.violations.forEach((v) => console.log(`   ✗ ${v}`));
      }
    } catch (bErr) {
      console.warn(`   Warning reading baseline: ${bErr.message}`);
    }
  } else {
    report.invariants = { passed: true, note: 'No baseline file specified; skipping diff' };
  }

  // 5. Kafka Recovery Validation
  console.log('\n5. Verifying Kafka cluster topology and consumer groups...');
  const kafkaRes = await validateKafkaRecovery();
  report.kafka = {
    passed: kafkaRes.healthy,
    details: kafkaRes,
  };

  // 6. Microservice & Edge Validation
  console.log('\n6. Verifying microservice readiness probes and Nginx proxy...');
  const serviceRes = await validateServiceRecovery();
  report.services = {
    passed: serviceRes.healthy,
    details: serviceRes,
  };

  const overallSuccess =
    report.database.passed &&
    report.kafka.passed &&
    report.services.passed &&
    report.invariants.passed;

  console.log('\n========================================================================');
  console.log(`▶ [POST-RECOVERY VERIFICATION SUMMARY]: [${overallSuccess ? 'PASS' : 'FAIL'}]`);
  console.log(`  Database & Schema Integrity:   [${report.database.passed ? 'PASS' : 'FAIL'}]`);
  console.log(`  Kafka Mesh & Consumer Groups:  [${report.kafka.passed ? 'PASS' : 'FAIL'}]`);
  console.log(`  Microservices & Edge Probes:   [${report.services.passed ? 'PASS' : 'FAIL'}]`);
  console.log(`  Data Invariants vs Baseline:   [${report.invariants.passed ? 'PASS' : 'FAIL'}]`);
  console.log('========================================================================');

  return {
    success: overallSuccess,
    report,
  };
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  const containerIdx = args.indexOf('--target-container');
  const targetContainer =
    containerIdx !== -1 && args[containerIdx + 1]
      ? args[containerIdx + 1]
      : 'ecommerce-postgres';

  const baselineIdx = args.indexOf('--baseline');
  const baselineFile =
    baselineIdx !== -1 && args[baselineIdx + 1] ? args[baselineIdx + 1] : null;

  try {
    const res = await verifyComprehensiveRecovery({ targetContainer, baselineFile });
    process.exit(res.success ? 0 : 1);
  } catch (err) {
    console.error('Fatal Post-Recovery Verification Error:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
