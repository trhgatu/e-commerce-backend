import { Request, Response } from 'express';
import * as inventoryService from './inventory.service';
import { handleError, buildCommonQuery } from '@common/utils';

const controller = {
  getAllInventories: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { filters, sort } = buildCommonQuery(req, [
        'productId',
        'colorId',
        'size',
      ]);

      const result = await inventoryService.getAllInventories(
        page,
        limit,
        filters,
        sort
      );

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventories fetched successfully',
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch inventories', 400);
    }
  },

  getInventoryById: async (req: Request, res: Response) => {
    try {
      const inventory = await inventoryService.getInventoryById(req.params.id);
      if (!inventory) {
        res
          .status(404)
          .json({ success: false, code: 404, message: 'Inventory not found' });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventory fetched successfully',
        data: inventory,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch inventory', 400);
    }
  },

  createInventory: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const result = await inventoryService.createInventory(data);

      res.status(201).json({
        success: true,
        code: 201,
        message: 'Inventory created successfully',
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create inventory', 400);
    }
  },

  updateInventory: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const result = await inventoryService.updateInventory(
        req.params.id,
        data
      );

      if (!result) {
        res
          .status(404)
          .json({ success: false, code: 404, message: 'Inventory not found' });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventory updated successfully',
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update inventory', 400);
    }
  },

  deleteInventory: async (req: Request, res: Response) => {
    try {
      const result = await inventoryService.deleteInventory(req.params.id);

      if (!result) {
        res
          .status(404)
          .json({ success: false, code: 404, message: 'Inventory not found' });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventory deleted successfully',
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete inventory', 400);
    }
  },

  getInventoriesByProductId: async (req: Request, res: Response) => {
    try {
      const data = await inventoryService.getInventoriesByProductId(
        req.params.productId
      );
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventories by product fetched successfully',
        data,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch product inventories', 400);
    }
  },

  getInventorySummary: async (req: Request, res: Response) => {
    try {
      const summary = await inventoryService.getInventorySummaryByProductId(
        req.params.productId
      );
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventory summary fetched successfully',
        data: summary,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch inventory summary', 400);
    }
  },

  increaseQuantity: async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      const result = await inventoryService.increaseInventoryQuantity(
        req.params.id,
        amount
      );

      if (!result) {
        res
          .status(404)
          .json({ success: false, code: 404, message: 'Inventory not found' });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventory increased successfully',
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Failed to increase inventory', 400);
    }
  },

  decreaseQuantity: async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      const result = await inventoryService.decreaseInventoryQuantity(
        req.params.id,
        amount
      );

      if (!result) {
        res
          .status(404)
          .json({ success: false, code: 404, message: 'Inventory not found' });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Inventory decreased successfully',
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Failed to decrease inventory', 400);
    }
  },
};

export default controller;
