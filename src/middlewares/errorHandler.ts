import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

// ---------------------------------------------------------------------------
// Standardised JSON error response shape
// ---------------------------------------------------------------------------
export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  path: string;
  method: string;
  timestamp: string;
  errors?: unknown;
  stack?: string;
}

// ---------------------------------------------------------------------------
// Centralised Error Handler Middleware
// ---------------------------------------------------------------------------
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // Common context payload to identify exactly *where* the error happened
  const baseResponse = {
    success: false as const,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  // ── 1. Zod Validation Errors ─────────────────────────────────────────────
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    err.issues.forEach((issue) => {
      // If the path starts with body/query/params and has nested segments, strip the prefix
      const path =
        issue.path.length > 1 &&
        (issue.path[0] === 'body' || issue.path[0] === 'query' || issue.path[0] === 'params')
          ? issue.path.slice(1).join('.')
          : issue.path.join('.') || 'general';
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(issue.message);
    });

    const response: ErrorResponse = {
      ...baseResponse,
      statusCode: 422,
      message: 'Data validation failed. Please check the provided inputs.',
      errors: formattedErrors,
    };
    res.status(422).json(response);
    return;
  }

  // ── 2. Known Operational Errors (AppError) ────────────────────────────────
  if (err instanceof AppError && err.isOperational) {
    const response: ErrorResponse = {
      ...baseResponse,
      statusCode: err.statusCode,
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // ── 3. Prisma Database Errors ─────────────────────────────────────────────
  // Intercept common database errors to provide meaningful messages
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode = 400;
    let message = 'Database operation failed';

    // Unique constraint violation (e.g. duplicate email or slug)
    if (err.code === 'P2002') {
      statusCode = 409; // Conflict
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      message = `Duplicate entry error: The value for '${target}' is already in use.`;
    }
    // Record not found
    else if (err.code === 'P2025') {
      statusCode = 404; // Not Found
      message = 'The requested database record could not be found.';
    }

    const response: ErrorResponse = {
      ...baseResponse,
      statusCode,
      message,
    };
    res.status(statusCode).json(response);
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    const response: ErrorResponse = {
      ...baseResponse,
      statusCode: 400,
      message: 'Invalid database query. Please check data types or missing fields.',
    };
    res.status(400).json(response);
    return;
  }

  // ── 4. Unknown / Programming Errors ──────────────────────────────────────
  // Do not leak sensitive implementation details in production.
  const statusCode = 500;
  const isProd = env.NODE_ENV === 'production';
  const message = isProd
    ? 'An internal server error occurred.'
    : (err instanceof Error ? err.message : 'An unknown programming error occurred.');

  const response: ErrorResponse = {
    ...baseResponse,
    statusCode,
    message,
    ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
  };

  // Log non-operational errors with full request context — these are bugs that must be fixed.
  console.error(`🔥 [ERROR] ${req.method} ${req.originalUrl} |`, err);

  res.status(statusCode).json(response);
};
