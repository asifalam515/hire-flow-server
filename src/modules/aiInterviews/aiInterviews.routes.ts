import { Router } from 'express';
import {
  startAiSessionController,
  getAiSessionController,
  submitCandidateAnswerController,
  getAiScorecardController,
} from './aiInterviews.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  startAiSessionSchema,
  getAiSessionSchema,
  submitAnswerSchema,
  applicationIdParamSchema,
} from './aiInterviews.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// ---------------------------------------------------------------------------
// AI Interviews Routes (/api/v1/ai-interviews)
// ---------------------------------------------------------------------------

// ── Initialize or resume an AI Interview Session ───────────────────────────
router.post(
  '/start',
  requireAuth,
  validateRequest(startAiSessionSchema),
  catchAsync(startAiSessionController),
);

// ── Fetch active session details, questions & transcript ───────────────────
router.get(
  '/:sessionId',
  requireAuth,
  validateRequest(getAiSessionSchema),
  catchAsync(getAiSessionController),
);

// ── Submit candidate answer and advance / finalize interview ───────────────
router.post(
  '/:sessionId/answer',
  requireAuth,
  validateRequest(submitAnswerSchema),
  catchAsync(submitCandidateAnswerController),
);

// ── Retrieve evaluation scorecard for an application ───────────────────────
router.get(
  '/application/:applicationId',
  requireAuth,
  validateRequest(applicationIdParamSchema),
  catchAsync(getAiScorecardController),
);

export default router;

