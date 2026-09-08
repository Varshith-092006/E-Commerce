#!/usr/bin/env node

/**
 * Phase 8 Backup Integrity Verification Engine
 *
 * Verifies the integrity of backup archives without requiring database restore:
 * - Validates manifest structure and schema
 * - Verifies presence and non-emptiness of all 6 database dumps
 * - Computes and cross-checks SHA-256 cryptographic checksums
 * - Fails with non-zero exit code if any tampering or corruption is detected
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  REQUIRED_SERVICE_DATABASES,
  validateBackupManifest,
  validateChecksum,
} from '../packages/shared/src/utils/backup-recovery-planning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_BACKUPS_BASE = path.join(ROOT_DIR, 'backups');

export function computeSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
}

/**
 * Finds the latest backup directory in the backups directory.
 */
export function findLatestBackupDir(baseDir = DEFAULT_BACKUPS_BASE) {
  if (!fs.existsSync(baseDir)) return null;
  const entries = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
    .reverse();

  return entries.length > 0 ? path.join(baseDir, entries[0]) : null;
}

/**
 * Verifies the integrity of a backup directory.
 *
 * @param {string} backupDir - Path to backup directory
 * @returns {{ valid: boolean, errors: string[], manifest: Object, fileResults: Array<Object> }}
 */
export function verifyBackupIntegrity(backupDir) {
  const errors = [];
  const fileResults = [];

  console.log('========================================================================');
  console.log(`▶ VERIFYING BACKUP INTEGRITY: [${backupDir}]`);
  console.log('========================================================================');

  if (!fs.existsSync(backupDir)) {
    return { valid: false, errors: [`Backup directory does not exist: ${backupDir}`], fileResults };
  }

  const manifestPath = path.join(backupDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { valid: false, errors: [`manifest.json not found in ${backupDir}`], fileResults };
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    return { valid: false, errors: [`Corrupted manifest.json JSON: ${err.message}`], fileResults };
  }

  // 1. Validate manifest schema
  const manifestValidation = validateBackupManifest(manifest);
  if (!manifestValidation.valid) {
    errors.push(...manifestValidation.errors);
  }

  // 2. Verify all database dump files
  for (const dbName of REQUIRED_SERVICE_DATABASES) {
    const dbEntry = manifest.databases ? manifest.databases.find((d) => d.name === dbName) : null;
    if (!dbEntry) {
      errors.push(`Manifest does not contain entry for required database '${dbName}'`);
      continue;
    }

    const filePath = path.join(backupDir, dbEntry.file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Referenced backup file missing on disk: ${dbEntry.file}`);
      fileResults.push({ name: dbName, file: dbEntry.file, exists: false, integrity: 'MISSING' });
      continue;
    }

    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      errors.push(`Backup file '${dbEntry.file}' is 0 bytes (empty dump)`);
      fileResults.push({ name: dbName, file: dbEntry.file, exists: true, size: 0, integrity: 'EMPTY' });
      continue;
    }

    // Cryptographic Checksum Verification
    const computedHash = computeSha256(filePath);
    const checksumCheck = validateChecksum(fs.readFileSync(filePath), dbEntry.sha256);

    if (!checksumCheck.matched) {
      errors.push(
        `CHECKSUM MISMATCH on '${dbEntry.file}'! Expected ${dbEntry.sha256}, got ${computedHash}`,
      );
      fileResults.push({
        name: dbName,
        file: dbEntry.file,
        size: stats.size,
        expectedSha: dbEntry.sha256,
        computedSha: computedHash,
        integrity: 'CORRUPTED',
      });
    } else {
      fileResults.push({
        name: dbName,
        file: dbEntry.file,
        size: stats.size,
        sha256: computedHash,
        integrity: 'VALID',
      });
    }
  }

  const isValid = errors.length === 0;

  console.log('\n--- BACKUP VERIFICATION RESULTS ---');
  for (const res of fileResults) {
    console.log(`  ${res.name.padEnd(16)} | File: ${res.file.padEnd(20)} | Integrity: [${res.integrity}]`);
  }

  if (isValid) {
    console.log('\n✓ BACKUP INTEGRITY VERIFIED: All 6 databases match cryptographic SHA-256 checksums.');
  } else {
    console.error('\n✗ BACKUP INTEGRITY FAILED:');
    errors.forEach((e) => console.error(`  - ${e}`));
  }

  return {
    valid: isValid,
    errors,
    manifest,
    fileResults,
  };
}

// CLI Execution
function main() {
  const args = process.argv.slice(2);
  const getArg = (flag, def) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
  };

  const backupDirArg = getArg('--backup', null);
  const backupDir = backupDirArg || findLatestBackupDir();

  if (!backupDir) {
    console.error('No backup directory specified and no backups found in backups/');
    process.exit(1);
  }

  const result = verifyBackupIntegrity(backupDir);
  process.exit(result.valid ? 0 : 1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
