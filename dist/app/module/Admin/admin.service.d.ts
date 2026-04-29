import type { JobStatus, Role } from "@/generated/prisma/enums";
export declare const adminService: {
    getUsersFromDb: (page?: number, limit?: number) => Promise<{
        data: {
            id: string;
            createdAt: Date;
            email: string;
            name: string;
            role: Role;
            isSuspended: boolean;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    toggleUserSuspensionInDb: (userId: string, isSuspended: boolean) => Promise<{
        id: string;
        email: string;
        name: string;
        role: Role;
        isSuspended: boolean;
    }>;
    assignUserRoleInDb: (userId: string, role: Role) => Promise<{
        id: string;
        email: string;
        name: string;
        role: Role;
        isSuspended: boolean;
    }>;
    getPendingJobsFromDb: (page?: number, limit?: number) => Promise<{
        data: ({
            recruiter: {
                email: string;
                name: string;
            };
            company: {
                name: string;
                slug: string;
                logoUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            type: import("@/generated/prisma/enums").JobType;
            companyId: string;
            postedById: string;
            title: string;
            slug: string;
            description: string;
            requirements: string | null;
            responsibilities: string | null;
            benefits: string | null;
            experienceLevel: import("@/generated/prisma/enums").ExperienceLevel;
            location: string | null;
            isRemote: boolean;
            country: string | null;
            city: string | null;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            salaryPeriod: string | null;
            techStack: string[];
            status: JobStatus;
            applicationCount: number;
            viewCount: number;
            publishedAt: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    moderateJobInDb: (jobId: string, status: JobStatus) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: import("@/generated/prisma/enums").JobType;
        companyId: string;
        postedById: string;
        title: string;
        slug: string;
        description: string;
        requirements: string | null;
        responsibilities: string | null;
        benefits: string | null;
        experienceLevel: import("@/generated/prisma/enums").ExperienceLevel;
        location: string | null;
        isRemote: boolean;
        country: string | null;
        city: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        techStack: string[];
        status: JobStatus;
        applicationCount: number;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    getPlatformAnalyticsFromDb: () => Promise<{
        totalUsers: number;
        totalJobs: number;
        totalApplications: number;
        signupsChart: {
            date: string;
            count: number;
        }[];
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map