import { Request, Response } from 'express';
import User from '../models/userModel';
import * as userService from '../services/userService';
import { createUserSchema, updateUserSchema } from '../validators/userValidator';
import { handleError } from '../utils';

const controller = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Users fetched successfully',
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch users', 400);
    }
  },
  //Can sua
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId).select('-password').lean();

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          _id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
  getUserById: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'User not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        code: 200,
        message: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch user', 400);
    }
  },
  createUser: async (req: Request, res: Response) => {
    try {
      const parsed = createUserSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          code: 400,
          message: 'Validation failed',
          details: parsed.error.errors,
        });
        return;
      }

      let userData = parsed.data;
      if (!userData) {
        res.status(400).json({
          success: false,
          code: 400,
          message: 'Invalid user data',
        });
        return;
      }
      const user = await userService.createUser(userData);
      res.status(201).json({
        success: true,
        code: 201,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      console.log(error)
      handleError(res, error, 'Failed to create user', 400);
    }
  },
  updateUser: async (req: Request, res: Response) => {
    try {
      const parsed = updateUserSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          code: 400,
          message: 'Validation failed',
          details: parsed.error.errors,
        });
        return;
      }

      const userData = parsed.data;
      const user = await userService.updateUser(req.params.id, userData);

      if (!user) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update user', 400);
    }
  },
  hardDeleteUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.hardDeleteUser(req.params.id);
      if (!user) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'User deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete user', 400);
    }
  },
  softDeleteUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.softDeleteUser(req.params.id);
      if (!user) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'User deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete user', 400);
    }
  }
};

export default controller;
