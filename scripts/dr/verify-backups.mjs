#!/usr/bin/env node

/**
 * Phase 12 Disaster Recovery Backup Integrity Verification Tool
 *
 * Verifies the integrity of backup archives without requiring database restore:
 * - Validates backup manifest schema and presence of all 6 microservice databases
 * - Verifies presence and non-emptiness of all .sql dump files
 * - Computes and cross-checks SHA-256 cryptographic checksums against manifest
 * - Reusable by DR reconstruction runners and automated CI/CD checks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  REQUIRED_SERVICE_DATABASES,
  validateBackupManifest,
  validateChecksum,
} from '../../packages/shared/src/utils/backup-recovery-planning.js';
import { computeSha256, findLatestBackupDir } from '../verify-backups.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const DEFAULT_BACKUPS_BASE = path.join(ROOT_DIR, 'backups');

export function verifyDrBackup(backupDir) {
  const targetDir = backupDir || findLatestBackupDir(DEFAULT_BACKUPS_BASE);

  console.log('========================================================================');
  console.log(`▶ [DR BACKUP VERIFICATION] Archive: ${targetDir || 'NONE FOUND'}`);
  console.log('========================================================================');

  if (!targetDir || !fs.existsSync(targetDir)) {
    return {
      valid: false,
      backupDir: targetDir,
      errors: [`Backup directory does not exist: ${targetDir}`],
      fileResults: [],
    };
  }

  const manifestPath = path.join(targetDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return {
      valid: false,
      backupDir: targetDir,
      errors: [`manifest.json not found in ${targetDir}`],
      fileResults: [],
    };
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    return {
      valid: false,
      backupDir: targetDir,
      errors: [`Corrupted manifest.json JSON: ${err.message}`],
      fileResults: [],
    };
  }

  const manifestValidation = validateBackupManifest(manifest);
  const errors = [...manifestValidation.errors];
  const fileResults = [];

  for (const dbName of REQUIRED_SERVICE_DATABASES) {
    const entry = manifest.databases ? manifest.databases.find((d) => d.name === dbName) : null;
    if (!entry) {
      errors.push(`Missing database entry in manifest: ${dbName}`);
      fileResults.push({ name: dbName, status: 'MISSING_IN_MANIFEST' });
      continue;
    }

    const dumpFilePath = path.join(targetDir, entry.file);
    if (!fs.existsSync(dumpFilePath)) {
      errors.push(`Dump file missing on disk: ${entry.file}`);
      fileResults.push({ name: dbName, file: entry.file, status: 'FILE_MISSING' });
      continue;
    }

    const stat = fs.statSync(dumpFilePath);
    if (stat.size === 0) {
      errors.push(`Dump file is empty (0 bytes): ${entry.file}`);
      fileResults.push({ name: dbName, file: entry.file, status: 'EMPTY_FILE' });
      continue;
    }

    const computedHash = computeSha256(dumpFilePath);
    const checksumMatch = validateChecksum(fs.readFileSync(dumpFilePath), entry.sha256).matched;

    if (!checksumMatch) {
      errors.push(
        `SHA-256 MISMATCH for ${entry.file}: expected ${entry.sha256}, computed ${computedHash}`,
      );
      fileResults.push({
        name: dbName,
        file: entry.file,
        status: 'CORRUPTED',
        expected: entry.sha256,
        computed: computedHash,
      });
    } else {
      fileResults.push({
        name: dbName,
        file: entry.file,
        sizeBytes: stat.size,
        status: 'VALID',
        sha256: computedHash,
      });
    }
  }

  const valid = errors.length === 0;

  console.log('\n--- VERIFICATION RESULTS ---');
  fileResults.forEach((r) => {
    console.log(`  ${r.name.padEnd(18)} | File: ${(r.file || '').padEnd(20)} | Status: [${r.status}]`);
  });

  if (valid) {
    console.log(`\n✓ SUCCESS: All 6 databases verified with valid SHA-256 cryptographic checksums.`);
  } else {
    console.error(`\n✗ INTEGRITY FAILURE: ${errors.length} error(s) detected:`);
    errors.forEach((e) => console.error(`  - ${e}`));
  }

  return {
    valid,
    backupDir: targetDir,
    manifest,
    errors,
    fileResults,
  };
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  const backupIdx = args.indexOf('--backup');
  const backupDirArg = backupIdx !== -1 && args[backupIdx + 1] ? args[backupIdx + 1] : null;

  try {
    const res = verifyDrBackup(backupDirArg);
    process.exit(res.valid ? 0 : 1);
  } catch (err) {
    console.error('FATAL VERIFICATION ERROR:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
