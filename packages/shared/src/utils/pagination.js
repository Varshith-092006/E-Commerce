const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parses and bounds pagination parameters from a request query
 *
 * @param {Object} query - Express request query object
 * @param {Object} [options]
 * @param {number} [options.defaultLimit=20]
 * @param {number} [options.maxLimit=100]
 * @returns {{ page: number, limit: number, skip: number }}
 */
export function parsePagination(
  query = {},
  { defaultLimit = DEFAULT_LIMIT, maxLimit = MAX_LIMIT } = {},
) {
  const rawPage = parseInt(query.page, 10);
  const rawLimit = parseInt(query.limit, 10);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;
  let limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;

  if (limit > maxLimit) {
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
  const totalPages = Math.ceil(total / limit) || (total === 0 ? 0 : 1);

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
