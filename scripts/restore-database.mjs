#!/usr/bin/env node

/**
 * Phase 8 Database Restore Tool
 *
 * Safely restores logical backups into an isolated target:
 * - Defaults to DRY-RUN mode; requires explicit --confirm-restore
 * - Strictly rejects production targets and primary container (ecommerce-postgres)
 * - Verifies SHA-256 checksums before applying any SQL
 * - Streams pg_dump SQL into target database via psql
 * - Measures exact restore timings for RTO validation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  REQUIRED_SERVICE_DATABASES,
  validateRestoreSafety,
} from '../packages/shared/src/utils/backup-recovery-planning.js';
import { verifyBackupIntegrity, findLatestBackupDir } from './verify-backups.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_BACKUPS_BASE = path.join(ROOT_DIR, 'backups');

export function runCmd(cmd, timeoutMs = 60000) {
  try {
    return execSync(cmd, { encoding: 'utf-8', timeout: timeoutMs }).trim();
  } catch (err) {
    throw new Error(`Command failed [${cmd}]: ${err.message}`);
  }
}

/**
 * Restores one or all databases from a validated backup archive into a target container.
 *
 * @param {Object} options
 * @param {string} options.backupDir
 * @param {string} [options.database='all']
 * @param {string} [options.targetContainer='ecommerce-postgres-restore']
 * @param {string} [options.user='postgres']
 * @param {boolean} [options.confirmRestore=false]
 * @param {boolean} [options.dryRun=true]
 * @returns {Promise<{ success: boolean, results: Array<Object>, totalRestoreDurationMs: number }>}
 */
export async function restoreDatabases(options = {}) {
  const database = options.database || 'all';
  const targetContainer = options.targetContainer || 'ecommerce-postgres-restore';
  const user = options.user || 'postgres';
  const confirmRestore = options.confirmRestore === true;
  const dryRun = options.dryRun !== false && !confirmRestore;
  const backupDir = options.backupDir || findLatestBackupDir();

  console.log('========================================================================');
  console.log(`▶ INITIATING DATABASE RESTORE: [${database.toUpperCase()}]`);
  console.log(`  Source Backup: ${backupDir}`);
  console.log(`  Target Container: ${targetContainer} | User: ${user}`);
  console.log(`  Mode: ${dryRun ? 'DRY-RUN (Safe Simulation)' : 'LIVE RESTORE (--confirm-restore ACTIVE)'}`);
  console.log('========================================================================');

  if (!backupDir || !fs.existsSync(backupDir)) {
    throw new Error(`Invalid or missing backup directory: ${backupDir}`);
  }

  // 1. Validate Restore Safety Guardrails
  const safety = validateRestoreSafety({
    targetHost: 'localhost',
    targetDb: database,
    targetContainer,
    isProduction: process.env.NODE_ENV === 'production',
    confirmFlag: confirmRestore,
  });

  if (!safety.safe && !dryRun) {
    console.error('RESTORE SAFETY VIOLATION ABORT:');
    safety.violations.forEach((v) => console.error(`  - ${v}`));
    throw new Error(`Restore safety check failed: ${safety.violations.join('; ')}`);
  }

  // 2. Pre-restore Integrity Check
  console.log('1. Validating backup archive integrity & checksums prior to restore...');
  const integrity = verifyBackupIntegrity(backupDir);
  if (!integrity.valid) {
    console.error('RESTORE BLOCKED: Backup integrity check failed!');
    integrity.errors.forEach((e) => console.error(`  - ${e}`));
    throw new Error(`Backup integrity verification failed: ${integrity.errors.join('; ')}`);
  }

  // Determine target databases
  const targetDbs = database === 'all' ? REQUIRED_SERVICE_DATABASES : [database];

  if (dryRun) {
    console.log('\n[DRY-RUN MODE] Pre-checks passed successfully. No database mutations applied.');
    console.log('To execute actual restore against disposable target, pass: --confirm-restore');
    return {
      success: true,
      dryRun: true,
      results: targetDbs.map((d) => ({ name: d, status: 'DRY_RUN_PASSED' })),
      totalRestoreDurationMs: 0,
    };
  }

  // Verify target container is running
  const isRunning = runCmd(`docker ps --filter "name=${targetContainer}" --format "{{.Names}}"`);
  if (!isRunning || !isRunning.includes(targetContainer)) {
    throw new Error(`Target restore container '${targetContainer}' is not running!`);
  }

  const overallStartTime = Date.now();
  const restoreResults = [];

  for (const dbName of targetDbs) {
    console.log(`\nRestoring database '${dbName}' into container '${targetContainer}'...`);
    const dbStartTime = Date.now();
    const dumpFile = path.join(backupDir, `${dbName}.sql`);

    if (!fs.existsSync(dumpFile)) {
      throw new Error(`Dump file missing: ${dumpFile}`);
    }

    try {
      const sqlContent = fs.readFileSync(dumpFile, 'utf-8');

      // Pipe dump SQL into target container via psql
      const restoreCmd = `docker exec -i ${targetContainer} psql -U ${user} -d ${dbName}`;
      execSync(restoreCmd, {
        input: sqlContent,
        encoding: 'utf-8',
        maxBuffer: 100 * 1024 * 1024,
        timeout: 90000,
      });

      const durationMs = Date.now() - dbStartTime;
      console.log(`  ✓ Database '${dbName}' restored successfully in ${durationMs}ms`);

      restoreResults.push({
        name: dbName,
        durationMs,
        status: 'SUCCESS',
      });
    } catch (err) {
      console.error(`  ✗ Failed to restore '${dbName}': ${err.message}`);
      restoreResults.push({
        name: dbName,
        durationMs: Date.now() - dbStartTime,
        status: 'FAILED',
        error: err.message,
      });
      throw err;
    }
  }

  const totalRestoreDurationMs = Date.now() - overallStartTime;

  console.log('\n========================================================================');
  console.log(`RESTORE SUITE COMPLETE: All ${targetDbs.length} databases restored in ${totalRestoreDurationMs}ms`);
  console.log('========================================================================');

  return {
    success: true,
    dryRun: false,
    results: restoreResults,
    totalRestoreDurationMs,
  };
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag, def) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
  };

  const database = getArg('--database', 'all');
  const backupDirArg = getArg('--backup', null);
  const backupDir = backupDirArg || findLatestBackupDir();
  const targetContainer = getArg('--target-container', 'ecommerce-postgres-restore');
  const user = getArg('--user', 'postgres');
  const confirmRestore = args.includes('--confirm-restore');
  const dryRun = args.includes('--dry-run') || !confirmRestore;

  try {
    const res = await restoreDatabases({
      backupDir,
      database,
      targetContainer,
      user,
      confirmRestore,
      dryRun,
    });
    process.exit(res.success ? 0 : 1);
  } catch (err) {
    console.error('\nFATAL RESTORE ERROR:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
