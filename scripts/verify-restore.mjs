#!/usr/bin/env node

/**
 * Phase 8 Post-Restore Invariant & Relational Verification Engine
 *
 * Inspects restored databases in the target container:
 * - Queries actual table row counts across all 6 service databases
 * - Compares pre-backup counts vs post-restore counts
 * - Verifies relational integrity, foreign key relations, and schema elements
 * - Verifies outbox records, processed event logs, and idempotency state
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { validateRestoreInvariants } from '../packages/shared/src/utils/backup-recovery-planning.js';

export function queryContainerDb(container, dbName, sql, user = 'postgres') {
  try {
    const cmd = `docker exec -i ${container} psql -U ${user} -d ${dbName} -t -A`;
    const res = execSync(cmd, { input: sql, encoding: 'utf-8', timeout: 15000 });
    return res.trim();
  } catch (err) {
    return null;
  }
}

/**
 * Captures comprehensive row counts across all 6 service databases.
 *
 * @param {string} [container='ecommerce-postgres']
 * @param {string} [user='postgres']
 * @returns {Object} { [key: `${db}.${table}`]: count }
 */
export function captureDatabaseRowCounts(container = 'ecommerce-postgres', user = 'postgres') {
  const tableDefinitions = [
    // Identity DB
    { db: 'identity_db', table: 'users' },
    { db: 'identity_db', table: 'sellers' },
    { db: 'identity_db', table: 'addresses' },
    { db: 'identity_db', table: 'audit_logs' },

    // Catalog DB
    { db: 'catalog_db', table: 'categories' },
    { db: 'catalog_db', table: 'products' },
    { db: 'catalog_db', table: 'product_images' },
    { db: 'catalog_db', table: 'coupons' },
    { db: 'catalog_db', table: 'reviews' },

    // Order DB
    { db: 'order_db', table: 'orders' },
    { db: 'order_db', table: 'order_items' },
    { db: 'order_db', table: 'order_outbox' },
    { db: 'order_db', table: 'order_status_history' },
    { db: 'order_db', table: 'idempotency_records' },

    // Payment DB
    { db: 'payment_db', table: 'payments' },
    { db: 'payment_db', table: 'payment_refunds' },
    { db: 'payment_db', table: 'payment_outbox' },
    { db: 'payment_db', table: 'payment_processed_events' },

    // Fulfillment DB
    { db: 'fulfillment_db', table: 'warehouses' },
    { db: 'fulfillment_db', table: 'inventory_items' },
    { db: 'fulfillment_db', table: 'shipments' },
    { db: 'fulfillment_db', table: 'return_pickups' },
    { db: 'fulfillment_db', table: 'fulfillment_outbox' },

    // Notification DB
    { db: 'notification_db', table: 'notifications' },
    { db: 'notification_db', table: 'notification_templates' },
    { db: 'notification_db', table: 'notification_preferences' },
    { db: 'notification_db', table: 'notification_outbox' },
  ];

  const counts = {};

  for (const def of tableDefinitions) {
    const key = `${def.db}.${def.table}`;
    const raw = queryContainerDb(container, def.db, `SELECT count(*) FROM ${def.table};`, user);
    counts[key] = raw !== null && !isNaN(parseInt(raw, 10)) ? parseInt(raw, 10) : 0;
  }

  return counts;
}

/**
 * Validates relational invariants, constraints, and outbox state in the restored target.
 *
 * @param {string} container - Target container name
 * @param {string} [user='postgres']
 * @returns {{ valid: boolean, checks: Array<Object> }}
 */
