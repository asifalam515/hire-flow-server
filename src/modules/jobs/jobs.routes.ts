import { Router } from 'express';
import { Role } from '@prisma/client';
import { JobsController } from './jobs.controller';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';
import { requireCompany, requireJobTenantOwnership } from '../../middlewares/tenant.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createJobSchema,
  updateJobSchema,
  jobIdParamsSchema,
  listJobsSchema,
} from './jobs.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();
const jobsController = new JobsController();

// ---------------------------------------------------------------------------
// Jobs Routes
// ---------------------------------------------------------------------------

// ── Public / Marketplace Queries ───────────────────────────────────────────
router.get(
  '/',
  validateRequest(listJobsSchema),
  catchAsync(jobsController.listJobs),
);

// ── Authenticated Candidate Actions (Saved Jobs) ───────────────────────────
router.get(
  '/saved/me',
  requireAuth,
  catchAsync(jobsController.listSavedJobs),
);

router.post(
  '/:id/save',
  requireAuth,
  validateRequest(jobIdParamsSchema),
  catchAsync(jobsController.toggleSaveJob),
);

// ── Recruiter Company Dashboard (Strict Tenant Isolation) ──────────────────
router.get(
  '/company/my-jobs',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireCompany,
  validateRequest(listJobsSchema),
  catchAsync(jobsController.listMyCompanyJobs),
);

// ── Single Job Detail ──────────────────────────────────────────────────────
router.get(
  '/:id',
  validateRequest(jobIdParamsSchema),
  catchAsync(jobsController.getJobById),
);

// ── Job Management (Recruiters & Admins Only) ──────────────────────────────
router.post(
  '/',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireCompany,
  validateRequest(createJobSchema),
  catchAsync(jobsController.createJob),
);

router.patch(
  '/:id',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireJobTenantOwnership,
  validateRequest(updateJobSchema),
  catchAsync(jobsController.updateJob),
);

router.delete(
  '/:id',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireJobTenantOwnership,
  validateRequest(jobIdParamsSchema),
  catchAsync(jobsController.deleteJob),
);

export const jobsRoutes = router;
