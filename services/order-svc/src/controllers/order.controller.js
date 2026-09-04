import { successResponse, ValidationError } from '@ecommerce/shared';

import { orderService as defaultOrderService } from '../services/order.service.js';

export class OrderController {
  constructor(orderService = defaultOrderService) {
    this.orderService = orderService;
  }

  getUserId(req) {
    const userId = req.user?.id || req.headers['x-user-id'];
    if (!userId) {
      throw new ValidationError('Authenticated customer ID is missing');
    }
    return userId;
  }

  getSellerId(req) {
    const sellerId =
      req.user?.sellerId || req.headers['x-seller-id'] || req.user?.id || req.headers['x-user-id'];
    if (!sellerId) {
      throw new ValidationError('Authenticated seller ID is missing');
    }
    return sellerId;
  }

  createOrder = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const idempotencyKey = req.headers['idempotency-key'];

      const { addressId, paymentMethod, paymentId, couponCode, buyNowItem, customerNotes } =
        req.body || {};

      const result = await this.orderService.createOrder({
        userId,
        idempotencyKey,
        addressId,
        paymentMethod,
        paymentId,
        couponCode,
        buyNowItem,
        customerNotes,
        requestId: req.id,
      });

      if (result.isReplay) {
        res.setHeader('x-idempotent-replay', 'true');
      }

