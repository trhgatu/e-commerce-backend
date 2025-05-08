import { Request, Response } from 'express';
import User from '../models/userModel';

interface AuthResponse {
    user: { _id: string; email: string; name: string; role: string };
    token: string;
}

interface ErrorResponse {
    message: string;
}
const controller = {
    getCurrentUser: async (req: Request, res: Response<AuthResponse | ErrorResponse>) => {
        try {
            const user = await User.findById(req.user?.userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const token = req.headers.authorization?.split(' ')[1] || '';
            res.json({
                user: { _id: user._id.toString(), email: user.email, name: user.name, role: user.role },
                token,
            });
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
}
export default controller;