import type {
  ExperienceLevel,
  JobStatus,
  JobType,
  QuestionType,
} from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";

interface ScreeningQuestionInput {
  question: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
}

interface CreateJobInput {
  companyId: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  location?: string;
  isRemote?: boolean;
  country?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  techStack?: string[];
  status?: JobStatus;
  expiresAt?: Date;
  screeningQuestions?: ScreeningQuestionInput[];
}

interface UpdateJobInput {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  type?: JobType;
  experienceLevel?: ExperienceLevel;
  location?: string;
  isRemote?: boolean;
  country?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  techStack?: string[];
  status?: JobStatus;
  expiresAt?: Date;
  slug?: string;
  screeningQuestions?: ScreeningQuestionInput[];
}

interface JobFilters {
  companyId?: string;
  status?: JobStatus;
  type?: JobType;
  experienceLevel?: ExperienceLevel;
  isRemote?: boolean;
  location?: string;
  country?: string;
  salaryMin?: number;
  salaryMax?: number;
  search?: string;
  techStack?: string[];
}

// Check if slug is unique
const isSlugUnique = async (
  slug: string,
  excludeId?: string,
): Promise<boolean> => {
  const existingJob = await prisma.job.findUnique({
    where: { slug },
  });

  if (!existingJob) return true;
  if (excludeId && existingJob.id === excludeId) return true;
  return false;
};

// Create a new job
const createJobInDb = async (data: CreateJobInput, userId: string) => {
  // Validate slug uniqueness
  const isUnique = await isSlugUnique(data.slug);
  if (!isUnique) {
    throw new AppError(`Slug "${data.slug}" is already taken`, 400);
  }

  // Verify company exists and user is a member
  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  // Verify user is a company member (recruiter/owner)
  const companyMember = await prisma.companyMember.findUnique({
    where: { userId },
  });
  if (!companyMember || companyMember.companyId !== data.companyId) {
    throw new AppError("You are not a member of this company", 403);
  }

  const job = await prisma.job.create({
    data: {
      companyId: data.companyId,
      postedById: userId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      benefits: data.benefits,
      type: data.type,
      experienceLevel: data.experienceLevel,
      location: data.location,
      isRemote: data.isRemote || false,
      country: data.country,
      city: data.city,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      salaryCurrency: data.salaryCurrency || "USD",
      salaryPeriod: data.salaryPeriod || "YEAR",
      techStack: data.techStack || [],
      status: data.status || "DRAFT",
      ...(data.expiresAt && { expiresAt: data.expiresAt }),
      ...(data.screeningQuestions && {
        screeningQuestions: {
          create: data.screeningQuestions.map((q) => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            required: q.required !== undefined ? q.required : true,
          })),
        },
      }),
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
  });

  return job;
};

// Get all jobs with search and filters
const getAllJobsFromDb = async (
  page: number = 1,
  limit: number = 10,
  filters?: JobFilters,
) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  // Status filter - default to published for public view
  if (filters?.status) {
    where.status = filters.status;
  } else {
    where.status = "PUBLISHED";
  }

  if (filters?.companyId) where.companyId = filters.companyId;
  if (filters?.type) where.type = filters.type;
  if (filters?.experienceLevel) where.experienceLevel = filters.experienceLevel;
  if (filters?.isRemote !== undefined) where.isRemote = filters.isRemote;
  if (filters?.country) where.country = filters.country;
  if (filters?.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  // Salary range filter
  if (filters?.salaryMin !== undefined || filters?.salaryMax !== undefined) {
    where.AND = [];
    if (filters?.salaryMin !== undefined) {
      where.AND.push({
        OR: [{ salaryMax: { gte: filters.salaryMin } }, { salaryMax: null }],
      });
    }
    if (filters?.salaryMax !== undefined) {
      where.AND.push({
        OR: [{ salaryMin: { lte: filters.salaryMax } }, { salaryMin: null }],
      });
    }
  }

  // Search in title, description, and tech stack
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { techStack: { hasSome: [filters.search] } },
    ];
  }

  // Tech stack filter
  if (filters?.techStack && filters.techStack.length > 0) {
    where.techStack = { hasSome: filters.techStack };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            isVerified: true,
          },
        },
        _count: {
          select: { applications: true, savedBy: true },
        },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single job by ID
const getJobByIdFromDb = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          bannerUrl: true,
          website: true,
          description: true,
          industry: true,
          size: true,
          isVerified: true,
        },
      },
      _count: {
        select: { applications: true, savedBy: true },
      },
      screeningQuestions: true,
    },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // Increment view count
  await prisma.job.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return job;
};

