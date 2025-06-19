// controllers/authController.ts
import { Request, Response } from 'express';
import * as authService from './auth.service';
import { handleError } from '@common/utils';

const controller = {
  register: async (req: Request, res: Response) => {
    const { email, password, fullName } = req.body;

    try {
      const user = await authService.register(email, password, fullName);

      res.locals.targetId = user.user._id.toString();
      res.locals.description = `User register: ${user.user.email}`;

      res.status(201).json({
        success: true,
        code: 201,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      handleError(res, error, 'Registration failed', 400);
    }
  },

  login: async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    try {
      const user = await authService.login(identifier, password);

      res.locals.targetId = user.user._id.toString();
      res.locals.description = `User login: ${user.user.email}`;

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Login successful',
        data: user,
      });
    } catch (error) {
      console.error('Login failed:', error);
      handleError(res, error, 'Login failed', 401);
    }
  },
  logout: async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      code: 200,
      message: 'Logged out successfully',
    });
  }
};

export default controller;
