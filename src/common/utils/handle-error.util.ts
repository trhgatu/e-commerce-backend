// src/utils/handleError.ts

import { Response } from 'express';

export const handleError = (
  res: Response,
  error: unknown,
  message = 'Something went wrong',
  statusCode = 500
): Response => {
  if (error instanceof Error) {
    return res.status(statusCode).json({
      success: false,
      code: statusCode,
      message,
      error: error.message,
    });
  }

  return res.status(statusCode).json({
    success: false,
    code: statusCode,
    message,
    error: error,
  });
};
