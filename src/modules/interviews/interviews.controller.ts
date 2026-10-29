import { Request, Response } from 'express';
import {
  scheduleInterview,
  getInterviewRoomByApplication,
  generateLiveKitToken,
  updateInterviewNotes,
  updateInterviewStatus,
} from './interviews.service';
import { AppError } from '../../utils/AppError';

// ---------------------------------------------------------------------------
// Interviews Controller (Pure Arrow Functions)
// ---------------------------------------------------------------------------

const extractParam = (req: Request, paramName: string): string => {
  const val = req.params[paramName];
  const str = Array.isArray(val) ? val[0] : val;
  if (!str) {
    throw new AppError(`Missing required parameter: ${paramName}`, 400);
  }
  return str;
};

/**
 * POST /api/v1/interviews/schedule
 */
export const scheduleInterviewController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const room = await scheduleInterview(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Interview scheduled successfully',
    data: { room },
  });
};

/**
 * GET /api/v1/interviews/application/:applicationId
 */
export const getInterviewRoomController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const applicationId = extractParam(req, 'applicationId');
  const room = await getInterviewRoomByApplication(req.user, applicationId);

  res.status(200).json({
    success: true,
    data: { room },
  });
};

/**
 * POST /api/v1/interviews/token
 */
export const generateTokenController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const result = await generateLiveKitToken(req.user, req.body.applicationId);

  res.status(200).json({
    success: true,
    message: 'LiveKit token generated successfully',
    data: result,
  });
};

/**
 * PATCH /api/v1/interviews/:id/notes
 */
export const updateNotesController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const id = extractParam(req, 'id');
  const room = await updateInterviewNotes(req.user, id, req.body);

  res.status(200).json({
    success: true,
    message: 'Interview notes updated',
    data: { room },
  });
};

/**
 * PATCH /api/v1/interviews/:id/status
 */
export const updateStatusController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const id = extractParam(req, 'id');
  const room = await updateInterviewStatus(req.user, id, req.body);

  res.status(200).json({
    success: true,
    message: 'Interview status updated',
    data: { room },
  });
};

