import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  listJobsController,
  listSavedJobsController,
  toggleSaveJobController,
  listMyCompanyJobsController,
  getJobByIdController,
  createJobController,
  updateJobController,
  deleteJobController,
} from './jobs.controller';
import { requireAuth, requireRole, requireRecruiterAuth } from '../../middlewares/auth.middleware';
import { requireCompany, requireJobTenantOwnership } from '../../middlewares/tenant.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createJobSchema,
  updateJobSchema,
  jobIdParamsSchema,
  listJobsSchema,
} from './jobs.validation';
import { catchAsync } from '../../utils/catchAsync';
import { getJobPipelineController } from '../applications/application.controller';
import { getApplicationsByJobSchema } from '../applications/application.validation';

const router = Router();

// ---------------------------------------------------------------------------
// Jobs Routes (/api/v1/jobs)
// ---------------------------------------------------------------------------

// ── Public / Marketplace Queries ───────────────────────────────────────────
router.get(
  '/',
  validateRequest(listJobsSchema),
  catchAsync(listJobsController),
);

// ── Authenticated Candidate Actions (Saved Jobs) ───────────────────────────
router.get(
  '/saved/me',
  requireAuth,
  catchAsync(listSavedJobsController),
);

router.post(
  '/:id/save',
  requireAuth,
  validateRequest(jobIdParamsSchema),
  catchAsync(toggleSaveJobController),
);

// ── Recruiter Company Dashboard (Strict Tenant Isolation) ──────────────────
router.get(
  '/company/my-jobs',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireCompany,
  validateRequest(listJobsSchema),
  catchAsync(listMyCompanyJobsController),
);

// ── Recruiter Kanban Board Pipeline for Job ────────────────────────────────
router.get(
  '/:jobId/applications',
  requireRecruiterAuth,
  validateRequest(getApplicationsByJobSchema),
  catchAsync(getJobPipelineController),
);

// ── Single Job Detail ──────────────────────────────────────────────────────
router.get(
  '/:id',
  validateRequest(jobIdParamsSchema),
  catchAsync(getJobByIdController),
);

// ── Job Management (Recruiters & Admins Only) ──────────────────────────────
router.post(
  '/',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireCompany,
  validateRequest(createJobSchema),
  catchAsync(createJobController),
);

router.patch(
  '/:id',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireJobTenantOwnership,
  validateRequest(updateJobSchema),
  catchAsync(updateJobController),
);

router.delete(
  '/:id',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  requireJobTenantOwnership,
  validateRequest(jobIdParamsSchema),
  catchAsync(deleteJobController),
);

export const jobsRoutes = router;
