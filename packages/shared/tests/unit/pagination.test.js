import { parsePagination, buildPaginationMeta } from '../../src/index.js';

describe('Pagination Utilities', () => {
  it('parses default pagination when query is empty', () => {
    const result = parsePagination({});
    expect(result).toEqual({
      page: 1,
      limit: 20,
      skip: 0,
    });
  });

  it('parses valid page and limit parameters', () => {
    const result = parsePagination({ page: '3', limit: '15' });
    expect(result).toEqual({
      page: 3,
      limit: 15,
      skip: 30,
    });
  });

  it('bounds limit to maxLimit', () => {
    const result = parsePagination({ page: '1', limit: '500' }, { maxLimit: 100 });
    expect(result.limit).toBe(100);
  });

  it('handles negative or invalid page values gracefully', () => {
    const result = parsePagination({ page: '-5', limit: 'invalid' });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.skip).toBe(0);
  });

  it('buildPaginationMeta calculates totalPages, hasNext, and hasPrev correctly', () => {
    const meta = buildPaginationMeta({ page: 2, limit: 10, total: 35 });
    expect(meta).toEqual({
      pagination: {
        page: 2,
        limit: 10,
        total: 35,
        totalPages: 4,
        hasNext: true,
        hasPrev: true,
      },
    });
  });

  it('buildPaginationMeta handles edge case when total is 0', () => {
    const meta = buildPaginationMeta({ page: 1, limit: 20, total: 0 });
    expect(meta.pagination.totalPages).toBe(0);
    expect(meta.pagination.hasNext).toBe(false);
    expect(meta.pagination.hasPrev).toBe(false);
  });
});
