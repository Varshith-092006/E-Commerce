#!/usr/bin/env node

/**
 * Phase 8 Database Backup Engine
 *
 * Implements logical snapshot backups for all 6 microservice databases:
 * - identity_db
 * - catalog_db
 * - order_db
 * - payment_db
 * - fulfillment_db
 * - notification_db
 *
 * Features:
 * - PostgreSQL standard pg_dump with safe flags (--clean, --if-exists, --no-owner, --no-privileges)
 * - Deterministic timestamped directories: backups/YYYY-MM-DD_HH-mm-ss/
 * - SHA-256 checksum generation for each dump file
 * - Strict manifest generation without secrets
 * - Configurable retention pruning (BACKUP_RETENTION_COUNT=7)
 * - Strict failure detection with non-zero exit code
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  REQUIRED_SERVICE_DATABASES,
  validateBackupManifest,
  calculateRetentionList,
} from '../packages/shared/src/utils/backup-recovery-planning.js';

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

export function formatTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  const MM = pad(date.getUTCMonth() + 1);
  const dd = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const mm = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${yyyy}-${MM}-${dd}_${hh}-${mm}-${ss}`;
}

export function computeSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
}

/**
 * Executes a full backup of all 6 service databases.
 *
 * @param {Object} options
 * @param {string} [options.container='ecommerce-postgres']
 * @param {string} [options.user='postgres']
 * @param {string} [options.backupsBaseDir]
 * @param {number} [options.retentionCount=7]
 * @returns {Promise<{ success: boolean, backupDir: string, manifest: Object, totalDurationMs: number }>}
 */
