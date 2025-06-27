import { Request, Response } from 'express';
import * as voucherService from './voucher.service';
import { handleError, buildCommonQuery } from '@common/utils';

const controller = {
  // Get all vouchers with pagination
  getAllVouchers: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { filters, sort } = buildCommonQuery(req, ['code']);

      const result = await voucherService.getAllVouchers(
        page,
        limit,
        filters,
        sort
      );

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Vouchers fetched successfully',
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch vouchers', 400);
    }
  },

  // Get voucher by ID
  getVoucherById: async (req: Request, res: Response) => {
    try {
      const voucher = await voucherService.getVoucherById(req.params.id);
      if (!voucher) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Voucher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Voucher fetched successfully',
        data: voucher,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch voucher', 400);
    }
  },

  // Create new voucher
  createVoucher: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const voucher = await voucherService.createVoucher(data);

      res.status(201).json({
        success: true,
        code: 201,
        message: 'Voucher created successfully',
        data: voucher,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create voucher', 400);
    }
  },

  // Update voucher
  updateVoucher: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const voucher = await voucherService.updateVoucher(req.params.id, data);

      if (!voucher) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Voucher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Voucher updated successfully',
        data: voucher,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update voucher', 400);
    }
  },

  // Soft delete voucher
  softDeleteVoucher: async (req: Request, res: Response) => {
    try {
      const voucher = await voucherService.softDeleteVoucher(req.params.id);
      if (!voucher) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Voucher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Voucher soft-deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to soft-delete voucher', 400);
    }
  },

  // Hard delete voucher
  hardDeleteVoucher: async (req: Request, res: Response) => {
    try {
      const voucher = await voucherService.hardDeleteVoucher(req.params.id);
      if (!voucher) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Voucher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Voucher deleted permanently',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete voucher', 400);
    }
  },

  // Restore voucher
  restoreVoucher: async (req: Request, res: Response) => {
    try {
      const voucher = await voucherService.restoreVoucher(req.params.id);
      if (!voucher) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Voucher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Voucher restored successfully',
        data: voucher,
      });
    } catch (error) {
      handleError(res, error, 'Failed to restore voucher', 400);
    }
  },

  // Validate voucher usage (user nhập mã)
  validateVoucherUsage: async (req: Request, res: Response) => {
    try {
      const { code, userId, orderTotal } = req.body;
      const result = await voucherService.validateVoucherUsage(
        code,
        userId,
        orderTotal
      );

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Voucher is valid',
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Voucher validation failed', 400);
    }
  },
};

export default controller;
