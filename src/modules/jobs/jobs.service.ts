import { Prisma, Job, Role, JobStatus } from '@prisma/client';
import { JobsRepository, PaginatedJobsResult } from './jobs.repository';
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
// Jobs Service
// ---------------------------------------------------------------------------
// Implements business rules, strict multi-tenant isolation verification,
// and delegates data operations to JobsRepository.
// ---------------------------------------------------------------------------

export class JobsService {
  private readonly jobsRepository: JobsRepository;

  constructor(jobsRepository: JobsRepository = new JobsRepository()) {
    this.jobsRepository = jobsRepository;
  }

  /**
   * Create a new job posting.
   */
  public createJob = async (user: UserContext, input: CreateJobInput): Promise<Job> => {
    if (user.role !== Role.RECRUITER && user.role !== Role.ADMIN) {
      throw new AppError('Access denied. Only recruiters and admins can post jobs.', 403);
    }

    let targetCompanyId: string | undefined;

    if (user.role === Role.RECRUITER) {
      if (!user.companyId) {
        throw new AppError('You must belong to a registered company before posting jobs.', 403);
      }
      // Tenant Isolation Override: Recruiters can only ever post for their own company
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

    return this.jobsRepository.create({
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status || JobStatus.PUBLISHED,
      companyId: targetCompanyId,
    });
  };

  /**
   * Update an existing job posting with strict tenant ownership checks.
   */
  public updateJob = async (user: UserContext, jobId: string, input: UpdateJobInput): Promise<Job> => {
    const job = await this.jobsRepository.findById(jobId);
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

    return this.jobsRepository.update(jobId, updateData);
  };

  /**
   * Delete an existing job posting with strict tenant ownership checks.
   */
  public deleteJob = async (user: UserContext, jobId: string): Promise<Job> => {
    const job = await this.jobsRepository.findById(jobId);
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

    return this.jobsRepository.delete(jobId);
  };

  /**
   * Fetch a job by exact ID.
   */
  public getJobById = async (jobId: string) => {
    const job = await this.jobsRepository.findById(jobId);
    if (!job) {
      throw new AppError('Job not found.', 404);
    }
    return job;
  };

  /**
   * List jobs across the marketplace, or strictly isolated by recruiter's company.
   */
  public listJobs = async (
    query: ListJobsQuery,
    user?: UserContext,
    options: { myCompanyOnly?: boolean } = {},
  ): Promise<PaginatedJobsResult> => {
    let targetCompanyId = query.companyId;
    let targetStatus = query.status;

    // If recruiter requests their own company jobs dashboard (`/api/v1/jobs/company/my-jobs`)
    if (options.myCompanyOnly) {
      if (!user || !user.companyId) {
        throw new AppError('You must belong to a company to access company job dashboards.', 403);
      }
      targetCompanyId = user.companyId;
      // Allow recruiter to view all draft/closed/published statuses for their company unless specific status passed
    } else {
      // For public or candidate marketplace queries, only display PUBLISHED jobs unless querying own company
      if (!targetStatus && (!user || (user.role === Role.RECRUITER && targetCompanyId !== user.companyId))) {
        targetStatus = JobStatus.PUBLISHED;
      }
    }

    return this.jobsRepository.list({
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
  public toggleSaveJob = async (userId: string, jobId: string): Promise<ToggleSaveResult> => {
    const job = await this.jobsRepository.findById(jobId);
    if (!job) {
      throw new AppError('Job not found.', 404);
    }

    const existingSave = await this.jobsRepository.findSavedJob(userId, jobId);

    if (existingSave) {
      await this.jobsRepository.unsaveJob(userId, jobId);
      return {
        saved: false,
        message: 'Job removed from your saved jobs.',
      };
    } else {
      await this.jobsRepository.saveJob(userId, jobId);
      return {
        saved: true,
        message: 'Job successfully saved for later.',
      };
    }
  };

  /**
   * List all saved jobs for a specific user.
   */
  public listSavedJobs = async (userId: string) => {
    return this.jobsRepository.listSavedJobs(userId);
  };
}
