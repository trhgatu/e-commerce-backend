import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
}

export const generateJwt = (payload: JwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  };