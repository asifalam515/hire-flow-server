import { Prisma, Job, SavedJob, JobStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateJobDTO {
  title: string;
  description: string;
  status: JobStatus;
  companyId: string;
  category: string;
  nature: string;
  vacancies?: number | null;
  employmentTypes: string[];
  locationCountry: string;
  locationCity: string;
  exactAddress?: string | null;
  minSalary: number;
  maxSalary: number;
  isSalaryNegotiable: boolean;
  benefits: string[];
  educationLevel: string;
  yearsOfExperience: string;
  gender: string;
  candidateExperience: string[];
  languages: string[];
  softwareSkills: string[];
  responsibilities: string;
  requirements: string;
}

export interface ListJobsParams {
  search?: string | undefined;
  status?: JobStatus | undefined;
  companyId?: string | undefined;
  page: number;
  limit: number;
}

export interface PaginatedJobsResult {
  jobs: Array<Job & { company: { id: string; name: string; slug: string }; _count?: { applications: number; savedJobs: number } }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Jobs Repository (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Create a new job posting.
 */
export const createJobRecord = async (data: CreateJobDTO): Promise<Job> => {
  return prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      companyId: data.companyId,
      category: data.category,
      nature: data.nature,
      vacancies: data.vacancies,
      employmentTypes: data.employmentTypes,
      locationCountry: data.locationCountry,
      locationCity: data.locationCity,
      exactAddress: data.exactAddress,
      minSalary: data.minSalary,
      maxSalary: data.maxSalary,
      isSalaryNegotiable: data.isSalaryNegotiable,
      benefits: data.benefits,
      educationLevel: data.educationLevel,
      yearsOfExperience: data.yearsOfExperience,
      gender: data.gender,
      candidateExperience: data.candidateExperience,
      languages: data.languages,
      softwareSkills: data.softwareSkills,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
    },
  });
};

/**
 * Update an existing job posting.
 */
export const updateJobRecord = async (id: string, data: Prisma.JobUpdateInput): Promise<Job> => {
  return prisma.job.update({
    where: { id },
    data,
  });
};

/**
 * Delete a job posting.
 */
export const deleteJobRecord = async (id: string): Promise<Job> => {
  return prisma.job.delete({
    where: { id },
  });
};

/**
 * Find a job by its unique ID, including company details and counts.
 */
export const findJobByIdRecord = async (id: string) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          applications: true,
          savedJobs: true,
        },
      },
    },
  });
};

/**
 * List jobs with pagination, filtering, and optional GIN full-text search.
 */
export const listJobsRecord = async (params: ListJobsParams): Promise<PaginatedJobsResult> => {
  const { search, status, companyId, page, limit } = params;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.JobWhereInput = {};

  if (status) {
    whereClause.status = status;
  }

  if (companyId) {
    whereClause.companyId = companyId;
  }

  // ── GIN Full-Text Search Optimization ───────────────────────────────────
  if (search && search.trim() !== '') {
    const formattedSearch = search.trim();
    try {
      const matchingRows = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM jobs
        WHERE to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${formattedSearch})
      `;
      const matchingIds = matchingRows.map((r) => r.id);

      if (matchingIds.length === 0) {
        return {
          jobs: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }

      whereClause.id = { in: matchingIds };
    } catch (error) {
      whereClause.OR = [
        { title: { contains: formattedSearch, mode: 'insensitive' } },
        { description: { contains: formattedSearch, mode: 'insensitive' } },
      ];
    }
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            applications: true,
            savedJobs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.job.count({ where: whereClause }),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// ── Saved Jobs CRUD ───────────────────────────────────────────────────────

/**
 * Check if a job is already saved by a specific user.
 */
export const findSavedJobRecord = async (userId: string, jobId: string): Promise<SavedJob | null> => {
  return prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
};

/**
 * Save a job for later for a candidate.
 */
export const saveJobRecord = async (userId: string, jobId: string): Promise<SavedJob> => {
  return prisma.savedJob.create({
    data: {
      userId,
      jobId,
    },
  });
};

/**
 * Remove a saved job for a candidate.
 */
export const unsaveJobRecord = async (userId: string, jobId: string): Promise<SavedJob> => {
  return prisma.savedJob.delete({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
};

/**
 * List all saved jobs for a specific user.
 */
export const listSavedJobsRecord = async (userId: string) => {
  return prisma.savedJob.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
