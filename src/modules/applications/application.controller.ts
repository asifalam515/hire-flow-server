import { Request, Response } from 'express';
import { applyForJob, getJobPipeline, moveCandidateStage } from './application.service';
import { AppError } from '../../utils/AppError';

// ---------------------------------------------------------------------------
// Application Controller (Pure Arrow Functions)
// ---------------------------------------------------------------------------

const extractParamId = (req: Request, paramName: string = 'id'): string => {
  const rawId = req.params[paramName];
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (typeof id !== 'string' || !id) {
    throw new AppError(`Parameter '${paramName}' is required and must be a valid string.`, 400);
  }
  return id;
};

/**
 * POST /api/v1/applications
 */
export const applyForJobController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const application = await applyForJob(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Successfully applied to the job posting.',
    data: { application },
  });
};

/**
 * GET /api/v1/jobs/:jobId/applications
 * or GET /api/v1/applications/job/:jobId
 */
export const getJobPipelineController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const jobId = extractParamId(req, 'jobId');
  const applications = await getJobPipeline(req.user, jobId);

  res.status(200).json({
    success: true,
    data: {
      total: applications.length,
      applications,
    },
  });
};

/**
 * PATCH /api/v1/applications/:id/status
 */
export const moveCandidateStageController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const applicationId = extractParamId(req, 'id');
  const application = await moveCandidateStage(req.user, applicationId, req.body);

  res.status(200).json({
    success: true,
    message: `Candidate application moved to stage ${application.status}.`,
    data: { application },
  });
};
