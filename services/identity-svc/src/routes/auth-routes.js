import { Router } from 'express';

import { AuthController } from '../controllers/auth-controller.js';

export function createAuthRoutes(authController = new AuthController()) {
  const router = Router();

  router.post('/register', authController.register);
  router.post('/register-seller', authController.registerSeller);
  router.post('/verify', authController.verify);
  router.post('/resend-verification', authController.resendVerification);
  router.post('/login', authController.login);
  router.post('/refresh', authController.refresh);
  router.post('/logout', authController.logout);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);

  return router;
}
