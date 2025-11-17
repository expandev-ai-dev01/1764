/**
 * @summary
 * Global error handling middleware
 * Catches and formats all application errors
 *
 * @module middleware/error
 */

import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@/middleware/crud';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res
    .status(statusCode)
    .json(
      errorResponse(
        error.message || 'internalServerError',
        process.env.NODE_ENV === 'development' ? error.stack : undefined
      )
    );
}