export async function executeBackup(options = {}) {
  const container = options.container || 'ecommerce-postgres';
  const user = options.user || 'postgres';
  const backupsBaseDir = options.backupsBaseDir || DEFAULT_BACKUPS_BASE;
  const retentionCount = parseInt(options.retentionCount || process.env.BACKUP_RETENTION_COUNT || '7', 10);

  const startTime = Date.now();
  const timestampStr = formatTimestamp(new Date());
  const backupDirName = timestampStr;
  const targetDir = path.join(backupsBaseDir, backupDirName);

  console.log('========================================================================');
  console.log(`▶ INITIATING DATABASE BACKUP SUITE: [${backupDirName}]`);
  console.log(`  Source Container: ${container} | User: ${user} | Retention: ${retentionCount}`);
  console.log(`  Destination: ${targetDir}`);
  console.log('========================================================================');

  // Verify PostgreSQL container is running
  const isRunning = runCmd(`docker ps --filter "name=${container}" --format "{{.Names}}"`);
  if (!isRunning || !isRunning.includes(container)) {
    throw new Error(`Target PostgreSQL container '${container}' is not running!`);
  }

  // Get PostgreSQL version
  const pgVersion = runCmd(`docker exec ${container} pg_dump --version`);
  console.log(`PostgreSQL Tooling: ${pgVersion}`);

  // Ensure target backup directory exists
  fs.mkdirSync(targetDir, { recursive: true });

  const databaseResults = [];
  let allDatabasesSucceeded = true;

  for (const dbName of REQUIRED_SERVICE_DATABASES) {
    console.log(`\nBacking up database '${dbName}'...`);
    const dbStartTime = Date.now();
    const fileName = `${dbName}.sql`;
    const destFilePath = path.join(targetDir, fileName);

    try {
      // Execute pg_dump with safe logical dump flags
      const dumpCmd = `docker exec ${container} pg_dump -U ${user} --clean --if-exists --no-owner --no-privileges -d ${dbName}`;
      const dumpSql = execSync(dumpCmd, { encoding: 'utf-8', maxBuffer: 100 * 1024 * 1024, timeout: 60000 });

      fs.writeFileSync(destFilePath, dumpSql, 'utf-8');

      const stats = fs.statSync(destFilePath);
      const sha256 = computeSha256(destFilePath);
      const durationMs = Date.now() - dbStartTime;

      if (stats.size === 0) {
        throw new Error(`Dump file '${fileName}' was created empty!`);
      }

      console.log(`  ✓ ${dbName} backed up successfully (${stats.size} bytes, SHA: ${sha256.slice(0, 16)}..., ${durationMs}ms)`);

      databaseResults.push({
        name: dbName,
        file: fileName,
        sizeBytes: stats.size,
        sha256,
        durationMs,
        status: 'VALID',
      });
    } catch (err) {
      console.error(`  ✗ Failed to backup '${dbName}': ${err.message}`);
      allDatabasesSucceeded = false;
      databaseResults.push({
        name: dbName,
        file: fileName,
        sizeBytes: 0,
        sha256: '',
        durationMs: Date.now() - dbStartTime,
        status: 'FAILED',
        error: err.message,
      });
      break; // Abort on first failure to prevent inconsistent backup sets
    }
  }

  const totalDurationMs = Date.now() - startTime;

  // Build manifest
  const manifest = {
    backupId: `backup_${backupDirName}`,
    createdAt: new Date(startTime).toISOString(),
    postgresVersion: pgVersion,
    databases: databaseResults,
    totalDurationMs,
    status: allDatabasesSucceeded ? 'VALID' : 'FAILED',
  };

  const manifestPath = path.join(targetDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  // Validate manifest schema
  if (allDatabasesSucceeded) {
    const manifestValidation = validateBackupManifest(manifest);
    if (!manifestValidation.valid) {
      console.error('Manifest schema validation failed:', manifestValidation.errors);
      throw new Error(`Manifest validation failed: ${manifestValidation.errors.join('; ')}`);
    }
    console.log(`\n✓ Manifest successfully generated and validated at: ${manifestPath}`);
  } else {
    throw new Error('One or more database backups failed. Backup set marked as FAILED.');
  }

  // Apply retention policy
  try {
    applyRetentionPolicy(backupsBaseDir, retentionCount);
  } catch (retErr) {
    console.warn(`Retention cleanup warning: ${retErr.message}`);
  }

  console.log('\n========================================================================');
  console.log(`BACKUP SUITE COMPLETE: [${manifest.status}] in ${totalDurationMs}ms`);
  console.log('========================================================================');

  return {
    success: allDatabasesSucceeded,
    backupDir: targetDir,
    manifest,
    totalDurationMs,
  };
}

/**
 * Prunes older backups according to retention policy while strictly preserving the latest valid backup.
 */
export function applyRetentionPolicy(backupsBaseDir, retentionCount = 7) {
  if (!fs.existsSync(backupsBaseDir)) return;

  const entries = fs.readdirSync(backupsBaseDir, { withFileTypes: true });
  const backupDirs = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dirPath = path.join(backupsBaseDir, entry.name);
      const manifestPath = path.join(dirPath, 'manifest.json');
      let createdAt = entry.name;
      if (fs.existsSync(manifestPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          createdAt = parsed.createdAt || createdAt;
        } catch {
          // Fallback to directory name
        }
      }
      backupDirs.push({ dirName: entry.name, dirPath, createdAt });
    }
  }

  const { toPrune, toKeep, abortedReason } = calculateRetentionList(backupDirs, retentionCount);

  if (abortedReason) {
    console.warn(abortedReason);
    return;
  }

  if (toPrune.length > 0) {
    console.log(`\nPruning ${toPrune.length} expired backup directories (retention limit: ${retentionCount})...`);
    for (const old of toPrune) {
      console.log(`  - Pruning old backup: ${old.dirName}`);
      fs.rmSync(old.dirPath, { recursive: true, force: true });
    }
    console.log(`  Preserved ${toKeep.length} active backups.`);
  }
}

// Direct CLI Execution
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag, def) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
  };

  const container = getArg('--container', 'ecommerce-postgres');
  const user = getArg('--user', 'postgres');
  const outputDir = getArg('--output-dir', DEFAULT_BACKUPS_BASE);
  const retention = parseInt(getArg('--retention', '7'), 10);

  try {
    await executeBackup({
      container,
      user,
      backupsBaseDir: outputDir,
      retentionCount: retention,
    });
    process.exit(0);
  } catch (err) {
    console.error('\nFATAL BACKUP ERROR:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
