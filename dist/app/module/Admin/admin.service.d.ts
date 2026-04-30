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
        updatedUser: {
            id: string;
            email: string;
            name: string;
            role: Role;
            isSuspended: boolean;
        };
        previousStatus: boolean;
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
    getPendingCompaniesFromDb: (page?: number, limit?: number) => Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            country: string | null;
            city: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            website: string | null;
            linkedinUrl: string | null;
            industry: string | null;
            size: import("@/generated/prisma/enums").CompanySize | null;
            founded: number | null;
            isVerified: boolean;
            isActive: boolean;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    verifyCompanyInDb: (companyId: string, isVerified: boolean) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        country: string | null;
        city: string | null;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        industry: string | null;
        size: import("@/generated/prisma/enums").CompanySize | null;
        founded: number | null;
        isVerified: boolean;
        isActive: boolean;
    }>;
    globalAdminSearchFromDb: (query: string, page?: number, limit?: number) => Promise<{
        users: {
            id: string;
            createdAt: Date;
            email: string;
            name: string;
            role: Role;
        }[];
        companies: {
            id: string;
            name: string;
            slug: string;
            industry: string | null;
            isVerified: boolean;
        }[];
        jobs: {
            id: string;
            createdAt: Date;
            type: import("@/generated/prisma/enums").JobType;
            title: string;
            status: JobStatus;
        }[];
        pagination: {
            page: number;
            limit: number;
        };
    }>;
    getAuditLogsFromDb: (page?: number, limit?: number) => Promise<{
        data: ({
            application: {
                id: string;
                candidateId: string;
                stage: import("@/generated/prisma/enums").ApplicationStage;
            };
            changedBy: {
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            applicationId: string;
            changedById: string;
            fromStage: import("@/generated/prisma/enums").ApplicationStage | null;
            toStage: import("@/generated/prisma/enums").ApplicationStage;
            reason: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAdminAuditTrailFromDb: (filters?: {
        actorId?: string;
        entityType?: string;
        action?: string;
        from?: string;
        to?: string;
    }, page?: number, limit?: number) => Promise<{
        data: ({
            actor: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            action: string;
            entityType: string;
            entityId: string;
            actorId: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    forceCloseJobInDb: (jobId: string, reason?: string) => Promise<{
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
};
//# sourceMappingURL=admin.service.d.ts.map