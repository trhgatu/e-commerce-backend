import { Request, Response } from 'express';
import * as permissionService from '../services/permissionService';
import { handleError } from '../utils';
import { buildCommonQuery } from '../utils/buildCommonQuery';

const controller = {
  getAllPermissions: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { filters, sort } = buildCommonQuery(req, ["name", "description" , "group"]);
      const result = await permissionService.getAllPermissions(
        page,
        limit,
        filters,
        sort,
      );

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Permissions fetched successfully',
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch permissions', 400);
    }
  },

  getPermissionById: async (req: Request, res: Response) => {
    try {
      const permission = await permissionService.getPermissionById(req.params.id);
      if (!permission) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Permissions not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Permissions fetched successfully',
        data: permission,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch permissions', 400);
    }
  },

  createPermission: async (req: Request, res: Response) => {
    try {
      const permissionData = req.body;
      const permission = await permissionService.createPermission(permissionData);
      res.status(201).json({
        success: true,
        code: 201,
        message: 'Permission created successfully',
        data: permission,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create permission', 400);
    }
  },
  bulkCreatePermissions: async (req: Request, res: Response) => {
    try {
      const permissionsData = req.body;
      const permissions = await permissionService.bulkCreatePermissions(permissionsData);
      res.status(201).json({
        success: true,
        code: 201,
        message: 'Permissions created successfully',
        data: permissions,
      });
    }
    catch (error) {
      handleError(res, error, 'Failed to create permissions', 400);
    }
  },

  updatePermission: async (req: Request, res: Response) => {
    try {
      const permissionData = req.body;
      const permission = await permissionService.updatePermission(req.params.id, permissionData);

      if (!permission) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Permission not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Permission updated successfully',
        data: permission,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update permission', 400);
    }
  },

  hardDeletePermission: async (req: Request, res: Response) => {
    try {
      const permission = await permissionService.hardDeletePermission(req.params.id);
      if (!permission) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Permission not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Permission deleted successfully',
        data: permission
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete permission', 400);
    }
  },
  softDeletePermission: async (req: Request, res: Response) => {
    try {
      const permission = await permissionService.softDeletePermission(req.params.id);
      if (!permission) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Permission not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Permission deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete permission', 400);
    }
  },
  restorePermission: async (req:Request, res: Response) => {
    try {
      const permission = await permissionService.restorePermission(req.params.id);
      if (!permission) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Permission not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Permission restored successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to restore permission', 400);
    }
  }
};

export default controller;
