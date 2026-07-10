import { Prisma, Job, SavedJob, JobStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateJobDTO {
  title: string;
  description: string;
  status: JobStatus;
  companyId: string;
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
// Jobs Repository
// ---------------------------------------------------------------------------
// Encapsulates all database interactions for Jobs and SavedJobs.
// Uses PostgreSQL GIN full-text search index when `search` query is provided.
// ---------------------------------------------------------------------------

export class JobsRepository {
  /**
   * Create a new job posting.
   */
  public async create(data: CreateJobDTO): Promise<Job> {
    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        companyId: data.companyId,
      },
    });
  }

  /**
   * Update an existing job posting.
   */
  public async update(id: string, data: Prisma.JobUpdateInput): Promise<Job> {
    return prisma.job.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a job posting.
   */
  public async delete(id: string): Promise<Job> {
    return prisma.job.delete({
      where: { id },
    });
  }

  /**
   * Find a job by its unique ID, including company details and counts.
   */
  public async findById(id: string) {
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
  }

  /**
   * List jobs with pagination, filtering, and optional GIN full-text search.
   */
  public async list(params: ListJobsParams): Promise<PaginatedJobsResult> {
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
        // Execute optimized functional GIN index lookup for matching job IDs
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
        // Fallback to standard ILIKE search if database full-text query fails or syntax is unsupported
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
  }

  // ── Saved Jobs CRUD ───────────────────────────────────────────────────────

  /**
   * Check if a job is already saved by a specific user.
   */
  public async findSavedJob(userId: string, jobId: string): Promise<SavedJob | null> {
    return prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });
  }

  /**
   * Save a job for later for a candidate.
   */
  public async saveJob(userId: string, jobId: string): Promise<SavedJob> {
    return prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
    });
  }

  /**
   * Remove a saved job for a candidate.
   */
  public async unsaveJob(userId: string, jobId: string): Promise<SavedJob> {
    return prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });
  }

  /**
   * List all saved jobs for a specific user.
   */
  public async listSavedJobs(userId: string) {
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
  }
}
