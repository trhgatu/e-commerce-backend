// controllers/authController.ts
import { Request, Response } from 'express';
import * as authService from './auth.service';
import { handleError } from '@common/utils';

const controller = {
  register: async (req: Request, res: Response) => {
    const { email, password, fullName } = req.body;

    try {
      const result = await authService.register(email, password, fullName);
      res.status(201).json({
        success: true,
        code: 201,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Registration failed', 400);
    }
  },

  login: async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    try {
      const result = await authService.login(identifier, password);
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
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
