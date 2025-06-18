import { Request, Response } from 'express';
import * as colorService from './color.service';
import { handleError, buildCommonQuery } from '@common/utils';

const controller = {
    getAllColors: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { filters, sort } = buildCommonQuery(req, ["name", "hexCode"]);
            const result = await colorService.getAllColors(page, limit, filters, sort);

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Colors fetched successfully',
                data: result.data,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                totalItems: result.total,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch colors', 400);
        }
    },

    // Get brand by ID
    getColorById: async (req: Request, res: Response) => {
        try {
            const color = await colorService.getColorById(req.params.id);
            if (!color) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Color not found',
                });
                return;
            }
            res.status(200).json({
                success: true,
                code: 200,
                message: 'Color fetched successfully',
                data: color,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch Color', 400);
        }
    },

    createColor: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User ID is missing from request');
            const colorData = req.body;
            const color = await colorService.createColor(colorData, userId);

            res.locals.targetId = color._id?.toString() || '';
            res.locals.description = `Created color: ${color.name}`;

            res.status(201).json({
                success: true,
                code: 201,
                message: 'Color created successfully',
                data: color,
            });
        } catch (error) {
            handleError(res, error, 'Failed to create color', 400);
        }
    },

    // Update brand
    updateColor: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User ID is missing from request');
            const colorData = req.body;
            const color = await colorService.updateColor(req.params.id, colorData, userId);

            if (!color) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Color not found',
                });
                return;
            }
            res.locals.targetId = color._id?.toString();
            res.locals.description = `Updated color: ${color.name}`;
            res.status(200).json({
                success: true,
                code: 200,
                message: 'Color updated successfully',
                data: color,
            });
        } catch (error) {
            handleError(res, error, 'Failed to update brand', 400);
        }
    },

    hardDeleteColor: async (req: Request, res: Response) => {
        try {
            const brand = await colorService.hardDeleteColor(req.params.id);
            if (!brand) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Brand not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Brand deleted successfully',
            });
        } catch (error) {
            handleError(res, error, 'Failed to delete brand', 400);
        }
    },
    softDeleteColor: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User ID is missing from request');
            const color = await colorService.softDeleteColor(req.params.id, userId);
            if (!color) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Color not found',
                });
                return;
            }
            res.locals.targetId = color._id?.toString();
            res.locals.description = `Deleted color: ${color.name}`
            res.status(200).json({
                success: true,
                code: 200,
                message: 'Color deleted successfully',
            });
        } catch (error) {
            handleError(res, error, 'Failed to delete color', 400);
        }
    },
    restoreColor: async (req: Request, res: Response) => {
        try {
            const color = await colorService.restoreColor(req.params.id);
            if (!color) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Color not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Color restored successfully',
            });
        } catch (error) {
            handleError(res, error, 'Failed to delete color', 400);
        }
    }
};

export default controller;
