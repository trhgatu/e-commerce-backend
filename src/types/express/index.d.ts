import 'express';
import { UserPayload } from '../../api/v1/models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
