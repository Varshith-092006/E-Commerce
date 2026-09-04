import { successResponse, buildPaginationMeta, parsePagination } from '@ecommerce/shared';

import { SellerService } from '../services/seller-service.js';

export class SellerController {
  constructor(sellerService = new SellerService()) {
    this.sellerService = sellerService;
  }

  getMe = async (req, res, next) => {
    try {
      const seller = await this.sellerService.getSellerProfile(req.user.id);
      return res.status(200).json(
        successResponse({
          data: seller,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (req, res, next) => {
    try {
      const { businessName, businessAddress, gstin, pan } = req.body;
      const updated = await this.sellerService.updateSellerProfile(req.user.id, {
        businessName,
        businessAddress,
        gstin,
        pan,
      });

      return res.status(200).json(
        successResponse({
          data: updated,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  listForAdmin = async (req, res, next) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const { status } = req.query;

      const { sellers, total } = await this.sellerService.listSellersForAdmin({
        status,
        page,
        limit,
      });

      const paginationMeta = buildPaginationMeta({ page, limit, total });

      return res.status(200).json(
        successResponse({
          data: sellers,
          meta: paginationMeta,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateStatusByAdmin = async (req, res, next) => {
    try {
      const { status, rejectionReason } = req.body;
      const updated = await this.sellerService.updateSellerStatusByAdmin(req.params.id, {
        status,
        rejectionReason,
      });

      return res.status(200).json(
        successResponse({
          data: updated,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
