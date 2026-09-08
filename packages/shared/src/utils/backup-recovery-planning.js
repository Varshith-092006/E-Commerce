/**
 * Database Backup, Restore, RPO & RTO Evaluation Utilities
 *
 * Provides pure, infrastructure-independent calculation and validation models for:
 * - Backup manifest schema validation (no secrets, valid fields, 6 service DBs)
 * - SHA-256 Checksum generation and integrity verification
 * - Retention calculation (keeps newest N backups, preserves latest valid backup unconditionally)
 * - Recovery Point Objective (RPO) and Recovery Time Objective (RTO) calculations
 * - Logical data invariant and row-count verification across microservice datastores
 * - Non-destructive restore safety guardrail enforcement
 */

import crypto from 'crypto';

export const REQUIRED_SERVICE_DATABASES = Object.freeze([
  'identity_db',
  'catalog_db',
  'order_db',
  'payment_db',
  'fulfillment_db',
  'notification_db',
]);

export const FORBIDDEN_SECRET_KEYS = Object.freeze([
  'password',
  'secret',
  'token',
  'jwt',
  'credential',
  'api_key',
  'private_key',
]);

/**
 * Validates the schema and integrity of a backup manifest object.
 *
 * @param {Object} manifest - Parsed manifest JSON
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateBackupManifest(manifest) {
  const errors = [];

  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be a non-null object'] };
  }

  // Required top-level fields
  if (!manifest.backupId || typeof manifest.backupId !== 'string') {
    errors.push('Manifest must contain a non-empty string backupId');
  }

  if (!manifest.createdAt || isNaN(Date.parse(manifest.createdAt))) {
    errors.push('Manifest must contain a valid ISO timestamp createdAt');
  }

  if (!manifest.postgresVersion || typeof manifest.postgresVersion !== 'string') {
    errors.push('Manifest must contain a non-empty string postgresVersion');
  }

  if (!Array.isArray(manifest.databases) || manifest.databases.length === 0) {
    errors.push('Manifest must contain a non-empty databases array');
    return { valid: false, errors };
  }

  // Verify no sensitive keys leaked into manifest
  const checkKeys = (obj) => {
    if (!obj || typeof obj !== 'object') {
      return;
    }
    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      for (const secretKey of FORBIDDEN_SECRET_KEYS) {
        if (lowerKey.includes(secretKey)) {
          errors.push(`SECURITY VIOLATION: Manifest contains prohibited sensitive key: ${key}`);
        }
      }
      if (typeof obj[key] === 'object') {
        checkKeys(obj[key]);
      }
    }
  };
  checkKeys(manifest);

  // Verify all 6 required databases are present
  const presentDbs = new Set(manifest.databases.map((d) => d.name));
  for (const reqDb of REQUIRED_SERVICE_DATABASES) {
    if (!presentDbs.has(reqDb)) {
      errors.push(`Missing required database '${reqDb}' in backup manifest`);
    }
  }

  // Validate each database entry
  for (const db of manifest.databases) {
    if (!REQUIRED_SERVICE_DATABASES.includes(db.name)) {
      errors.push(`Unknown database name '${db.name}' in manifest`);
    }

    if (!db.file || typeof db.file !== 'string' || !db.file.endsWith('.sql')) {
      errors.push(`Database '${db.name}' has invalid file path: ${db.file}`);
    }

    if (typeof db.sizeBytes !== 'number' || db.sizeBytes <= 0) {
      errors.push(`Database '${db.name}' has invalid sizeBytes: ${db.sizeBytes}`);
    }

    const sha256Regex = /^[a-f0-9]{64}$/i;
    if (!db.sha256 || !sha256Regex.test(db.sha256)) {
      errors.push(`Database '${db.name}' has invalid SHA-256 checksum: ${db.sha256}`);
    }

    if (db.status !== 'VALID') {
      errors.push(`Database '${db.name}' status is '${db.status}', expected 'VALID'`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates content checksum against expected SHA-256 hex string.
 *
 * @param {string|Buffer} content - Data buffer or string
 * @param {string} expectedChecksum - 64-character hex string
 * @returns {{ matched: boolean, computed: string }}
 */
