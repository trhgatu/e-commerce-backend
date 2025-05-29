import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
    email: string;
    roleId?: string;
}

export const generateJwt = (payload: JwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  };