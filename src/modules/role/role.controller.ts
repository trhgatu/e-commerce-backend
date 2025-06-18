import { Request, Response } from 'express';
import * as roleService from './role.service';
import { handleError, buildCommonQuery } from '@common/utils';

const controller = {
  getAllRoles: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { filters, sort } = buildCommonQuery(req, ["name", "description"]);
      const result = await roleService.getAllRoles(
        page,
        limit,
        filters,
        sort,
      );

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Roles fetched successfully',
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch roles', 400);
    }
  },

  getRoleById: async (req: Request, res: Response) => {
    try {
      const role = await roleService.getRoleById(req.params.id);
      if (!role) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Role not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Role fetched successfully',
        data: role,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch role', 400);
    }
  },

  createRole: async (req: Request, res: Response) => {
    try {
      const roleData = req.body;
      const role = await roleService.createRole(roleData);
      res.status(201).json({
        success: true,
        code: 201,
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create role', 400);
    }
  },

  updateRole: async (req: Request, res: Response) => {
    try {
      const roleData = req.body;
      const role = await roleService.updateRole(req.params.id, roleData);

      if (!role) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Role not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Role updated successfully',
        data: role,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update role', 400);
    }
  },

  hardDeleteRole: async (req: Request, res: Response) => {
    try {
      const role = await roleService.hardDeleteRole(req.params.id);
      if (!role) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Role not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Role deleted successfully',
        data: role
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete role', 400);
    }
  },
  softDeleteRole: async (req: Request, res: Response) => {
    try {
      const role = await roleService.softDeleteRole(req.params.id);
      if (!role) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Role not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete role', 400);
    }
  },
  restoreRole: async (req: Request, res: Response) => {
    try {
      const role = await roleService.restoreRole(req.params.id);
      if (!role) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Role not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Role restored successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to restore role', 400);
    }
  },
  assignPermissionsToRole: async (req: Request, res: Response) => {
    try {
      const roleId = req.params.id;
      const { permissions } = req.body;

      if (!Array.isArray(permissions)) {
        res.status(400).json({
          success: false,
          code: 400,
          message: 'Permissions must be an array of IDs',
        });
        return;
      }

      const updatedRole = await roleService.assignPermissionsToRole(roleId, permissions);

      if (!updatedRole) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Role not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Permissions assigned successfully',
        data: updatedRole,
      });
    } catch (error) {
      handleError(res, error, 'Failed to assign permissions', 400);
    }
  }

};

export default controller;
