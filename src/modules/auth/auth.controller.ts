// controllers/authController.ts
import { Request, Response } from 'express';
import * as authService from './auth.service';
import { handleError, sendResponse, getUserId } from '@common/utils';

const controller = {
  register: async (req: Request, res: Response) => {
    try {
      const user = await authService.register(req.body);

      res.locals.targetId = user.user._id.toString();
      res.locals.description = `User register: ${user.user.email}`;

      sendResponse({
        res,
        statusCode: 201,
        message: 'Register successful',
        data: user,
      });
    } catch (error) {
      handleError(res, error, 'Registration failed', 400);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { accessToken, refreshToken, user } = await authService.login(
        req.body
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.locals.targetId = user._id.toString();
      res.locals.description = `User login: ${user.email}`;

      sendResponse({
        res,
        message: 'Login successful',
        data: {
          token: accessToken,
          user,
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      handleError(res, error, 'Login failed', 401);
    }
  },

  getMe: async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const data = await authService.getMe(userId);
      sendResponse({ res, message: 'User info fetched', data });
    } catch (error) {
      handleError(res, error, 'Unauthorized', 401);
    }
  },

  logout: async (_: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    sendResponse({ res, message: 'Logged out successfully' });
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) throw new Error('Refresh token not provided');

      const data = await authService.refreshAccessToken(token);
      sendResponse({ res, message: 'Access token refreshed', data });
    } catch (error) {
      handleError(res, error, 'Failed to refresh access token', 401);
    }
  },
};

export default controller;
