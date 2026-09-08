/**
 * Injects safe connection pool parameters (connection_limit, pool_timeout) into a PostgreSQL connection URL.
 * Respects existing URL query parameters unless explicitly overridden by environment variables.
 *
 * Sizing guide for PostgreSQL (max_connections = 100):
 * - order-svc: 10
 * - catalog-svc: 10
 * - payment-svc: 8
 * - identity-svc: 8
 * - fulfillment-svc: 8
 * - notification-svc: 6
 * Total 1 replica = 50 conns (50 headroom)
 * Total 2 replicas = 100 conns (100% capacity)
 *
 * @param {string} rawUrl - The original database URL
 * @param {Object} [options]
 * @param {string} [options.serviceName] - Name of the service (e.g. 'order-svc', 'catalog')
 * @param {number} [options.defaultPoolSize=10] - Default pool size if not configured
 * @param {number} [options.defaultTimeout=30] - Default acquisition timeout in seconds
 * @returns {string} The database URL with connection_limit and pool_timeout configured
 */
export function configureDatabaseUrl(
  rawUrl,
  { serviceName = '', defaultPoolSize = 10, defaultTimeout = 30 } = {},
) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return rawUrl;
  }

  try {
    const url = new URL(rawUrl);

    // 1. Resolve connection pool size
    // Priority: SERVICE_DATABASE_POOL_SIZE -> DATABASE_POOL_SIZE -> existing URL param -> defaultPoolSize
    const sanitizedServiceName = serviceName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const serviceSpecificEnvKey = sanitizedServiceName
      ? `${sanitizedServiceName}_DATABASE_POOL_SIZE`
      : null;

    const envPoolSize =
      (serviceSpecificEnvKey && process.env[serviceSpecificEnvKey]) ||
      process.env.DATABASE_POOL_SIZE ||
      null;

    if (envPoolSize !== null && envPoolSize !== undefined) {
      const parsedSize = parseInt(envPoolSize, 10);
      if (!isNaN(parsedSize) && parsedSize > 0) {
        url.searchParams.set('connection_limit', String(parsedSize));
      }
    } else if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', String(defaultPoolSize));
    }

    // 2. Resolve pool timeout
    // Priority: DATABASE_POOL_TIMEOUT -> existing URL param -> defaultTimeout
    const envTimeout = process.env.DATABASE_POOL_TIMEOUT;
    if (envTimeout !== null && envTimeout !== undefined) {
      const parsedTimeout = parseInt(envTimeout, 10);
      if (!isNaN(parsedTimeout) && parsedTimeout > 0) {
        url.searchParams.set('pool_timeout', String(parsedTimeout));
      }
    } else if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', String(defaultTimeout));
    }

    return url.toString();
  } catch {
    // If URL parsing fails, return rawUrl unchanged
    return rawUrl;
  }
}
