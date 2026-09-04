import { OrderStateMachineService } from '../../src/services/order-state-machine.service.js';
import {
  ValidationError,
  ForbiddenError,
  BusinessRuleError,
} from '@ecommerce/shared';

describe('OrderStateMachineService Unit Tests', () => {
  const customerId = 'u1a2b3c4-0000-0000-0000-000000000001';
  const sellerId = 's1a2b3c4-0000-0000-0000-000000000001';
  const adminId = 'a1a2b3c4-0000-0000-0000-000000000001';
  const courierId = 'c1a2b3c4-0000-0000-0000-000000000001';

  const baseOrder = {
    id: 'ord-1',
    user_id: customerId,
    status: 'PLACED',
    items: [
      { id: 'item-1', seller_id: sellerId, title: 'Item 1', quantity: 1 },
    ],
  };

  describe('Valid Forward State Transitions', () => {
    it('should allow SELLER to transition PLACED -> CONFIRMED', () => {
      const res = OrderStateMachineService.validateTransition({
        currentStatus: 'PLACED',
        targetStatus: 'CONFIRMED',
        actorId: sellerId,
        actorRole: 'SELLER',
        order: baseOrder,
      });
      expect(res.valid).toBe(true);
      expect(res.toStatus).toBe('CONFIRMED');
    });

    it('should allow SELLER to transition CONFIRMED -> PROCESSING', () => {
      const res = OrderStateMachineService.validateTransition({
        currentStatus: 'CONFIRMED',
        targetStatus: 'PROCESSING',
        actorId: sellerId,
        actorRole: 'SELLER',
        order: { ...baseOrder, status: 'CONFIRMED' },
      });
      expect(res.valid).toBe(true);
      expect(res.toStatus).toBe('PROCESSING');
    });

    it('should allow SELLER to transition PROCESSING -> SHIPPED', () => {
      const res = OrderStateMachineService.validateTransition({
        currentStatus: 'PROCESSING',
        targetStatus: 'SHIPPED',
        actorId: sellerId,
        actorRole: 'SELLER',
        order: { ...baseOrder, status: 'PROCESSING' },
      });
      expect(res.valid).toBe(true);
      expect(res.toStatus).toBe('SHIPPED');
    });

    it('should allow COURIER/LOGISTICS to transition SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED', () => {
      const res1 = OrderStateMachineService.validateTransition({
        currentStatus: 'SHIPPED',
        targetStatus: 'OUT_FOR_DELIVERY',
        actorId: courierId,
        actorRole: 'COURIER',
        order: { ...baseOrder, status: 'SHIPPED' },
      });
      expect(res1.valid).toBe(true);

      const res2 = OrderStateMachineService.validateTransition({
        currentStatus: 'OUT_FOR_DELIVERY',
        targetStatus: 'DELIVERED',
        actorId: courierId,
        actorRole: 'LOGISTICS',
        order: { ...baseOrder, status: 'OUT_FOR_DELIVERY' },
      });
      expect(res2.valid).toBe(true);
    });
  });

  describe('Cancellation Rules & Actor Permissions', () => {
    it('should allow CUSTOMER to cancel PLACED order with valid reason', () => {
      const res = OrderStateMachineService.validateTransition({
        currentStatus: 'PLACED',
        targetStatus: 'CANCELLED',
        actorId: customerId,
        actorRole: 'CUSTOMER',
        order: baseOrder,
        reason: 'Found a better deal elsewhere',
      });
      expect(res.valid).toBe(true);
      expect(res.reason).toBe('Found a better deal elsewhere');
    });

    it('should allow CUSTOMER to cancel CONFIRMED order with valid reason', () => {
      const res = OrderStateMachineService.validateTransition({
        currentStatus: 'CONFIRMED',
        targetStatus: 'CANCELLED',
        actorId: customerId,
        actorRole: 'CUSTOMER',
        order: { ...baseOrder, status: 'CONFIRMED' },
        reason: 'Ordered by mistake',
      });
      expect(res.valid).toBe(true);
    });

    it('should REJECT CUSTOMER cancellation of PROCESSING order', () => {
      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'PROCESSING',
          targetStatus: 'CANCELLED',
          actorId: customerId,
          actorRole: 'CUSTOMER',
          order: { ...baseOrder, status: 'PROCESSING' },
          reason: 'Please cancel my order',
        });
      }).toThrow(ForbiddenError);
    });

    it('should allow ADMIN / SELLER cancellation of PROCESSING order with mandatory reason', () => {
      const res = OrderStateMachineService.validateTransition({
        currentStatus: 'PROCESSING',
        targetStatus: 'CANCELLED',
        actorId: sellerId,
        actorRole: 'SELLER',
        order: { ...baseOrder, status: 'PROCESSING' },
        reason: 'Out of stock at supplier warehouse',
      });
      expect(res.valid).toBe(true);
    });

    it('should REJECT cancellation of SHIPPED and DELIVERED orders', () => {
      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'SHIPPED',
          targetStatus: 'CANCELLED',
          actorId: customerId,
          actorRole: 'CUSTOMER',
          order: { ...baseOrder, status: 'SHIPPED' },
          reason: 'Cancel item',
        });
      }).toThrow(BusinessRuleError);

      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'DELIVERED',
          targetStatus: 'CANCELLED',
          actorId: adminId,
          actorRole: 'ADMIN',
          order: { ...baseOrder, status: 'DELIVERED' },
          reason: 'Cancel delivered',
        });
      }).toThrow(BusinessRuleError);
    });

    it('should reject cancellation when reason is missing or shorter than 5 chars', () => {
      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'PLACED',
          targetStatus: 'CANCELLED',
          actorId: customerId,
          actorRole: 'CUSTOMER',
          order: baseOrder,
          reason: 'No', // only 2 chars
        });
      }).toThrow(ValidationError);

      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'PLACED',
          targetStatus: 'CANCELLED',
          actorId: customerId,
          actorRole: 'CUSTOMER',
          order: baseOrder,
          reason: '',
        });
      }).toThrow(ValidationError);
    });
  });

  describe('Ownership & Role Restrictions', () => {
    it('should reject CUSTOMER forward status transitions', () => {
      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'PLACED',
          targetStatus: 'CONFIRMED',
          actorId: customerId,
          actorRole: 'CUSTOMER',
          order: baseOrder,
        });
      }).toThrow(ForbiddenError);
    });

    it('should reject foreign customer cancellation', () => {
      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'PLACED',
          targetStatus: 'CANCELLED',
          actorId: 'u-attacker-99',
          actorRole: 'CUSTOMER',
          order: baseOrder,
          reason: 'Malicious cancel',
        });
      }).toThrow(ForbiddenError);
    });

    it('should reject SELLER transition if seller does not own items in the order', () => {
      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'PLACED',
          targetStatus: 'CONFIRMED',
          actorId: 's-unrelated-99',
          actorRole: 'SELLER',
          order: baseOrder,
        });
      }).toThrow(ForbiddenError);
    });

    it('should reject SELLER whole-order cancellation if order contains other sellers items', () => {
      const multiSellerOrder = {
        ...baseOrder,
        items: [
          { id: 'i1', seller_id: sellerId },
          { id: 'i2', seller_id: 's-other-seller' },
        ],
      };

      expect(() => {
        OrderStateMachineService.validateTransition({
          currentStatus: 'PLACED',
          targetStatus: 'CANCELLED',
          actorId: sellerId,
          actorRole: 'SELLER',
          order: multiSellerOrder,
          reason: 'Seller cancelled item',
        });
      }).toThrow(BusinessRuleError);
    });
  });
});
