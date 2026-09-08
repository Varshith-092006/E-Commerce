import crypto from 'crypto';

/**
 * Creates a deterministic, short MD5 hash for query objects/strings
 * @param {any} query
 * @returns {string}
 */
export function hashQuery(query) {
  if (!query) {
    return 'all';
  }
  if (typeof query === 'string') {
    return crypto.createHash('md5').update(query.trim()).digest('hex').slice(0, 12);
  }
  try {
    // Sort keys deterministically
    const sortedKeys = Object.keys(query).sort();
    const normalized = {};
    for (const k of sortedKeys) {
      if (query[k] !== undefined && query[k] !== null && query[k] !== '') {
        normalized[k] = query[k];
      }
    }
    const str = JSON.stringify(normalized);
    return crypto.createHash('md5').update(str).digest('hex').slice(0, 12);
  } catch {
    return 'default';
  }
}

/**
 * Centralized Cache Key Builders
 *
 * Strict hierarchical naming conventions to prevent collisions, ensure multi-tenant
 * and user boundary isolation, and enable granular cache invalidation.
 */
export const CacheKeys = {
  catalog: {
    product: (id) => `catalog:product:${id}`,
    productPattern: () => `catalog:product:*`,
    products: (query = {}) => `catalog:products:${hashQuery(query)}`,
    productsPattern: () => `catalog:products:*`,
    category: (id) => `catalog:category:${id}`,
    categories: (query = {}) => `catalog:categories:${hashQuery(query)}`,
    categoryTree: () => `catalog:categories:tree`,
    categoryPattern: () => `catalog:categor*`,
    search: (query = {}) => `catalog:search:${hashQuery(query)}`,
    searchPattern: () => `catalog:search:*`,
    autocomplete: (prefix = '') => `catalog:autocomplete:${prefix.trim().toLowerCase()}`,
    autocompletePattern: () => `catalog:autocomplete:*`,
    reviews: (productId, page = 1, limit = 10) => `review:list:${productId}:${page}:${limit}`,
    reviewsPattern: (productId) => (productId ? `review:list:${productId}:*` : `review:list:*`),
    ratingSummary: (productId) => `review:summary:${productId}`,
    allReviewsPattern: (productId) => `review:*:${productId}*`,
  },

  seller: {
    analyticsOverview: (sellerId, from = '', to = '') =>
      `seller:analytics:overview:${sellerId}:${from}:${to}`,
    analyticsTimeline: (sellerId, from = '', to = '', interval = 'day') =>
      `seller:analytics:timeline:${sellerId}:${from}:${to}:${interval}`,
    analyticsTopProducts: (sellerId, from = '', to = '') =>
      `seller:analytics:top-products:${sellerId}:${from}:${to}`,
    analyticsPattern: (sellerId) => `seller:analytics:*:${sellerId}:*`,
  },

  admin: {
    dashboardSummary: () => `admin:dashboard:summary`,
    dashboardStats: () => `admin:dashboard:stats`,
    dashboardKpis: () => `admin:dashboard:kpis`,
    dashboardPattern: () => `admin:dashboard:*`,
  },

  identity: {
    user: (id) => `identity:user:${id}`,
    seller: (id) => `identity:seller:${id}`,
    address: (id) => `identity:address:${id}`,
    userAddresses: (userId) => `identity:addresses:user:${userId}`,
    userPattern: (id) => `identity:*:${id}*`,
  },

  fulfillment: {
    warehouse: (id) => `warehouse:${id}`,
    warehousesList: (query = {}) => `warehouses:list:${hashQuery(query)}`,
    warehousesPattern: () => `warehouses:*`,
    shipment: (id) => `shipment:${id}`,
    tracking: (trackingNumber) => `shipment:tracking:${trackingNumber}`,
    shipmentPattern: (id) => `shipment:*:${id}*`,
    // Display-only non-authoritative inventory reading (DO NOT use for reservation/checkout)
    inventoryDisplay: (warehouseId, sku) => `inventory:display:${warehouseId}:${sku}`,
    inventoryDisplayPattern: (sku) => `inventory:display:*:${sku}`,
  },

  cart: {
    user: (userId) => `cart:${userId}`,
  },

  coupon: {
    code: (code) => `coupon:${String(code).trim().toUpperCase()}`,
    pattern: () => `coupon:*`,
  },

  notification: {
    preferences: (userId) => `notification:preferences:${userId}`,
  },
};
