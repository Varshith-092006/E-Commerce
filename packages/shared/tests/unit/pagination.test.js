import {
  parsePagination,
  buildPaginationMeta,
  encodeCursor,
  decodeCursor,
  parseCursorPagination,
  buildCursorPaginationMeta,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
} from '../../src/utils/pagination.js';
import { BadRequestError } from '../../src/errors/specific-errors.js';

describe('Shared Pagination Utilities Unit Tests', () => {
  describe('Offset Pagination', () => {
    test('uses default limit and page 1 when query is empty', () => {
      const result = parsePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(DEFAULT_LIMIT);
      expect(result.skip).toBe(0);
    });

    test('enforces minimum limit of 1 and bounds negative limits', () => {
      const result = parsePagination({ limit: -5, page: 1 });
      expect(result.limit).toBe(MIN_LIMIT);
      expect(result.skip).toBe(0);

      const zeroResult = parsePagination({ limit: 0, page: 2 });
      expect(zeroResult.limit).toBe(MIN_LIMIT);
      expect(zeroResult.skip).toBe(1);
    });

    test('enforces maximum limit cap of 100 on large numbers', () => {
      const result = parsePagination({ limit: 999999, page: 3 });
      expect(result.limit).toBe(MAX_LIMIT);
      expect(result.skip).toBe(200);
    });

    test('falls back to page 1 on invalid page input', () => {
      const negativePage = parsePagination({ page: -1, limit: 10 });
      expect(negativePage.page).toBe(1);
      expect(negativePage.skip).toBe(0);

      const nanPage = parsePagination({ page: 'abc', limit: 10 });
      expect(nanPage.page).toBe(1);
      expect(nanPage.skip).toBe(0);
    });

    test('builds correct pagination metadata for first, middle, and last pages', () => {
      // Middle page
      const meta = buildPaginationMeta({ page: 2, limit: 20, total: 60 });
      expect(meta).toEqual({
        page: 2,
        limit: 20,
        total: 60,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
        hasNext: true,
        hasPrev: true,
      });

      // Last page
      const lastMeta = buildPaginationMeta({ page: 3, limit: 20, total: 60 });
      expect(lastMeta.hasNextPage).toBe(false);
      expect(lastMeta.hasPreviousPage).toBe(true);

      // Empty result
      const emptyMeta = buildPaginationMeta({ page: 1, limit: 20, total: 0 });
      expect(emptyMeta.total).toBe(0);
      expect(emptyMeta.totalPages).toBe(0);
      expect(emptyMeta.hasNextPage).toBe(false);
      expect(emptyMeta.hasPreviousPage).toBe(false);
    });
  });

  describe('Cursor Pagination', () => {
    test('encodes and decodes opaque base64url cursor deterministically', () => {
      const original = { id: 'uuid-1234', createdAt: '2026-09-06T12:00:00.000Z' };
      const cursor = encodeCursor(original);

      expect(typeof cursor).toBe('string');
      expect(cursor).not.toContain('+');
      expect(cursor).not.toContain('/');

      const decoded = decodeCursor(cursor);
      expect(decoded.id).toBe(original.id);
      expect(decoded.createdAt).toBe(original.createdAt);
    });

    test('rejects malformed or invalid cursors with 400 BadRequestError', () => {
      expect(() => decodeCursor('not_valid_base64_json!@#')).toThrow(BadRequestError);
      expect(() => decodeCursor(Buffer.from('not json').toString('base64url'))).toThrow(
        BadRequestError,
      );
      expect(() =>
        decodeCursor(Buffer.from(JSON.stringify({ noId: true })).toString('base64url')),
      ).toThrow(BadRequestError);
      expect(() =>
        decodeCursor(
          Buffer.from(JSON.stringify({ id: '1', createdAt: 'invalid-date' })).toString('base64url'),
        ),
      ).toThrow(BadRequestError);
    });

    test('returns null when cursor is empty, undefined or null', () => {
      expect(decodeCursor(null)).toBeNull();
      expect(decodeCursor(undefined)).toBeNull();
      expect(decodeCursor('')).toBeNull();
    });

    test('parseCursorPagination bounds limit and decodes valid cursor', () => {
      const validCursor = encodeCursor({ id: 'uuid-1', createdAt: '2026-09-06T00:00:00.000Z' });
      const parsed = parseCursorPagination({
        cursor: validCursor,
        limit: '500',
      });

      expect(parsed.limit).toBe(MAX_LIMIT);
      expect(parsed.cursor.id).toBe('uuid-1');
      expect(parsed.rawCursor).toBe(validCursor);
    });

    test('buildCursorPaginationMeta generates nextCursor when hasNextPage is true', () => {
      const items = [
        { id: '1', created_at: new Date('2026-09-06T03:00:00Z') },
        { id: '2', created_at: new Date('2026-09-06T02:00:00Z') },
        { id: '3', created_at: new Date('2026-09-06T01:00:00Z') },
      ];

      // Request limit 2, got 3 items (limit + 1)
      const result = buildCursorPaginationMeta({ items, limit: 2 });
      expect(result.items.length).toBe(2);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.nextCursor).toBeTruthy();

      // Decode generated nextCursor - should point to item 2
      const decoded = decodeCursor(result.pagination.nextCursor);
      expect(decoded.id).toBe('2');
    });

    test('buildCursorPaginationMeta sets nextCursor to null on last page', () => {
      const items = [
        { id: '1', created_at: new Date('2026-09-06T03:00:00Z') },
        { id: '2', created_at: new Date('2026-09-06T02:00:00Z') },
      ];

      // Request limit 2, got 2 items (no extra item)
      const result = buildCursorPaginationMeta({ items, limit: 2 });
      expect(result.items.length).toBe(2);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.nextCursor).toBeNull();
    });
  });
});
