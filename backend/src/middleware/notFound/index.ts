/**
 * @summary
 * 404 Not Found middleware
 * Handles requests to non-existent routes
 *
 * @module middleware/notFound
 */

import { Request, Response } from 'express';
import { errorResponse } from '@/middleware/crud';

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json(errorResponse('routeNotFound'));
}
