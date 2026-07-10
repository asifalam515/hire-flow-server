import { Router } from 'express';
import {
  applyForJobController,
  getJobPipelineController,
  moveCandidateStageController,
} from './application.controller';
import { requireCandidateAuth, requireRecruiterAuth } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  ApplyToJobSchema,
  UpdateApplicationStatusSchema,
  getApplicationsByJobSchema,
} from './application.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// ---------------------------------------------------------------------------
// Application Routes (/api/v1/applications)
// ---------------------------------------------------------------------------

// ── Candidate Applies to Job ───────────────────────────────────────────────
router.post(
  '/',
  requireCandidateAuth,
  validateRequest(ApplyToJobSchema),
  catchAsync(applyForJobController),
);

// ── Recruiter Views Kanban Board Pipeline for a Job ────────────────────────
router.get(
  '/job/:jobId',
  requireRecruiterAuth,
  validateRequest(getApplicationsByJobSchema),
  catchAsync(getJobPipelineController),
);

// ── Recruiter Updates Stage (e.g. APPLIED -> SCREENING -> INTERVIEW) ───────
router.patch(
  '/:id/status',
  requireRecruiterAuth,
  validateRequest(UpdateApplicationStatusSchema),
  catchAsync(moveCandidateStageController),
);

export const applicationRoutes = router;