// Get single job by slug
const getJobBySlugFromDb = async (slug: string) => {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          bannerUrl: true,
          website: true,
          description: true,
          industry: true,
          size: true,
          isVerified: true,
        },
      },
      _count: {
        select: { applications: true, savedBy: true },
      },
      screeningQuestions: true,
    },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // Increment view count
  await prisma.job.update({
    where: { id: job.id },
    data: { viewCount: { increment: 1 } },
  });

  return job;
};

// Get jobs by company
const getJobsByCompanyIdFromDb = async (
  companyId: string,
  page: number = 1,
  limit: number = 10,
  includeAllStatuses: boolean = false,
) => {
  const skip = (page - 1) * limit;

  const where: any = { companyId };
  if (!includeAllStatuses) {
    where.status = "PUBLISHED";
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: { applications: true, savedBy: true },
        },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update job
const updateJobInDb = async (
  id: string,
  userId: string,
  data: UpdateJobInput,
) => {
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // Check authorization - must be poster or admin
  if (job.postedById !== userId && !(await isUserAdmin(userId))) {
    throw new AppError("You do not have permission to update this job", 403);
  }

  // If slug is being updated, check uniqueness
  if (data.slug && data.slug !== job.slug) {
    const isUnique = await isSlugUnique(data.slug, id);
    if (!isUnique) {
      throw new AppError(`Slug "${data.slug}" is already taken`, 400);
    }
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      ...data,
      ...(data.screeningQuestions && {
        screeningQuestions: {
          deleteMany: {}, // Clean up existing and replace with new
          create: data.screeningQuestions.map((q) => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            required: q.required !== undefined ? q.required : true,
          })),
        },
      }),
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
      screeningQuestions: true,
    },
  });

  return updatedJob;
};

// Delete job
const deleteJobFromDb = async (id: string, userId: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // Check authorization - must be poster or admin
  if (job.postedById !== userId && !(await isUserAdmin(userId))) {
    throw new AppError("You do not have permission to delete this job", 403);
  }

  const deletedJob = await prisma.job.delete({
    where: { id },
  });

  return deletedJob;
};

// Get jobs by recruiter
const getJobsByRecruiterIdFromDb = async (
  recruiterId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { postedById: recruiterId },
      skip,
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: { applications: true, savedBy: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.count({ where: { postedById: recruiterId } }),
  ]);

  return {
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Helper: Check if user is admin
const isUserAdmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
};

// Get similar jobs
const getSimilarJobsFromDb = async (id: string, limit: number = 5) => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new AppError("Job not found", 404);

  if (!job.techStack || job.techStack.length === 0) {
    // Fallback if no tech stack
    return await prisma.job.findMany({
      where: {
        id: { not: id },
        status: "PUBLISHED",
        experienceLevel: job.experienceLevel,
      },
      take: limit,
      include: {
        company: { select: { id: true, name: true, logoUrl: true } },
      },
      orderBy: { publishedAt: "desc" },
    });
  }

  const similarJobs = await prisma.$queryRaw<any[]>`
    SELECT j.*, 
           c.id as "companyId", c.name as "companyName", c."logoUrl" as "companyLogo",
           (
             SELECT count(*) 
             FROM unnest(j."techStack") AS t1 
             JOIN unnest(${job.techStack}::text[]) AS t2 ON t1 = t2
           ) as "overlapCount"
    FROM "jobs" j
    JOIN "companies" c ON j."companyId" = c.id
    WHERE j."techStack" && ${job.techStack}::text[]
      AND j.status = 'PUBLISHED'
      AND j.id != ${id}
    ORDER BY "overlapCount" DESC, j."publishedAt" DESC
    LIMIT ${limit}
  `;

  // Map to the structure expected by the frontend
  return similarJobs.map((sj) => ({
    ...sj,
    company: {
      id: sj.companyId,
      name: sj.companyName,
      logoUrl: sj.companyLogo,
    },
    // Remove the flattened company fields from the root if desired
    companyId: sj.companyId,
    companyName: undefined,
    companyLogo: undefined,
    overlapCount: undefined,
  }));
};

