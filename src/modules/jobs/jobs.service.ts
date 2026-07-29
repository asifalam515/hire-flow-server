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
import { prisma } from '../../config/prisma';
import { triggerNewJobNotification } from '../notifications/notifications.service';

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
    category: input.category,
    nature: input.nature,
    vacancies: input.vacancies,
    employmentTypes: input.employmentTypes,
    locationCountry: input.locationCountry,
    locationCity: input.locationCity,
    exactAddress: input.exactAddress,
    minSalary: input.minSalary,
    maxSalary: input.maxSalary,
    isSalaryNegotiable: input.isSalaryNegotiable,
    benefits: input.benefits,
    educationLevel: input.educationLevel,
    yearsOfExperience: input.yearsOfExperience,
    gender: input.gender,
    candidateExperience: input.candidateExperience,
    languages: input.languages,
    softwareSkills: input.softwareSkills,
    responsibilities: input.responsibilities,
    requirements: input.requirements,
  });

  // Trigger New Job Notification to all candidates following the company
  const company = await prisma.company.findUnique({ where: { id: targetCompanyId } });
  if (company) {
    const followers = await prisma.followedCompany.findMany({
      where: { companyId: targetCompanyId },
      select: { userId: true }
    });
    if (followers.length > 0) {
      const userIds = followers.map(f => f.userId);
      // Fire and forget
      triggerNewJobNotification(userIds, company.name, job.title, `/jobs/${job.id}`).catch(err => {
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
    location: query.location,
    languages: query.languages,
    educationLevel: query.educationLevel,
    employmentTypes: query.employmentTypes,
    nature: query.nature,
    category: query.category,
    excludeId: query.excludeId,
    minSalary: query.minSalary,
    maxSalary: query.maxSalary,
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

/**
 * Calculate a heuristic match score (0-100) between a candidate and a job.
 */
export const calculateJobMatch = async (userId: string, jobId: string) => {
  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const profile = await getCandidateProfileByUserId(userId);
  if (!profile) {
    return { matchScore: 0, profileMissing: true };
  }

  let totalScore = 0;
  const breakdown = {
    skills: 0,
    experience: 0,
    location: 0,
    education: 0,
  };

  // 1. Skills Match (40% weight)
  const jobSkills = new Set([...(job.softwareSkills || []), ...(job.languages || [])].map(s => s.toLowerCase().trim()));
  const candidateSkills = new Set([...(profile.skills || []), ...(profile.languages || [])].map(s => s.toLowerCase().trim()));
  
  if (jobSkills.size === 0) {
    totalScore += 40; // Free points if job doesn't specify skills
    breakdown.skills = 40;
  } else {
    let matchedSkills = 0;
    for (const skill of jobSkills) {
      if (candidateSkills.has(skill)) {
        matchedSkills++;
      }
    }
    const skillScore = (matchedSkills / jobSkills.size) * 40;
    totalScore += skillScore;
    breakdown.skills = Math.round(skillScore);
  }

  // 2. Experience Match (30% weight)
  // Calculate total months of experience for candidate
  let candidateMonthsExp = 0;
  if (profile.workExperiences) {
    for (const exp of profile.workExperiences) {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      candidateMonthsExp += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
    }
  }

  let targetMonthsExp = 0;
  if (job.yearsOfExperience) {
    // Rough heuristic for extracting numbers from strings like "2-3 Years"
    const numbers = job.yearsOfExperience.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      targetMonthsExp = parseInt(numbers[0], 10) * 12; // take lower bound
    }
  }

  if (targetMonthsExp === 0) {
    totalScore += 30; // Free points if no experience needed
    breakdown.experience = 30;
  } else {
    const expRatio = Math.min(candidateMonthsExp / targetMonthsExp, 1.0);
    const expScore = expRatio * 30;
    totalScore += expScore;
    breakdown.experience = Math.round(expScore);
  }

  // 3. Location / Nature Match (15% weight)
  if (job.nature?.toLowerCase() === 'remote' && profile.tendToRemote?.toLowerCase() === 'yes') {
    totalScore += 15;
    breakdown.location = 15;
  } else if (job.locationCity && profile.city && job.locationCity.toLowerCase().includes(profile.city.toLowerCase())) {
    totalScore += 15;
    breakdown.location = 15;
  }

  // 4. Education Match (15% weight)
  if (!job.educationLevel) {
    totalScore += 15;
    breakdown.education = 15;
  } else {
    let hasEduMatch = false;
    if (profile.educations) {
      const targetEdu = job.educationLevel.toLowerCase();
      for (const edu of profile.educations) {
        if (edu.degree && edu.degree.toLowerCase().includes(targetEdu)) {
          hasEduMatch = true;
          break;
        }
      }
    }
    if (hasEduMatch) {
      totalScore += 15;
      breakdown.education = 15;
    }
  }

  return {
    matchScore: Math.round(totalScore),
    profileMissing: false,
    breakdown,
  };
};
