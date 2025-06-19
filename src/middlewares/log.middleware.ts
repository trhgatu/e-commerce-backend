// src/middlewares/logMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { logAction } from '@common/services/log.service';
import { LogAction } from '@common/models/log.model';

export const createLog = (action: LogAction, targetModel: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      const isSuccessful = res.statusCode >= 200 && res.statusCode < 300;

      const userId = req.user?._id?.toString() || res.locals.targetId || 'unknown';

      if (isSuccessful && userId) {
        const targetId = req.params.id || res.locals.targetId || 'unknown';

        await logAction({
          userId,
          targetModel,
          targetId,
          action,
          description: res.locals.description || `User performed ${action} on ${targetModel} ${targetId}`,
          metadata: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
          },
        });
      }
    });

    next();
  };
};
