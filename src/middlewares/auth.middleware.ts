import { Request, Response, NextFunction } from 'express';
import { UserPayload, UserStatus } from '@modules/user/user.model';
import { verifyAccessToken } from '@common/utils';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    const user: UserPayload = {
      _id: decoded._id,
      username: decoded.username,
      roleId: decoded.roleId,
      email: decoded.email,
      fullName: decoded.fullName,
      status: decoded.status as UserStatus,
    };

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
    return;
  }
};
