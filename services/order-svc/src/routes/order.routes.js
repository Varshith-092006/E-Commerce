import { Router } from 'express';
import { UnauthorizedError, ForbiddenError } from '@ecommerce/shared';

import { orderController } from '../controllers/order.controller.js';

export function createOrderRouter({ controller = orderController } = {}) {
  const router = Router();

  const requireAuth = (req, res, next) => {
    const userId = req.user?.id || req.headers['x-user-id'];
    if (!userId) {
      return next(new UnauthorizedError('Authentication required to manage orders'));
    }
    next();
  };

  const requireCustomer = (req, res, next) => {
    const role = req.user?.role || req.headers['x-user-role'];
    if (role && role !== 'CUSTOMER') {
      return next(new ForbiddenError('Only customer accounts can place orders directly'));
    }
    next();
  };

  const requireNonCustomer = (req, res, next) => {
    const role = req.user?.role || req.headers['x-user-role'];
    if (!role || role === 'CUSTOMER') {
      return next(new ForbiddenError('Customer accounts cannot perform forward status updates'));
    }
    next();
  };

  const requireSellerOrAdmin = (req, res, next) => {
    const role = req.user?.role || req.headers['x-user-role'];
    if (!role || (role !== 'SELLER' && role !== 'ADMIN')) {
      return next(new ForbiddenError('Access denied: Seller or Admin credentials required'));
    }
    next();
  };

  const requireAdmin = (req, res, next) => {
    const role = req.user?.role || req.headers['x-user-role'];
    if (!role || role !== 'ADMIN') {
      return next(new ForbiddenError('Access denied: Admin credentials required'));
    }
    next();
  };

  const requireLogisticsOrAdmin = (req, res, next) => {
    const role = req.user?.role || req.headers['x-user-role'];
    if (!role || (role !== 'COURIER' && role !== 'LOGISTICS' && role !== 'ADMIN')) {
      return next(
        new ForbiddenError('Access denied: Courier, Logistics, or Admin credentials required'),
      );
    }
    next();
  };

  router.use(requireAuth);

  // ── Admin-only summary endpoint (must be before /:id to avoid param collision) ──
  router.get('/admin/summary', requireAdmin, controller.getAdminSummary);

  // Phase 2H: Courier & Logistics Last-Mile Delivery
  router.get('/logistics/orders', requireLogisticsOrAdmin, controller.getLogisticsOrders);
  router.post(
    '/logistics/orders/:id/out-for-delivery',
    requireLogisticsOrAdmin,
    controller.markOutForDelivery,
  );
  router.post('/logistics/orders/:id/deliver', requireLogisticsOrAdmin, controller.markDelivered);
  router.post(
    '/logistics/orders/:id/attempt-failed',
    requireLogisticsOrAdmin,
    controller.recordFailedDeliveryAttempt,
  );

  // Phase 2G: Seller Order Management & Fulfillment
  router.get('/seller/orders', requireSellerOrAdmin, controller.getSellerOrders);
  router.post('/seller/orders/:id/confirm', requireSellerOrAdmin, controller.confirmSellerOrder);
  router.post('/seller/orders/:id/process', requireSellerOrAdmin, controller.processSellerOrder);
  router.post('/seller/orders/:id/ship', requireSellerOrAdmin, controller.shipSellerOrder);
  router.get(
    '/seller/orders/:id/packing-slip',
    requireSellerOrAdmin,
    controller.getSellerPackingSlip,
  );

  // Phase 2: Seller Analytics Endpoints (supports both /seller/analytics and /analytics)
  router.get(
    '/seller/analytics/overview',
    requireSellerOrAdmin,
    controller.getSellerAnalyticsOverview,
  );
  router.get(
    '/seller/analytics/revenue',
    requireSellerOrAdmin,
    controller.getSellerRevenueTimeline,
  );
  router.get(
    '/seller/analytics/timeline',
    requireSellerOrAdmin,
    controller.getSellerRevenueTimeline,
  );
  router.get(
    '/seller/analytics/top-products',
    requireSellerOrAdmin,
    controller.getSellerTopProducts,
  );
  router.get('/analytics/overview', requireSellerOrAdmin, controller.getSellerAnalyticsOverview);
  router.get('/analytics/revenue', requireSellerOrAdmin, controller.getSellerRevenueTimeline);
  router.get('/analytics/timeline', requireSellerOrAdmin, controller.getSellerRevenueTimeline);
  router.get('/analytics/top-products', requireSellerOrAdmin, controller.getSellerTopProducts);

  // Customer Order Placement
  router.post('/', requireCustomer, controller.createOrder);

  // Order Listing (Customer / Seller / Admin scoped)
  router.get('/', controller.getCustomerOrders);

  // Tax Invoice Generation (Customer / Admin only)
  router.get('/:id/invoice', controller.getOrderInvoice);

  // Order Details & Cancellation (Customer / Seller / Admin)
  router.get('/:id', controller.getOrderById);
  router.post('/:id/cancel', controller.cancelOrder);

  // Forward Status Updates (Seller / Logistics / Courier / Admin)
  router.patch('/:id/status', requireNonCustomer, controller.updateOrderStatus);

  return router;
}

export const orderRouter = createOrderRouter();