// Calculate match score according to requested breakdown
const calculateMatchScore = async (jobId: string, candidateId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId: candidateId },
    include: { experiences: true },
  });

  if (!job) throw new AppError("Job not found", 404);
  if (!profile) throw new AppError("Candidate profile not found", 404);

  const jobTech = job.techStack || [];
  const candidateSkills = profile.skills || [];

  const matchedSkills = jobTech.filter((s) => candidateSkills.includes(s));
  const missingSkills = jobTech.filter((s) => !candidateSkills.includes(s));

  // Tech stack score (50 pts)
  let techScore = 0;
  if (jobTech.length > 0) {
    techScore = (matchedSkills.length / jobTech.length) * 50;
  }

  // Salary score (25 pts)
  let salaryScore = 0;
  let salaryMatch = false;
  const jMin = job.salaryMin ?? null;
  const jMax = job.salaryMax ?? null;
  const cMin = profile.expectedSalaryMin ?? null;
  const cMax = profile.expectedSalaryMax ?? null;

  if (jMin !== null && jMax !== null && cMin !== null && cMax !== null) {
    // full overlap
    if (jMin <= cMax && jMax >= cMin) {
      salaryScore = 25;
      salaryMatch = true;
    } else {
      salaryScore = 0;
      salaryMatch = false;
    }
  } else if (
    (jMin !== null || jMax !== null) &&
    (cMin !== null || cMax !== null)
  ) {
    // partial info available — give partial points
    salaryScore = 12;
    salaryMatch = true;
  } else {
    salaryScore = 0;
    salaryMatch = false;
  }

  // Experience level score (25 pts)
  const levelOrder = ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"];
  const jobLevel = job.experienceLevel as string | null;
  // We don't have an explicit experience level on profile; try to infer from work experiences length
  let profileLevelIndex = -1;
  if (profile.experiences && profile.experiences.length > 0) {
    const years = profile.experiences.reduce((acc, we) => {
      // best-effort: if both dates exist
      if (we.startDate && we.endDate) {
        const start = new Date(we.startDate).getFullYear();
        const end = new Date(we.endDate).getFullYear();
        return acc + Math.max(0, end - start);
      }
      return acc + 0;
    }, 0);
    // Heuristic mapping
    if (years <= 1)
      profileLevelIndex = 0; // ENTRY
    else if (years <= 3)
      profileLevelIndex = 1; // JUNIOR
    else if (years <= 5)
      profileLevelIndex = 2; // MID
    else if (years <= 8)
      profileLevelIndex = 3; // SENIOR
    else profileLevelIndex = 4; // LEAD+
  }

  let levelScore = 0;
  let levelMatch = false;
  if (jobLevel) {
    const jobIdx = levelOrder.indexOf(jobLevel);
    if (profileLevelIndex >= 0 && jobIdx >= 0) {
      const diff = Math.abs(jobIdx - profileLevelIndex);
      if (diff === 0) {
        levelScore = 25;
        levelMatch = true;
      } else if (diff === 1) {
        levelScore = 12;
        levelMatch = true;
      } else {
        levelScore = 0;
        levelMatch = false;
      }
    } else {
      // not enough info — give partial credit
      levelScore = 12;
      levelMatch = false;
    }
  }

  const totalScore = Math.round(techScore + salaryScore + levelScore);

  return {
    score: Math.min(100, totalScore),
    matchedSkills,
    missingSkills,
    salaryMatch,
    levelMatch,
  };
};

// Update job status
const updateJobStatusInDb = async (
  id: string,
  userId: string,
  status: JobStatus,
) => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new AppError("Job not found", 404);

  if (job.postedById !== userId && !(await isUserAdmin(userId))) {
    throw new AppError(
      "You do not have permission to update this job status",
      403,
    );
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      status,
      publishedAt:
        status === "PUBLISHED" && !job.publishedAt
          ? new Date()
          : job.publishedAt,
    },
  });

  return updatedJob;
};

// Save job
const saveJobInDb = async (jobId: string, userId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError("Job not found", 404);

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing) throw new AppError("Job already saved", 400);

  const savedJob = await prisma.savedJob.create({
    data: {
      userId,
      jobId,
    },
  });

  return savedJob;
};

// Unsave job
const unsaveJobFromDb = async (jobId: string, userId: string) => {
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (!existing) throw new AppError("Job not saved", 400);

  const deletedJob = await prisma.savedJob.delete({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });

  return deletedJob;
};

export const jobService = {
  getAllJobsFromDb,
  getJobByIdFromDb,
  getJobBySlugFromDb,
  getJobsByCompanyIdFromDb,
  getJobsByRecruiterIdFromDb,
  createJobInDb,
  updateJobInDb,
  deleteJobFromDb,
  getSimilarJobsFromDb,
  calculateMatchScore,
  updateJobStatusInDb,
  saveJobInDb,
  unsaveJobFromDb,
};
