import { Prisma, Job, Role, JobStatus } from '@prisma/client';
import {
  createJobRecord,
  updateJobRecord,
  deleteJobRecord,
  findJobByIdRecord,
  listJobsRecord,
  findSavedJobRecord,
  saveJobRecord,
  unsaveJobRecord,
  listSavedJobsRecord,
  PaginatedJobsResult,
} from './jobs.repository';
import { CreateJobInput, UpdateJobInput, ListJobsQuery } from './jobs.validation';
import { AppError } from '../../utils/AppError';

export interface UserContext {
  id: string;
  role: Role;
  companyId: string | null;
}

export interface ToggleSaveResult {
  saved: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// Jobs Service (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Create a new job posting.
 */
export const createJob = async (user: UserContext, input: CreateJobInput): Promise<Job> => {
  if (user.role !== Role.RECRUITER && user.role !== Role.ADMIN) {
    throw new AppError('Access denied. Only recruiters and admins can post jobs.', 403);
  }

  let targetCompanyId: string | undefined;

  if (user.role === Role.RECRUITER) {
    if (!user.companyId) {
      throw new AppError('You must belong to a registered company before posting jobs.', 403);
    }
    targetCompanyId = user.companyId;
  } else if (user.role === Role.ADMIN) {
    targetCompanyId = input.companyId || user.companyId || undefined;
    if (!targetCompanyId) {
      throw new AppError('Company ID must be specified when an ADMIN creates a job.', 400);
    }
  }

  if (!targetCompanyId) {
    throw new AppError('Unable to resolve company ID for this job posting.', 400);
  }

  return createJobRecord({
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status || JobStatus.PUBLISHED,
    companyId: targetCompanyId,
  });
};

/**
 * Update an existing job posting with strict tenant ownership checks.
 */
export const updateJob = async (user: UserContext, jobId: string, input: UpdateJobInput): Promise<Job> => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  // Tenant Isolation Check
  if (user.role === Role.RECRUITER && job.companyId !== user.companyId) {
    throw new AppError(
      'Tenant Isolation Error: Access denied. You can only modify jobs belonging to your own company.',
      403,
    );
  }

  const updateData: Prisma.JobUpdateInput = {
    ...(input.title ? { title: input.title.trim() } : {}),
    ...(input.description ? { description: input.description.trim() } : {}),
    ...(input.status ? { status: input.status } : {}),
  };

  return updateJobRecord(jobId, updateData);
};

/**
 * Delete an existing job posting with strict tenant ownership checks.
 */
export const deleteJob = async (user: UserContext, jobId: string): Promise<Job> => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  // Tenant Isolation Check
  if (user.role === Role.RECRUITER && job.companyId !== user.companyId) {
    throw new AppError(
      'Tenant Isolation Error: Access denied. You can only delete jobs belonging to your own company.',
      403,
    );
  }

  return deleteJobRecord(jobId);
};

/**
 * Fetch a job by exact ID.
 */
export const getJobById = async (jobId: string) => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }
  return job;
};

/**
 * List jobs across the marketplace, or strictly isolated by recruiter's company.
 */
export const listJobs = async (
  query: ListJobsQuery,
  user?: UserContext,
  options: { myCompanyOnly?: boolean } = {},
): Promise<PaginatedJobsResult> => {
  let targetCompanyId = query.companyId;
  let targetStatus = query.status;

  if (options.myCompanyOnly) {
    if (!user || !user.companyId) {
      throw new AppError('You must belong to a company to access company job dashboards.', 403);
    }
    targetCompanyId = user.companyId;
  } else {
    if (!targetStatus && (!user || (user.role === Role.RECRUITER && targetCompanyId !== user.companyId))) {
      targetStatus = JobStatus.PUBLISHED;
    }
  }

  return listJobsRecord({
    search: query.search,
    status: targetStatus,
    companyId: targetCompanyId,
    page: query.page,
    limit: query.limit,
  });
};

/**
 * Toggle saving/unsaving a job for a candidate.
 */
export const toggleSaveJob = async (userId: string, jobId: string): Promise<ToggleSaveResult> => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const existingSave = await findSavedJobRecord(userId, jobId);

  if (existingSave) {
    await unsaveJobRecord(userId, jobId);
    return {
      saved: false,
      message: 'Job removed from your saved jobs.',
    };
  } else {
    await saveJobRecord(userId, jobId);
    return {
      saved: true,
      message: 'Job successfully saved for later.',
    };
  }
};

/**
 * List all saved jobs for a specific user.
 */
export const listSavedJobs = async (userId: string) => {
  return listSavedJobsRecord(userId);
};