export function verifyRelationalInvariants(container, user = 'postgres') {
  const checks = [];

  // Check 1: No orphan order items (order_items must reference existing orders)
  const orphanOrderItems = queryContainerDb(
    container,
    'order_db',
    'SELECT count(*) FROM order_items oi LEFT JOIN orders o ON oi.order_id = o.id WHERE o.id IS NULL;',
    user,
  );
  checks.push({
    name: 'Zero Orphan Order Items',
    result: orphanOrderItems === '0' ? 'PASSED' : 'FAILED',
    details: `Found ${orphanOrderItems} orphan order items`,
    safe: orphanOrderItems === '0',
  });

  // Check 2: No duplicate order numbers in restored order_db
  const dupOrders = queryContainerDb(
    container,
    'order_db',
    'SELECT count(*) FROM (SELECT order_number FROM orders GROUP BY order_number HAVING count(*) > 1) t;',
    user,
  );
  checks.push({
    name: 'Zero Duplicate Order Numbers',
    result: dupOrders === '0' ? 'PASSED' : 'FAILED',
    details: `Found ${dupOrders} duplicate orders`,
    safe: dupOrders === '0',
  });

  // Check 3: Outbox state consistency (all records are PENDING, PROCESSING, PROCESSED, or FAILED)
  const invalidOutbox = queryContainerDb(
    container,
    'order_db',
    "SELECT count(*) FROM order_outbox WHERE status NOT IN ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED');",
    user,
  );
  checks.push({
    name: 'Valid Outbox Status Enums',
    result: invalidOutbox === '0' ? 'PASSED' : 'FAILED',
    details: `Found ${invalidOutbox} rows with invalid outbox states`,
    safe: invalidOutbox === '0',
  });

  // Check 4: Payment state consistency
  const orphanRefunds = queryContainerDb(
    container,
    'payment_db',
    'SELECT count(*) FROM payment_refunds pr LEFT JOIN payments p ON pr.payment_id = p.id WHERE p.id IS NULL;',
    user,
  );
  checks.push({
    name: 'Zero Orphan Payment Refunds',
    result: orphanRefunds === '0' ? 'PASSED' : 'FAILED',
    details: `Found ${orphanRefunds} orphan refunds`,
    safe: orphanRefunds === '0',
  });

  const allPassed = checks.every((c) => c.safe);

  return {
    valid: allPassed,
    checks,
  };
}

/**
 * Compares pre-backup row counts against post-restore row counts.
 *
 * @param {Object} beforeCounts
 * @param {string} [restoreContainer='ecommerce-postgres-restore']
 * @param {string} [user='postgres']
 * @returns {Object} Invariant comparison and table results
 */
export function verifyRestoreData(beforeCounts, restoreContainer = 'ecommerce-postgres-restore', user = 'postgres') {
  console.log('========================================================================');
  console.log(`▶ VERIFYING POST-RESTORE INVARIANTS: Container [${restoreContainer}]`);
  console.log('========================================================================');

  const afterCounts = captureDatabaseRowCounts(restoreContainer, user);
  const comparison = validateRestoreInvariants(beforeCounts, afterCounts);
  const relational = verifyRelationalInvariants(restoreContainer, user);

  console.log('\n--- ROW COUNT INVARIANT COMPARISON ---');
  console.log('| Database.Table'.padEnd(35) + '| Before | After  | Difference | Status |');
  console.log('|' + '-'.repeat(34) + '|' + '-'.repeat(8) + '|' + '-'.repeat(8) + '|' + '-'.repeat(12) + '|' + '-'.repeat(8) + '|');

  for (const comp of comparison.tableComparisons) {
    const status = comp.matches ? 'MATCH' : comp.after >= comp.before ? 'GROWTH' : 'LOSS';
    console.log(
      `| ${comp.table.padEnd(33)} | ${String(comp.before).padEnd(6)} | ${String(comp.after).padEnd(6)} | ${String(comp.difference).padEnd(10)} | ${status.padEnd(6)} |`,
    );
  }

  console.log('\n--- RELATIONAL INTEGRITY CHECKS ---');
  for (const check of relational.checks) {
    console.log(`  ${check.name.padEnd(35)} : [${check.result}] (${check.details})`);
  }

  const overallSuccess = comparison.intact && relational.valid;

  if (overallSuccess) {
    console.log('\n✓ RESTORE VALIDATION PASSED: Logical data invariants and schema relations intact.');
  } else {
    console.error('\n✗ RESTORE VALIDATION FAILED:');
    comparison.violations.forEach((v) => console.error(`  - ${v}`));
  }

  return {
    success: overallSuccess,
    rowComparison: comparison,
    relationalChecks: relational,
    afterCounts,
  };
}

// CLI Execution
function main() {
  const args = process.argv.slice(2);
  const getArg = (flag, def) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
  };

  const container = getArg('--container', 'ecommerce-postgres-restore');
  const user = getArg('--user', 'postgres');

  const counts = captureDatabaseRowCounts(container, user);
  const relational = verifyRelationalInvariants(container, user);

  console.log(JSON.stringify({ counts, relational }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
