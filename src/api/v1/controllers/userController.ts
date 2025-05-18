import { Request, Response } from 'express';
import User from '../models/userModel';
import * as userService from '../services/userService';
import { createUserSchema, updateUserSchema } from '../validators/userValidator';
import { handleError } from '../utils';

const controller = {
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
          const category = await userService.createUser(userData);
          res.status(201).json({
            success: true,
            code: 201,
            message: 'User created successfully',
            data: category,
          });
        } catch (error) {
            console.log(error)
          handleError(res, error, 'Failed to create category', 400);
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
  }
};

export default controller;
