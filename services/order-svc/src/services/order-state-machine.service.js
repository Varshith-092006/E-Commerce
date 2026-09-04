import { ValidationError, ForbiddenError, BusinessRuleError } from '@ecommerce/shared';

export class OrderStateMachineService {
  /**
   * Allowed status transitions mapped to authorized roles
   */
  static TRANSITION_RULES = {
    PLACED: {
      CONFIRMED: ['SELLER', 'ADMIN'],
      CANCELLED: ['CUSTOMER', 'SELLER', 'ADMIN'],
    },
    CONFIRMED: {
      PROCESSING: ['SELLER', 'ADMIN'],
      CANCELLED: ['CUSTOMER', 'SELLER', 'ADMIN'],
    },
    PROCESSING: {
      SHIPPED: ['SELLER', 'ADMIN'],
      CANCELLED: ['SELLER', 'ADMIN'], // CUSTOMER CANNOT CANCEL IN PROCESSING
    },
    SHIPPED: {
      OUT_FOR_DELIVERY: ['LOGISTICS', 'COURIER', 'ADMIN'],
    },
    OUT_FOR_DELIVERY: {
      DELIVERED: ['LOGISTICS', 'COURIER', 'ADMIN'],
    },
    DELIVERED: {},
    CANCELLED: {},
  };

  /**
   * Validates cancellation reason constraints (5 to 500 characters)
   */
  static validateCancellationReason(reason) {
    if (!reason || typeof reason !== 'string') {
      throw new ValidationError('A cancellation reason is required');
    }
    const cleanReason = reason.trim();
    if (cleanReason.length < 5 || cleanReason.length > 500) {
      throw new ValidationError('Cancellation reason must be between 5 and 500 characters');
    }
    return cleanReason;
  }

  /**
   * Centralized state transition validator
   */
  static validateTransition({
    currentStatus,
    targetStatus,
    actorId,
    actorRole,
    order,
    reason = null,
  }) {
    if (!currentStatus || !targetStatus) {
      throw new ValidationError('Current status and target status are required');
    }
    if (!actorId || !actorRole) {
      throw new ValidationError('Actor ID and actor role are required for state transition');
    }

    const cleanCurrent = currentStatus.toUpperCase();
    const cleanTarget = targetStatus.toUpperCase();
    const cleanRole = actorRole.toUpperCase();

    // 1. Check if current status is terminal
    if (cleanCurrent === 'CANCELLED') {
      throw new BusinessRuleError('Cannot change status of a CANCELLED order');
    }
    if (cleanCurrent === 'DELIVERED') {
      throw new BusinessRuleError('Cannot change status of a DELIVERED order in this phase');
    }

    // 2. Check transition validity in rule matrix
    const allowedTargets = this.TRANSITION_RULES[cleanCurrent];
    if (!allowedTargets || !allowedTargets[cleanTarget]) {
      throw new BusinessRuleError(
        `Invalid status transition from '${cleanCurrent}' to '${cleanTarget}'`,
      );
    }

    // 3. Check role authorization for this specific transition
    const authorizedRoles = allowedTargets[cleanTarget];
    if (!authorizedRoles.includes(cleanRole)) {
      throw new ForbiddenError(
        `Role '${cleanRole}' is not authorized to transition order from '${cleanCurrent}' to '${cleanTarget}'`,
      );
    }

    // 4. Actor-specific ownership checks
    if (cleanRole === 'CUSTOMER') {
      if (order && order.user_id && order.user_id !== actorId) {
        throw new ForbiddenError('Customers may only modify their own orders');
      }
      if (cleanTarget !== 'CANCELLED') {
        throw new ForbiddenError('Customers cannot perform forward status transitions');
      }
    } else if (cleanRole === 'SELLER') {
      if (order && order.items && order.items.length > 0) {
        const sellerItems = order.items.filter((i) => i.seller_id === actorId);
        if (sellerItems.length === 0) {
          throw new ForbiddenError('Seller does not own any items in this order');
        }

        // For whole-order cancellation by a seller, seller must own all items in the order
        if (cleanTarget === 'CANCELLED' && sellerItems.length !== order.items.length) {
          throw new BusinessRuleError(
            'Cannot cancel entire multi-seller order. Seller only owns partial items.',
          );
        }
      }
    }

    // 5. If target is CANCELLED, validate mandatory reason
    let validatedReason = reason;
    if (cleanTarget === 'CANCELLED') {
      validatedReason = this.validateCancellationReason(reason);
    }

    return {
      valid: true,
      fromStatus: cleanCurrent,
      toStatus: cleanTarget,
      actorId,
      actorRole: cleanRole,
      reason: validatedReason,
    };
  }
}
