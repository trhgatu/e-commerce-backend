import { Request, Response } from 'express';
import * as brandService from '../services/brandService';
import { handleError } from '../utils/handleError';

const controller = {
    // Get all brands with pagination
    getAllBrands: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await brandService.getBrands(page, limit);

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Brands fetched successfully',
                data: result.data,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                totalItems: result.total,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch brands', 400);
        }
    },

    // Get brand by ID
    getBrandById: async (req: Request, res: Response) => {
        try {
            const brand = await brandService.getBrandById(req.params.id);
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
                message: 'Brand fetched successfully',
                data: brand,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch brand', 400);
        }
    },

    // Create new brand
    createBrand: async (req: Request, res: Response) => {
        try {
            const brandData = req.body;
            console.log(brandData)
            const brand = await brandService.createBrand(brandData);

            res.status(201).json({
                success: true,
                code: 201,
                message: 'Brand created successfully',
                data: brand,
            });
        } catch (error) {
            handleError(res, error, 'Failed to create brand', 400);
        }
    },

    // Update brand
    updateBrand: async (req: Request, res: Response) => {
        try {
            const brandData = req.body;
            const brand = await brandService.updateBrand(req.params.id, brandData);

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
                message: 'Brand updated successfully',
                data: brand,
            });
        } catch (error) {
            handleError(res, error, 'Failed to update brand', 400);
        }
    },

    // Delete brand
    hardDeleteBrand: async (req: Request, res: Response) => {
        try {
            const brand = await brandService.hardDeleteBrand(req.params.id);
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
    softDeleteBrand: async (req: Request, res: Response) => {
        try {
            const brand = await brandService.softDeleteBrand(req.params.id);
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
};

export default controller;
