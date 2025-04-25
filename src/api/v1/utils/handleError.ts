// src/utils/handleError.ts

import { Response } from 'express';

export const handleError = (res: Response, error: unknown, message = 'Something went wrong', statusCode = 500) => {
  if (error instanceof Error) {
    res.status(statusCode).json({ error: `${message}: ${error.message}` });
  } else {
    res.status(statusCode).json({ error: message });
  }
};
