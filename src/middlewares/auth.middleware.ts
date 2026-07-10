import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export interface JwtPayload {
  id: string;
  role: Role;
  companyId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to extract the Bearer token, verify the JWT, and attach the decoded
 * user payload (`id`, `role`, `companyId`) to the Express `req.user` object.
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Please provide a valid Bearer token.', 401));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || !parts[1]) {
    return next(new AppError('Authentication required. Please provide a valid Bearer token.', 401));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof decoded === 'string' || !decoded.id || !decoded.role) {
      return next(new AppError('Invalid access token payload.', 401));
    }
    req.user = decoded as unknown as JwtPayload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Access token has expired. Please refresh your token.', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid access token. Authentication failed.', 401));
    } else {
      next(new AppError('Authentication verification failed.', 401));
    }
  }
};

/**
 * Closure middleware to strictly enforce Role-Based Access Control (RBAC).
 * Must be executed after `requireAuth`.
 *
 * @param allowedRoles Array of `Role` enum values permitted to access the route.
 */
export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required before verifying permissions.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}.`,
          403,
        ),
      );
    }

    next();
  };
};

/**
 * Convenience middleware array requiring candidate authentication and CANDIDATE role.
 */
export const requireCandidateAuth = [requireAuth, requireRole([Role.CANDIDATE])];

/**
 * Convenience middleware array requiring recruiter authentication and RECRUITER or ADMIN role.
 */
export const requireRecruiterAuth = [requireAuth, requireRole([Role.RECRUITER, Role.ADMIN])];

