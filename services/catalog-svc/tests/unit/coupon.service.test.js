import { jest } from '@jest/globals';
import { CouponService } from '../../src/services/coupon.service.js';
import { ValidationError, NotFoundError, BusinessRuleError } from '@ecommerce/shared';

describe('CouponService Unit Tests', () => {
  let couponService;
  let mockCouponRepo;

  beforeEach(() => {
    mockCouponRepo = {
      findByCode: jest.fn(),
      getUserRedemptionCount: jest.fn(),
      incrementUsageAtomic: jest.fn(),
      recordRedemption: jest.fn(),
    };

    couponService = new CouponService({
      couponRepo: mockCouponRepo,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate and calculate percentage discount correctly', async () => {
    mockCouponRepo.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'SAVE10',
      discount_type: 'PERCENTAGE',
      discount_value: '10.00',
      max_discount_cap: '50.00',
      min_order_amount: '50.00',
      usage_limit: 100,
      current_usage: 5,
      per_user_limit: 1,
      is_active: true,
      valid_from: new Date(Date.now() - 10000),
      valid_until: new Date(Date.now() + 1000000),
    });
    mockCouponRepo.getUserRedemptionCount.mockResolvedValue(0);

    const result = await couponService.validateCoupon({
      code: 'save10',
      subtotal: 200.0,
      userId: 'user-1',
    });

    expect(result.valid).toBe(true);
    expect(result.discount_amount).toBe('20.00'); // 10% of 200
    expect(result.code).toBe('SAVE10');
  });

  it('should enforce max discount cap on large orders', async () => {
    mockCouponRepo.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'MEGA50',
      discount_type: 'PERCENTAGE',
      discount_value: '50.00',
      max_discount_cap: '30.00', // Capped at $30
      min_order_amount: '50.00',
      usage_limit: null,
      current_usage: 0,
      per_user_limit: 5,
      is_active: true,
      valid_from: new Date(Date.now() - 10000),
      valid_until: new Date(Date.now() + 1000000),
    });
    mockCouponRepo.getUserRedemptionCount.mockResolvedValue(0);

    const result = await couponService.validateCoupon({
      code: 'MEGA50',
      subtotal: 500.0, // 50% would be 250, but capped at 30
      userId: 'user-1',
    });

    expect(result.discount_amount).toBe('30.00');
  });

  it('should reject inactive coupon with BusinessRuleError', async () => {
    mockCouponRepo.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'INACTIVE',
      is_active: false,
      valid_from: new Date(Date.now() - 10000),
      valid_until: new Date(Date.now() + 1000000),
    });

    await expect(
      couponService.validateCoupon({
        code: 'INACTIVE',
        subtotal: 100,
      }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('should reject expired coupon with BusinessRuleError', async () => {
    mockCouponRepo.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'EXPIRED',
      is_active: true,
      valid_from: new Date(Date.now() - 1000000),
      valid_until: new Date(Date.now() - 500), // Expired
      min_order_amount: '0',
    });

    await expect(
      couponService.validateCoupon({
        code: 'EXPIRED',
        subtotal: 100,
      }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('should reject when order subtotal is below min_order_amount', async () => {
    mockCouponRepo.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'MIN50',
      is_active: true,
      valid_from: new Date(Date.now() - 10000),
      valid_until: new Date(Date.now() + 1000000),
      min_order_amount: '50.00',
    });

    await expect(
      couponService.validateCoupon({
        code: 'MIN50',
        subtotal: 30.0, // Below 50
      }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('should reject when global usage limit is reached', async () => {
    mockCouponRepo.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'EXHAUSTED',
      is_active: true,
      valid_from: new Date(Date.now() - 10000),
      valid_until: new Date(Date.now() + 1000000),
      min_order_amount: '0',
      usage_limit: 10,
      current_usage: 10, // Full
    });

    await expect(
      couponService.validateCoupon({
        code: 'EXHAUSTED',
        subtotal: 100,
      }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('should reject when per-user limit is reached', async () => {
    mockCouponRepo.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'ONCEONLY',
      is_active: true,
      valid_from: new Date(Date.now() - 10000),
      valid_until: new Date(Date.now() + 1000000),
      min_order_amount: '0',
      usage_limit: 100,
      current_usage: 2,
      per_user_limit: 1,
    });
    mockCouponRepo.getUserRedemptionCount.mockResolvedValue(1); // User already used once

    await expect(
      couponService.validateCoupon({
        code: 'ONCEONLY',
        subtotal: 100,
        userId: 'user-1',
      }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('should throw NotFoundError for invalid non-existent coupon code', async () => {
    mockCouponRepo.findByCode.mockResolvedValue(null);

    await expect(
      couponService.validateCoupon({
        code: 'INVALIDCODE',
        subtotal: 100,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
