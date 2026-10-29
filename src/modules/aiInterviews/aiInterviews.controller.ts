import { Request, Response } from 'express';
import {
  startAiInterviewSession,
  getAiInterviewSession,
  submitCandidateAnswer,
  getAiScorecardForApplication,
} from './aiInterviews.service';
import { AppError } from '../../utils/AppError';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const extractParam = (req: Request, paramName: string): string => {
  const val = req.params[paramName];
  const str = Array.isArray(val) ? val[0] : val;
  if (!str) {
    throw new AppError(`Missing required parameter: ${paramName}`, 400);
  }
  return str;
};

// ---------------------------------------------------------------------------
// AI Interviews Controller (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * POST /api/v1/ai-interviews/start
 * Initializes or resumes an AI interview session for an application.
 */
export const startAiSessionController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const { applicationId } = req.body;
  const session = await startAiInterviewSession(req.user, applicationId);

  res.status(200).json({
    success: true,
    message: 'AI interview session started successfully',
    data: { session },
  });
};

/**
 * GET /api/v1/ai-interviews/:sessionId
 * Retrieves the state of an active or completed AI interview session.
 */
export const getAiSessionController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const sessionId = extractParam(req, 'sessionId');
  const session = await getAiInterviewSession(req.user, sessionId);

  res.status(200).json({
    success: true,
    data: { session },
  });
};

/**
 * POST /api/v1/ai-interviews/:sessionId/answer
 * Ingests candidate's answer, advances question or finalizes interview with Gemini scorecard.
 */
export const submitCandidateAnswerController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const sessionId = extractParam(req, 'sessionId');
  const { answer } = req.body;

  const result = await submitCandidateAnswer(req.user, sessionId, answer);

  res.status(200).json({
    success: true,
    message: result.isCompleted ? 'Interview completed successfully' : 'Answer recorded',
    data: result,
  });
};

/**
 * GET /api/v1/ai-interviews/application/:applicationId
 * Retrieves the scorecard and evaluation rubric for a specific application.
 */
export const getAiScorecardController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const applicationId = extractParam(req, 'applicationId');
  const session = await getAiScorecardForApplication(req.user, applicationId);

  res.status(200).json({
    success: true,
    data: { session },
  });
};

