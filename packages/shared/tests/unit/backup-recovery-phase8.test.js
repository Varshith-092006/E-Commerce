import {
  validateBackupManifest,
  validateChecksum,
  calculateRetentionList,
  calculateRpoRto,
  validateRestoreInvariants,
  validateRestoreSafety,
  REQUIRED_SERVICE_DATABASES,
} from '../../src/utils/backup-recovery-planning.js';

describe('Phase 8: Database Backup, Restore, RPO & RTO Utilities', () => {
  const mockValidManifest = {
    backupId: 'backup_2026-09-07_22-00-00',
    createdAt: '2026-09-07T16:30:00.000Z',
    postgresVersion: 'PostgreSQL 16.15',
    databases: REQUIRED_SERVICE_DATABASES.map((name) => ({
      name,
      file: `${name}.sql`,
      sizeBytes: 15420,
      sha256: 'a'.repeat(64),
      status: 'VALID',
    })),
  };

  describe('Manifest Schema Validation', () => {
    it('accepts a fully compliant backup manifest', () => {
      const result = validateBackupManifest(mockValidManifest);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects null or non-object manifest', () => {
      expect(validateBackupManifest(null).valid).toBe(false);
      expect(validateBackupManifest(undefined).valid).toBe(false);
      expect(validateBackupManifest('string').valid).toBe(false);
    });

    it('rejects manifest missing required service databases', () => {
      const invalid = {
        ...mockValidManifest,
        databases: mockValidManifest.databases.slice(0, 3), // Missing 3 DBs
      };

      const result = validateBackupManifest(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Missing required database'))).toBe(true);
    });

    it('rejects manifest with sensitive secret keys (passwords, tokens, jwt)', () => {
      const leakyManifest = {
        ...mockValidManifest,
        admin_password: 'supersecretpassword123',
      };

      const result = validateBackupManifest(leakyManifest);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('SECURITY VIOLATION'))).toBe(true);
    });

    it('rejects manifest with invalid or non-hex SHA-256 checksums', () => {
      const invalid = {
        ...mockValidManifest,
        databases: mockValidManifest.databases.map((db, idx) =>
          idx === 0 ? { ...db, sha256: 'not-a-valid-sha256' } : db,
        ),
      };

      const result = validateBackupManifest(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('invalid SHA-256 checksum'))).toBe(true);
    });

    it('rejects database status other than VALID', () => {
      const invalid = {
        ...mockValidManifest,
        databases: mockValidManifest.databases.map((db, idx) =>
          idx === 0 ? { ...db, status: 'FAILED' } : db,
        ),
      };

      const result = validateBackupManifest(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('expected \'VALID\''))).toBe(true);
    });
  });

  describe('Checksum Validation', () => {
    it('accurately computes and verifies SHA-256 checksum', () => {
      const sampleContent = 'CREATE TABLE test_table (id SERIAL PRIMARY KEY);';
      // Known sha256 for sampleContent
      const computed = validateChecksum(sampleContent, 'arbitrary').computed;
      const verified = validateChecksum(sampleContent, computed);

      expect(verified.matched).toBe(true);
      expect(verified.computed).toBe(computed);
    });

    it('detects tampered content with checksum mismatch', () => {
      const original = 'INSERT INTO orders VALUES (1, 100);';
      const tampered = 'INSERT INTO orders VALUES (1, 999999);';
      const originalChecksum = validateChecksum(original, '').computed;

      const result = validateChecksum(tampered, originalChecksum);
      expect(result.matched).toBe(false);
      expect(result.computed).not.toBe(originalChecksum);
    });

    it('handles null/undefined content gracefully', () => {
      expect(validateChecksum(null, 'abc').matched).toBe(false);
      expect(validateChecksum(undefined, 'abc').matched).toBe(false);
    });
  });

  describe('Retention Policy Calculation', () => {
    it('retains newest N backup directories and flags older sets for pruning', () => {
      const mockBackups = [
        { dirName: 'backup-10', createdAt: '2026-09-07T10:00:00Z' },
        { dirName: 'backup-09', createdAt: '2026-09-07T09:00:00Z' },
        { dirName: 'backup-08', createdAt: '2026-09-07T08:00:00Z' },
        { dirName: 'backup-07', createdAt: '2026-09-07T07:00:00Z' },
        { dirName: 'backup-06', createdAt: '2026-09-07T06:00:00Z' },
        { dirName: 'backup-05', createdAt: '2026-09-07T05:00:00Z' },
        { dirName: 'backup-04', createdAt: '2026-09-07T04:00:00Z' },
        { dirName: 'backup-03', createdAt: '2026-09-07T03:00:00Z' },
        { dirName: 'backup-02', createdAt: '2026-09-07T02:00:00Z' },
        { dirName: 'backup-01', createdAt: '2026-09-07T01:00:00Z' },
      ];

      const { toKeep, toPrune } = calculateRetentionList(mockBackups, 7);

      expect(toKeep).toHaveLength(7);
      expect(toPrune).toHaveLength(3);
      expect(toKeep[0].dirName).toBe('backup-10'); // Newest kept
      expect(toPrune.map((b) => b.dirName)).toEqual(['backup-03', 'backup-02', 'backup-01']);
    });

    it('preserves all backups when total count is less than retention limit', () => {
      const mockBackups = [
        { dirName: 'backup-02', createdAt: '2026-09-07T02:00:00Z' },
        { dirName: 'backup-01', createdAt: '2026-09-07T01:00:00Z' },
      ];

      const { toKeep, toPrune } = calculateRetentionList(mockBackups, 7);
      expect(toKeep).toHaveLength(2);
      expect(toPrune).toHaveLength(0);
    });

    it('never deletes the only/latest backup', () => {
      const singleBackup = [{ dirName: 'backup-latest', createdAt: '2026-09-07T12:00:00Z' }];
      const { toKeep, toPrune } = calculateRetentionList(singleBackup, 1);
      expect(toKeep).toHaveLength(1);
      expect(toPrune).toHaveLength(0);
    });
  });

  describe('RPO & RTO Calculation', () => {
    it('accurately computes RPO window and RTO duration breakdown', () => {
      const backupTime = '2026-09-07T10:00:00.000Z';
      const failureTime = '2026-09-07T10:25:00.000Z'; // Outage 25 minutes later
      const restoreStart = '2026-09-07T10:26:00.000Z';
      const restoreEnd = '2026-09-07T10:28:30.000Z'; // Restore took 2m 30s (150s)
      const appReadyTime = '2026-09-07T10:30:00.000Z'; // App ready 1m 30s later (90s)

      const metrics = calculateRpoRto({
        backupTime,
        failureTime,
        restoreStart,
        restoreEnd,
        appReadyTime,
      });

      expect(metrics.rpoDurationMs).toBe(25 * 60 * 1000); // 25 mins
      expect(metrics.rpoFormatted).toBe('25m 0s');
      expect(metrics.restoreDurationMs).toBe(150 * 1000);
      expect(metrics.appRecoveryDurationMs).toBe(90 * 1000);
      expect(metrics.totalRtoMs).toBe(5 * 60 * 1000); // 10:25 to 10:30 = 5 mins
      expect(metrics.totalRtoFormatted).toBe('300.00s');
    });

    it('safely handles non-monotonic or missing timestamps', () => {
      const metrics = calculateRpoRto({});
      expect(metrics.rpoDurationMs).toBe(0);
      expect(metrics.totalRtoMs).toBe(0);
    });
  });

  describe('Restore Row-Count Invariant Validation', () => {
    it('passes when restored row counts match pre-backup counts exactly', () => {
      const before = { users: 10, products: 50, orders: 120, outbox: 120 };
      const after = { users: 10, products: 50, orders: 120, outbox: 120 };

      const result = validateRestoreInvariants(before, after);
      expect(result.intact).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.tableComparisons).toHaveLength(4);
      expect(result.tableComparisons.every((c) => c.matches)).toBe(true);
    });

    it('detects record loss during restore and reports table violation', () => {
      const before = { users: 10, products: 50, orders: 120 };
      const after = { users: 10, products: 48, orders: 110 }; // Lost 2 products, 10 orders!

      const result = validateRestoreInvariants(before, after);
      expect(result.intact).toBe(false);
      expect(result.violations).toHaveLength(2);
      expect(result.violations.some((v) => v.includes('products'))).toBe(true);
      expect(result.violations.some((v) => v.includes('orders'))).toBe(true);
    });
  });

  describe('Restore Safety Guardrails', () => {
    it('strictly blocks restores against production environments', () => {
      const safety = validateRestoreSafety({
        targetHost: 'localhost',
        targetDb: 'order_db',
        isProduction: true,
        confirmFlag: true,
      });

      expect(safety.safe).toBe(false);
      expect(safety.violations.some((v) => v.includes('strictly prohibited against production'))).toBe(true);
    });

    it('rejects remote or non-local database hosts', () => {
      const safety = validateRestoreSafety({
        targetHost: 'db.production.company.com',
        targetDb: 'order_db',
        confirmFlag: true,
      });

      expect(safety.safe).toBe(false);
      expect(safety.violations.some((v) => v.includes('Remote host'))).toBe(true);
    });

    it('strictly protects primary development database (ecommerce-postgres) from overwrite', () => {
      const safety = validateRestoreSafety({
        targetHost: 'localhost',
        targetDb: 'order_db',
        targetContainer: 'ecommerce-postgres', // Primary instance!
        confirmFlag: true,
      });

      expect(safety.safe).toBe(false);
      expect(safety.violations.some((v) => v.includes('Cannot overwrite primary development container'))).toBe(true);
    });

    it('blocks SQL-injection-like database identifiers', () => {
      const safety = validateRestoreSafety({
        targetHost: 'localhost',
        targetDb: 'order_db; DROP TABLE users;',
        confirmFlag: true,
      });

      expect(safety.safe).toBe(false);
      expect(safety.violations.some((v) => v.includes('contains illegal characters'))).toBe(true);
    });

    it('requires explicit --confirm-restore confirmation flag', () => {
      const safety = validateRestoreSafety({
        targetHost: 'localhost',
        targetDb: 'order_db',
        targetContainer: 'ecommerce-postgres-restore',
        confirmFlag: false, // Dry run
      });

      expect(safety.safe).toBe(false);
      expect(safety.violations.some((v) => v.includes('CONFIRMATION REQUIRED'))).toBe(true);
    });

    it('permits restore against isolated disposable container with confirmation flag', () => {
      const safety = validateRestoreSafety({
        targetHost: 'localhost',
        targetDb: 'order_db',
        targetContainer: 'ecommerce-postgres-restore',
        confirmFlag: true,
      });

      expect(safety.safe).toBe(true);
      expect(safety.violations).toHaveLength(0);
    });
  });
});
