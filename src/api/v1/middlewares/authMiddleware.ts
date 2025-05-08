import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
            userId: string;
            email: string;
            role: string;
        };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
        return;
    }
};