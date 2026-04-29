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
    return updatedUser;
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
            publishedAt: status === "PUBLISHED" ? new Date() : undefined,
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
export const adminService = {
    getUsersFromDb,
    toggleUserSuspensionInDb,
    assignUserRoleInDb,
    getPendingJobsFromDb,
    moderateJobInDb,
    getPlatformAnalyticsFromDb,
};
//# sourceMappingURL=admin.service.js.map