      return res.status(201).json(
        successResponse({
          data: result.order,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getOrderById = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'CUSTOMER';
      const { id: orderId } = req.params;

      const order = await this.orderService.getOrderById(orderId, userId, role, req.id);

      return res.status(200).json(
        successResponse({
          data: order,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getCustomerOrders = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'CUSTOMER';
      const { page, limit, status, search } = req.query;

      const result = await this.orderService.getCustomerOrders({
        userId,
        userRole: role,
        page,
        limit,
        status,
        search,
      });

      const resp = successResponse({
        data: result.items,
        extraMeta: { pagination: result.pagination },
        requestId: req.id,
      });
      resp.pagination = result.pagination;

      return res.status(200).json(resp);
    } catch (err) {
      next(err);
    }
  };

  getOrderInvoice = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'CUSTOMER';
      const { id: orderId } = req.params;

      const invoice = await this.orderService.getOrderInvoice(orderId, userId, role, req.id);

      return res.status(200).json(
        successResponse({
          data: invoice,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  cancelOrder = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const userRole = req.user?.role || req.headers['x-user-role'] || 'CUSTOMER';
      const { id: orderId } = req.params;
      const { reason } = req.body || {};

      const result = await this.orderService.cancelOrder({
        orderId,
        userId,
        userRole,
        reason,
        requestId: req.id,
      });

      return res.status(200).json(
        successResponse({
          data: {
            id: result.order.id,
            orderNumber: result.order.order_number,
            status: result.order.status,
            cancellationReason: result.order.cancellation_reason,
            cancelledAt: result.order.cancelled_at,
            cancelledBy: result.order.cancelled_by,
            refund: result.refund,
            idempotent: result.idempotent,
          },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  updateOrderStatus = async (req, res, next) => {
    try {
      const actorId = this.getUserId(req);
      const actorRole = req.user?.role || req.headers['x-user-role'];
      const { id: orderId } = req.params;
      const { status: targetStatus, reason } = req.body || {};

      const updatedOrder = await this.orderService.updateOrderStatus({
        orderId,
        targetStatus,
        actorId,
        actorRole,
        reason,
      });

      return res.status(200).json(
        successResponse({
          data: updatedOrder,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getSellerOrders = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { page, limit, status, search } = req.query;

      const result = await this.orderService.getSellerOrders({
        sellerId,
        userRole: role,
        page,
        limit,
        status,
        search,
      });

      const resp = successResponse({
        data: result.items,
        extraMeta: { pagination: result.pagination },
        requestId: req.id,
      });
      resp.pagination = result.pagination;

      return res.status(200).json(resp);
    } catch (err) {
      next(err);
    }
  };

  confirmSellerOrder = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { id: orderId } = req.params;
      const { reason } = req.body || {};

      const result = await this.orderService.confirmSellerOrder({
        orderId,
        sellerId,
        userRole: role,
        reason,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  processSellerOrder = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { id: orderId } = req.params;
      const { reason } = req.body || {};

      const result = await this.orderService.processSellerOrder({
        orderId,
        sellerId,
        userRole: role,
        reason,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  shipSellerOrder = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { id: orderId } = req.params;
      const { courierName, trackingNumber, reason } = req.body || {};

      const result = await this.orderService.shipSellerOrder({
        orderId,
        sellerId,
        userRole: role,
        courierName,
        trackingNumber,
        reason,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getSellerPackingSlip = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { id: orderId } = req.params;

      const result = await this.orderService.getSellerPackingSlip({
        orderId,
        sellerId,
        userRole: role,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  // ── Phase 2: Seller Analytics Controllers ────────────────────────────────
  getSellerAnalyticsOverview = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { startDate, endDate } = req.query;

      const data = await this.orderService.getSellerAnalyticsOverview({
        sellerId,
        userRole: role,
        startDate,
        endDate,
      });

      return res.status(200).json(
        successResponse({
          data,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getSellerRevenueTimeline = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { startDate, endDate, interval } = req.query;

      const data = await this.orderService.getSellerRevenueTimeline({
        sellerId,
        userRole: role,
        startDate,
        endDate,
        interval,
      });

      return res.status(200).json(
        successResponse({
          data,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getSellerTopProducts = async (req, res, next) => {
    try {
      const sellerId = this.getSellerId(req);
      const role = req.user?.role || req.headers['x-user-role'] || 'SELLER';
      const { startDate, endDate, limit } = req.query;

      const data = await this.orderService.getSellerTopProducts({
        sellerId,
        userRole: role,
        startDate,
        endDate,
        limit,
      });

      return res.status(200).json(
        successResponse({
          data,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Phase 2H: Logistics Run Sheet & Order Query
   */
  getLogisticsOrders = async (req, res, next) => {
    try {
      const role = req.user?.role || req.headers['x-user-role'] || 'COURIER';
      const { page, limit, status, search } = req.query;

      const result = await this.orderService.getLogisticsOrders({
        userRole: role,
        page,
        limit,
        status,
        search,
      });

      const resp = successResponse({
        data: result.items,
        extraMeta: { pagination: result.pagination },
        requestId: req.id,
      });
      resp.pagination = result.pagination;

      return res.status(200).json(resp);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Phase 2H: Mark Order as Out for Delivery
   */
  markOutForDelivery = async (req, res, next) => {
    try {
      const actorId = this.getUserId(req);
      const actorRole = req.user?.role || req.headers['x-user-role'] || 'COURIER';
      const { id: orderId } = req.params;
      const { deliveryAgentName, deliveryAgentPhone, reason } = req.body || {};

      const result = await this.orderService.markOutForDelivery({
        orderId,
        actorId,
        actorRole,
        deliveryAgentName,
        deliveryAgentPhone,
        reason,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Phase 2H: Mark Order as Delivered with Proof of Delivery
   */
  markDelivered = async (req, res, next) => {
    try {
      const actorId = this.getUserId(req);
      const actorRole = req.user?.role || req.headers['x-user-role'] || 'COURIER';
      const { id: orderId } = req.params;
      const { recipientName, podReference, deliveryNotes, codAmountCollected } = req.body || {};

      const result = await this.orderService.markDelivered({
        orderId,
        actorId,
        actorRole,
        recipientName,
        podReference,
        deliveryNotes,
        codAmountCollected,
        requestId: req.id,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Phase 2H: Record Failed Delivery Attempt
   */
  recordFailedDeliveryAttempt = async (req, res, next) => {
    try {
      const actorId = this.getUserId(req);
      const actorRole = req.user?.role || req.headers['x-user-role'] || 'COURIER';
      const { id: orderId } = req.params;
      const { reason } = req.body || {};

      const result = await this.orderService.recordFailedDeliveryAttempt({
        orderId,
        actorId,
        actorRole,
        reason,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/orders/admin/summary
   * ADMIN only — aggregated order pipeline stats and GMV
   */
  getAdminSummary = async (req, res, next) => {
    try {
      const summary = await this.orderService.getAdminSummary();

      return res.status(200).json(
        successResponse({
          data: summary,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const orderController = new OrderController();
