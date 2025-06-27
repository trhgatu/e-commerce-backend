// src/core/utils/response.ts
import { Response } from 'express';

interface IResponse<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendResponse = <T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  meta,
}: IResponse<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    ...(meta && { meta }),
  });
};
