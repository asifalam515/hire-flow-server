import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

/**
 * Middleware that verifies the authenticated user (`req.user`) is associated with a company (`companyId`).
 * Typically applied to routes where recruiters create or manage company-scoped resources.
 */
export const requireCompany = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  // Admins can bypass or require explicit company scope depending on operation,
  // but for recruiters, companyId must be present.
  if (req.user.role === Role.RECRUITER && !req.user.companyId) {
    return next(
      new AppError(
        'Tenant Isolation Error: You must belong to a registered company to perform this action.',
        403,
      ),
    );
  }

  next();
};

/**
 * Middleware that checks whether the target Job (`req.params.id`) belongs to the authenticated
 * user's company (`req.user.companyId`).
 * Enforces strict multi-tenant data isolation so recruiters can only modify their own company's jobs.
 */
export const requireJobTenantOwnership = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  // System Admins bypass tenant restriction
  if (req.user.role === Role.ADMIN) {
    return next();
  }

  const rawJobId = req.params.id;
  const jobId = Array.isArray(rawJobId) ? rawJobId[0] : rawJobId;

  if (typeof jobId !== 'string' || !jobId) {
    return next(new AppError('Job ID parameter is required and must be a valid string.', 400));
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { companyId: true },
    });

    if (!job) {
      return next(new AppError('Job not found.', 404));
    }

    if (job.companyId !== req.user.companyId) {
      return next(
        new AppError(
          'Tenant Isolation Error: Access denied. You can only modify jobs posted by your own company.',
          403,
        ),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
