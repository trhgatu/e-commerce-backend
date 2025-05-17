import { Request, Response } from 'express';
import User from '../models/userModel';

const controller = {
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId).select('-password').lean();

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({
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
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

export default controller;
