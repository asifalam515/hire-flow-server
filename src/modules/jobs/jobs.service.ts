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
import { getCandidateProfileByUserId } from '../candidates/candidates.repository';
import { findCompanyByIdRecord, findCompanyFollowerUserIdsRecord } from '../companies/companies.repository';
import { triggerNewJobNotification } from '../notifications/notifications.service';
import { evaluateAtsMatch } from '../candidates/atsScorer.service';

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

  const job = await createJobRecord({
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    status: input.status || JobStatus.PUBLISHED,
    companyId: targetCompanyId,
    category: input.category,
    nature: input.nature,
    vacancies: input.vacancies,
    employmentTypes: input.employmentTypes,
    locationCountry: input.locationCountry,
    locationCity: input.locationCity,
    exactAddress: input.exactAddress,
    minSalary: input.minSalary,
    maxSalary: input.maxSalary,
    isSalaryNegotiable: input.isSalaryNegotiable ?? false,
    benefits: input.benefits,
    educationLevel: input.educationLevel,
    yearsOfExperience: input.yearsOfExperience,
    gender: input.gender,
    candidateExperience: input.candidateExperience,
    languages: input.languages,
    softwareSkills: input.softwareSkills,
    responsibilities: input.responsibilities?.trim() ?? null,
    requirements: input.requirements?.trim() ?? null,
  });

  // Trigger New Job Notification to all candidates following the company
  const company = await findCompanyByIdRecord(targetCompanyId);
  if (company) {
    const userIds = await findCompanyFollowerUserIdsRecord(targetCompanyId);
    if (userIds.length > 0) {
      // Fire and forget
      triggerNewJobNotification(userIds, company.name, job.title, `/jobs/${job.id}`).catch((err) => {
        console.error('Failed to trigger job notifications:', err);
      });
    }
  }

  return job;
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
 * Delete a job posting with strict tenant ownership checks.
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
 * Fetch a single job by its ID.
 */
export const getJobById = async (jobId: string) => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }
  return job;
};

/**
 * List jobs for the public marketplace with multi-filter and full-text search.
 */
export const listJobs = async (
  query: ListJobsQuery,
  currentUser?: UserContext | undefined,
  options?: { myCompanyOnly?: boolean },
): Promise<PaginatedJobsResult> => {
  let statusFilter: JobStatus | undefined = JobStatus.PUBLISHED;

  if (currentUser?.role === Role.ADMIN) {
    statusFilter = query.status;
  } else if (currentUser?.role === Role.RECRUITER && (query.companyId === currentUser.companyId || options?.myCompanyOnly)) {
    statusFilter = query.status;
  }

  const targetCompanyId = options?.myCompanyOnly ? currentUser?.companyId || undefined : query.companyId;

  return listJobsRecord({
    search: query.search,
    status: statusFilter,
    companyId: targetCompanyId,
    location: query.location,
    languages: query.languages,
    educationLevel: query.educationLevel,
    employmentTypes: query.employmentTypes,
    nature: query.nature,
    category: query.category,
    excludeId: query.excludeId,
    minSalary: query.minSalary,
    maxSalary: query.maxSalary,
    page: query.page ?? 1,
    limit: query.limit ?? 20,
  });
};

/**
 * Toggle saving a job for the authenticated candidate.
 */
export const toggleSaveJob = async (
  userId: string,
  jobId: string,
): Promise<ToggleSaveResult> => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const existingSave = await findSavedJobRecord(userId, jobId);

  if (existingSave) {
    await unsaveJobRecord(userId, jobId);
    return {
      saved: false,
      message: 'Job removed from saved list.',
    };
  }

  await saveJobRecord(userId, jobId);
  return {
    saved: true,
    message: 'Job saved successfully.',
  };
};

/**
 * List all saved jobs for a specific user.
 */
export const listSavedJobs = async (userId: string) => {
  return listSavedJobsRecord(userId);
};

/**
 * Calculate the comprehensive ATS match score (0-100) and gap analysis between a candidate and a job.
 * Evaluates semantic vector similarity, software skills overlap, and experience duration.
 */
export const calculateJobMatch = async (userId: string, jobId: string) => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const profile = await getCandidateProfileByUserId(userId);
  if (!profile) {
    return {
      matchScore: 0,
      profileMissing: true,
      breakdown: {
        overallScore: 0,
        semanticScore: 0,
        skillsScore: 0,
        experienceScore: 0,
        matchedSkills: [],
        missingSkills: job.softwareSkills || [],
        recommendation: 'LOW_MATCH',
        summary: 'Candidate profile not found. Please complete your profile to view your ATS score.',
      },
    };
  }

  const atsResult = await evaluateAtsMatch(
    {
      skills: profile.skills,
      aboutMe: profile.aboutMe,
      workExperiences: profile.workExperiences,
      educations: profile.educations,
    },
    {
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      softwareSkills: job.softwareSkills,
      candidateExperience: job.candidateExperience,
      yearsOfExperience: job.yearsOfExperience,
      educationLevel: job.educationLevel,
    }
  );

  return {
    matchScore: atsResult.overallScore,
    profileMissing: false,
    breakdown: atsResult,
  };
};
