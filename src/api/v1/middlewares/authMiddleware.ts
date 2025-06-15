import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { UserPayload } from '../models/userModel';


export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
    };

    const userFromDb = await UserModel.findById(decoded.userId)
      .select('_id email fullName username roleId status')
      .lean();

    if (!userFromDb) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const user: UserPayload = {
      _id: userFromDb._id.toString(),
      email: userFromDb.email,
      fullName: userFromDb.fullName,
      username: userFromDb.username,
      roleId: userFromDb.roleId?.toString(),
      status: userFromDb.status,
    };

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
    return;
  }
};
