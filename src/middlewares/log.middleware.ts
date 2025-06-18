// src/middlewares/logMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { logAction } from '@common/services/log.service';
import { LogAction } from '@common/models/log.model';

export const createLog = (action: LogAction, targetModel: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      const isSuccessful = res.statusCode >= 200 && res.statusCode < 300;

      if (isSuccessful && req.user) {
        const targetId = req.params.id || (res.locals.targetId as string) || 'unknown';

        await logAction({
          userId: req.user._id.toString(),
          targetModel,
          targetId,
          action,
          description: `${req.user.fullName} performed ${action} on ${targetModel} ${targetId}`,
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
