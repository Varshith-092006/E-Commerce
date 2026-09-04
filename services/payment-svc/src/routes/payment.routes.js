import { Router } from 'express';
import { UnauthorizedError, ForbiddenError } from '@ecommerce/shared';

import { paymentController } from '../controllers/payment.controller.js';

export function createPaymentRouter({ controller = paymentController } = {}) {
  const router = Router();

  const requireCustomer = (req, res, next) => {
    const userId = req.user?.id || req.headers['x-user-id'];
    const role = req.user?.role || req.headers['x-user-role'];

    if (!userId) {
      return next(new UnauthorizedError('Authentication required'));
    }
    if (role && role !== 'CUSTOMER') {
      return next(new ForbiddenError('Only customer accounts can initiate or verify payments'));
    }
    next();
  };

  // Customer Routes
  router.post('/initiate', requireCustomer, controller.initiatePayment);
  router.post('/verify', requireCustomer, controller.verifyPayment);
  router.post('/cod/initiate', requireCustomer, controller.initiateCodPayment);

  // Internal / Service Routes
  router.post('/capture', controller.capturePayment);
  router.post('/refund', controller.refundPayment);
  router.post('/', controller.refundPayment);
  router.post('/returns/refund', controller.processReturnRefund);
  router.post('/cod/settle', controller.settleCodPayment);
  router.get('/admin/summary', controller.getAdminSummary);
  router.get('/:id/status', controller.getPaymentStatus);

  // Razorpay Webhook Route
  router.post('/webhook', controller.handleWebhook);

  // Query Route
  router.get('/:id', controller.getPaymentById);

  return router;
}

export const paymentRouter = createPaymentRouter();
