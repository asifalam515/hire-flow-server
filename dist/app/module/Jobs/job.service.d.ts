import type { ExperienceLevel, JobStatus, JobType } from "@/generated/prisma/enums";
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
export declare const jobService: {
    getAllJobsFromDb: (page?: number, limit?: number, filters?: JobFilters) => Promise<{
        data: ({
            company: {
                id: string;
                name: string;
                slug: string;
                logoUrl: string | null;
                isVerified: boolean;
            };
            _count: {
                applications: number;
                savedBy: number;
            };
            recruiter: never;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            type: JobType;
            slug: string;
            description: string;
            country: string | null;
            city: string | null;
            companyId: string;
            postedById: string;
            title: string;
            requirements: string | null;
            responsibilities: string | null;
            benefits: string | null;
            experienceLevel: ExperienceLevel;
            location: string | null;
            isRemote: boolean;
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
    getJobByIdFromDb: (id: string) => Promise<{
        company: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
            bannerUrl: string | null;
            website: string | null;
            description: string | null;
            industry: string | null;
            size: import("@/generated/prisma/enums").CompanySize | null;
            isVerified: boolean;
        };
        _count: {
            applications: number;
            savedBy: number;
        };
        recruiter: never;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: JobType;
        slug: string;
        description: string;
        country: string | null;
        city: string | null;
        companyId: string;
        postedById: string;
        title: string;
        requirements: string | null;
        responsibilities: string | null;
        benefits: string | null;
        experienceLevel: ExperienceLevel;
        location: string | null;
        isRemote: boolean;
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
    getJobBySlugFromDb: (slug: string) => Promise<{
        company: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
            bannerUrl: string | null;
            website: string | null;
            description: string | null;
            industry: string | null;
            size: import("@/generated/prisma/enums").CompanySize | null;
            isVerified: boolean;
        };
        _count: {
            applications: number;
            savedBy: number;
        };
        recruiter: never;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: JobType;
        slug: string;
        description: string;
        country: string | null;
        city: string | null;
        companyId: string;
        postedById: string;
        title: string;
        requirements: string | null;
        responsibilities: string | null;
        benefits: string | null;
        experienceLevel: ExperienceLevel;
        location: string | null;
        isRemote: boolean;
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
    getJobsByCompanyIdFromDb: (companyId: string, page?: number, limit?: number, includeAllStatuses?: boolean) => Promise<{
        data: ({
            company: {
                id: string;
                name: string;
                slug: string;
                logoUrl: string | null;
            };
            _count: {
                applications: number;
                savedBy: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            type: JobType;
            slug: string;
            description: string;
            country: string | null;
            city: string | null;
            companyId: string;
            postedById: string;
            title: string;
            requirements: string | null;
            responsibilities: string | null;
            benefits: string | null;
            experienceLevel: ExperienceLevel;
            location: string | null;
            isRemote: boolean;
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
    getJobsByRecruiterIdFromDb: (recruiterId: string, page?: number, limit?: number) => Promise<{
        data: ({
            company: {
                id: string;
                name: string;
                slug: string;
                logoUrl: string | null;
            };
            _count: {
                applications: number;
                savedBy: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            type: JobType;
            slug: string;
            description: string;
            country: string | null;
            city: string | null;
            companyId: string;
            postedById: string;
            title: string;
            requirements: string | null;
            responsibilities: string | null;
            benefits: string | null;
            experienceLevel: ExperienceLevel;
            location: string | null;
            isRemote: boolean;
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
    createJobInDb: (data: CreateJobInput, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: JobType;
        slug: string;
        description: string;
        country: string | null;
        city: string | null;
        companyId: string;
        postedById: string;
        title: string;
        requirements: string | null;
        responsibilities: string | null;
        benefits: string | null;
        experienceLevel: ExperienceLevel;
        location: string | null;
        isRemote: boolean;
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
    updateJobInDb: (id: string, userId: string, data: UpdateJobInput) => Promise<{
        company: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
        };
        recruiter: never;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: JobType;
        slug: string;
        description: string;
        country: string | null;
        city: string | null;
        companyId: string;
        postedById: string;
        title: string;
        requirements: string | null;
        responsibilities: string | null;
        benefits: string | null;
        experienceLevel: ExperienceLevel;
        location: string | null;
        isRemote: boolean;
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
    deleteJobFromDb: (id: string, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: JobType;
        slug: string;
        description: string;
        country: string | null;
        city: string | null;
        companyId: string;
        postedById: string;
        title: string;
        requirements: string | null;
        responsibilities: string | null;
        benefits: string | null;
        experienceLevel: ExperienceLevel;
        location: string | null;
        isRemote: boolean;
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
export {};
//# sourceMappingURL=job.service.d.ts.map