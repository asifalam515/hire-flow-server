import { Application, JobStatus, Role } from '@prisma/client';
import {
  createApplicationRecord,
  checkExistingApplication,
  getApplicationsByJobId,
  findApplicationByIdWithJob,
  updateApplicationStatus,
} from './application.repository';
import { ApplyToJobInput, UpdateApplicationStatusInput } from './application.validation';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../config/prisma';
import { JwtPayload } from '../../middlewares/auth.middleware';

// ---------------------------------------------------------------------------
// Application Service (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Candidate applies for a job.
 * Resolves/creates CandidateProfile, checks if job is PUBLISHED, and prevents duplicates.
 */
export const applyForJob = async (user: JwtPayload, input: ApplyToJobInput): Promise<Application> => {
  if (user.role !== Role.CANDIDATE && user.role !== Role.ADMIN) {
    throw new AppError('Only candidates can apply to jobs.', 403);
  }

  // 1. Check if target job exists and is open for applications
  const job = await prisma.job.findUnique({
    where: { id: input.jobId },
    select: { id: true, status: true, title: true },
  });

  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  if (job.status !== JobStatus.PUBLISHED) {
    throw new AppError('Cannot apply to a job that is not currently published.', 400);
  }

  // 2. Resolve CandidateProfile for the user (auto-create if candidate has not filled resume yet)
  let candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!candidateProfile) {
    candidateProfile = await prisma.candidateProfile.create({
      data: { userId: user.id },
      select: { id: true },
    });
  }

  // 3. Check for existing application (Conflict rule)
  const existingApplication = await checkExistingApplication(candidateProfile.id, input.jobId);

  if (existingApplication) {
    throw new AppError('You have already applied for this job posting.', 409);
  }

  // 4. Create the application
  return createApplicationRecord({
    candidateId: candidateProfile.id,
    jobId: input.jobId,
  });
};

/**
 * Recruiter views all applications (Kanban board pipeline) for a specific job.
 * Strictly enforces that the job belongs to the recruiter's companyId.
 */
export const getJobPipeline = async (user: JwtPayload, jobId: string): Promise<Application[]> => {
  let targetCompanyId = user.companyId;

  if (user.role === Role.RECRUITER) {
    if (!targetCompanyId) {
      throw new AppError('You must belong to a company to access job pipelines.', 403);
    }
  } else if (user.role === Role.ADMIN) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { companyId: true },
    });
    if (!job) {
      throw new AppError('Job not found.', 404);
    }
    targetCompanyId = job.companyId;
  } else {
    throw new AppError('Access denied. Only recruiters and admins can view applicant pipelines.', 403);
  }

  return getApplicationsByJobId(jobId, targetCompanyId);
};

/**
 * Recruiter updates candidate stage (`status`) of an application.
 * Strictly verifies tenant ownership before applying stage changes.
 */
export const moveCandidateStage = async (
  user: JwtPayload,
  applicationId: string,
  input: UpdateApplicationStatusInput,
): Promise<Application> => {
  const application = await findApplicationByIdWithJob(applicationId);

  if (!application) {
    throw new AppError('Application not found.', 404);
  }

  // Tenant Isolation Check
  if (user.role === Role.RECRUITER) {
    if (!user.companyId || application.job.companyId !== user.companyId) {
      throw new AppError(
        'Tenant Isolation Error: Access denied. You can only update candidate stages for jobs posted by your own company.',
        403,
      );
    }
  } else if (user.role !== Role.ADMIN) {
    throw new AppError('Access denied. Only recruiters and admins can update application stages.', 403);
  }

  return updateApplicationStatus(applicationId, input.status);
};