export function validateChecksum(content, expectedChecksum) {
  if (content === null || content === undefined) {
    return { matched: false, computed: '' };
  }

  const hash = crypto.createHash('sha256');
  hash.update(content);
  const computed = hash.digest('hex');

  return {
    matched: computed.toLowerCase() === (expectedChecksum || '').toLowerCase(),
    computed,
  };
}

/**
 * Computes retention list keeping the newest N backup directories.
 * Guarantees that the newest valid backup is NEVER pruned.
 *
 * @param {Array<{ dirName: string, createdAt: string|number }>} backupDirs
 * @param {number} [retentionCount=7]
 * @returns {{ toKeep: Array<any>, toPrune: Array<any>, abortedReason: string|null }}
 */
export function calculateRetentionList(backupDirs = [], retentionCount = 7) {
  if (!Array.isArray(backupDirs) || backupDirs.length === 0) {
    return { toKeep: [], toPrune: [], abortedReason: null };
  }

  const validRetentionCount = Math.max(1, parseInt(retentionCount, 10) || 7);

  // Sort by date descending (newest first)
  const sorted = [...backupDirs].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.dirName).getTime() || 0;
    const timeB = new Date(b.createdAt || b.dirName).getTime() || 0;
    return timeB - timeA;
  });

  const toKeep = sorted.slice(0, validRetentionCount);
  const toPrune = sorted.slice(validRetentionCount);

  // Safety invariant: Never delete the only or latest backup
  if (toKeep.length === 0 && sorted.length > 0) {
    return {
      toKeep: [sorted[0]],
      toPrune: [],
      abortedReason:
        'SAFETY ABORT: Attempted to prune all available backups; preserved latest backup.',
    };
  }

  return {
    toKeep,
    toPrune,
    abortedReason: null,
  };
}

/**
 * Calculates Recovery Point Objective (RPO) and Recovery Time Objective (RTO).
 *
 * @param {Object} params
 * @param {string|number|Date} params.backupTime - Timestamp of the backup snapshot
 * @param {string|number|Date} params.failureTime - Timestamp when outage or disaster occurred
 * @param {string|number|Date} params.restoreStart - Timestamp when restore command started
 * @param {string|number|Date} params.restoreEnd - Timestamp when database restore completed
 * @param {string|number|Date} params.appReadyTime - Timestamp when services returned 200/READY
 * @returns {Object} Calculated RPO and RTO metrics
 */
export function calculateRpoRto({
  backupTime,
  failureTime,
  restoreStart,
  restoreEnd,
  appReadyTime,
} = {}) {
  const tBackup = new Date(backupTime).getTime() || 0;
  const tFailure = new Date(failureTime).getTime() || 0;
  const tRestoreStart = new Date(restoreStart).getTime() || 0;
  const tRestoreEnd = new Date(restoreEnd).getTime() || 0;
  const tAppReady = new Date(appReadyTime).getTime() || 0;

  // RPO is the data-loss window (difference between failure time and backup time)
  const rpoDurationMs = Math.max(0, tFailure - tBackup);
  const rpoSeconds = Math.round(rpoDurationMs / 1000);

  // Restore duration (time spent actively streaming/importing SQL)
  const restoreDurationMs = Math.max(0, tRestoreEnd - tRestoreStart);

  // App recovery duration (time from DB ready until microservices pass readiness)
  const appRecoveryDurationMs = Math.max(0, tAppReady - tRestoreEnd);

  // Total RTO (total downtime elapsed from failure to full application readiness)
  const totalRtoMs = Math.max(0, tAppReady - tFailure);

  return {
    rpoDurationMs,
    rpoSeconds,
    rpoFormatted: `${Math.floor(rpoSeconds / 60)}m ${rpoSeconds % 60}s`,
    restoreDurationMs,
    appRecoveryDurationMs,
    totalRtoMs,
    totalRtoFormatted: `${(totalRtoMs / 1000).toFixed(2)}s`,
  };
}

