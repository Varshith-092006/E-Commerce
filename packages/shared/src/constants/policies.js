export const PlatformPolicies = Object.freeze({
  // Token lifetimes
  ACCESS_TOKEN_TTL_SECONDS: 15 * 60, // 15 minutes
  REFRESH_TOKEN_TTL_SECONDS: 30 * 24 * 60 * 60, // 30 days

  // Rate limits (requests per minute)
  RATE_LIMIT_LOGIN: 5,
  RATE_LIMIT_PAYMENT_AUTH: 10,
  RATE_LIMIT_SEARCH: 30,
  RATE_LIMIT_PRODUCT_LISTING: 60,
  RATE_LIMIT_DEFAULT_READ: 120,
  RATE_LIMIT_RETURNS: 5,

  // Business lifecycle
  INVENTORY_RESERVATION_TTL_SECONDS: 15 * 60, // 15 minutes
  RETURN_ELIGIBILITY_WINDOW_DAYS: 7, // 7 days after delivery
  IDEMPOTENCY_KEY_RETENTION_HOURS: 24, // 24 hours
});
