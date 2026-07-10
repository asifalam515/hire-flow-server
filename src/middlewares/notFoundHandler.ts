import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Catches requests to routes that do not exist.
 * Must be registered AFTER all valid routes, and BEFORE the errorHandler.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
};
