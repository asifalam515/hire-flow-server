import { Request, Response } from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  listJobs,
  toggleSaveJob,
  listSavedJobs,
} from './jobs.service';
import { AppError } from '../../utils/AppError';

// ---------------------------------------------------------------------------
// Jobs Controller (Pure Arrow Functions)
// ---------------------------------------------------------------------------

const extractJobId = (req: Request): string => {
  const rawJobId = req.params.id;
  const jobId = Array.isArray(rawJobId) ? rawJobId[0] : rawJobId;
  if (typeof jobId !== 'string' || !jobId) {
    throw new AppError('Job ID parameter is required and must be a valid string.', 400);
  }
  return jobId;
};

/**
 * POST /api/v1/jobs
 */
export const createJobController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const job = await createJob(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: { job },
  });
};

/**
 * PATCH /api/v1/jobs/:id
 */
export const updateJobController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const jobId = extractJobId(req);
  const job = await updateJob(req.user, jobId, req.body);

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: { job },
  });
};

/**
 * DELETE /api/v1/jobs/:id
 */
export const deleteJobController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const jobId = extractJobId(req);
  await deleteJob(req.user, jobId);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
};

/**
 * GET /api/v1/jobs/:id
 */
export const getJobByIdController = async (req: Request, res: Response): Promise<void> => {
  const jobId = extractJobId(req);
  const job = await getJobById(jobId);

  res.status(200).json({
    success: true,
    data: { job },
  });
};

/**
 * GET /api/v1/jobs
 * Marketplace listing with optional GIN full-text search (`?search=...`).
 */
export const listJobsController = async (req: Request, res: Response): Promise<void> => {
  const result = await listJobs(req.query as any, req.user);

  res.status(200).json({
    success: true,
    data: result,
  });
};

/**
 * GET /api/v1/jobs/company/my-jobs
 * Strictly isolated listing for a recruiter's own company.
 */
export const listMyCompanyJobsController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.companyId) {
    throw new AppError('You must belong to a company to access company jobs.', 403);
  }

  const result = await listJobs(
    req.query as any,
    req.user,
    { myCompanyOnly: true },
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};

/**
 * POST /api/v1/jobs/:id/save
 * Toggle saving a job for later for a candidate.
 */
export const toggleSaveJobController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const jobId = extractJobId(req);
  const result = await toggleSaveJob(req.user.id, jobId);

  res.status(200).json({
    success: true,
    message: result.message,
    data: { saved: result.saved },
  });
};

/**
 * GET /api/v1/jobs/saved/me
 * List all saved jobs for the currently authenticated candidate.
 */
export const listSavedJobsController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  const savedJobs = await listSavedJobs(req.user.id);

  res.status(200).json({
    success: true,
    data: { savedJobs },
  });
};
