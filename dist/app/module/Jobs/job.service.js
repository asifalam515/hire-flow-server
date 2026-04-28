import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";
// Check if slug is unique
const isSlugUnique = async (slug, excludeId) => {
    const existingJob = await prisma.job.findUnique({
        where: { slug },
    });
    if (!existingJob)
        return true;
    if (excludeId && existingJob.id === excludeId)
        return true;
    return false;
};
// Create a new job
const createJobInDb = async (data, userId) => {
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
            expiresAt: data.expiresAt,
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
            recruiter: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return job;
};
// Get all jobs with search and filters
const getAllJobsFromDb = async (page = 1, limit = 10, filters) => {
    const skip = (page - 1) * limit;
    const where = {};
    // Status filter - default to published for public view
    if (filters?.status) {
        where.status = filters.status;
    }
    else {
        where.status = "PUBLISHED";
    }
    if (filters?.companyId)
        where.companyId = filters.companyId;
    if (filters?.type)
        where.type = filters.type;
    if (filters?.experienceLevel)
        where.experienceLevel = filters.experienceLevel;
    if (filters?.isRemote !== undefined)
        where.isRemote = filters.isRemote;
    if (filters?.country)
        where.country = filters.country;
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
                recruiter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
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
const getJobByIdFromDb = async (id) => {
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
            recruiter: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            _count: {
                select: { applications: true, savedBy: true },
            },
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
const getJobBySlugFromDb = async (slug) => {
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
            recruiter: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            _count: {
                select: { applications: true, savedBy: true },
            },
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
const getJobsByCompanyIdFromDb = async (companyId, page = 1, limit = 10, includeAllStatuses = false) => {
    const skip = (page - 1) * limit;
    const where = { companyId };
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
const updateJobInDb = async (id, userId, data) => {
    const job = await prisma.job.findUnique({
        where: { id },
        include: { recruiter: true },
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
        data,
        include: {
            company: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logoUrl: true,
                },
            },
            recruiter: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return updatedJob;
};
// Delete job
const deleteJobFromDb = async (id, userId) => {
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
const getJobsByRecruiterIdFromDb = async (recruiterId, page = 1, limit = 10) => {
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
const isUserAdmin = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    return user?.role === "ADMIN";
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
};
//# sourceMappingURL=job.service.js.map