import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

/**
 * Middleware to validate incoming request data (`req.body`, `req.query`, `req.params`)
 * against a Zod schema. If validation passes, `req.body`, `req.query`, and `req.params`
 * are updated with parsed values (allowing type coercion and stripping unknown fields).
 */
export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed && typeof parsed === 'object') {
        if ('body' in parsed && parsed.body !== undefined) req.body = parsed.body;
        if ('query' in parsed && parsed.query !== undefined) Object.assign(req.query, parsed.query);
        if ('params' in parsed && parsed.params !== undefined) Object.assign(req.params, parsed.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
