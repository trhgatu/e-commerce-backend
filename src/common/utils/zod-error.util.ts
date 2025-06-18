import { Response } from 'express';
import { ZodError } from 'zod';

export const returnZodError = (res: Response, error: ZodError): Response => {
  return res.status(400).json({
    success: false,
    code: 400,
    message: 'Validation failed',
    details: error.errors,
  });
};
