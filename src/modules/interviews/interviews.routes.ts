import { Router } from 'express';
import {
  scheduleInterviewController,
  getInterviewRoomController,
  generateTokenController,
  updateNotesController,
  updateStatusController,
} from './interviews.controller';
import { requireAuth, requireRecruiterAuth } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  scheduleInterviewSchema,
  generateTokenSchema,
  updateNotesSchema,
  updateStatusSchema,
  applicationIdParamSchema,
} from './interviews.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// ---------------------------------------------------------------------------
// Interviews Routes (/api/v1/interviews)
// ---------------------------------------------------------------------------

// ── Recruiter Schedules Interview ──────────────────────────────────────────
router.post(
  '/schedule',
  requireRecruiterAuth,
  validateRequest(scheduleInterviewSchema),
  catchAsync(scheduleInterviewController),
);

// ── Get Room By Application ID (Candidate & Recruiter) ────────────────────
router.get(
  '/application/:applicationId',
  requireAuth,
  validateRequest(applicationIdParamSchema),
  catchAsync(getInterviewRoomController),
);

// ── Generate LiveKit Access Token ──────────────────────────────────────────
router.post(
  '/token',
  requireAuth,
  validateRequest(generateTokenSchema),
  catchAsync(generateTokenController),
);

// ── Recruiter Updates Private Notes ────────────────────────────────────────
router.patch(
  '/:id/notes',
  requireRecruiterAuth,
  validateRequest(updateNotesSchema),
  catchAsync(updateNotesController),
);

// ── Recruiter Updates Status ───────────────────────────────────────────────
router.patch(
  '/:id/status',
  requireRecruiterAuth,
  validateRequest(updateStatusSchema),
  catchAsync(updateStatusController),
);

export const interviewsRoutes = router;
