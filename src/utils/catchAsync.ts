import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an asynchronous Express route handler or middleware to catch any
 * unhandled Promise rejections and automatically forward them to `next()`.
 *
 * @example
 *   router.post('/register', catchAsync(usersController.register));
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
