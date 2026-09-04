import { successResponse } from '@ecommerce/shared';

import { AuthService } from '../services/auth-service.js';

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export class AuthController {
  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const result = await this.authService.registerCustomer(req.body);
      return res.status(201).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  registerSeller = async (req, res, next) => {
    try {
      const result = await this.authService.registerSeller(req.body);
      return res.status(201).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  verify = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyEmail({ email, otp });
      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await this.authService.resendVerification({ email });
      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.authService.login({
        email,
        password,
      });

      res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

      return res.status(200).json(
        successResponse({
          data: {
            user,
            accessToken,
            refreshToken, // also in JSON for non-browser/test clients
          },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

      const { accessToken, newRefreshToken, user } = await this.authService.refresh({
        rawRefreshToken,
      });

      res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, REFRESH_COOKIE_OPTIONS);

      return res.status(200).json(
        successResponse({
          data: {
            user,
            accessToken,
            refreshToken: newRefreshToken,
          },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

      await this.authService.logout({ rawRefreshToken });

      res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        path: '/',
      });

      return res.status(200).json(
        successResponse({
          data: { message: 'Successfully logged out' },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword({ email });
      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, token, newPassword } = req.body;
      const result = await this.authService.resetPassword({
        email,
        token,
        newPassword,
      });
      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
