import { BadRequestError } from '../errors/specific-errors.js';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 100;

/**
 * Parses and bounds offset pagination parameters from a request query
 *
 * @param {Object} query - Express request query object
 * @param {Object} [options]
 * @param {number} [options.defaultLimit=20]
 * @param {number} [options.maxLimit=100]
 * @param {number} [options.minLimit=1]
 * @returns {{ page: number, limit: number, skip: number }}
 */
export function parsePagination(
  query = {},
  { defaultLimit = DEFAULT_LIMIT, maxLimit = MAX_LIMIT, minLimit = MIN_LIMIT } = {},
) {
  const rawPage = parseInt(query.page, 10);
  const rawLimit = parseInt(query.limit, 10);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;
  let limit = Number.isInteger(rawLimit) ? rawLimit : defaultLimit;

  if (limit < minLimit) {
    limit = minLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

/**
 * Builds standard pagination metadata for API responses
 *
 * @param {Object} options
 * @param {number} options.page - Current page
 * @param {number} options.limit - Items per page
 * @param {number} options.total - Total count of records
 * @returns {Object} Pagination metadata
 */
export function buildPaginationMeta({ page, limit, total }) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const totalPages = Math.ceil(safeTotal / limit) || (safeTotal === 0 ? 0 : 1);

  return {
    page,
    limit,
    total: safeTotal,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Encodes deterministic record fields into an opaque URL-safe base64 cursor
 *
 * @param {Object} data - Deterministic fields (e.g. { id, createdAt })
 * @returns {string} Base64url-encoded cursor string
 */
export function encodeCursor(data) {
  if (!data || typeof data !== 'object') {
    throw new BadRequestError('Cannot encode invalid cursor data');
  }
  const payload = {
    id: String(data.id || ''),
    createdAt: data.createdAt || data.created_at || null,
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

/**
 * Decodes and validates an opaque base64url cursor
 *
 * @param {string} cursorString - The raw cursor string from query
 * @returns {{ id: string, createdAt: string }|null}
 * @throws {BadRequestError} When cursor is malformed or invalid
 */
export function decodeCursor(cursorString) {
  if (!cursorString) {
    return null;
  }

  if (typeof cursorString !== 'string' || cursorString.trim().length === 0) {
    throw new BadRequestError('Malformed or invalid cursor: Cursor must be a non-empty string');
  }

  try {
    const jsonStr = Buffer.from(cursorString.trim(), 'base64url').toString('utf8');
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== 'object' || !parsed.id) {
      throw new Error('Missing required cursor fields');
    }

    // Verify date is valid if provided
    if (parsed.createdAt && isNaN(Date.parse(parsed.createdAt))) {
      throw new Error('Invalid cursor timestamp');
    }

    return {
      id: String(parsed.id),
      createdAt: parsed.createdAt ? new Date(parsed.createdAt).toISOString() : null,
    };
  } catch (err) {
    throw new BadRequestError('Malformed or invalid cursor format', {
      cursor: cursorString,
      reason: err.message,
    });
  }
}

/**
 * Parses cursor pagination parameters from a request query
 *
 * @param {Object} query - Express request query
 * @param {Object} [options]
 * @param {number} [options.defaultLimit=20]
 * @param {number} [options.maxLimit=100]
 * @param {number} [options.minLimit=1]
 * @returns {{ cursor: { id: string, createdAt: string }|null, rawCursor: string|null, limit: number }}
 */
export function parseCursorPagination(
  query = {},
  { defaultLimit = DEFAULT_LIMIT, maxLimit = MAX_LIMIT, minLimit = MIN_LIMIT } = {},
) {
  const rawLimit = parseInt(query.limit, 10);
  let limit = Number.isInteger(rawLimit) ? rawLimit : defaultLimit;

  if (limit < minLimit) {
    limit = minLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }

  const rawCursor = query.cursor ? String(query.cursor).trim() : null;
  const cursor = rawCursor ? decodeCursor(rawCursor) : null;

  return {
    cursor,
    rawCursor,
    limit,
  };
}

/**
 * Constructs cursor pagination response metadata and slices the (limit + 1) items array
 *
 * @param {Object} options
 * @param {Array} options.items - The items fetched with take: limit + 1
 * @param {number} options.limit - The requested limit
 * @param {Function} [options.getCursorFn] - Custom function to extract cursor data from an item
 * @returns {{ items: Array, pagination: { limit: number, nextCursor: string|null, hasNextPage: boolean, count: number } }}
 */
export function buildCursorPaginationMeta({
  items = [],
  limit = DEFAULT_LIMIT,
  getCursorFn = null,
}) {
  const hasNextPage = items.length > limit;
  const slicedItems = hasNextPage ? items.slice(0, limit) : items;

  let nextCursor = null;
  if (hasNextPage && slicedItems.length > 0) {
    const lastItem = slicedItems[slicedItems.length - 1];
    const cursorData = getCursorFn
      ? getCursorFn(lastItem)
      : {
          id: lastItem.id,
          createdAt: lastItem.created_at || lastItem.createdAt,
        };
    nextCursor = encodeCursor(cursorData);
  }

  return {
    items: slicedItems,
    pagination: {
      limit,
      nextCursor,
      hasNextPage,
      count: slicedItems.length,
    },
  };
}
