import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";
const getUsersFromDb = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isSuspended: true,
                createdAt: true,
            },
        }),
        prisma.user.count(),
    ]);
    return {
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const toggleUserSuspensionInDb = async (userId, isSuspended) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const previousStatus = user.isSuspended;
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isSuspended },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isSuspended: true,
        },
    });
    return { updatedUser, previousStatus };
};
const assignUserRoleInDb = async (userId, role) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isSuspended: true,
        },
    });
    return updatedUser;
};
const getPendingJobsFromDb = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
        prisma.job.findMany({
            where: { status: "PENDING_APPROVAL" },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                company: {
                    select: { name: true, slug: true, logoUrl: true },
                },
                recruiter: {
                    select: { name: true, email: true },
                },
            },
        }),
        prisma.job.count({ where: { status: "PENDING_APPROVAL" } }),
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
const moderateJobInDb = async (jobId, status) => {
    if (status !== "PUBLISHED" && status !== "REJECTED") {
        throw new AppError("Status must be PUBLISHED or REJECTED", 400);
    }
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
        throw new AppError("Job not found", 404);
    }
    const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
            status,
            ...(status === "PUBLISHED" && { publishedAt: new Date() }),
        },
    });
    return updatedJob;
};
const getPlatformAnalyticsFromDb = async () => {
    const [totalUsers, totalJobs, totalApplications] = await Promise.all([
        prisma.user.count(),
        prisma.job.count(),
        prisma.application.count(),
    ]);
    // Aggregate user signups by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const users = await prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
    });
    const signupsPerDay = users.reduce((acc, user) => {
        const date = user.createdAt.toISOString().slice(0, 10);
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const signupsChart = Object.entries(signupsPerDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    return {
        totalUsers,
        totalJobs,
        totalApplications,
        signupsChart,
    };
};
const getPendingCompaniesFromDb = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [companies, total] = await Promise.all([
        prisma.company.findMany({
            where: { isVerified: false },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.company.count({ where: { isVerified: false } }),
    ]);
    return {
        data: companies,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const verifyCompanyInDb = async (companyId, isVerified) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
        throw new AppError("Company not found", 404);
    }
    const updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: { isVerified },
    });
    return updatedCompany;
};
const forceCloseJobInDb = async (jobId, reason) => {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
        throw new AppError("Job not found", 404);
    }
    const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: { status: "CLOSED" },
    });
    // Optionally store reason somewhere else (not persisted here)
    return updatedJob;
};
const globalAdminSearchFromDb = async (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    // Searching across Users, Companies, and Jobs
    const [users, companies, jobs] = await Promise.all([
        prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ],
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        }),
        prisma.company.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { industry: { contains: query, mode: "insensitive" } },
                ],
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                slug: true,
                industry: true,
                isVerified: true,
            },
        }),
        prisma.job.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { location: { contains: query, mode: "insensitive" } },
                ],
            },
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                status: true,
                type: true,
                createdAt: true,
            },
        }),
    ]);
    return {
        users,
        companies,
        jobs,
        pagination: {
            page,
            limit,
        },
    };
};
const getAuditLogsFromDb = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                changedBy: { select: { name: true, email: true } },
                application: { select: { id: true, stage: true, candidateId: true } },
            },
        }),
        prisma.auditLog.count(),
    ]);
    return {
        data: logs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getAdminAuditTrailFromDb = async (filters = {}, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.actorId)
        where.actorId = filters.actorId;
    if (filters.entityType)
        where.entityType = filters.entityType;
    if (filters.action)
        where.action = filters.action;
    if (filters.from || filters.to) {
        where.createdAt = {};
        if (filters.from)
            where.createdAt.gte = new Date(filters.from);
        if (filters.to)
            where.createdAt.lte = new Date(filters.to);
    }
    const [data, total] = await Promise.all([
        prisma.adminLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: { actor: { select: { id: true, email: true, name: true } } },
        }),
        prisma.adminLog.count({ where }),
    ]);
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const adminService = {
    getUsersFromDb,
    toggleUserSuspensionInDb,
    assignUserRoleInDb,
    getPendingJobsFromDb,
    moderateJobInDb,
    getPlatformAnalyticsFromDb,
    getPendingCompaniesFromDb,
    verifyCompanyInDb,
    globalAdminSearchFromDb,
    getAuditLogsFromDb,
    getAdminAuditTrailFromDb,
    forceCloseJobInDb,
};
//# sourceMappingURL=admin.service.js.map