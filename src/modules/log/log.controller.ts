import { Request, Response } from 'express';
import * as logService from '@common/services/log.service';
import { handleError, buildCommonQuery } from '@common/utils';

const controller = {
  getAllLogs: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { filters, sort } = buildCommonQuery(req, [
        'targetModel',
        'action',
        'description',
      ]);

      const logs = await logService.getAllLogs(page, limit, filters, sort);

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Logs fetched successfully',
        data: logs.data,
        currentPage: logs.currentPage,
        totalPages: logs.totalPages,
        totalItems: logs.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch logs', 400);
    }
  },

  getLogById: async (req: Request, res: Response) => {
    try {
      const log = await logService.getLogById(req.params.id);

      if (!log) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Log not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Log fetched successfully',
        data: log,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch log', 400);
    }
  },

  deleteLog: async (req: Request, res: Response) => {
    try {
      const deleted = await logService.hardDeleteLog(req.params.id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Log not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Log deleted successfully',
        data: deleted,
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete log', 400);
    }
  },

  clearAllLogs: async (_req: Request, res: Response) => {
    try {
      await logService.clearAllLogs();
      res.status(200).json({
        success: true,
        code: 200,
        message: 'All logs cleared (dev only)',
      });
    } catch (error) {
      handleError(res, error, 'Failed to clear logs', 400);
    }
  },
};

export default controller;