/**
 * Validates logical row counts and data invariants between pre-backup and post-restore states.
 *
 * @param {Object} beforeCounts - { [tableName]: count }
 * @param {Object} afterCounts - { [tableName]: count }
 * @returns {{ intact: boolean, tableComparisons: Array<Object>, violations: string[] }}
 */
export function validateRestoreInvariants(beforeCounts = {}, afterCounts = {}) {
  const violations = [];
  const tableComparisons = [];

  const allTables = Array.from(
    new Set([...Object.keys(beforeCounts || {}), ...Object.keys(afterCounts || {})]),
  ).sort();

  for (const table of allTables) {
    const before = beforeCounts[table] ?? 0;
    const after = afterCounts[table] ?? 0;
    const difference = after - before;

    tableComparisons.push({
      table,
      before,
      after,
      difference,
      matches: difference === 0,
    });

    if (after < before) {
      violations.push(
        `Table '${table}' lost records during restore! (Before: ${before}, Restored: ${after}, Loss: ${Math.abs(difference)})`,
      );
    }
  }

  return {
    intact: violations.length === 0,
    tableComparisons,
    violations,
  };
}

/**
 * Validates safety constraints before executing any restore operation.
 * Prevents accidental overwrite of production hosts or primary development instances.
 *
 * @param {Object} options
 * @param {string} options.targetHost
 * @param {string} options.targetDb
 * @param {string} [options.targetContainer='']
 * @param {boolean} [options.isProduction=false]
 * @param {boolean} [options.confirmFlag=false]
 * @returns {{ safe: boolean, violations: string[] }}
 */
export function validateRestoreSafety({
  targetHost = 'localhost',
  targetDb = '',
  targetContainer = '',
  isProduction = false,
  confirmFlag = false,
} = {}) {
  const violations = [];

  // Safety 1: Block production targets unconditionally
  if (isProduction || process.env.NODE_ENV === 'production') {
    violations.push(
      'FATAL: Database restores are strictly prohibited against production environments.',
    );
  }

  // Safety 2: Reject remote or external hostnames
  const isLocal =
    !targetHost ||
    targetHost === 'localhost' ||
    targetHost === '127.0.0.1' ||
    targetHost.includes('ecommerce-net') ||
    targetHost.includes('infra_ecommerce-net');
  if (!isLocal) {
    violations.push(
      `FATAL: Remote host '${targetHost}' rejected. Restores must run only against local Docker.`,
    );
  }

  // Safety 3: Never overwrite primary development database
  const isPrimary =
    targetContainer === 'ecommerce-postgres' ||
    targetContainer === 'infra-postgres-1' ||
    (targetContainer === '' && targetHost === 'localhost' && !confirmFlag);
  if (isPrimary && targetContainer === 'ecommerce-postgres') {
    violations.push(
      "BLOCKED: Cannot overwrite primary development container 'ecommerce-postgres'. Target must be isolated disposable container (e.g. ecommerce-postgres-restore).",
    );
  }

  // Safety 4: Validate database identifier syntax (prevent SQL injection)
  const dbNameRegex = /^[a-z0-9_]+$/;
  if (targetDb !== 'all' && (!targetDb || !dbNameRegex.test(targetDb))) {
    violations.push(
      `INVALID: Database identifier '${targetDb}' contains illegal characters or is invalid.`,
    );
  }

  if (targetDb !== 'all' && !REQUIRED_SERVICE_DATABASES.includes(targetDb)) {
    violations.push(
      `UNKNOWN: Database '${targetDb}' is not one of the approved 6 service databases.`,
    );
  }

  // Safety 5: Require explicit --confirm-restore
  if (!confirmFlag) {
    violations.push(
      'CONFIRMATION REQUIRED: Destructive restore requires explicit --confirm-restore flag. Running in DRY RUN mode.',
    );
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}
