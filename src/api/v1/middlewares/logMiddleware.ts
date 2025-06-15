// src/middlewares/logMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { logAction } from '../services/logService';
import { LogAction } from '../models/logModel';

export const createLog = (action: LogAction, targetModel: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      console.log('[LOG] res.locals:', res.locals);
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const targetId = req.params.id || res.locals.targetId;

        await logAction({
          userId: req.user._id,
          targetModel,
          targetId,
          action,
          description: `${req.user.fullName} performed ${action} on ${targetModel} ${targetId}`,
          metadata: {
            body: req.body,
            method: req.method,
            url: req.originalUrl,
          },
        });
      }
    });

    next();
  };
};
