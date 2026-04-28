import type { CompanySize } from "@/generated/prisma/enums";
interface CreateCompanyInput {
    name: string;
    slug: string;
    logoUrl?: string;
    bannerUrl?: string;
    website?: string;
    linkedinUrl?: string;
    description?: string;
    industry?: string;
    size?: CompanySize;
    founded?: number;
    country?: string;
    city?: string;
}
interface UpdateCompanyInput {
    name?: string;
    logoUrl?: string;
    bannerUrl?: string;
    website?: string;
    linkedinUrl?: string;
    description?: string;
    industry?: string;
    size?: CompanySize;
    founded?: number;
    country?: string;
    city?: string;
    isActive?: boolean;
}
export declare const companyService: {
    createCompanyInDb: (data: CreateCompanyInput, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        description: string | null;
        industry: string | null;
        size: CompanySize | null;
        founded: number | null;
        country: string | null;
        city: string | null;
        isVerified: boolean;
        isActive: boolean;
    }>;
    getAllCompaniesFromDb: (page?: number, limit?: number, filters?: {
        isActive?: boolean;
        isVerified?: boolean;
        search?: string;
    }) => Promise<{
        data: ({
            members: {
                id: string;
                userId: string;
                isOwner: boolean;
                joinedAt: Date;
                companyId: string;
            }[];
            jobs: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                expiresAt: Date | null;
                type: import("@/generated/prisma/enums").JobType;
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
                experienceLevel: import("@/generated/prisma/enums").ExperienceLevel;
                location: string | null;
                isRemote: boolean;
                salaryMin: number | null;
                salaryMax: number | null;
                salaryCurrency: string | null;
                salaryPeriod: string | null;
                techStack: string[];
                status: import("@/generated/prisma/enums").JobStatus;
                applicationCount: number;
                viewCount: number;
                publishedAt: Date | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            logoUrl: string | null;
            bannerUrl: string | null;
            website: string | null;
            linkedinUrl: string | null;
            description: string | null;
            industry: string | null;
            size: CompanySize | null;
            founded: number | null;
            country: string | null;
            city: string | null;
            isVerified: boolean;
            isActive: boolean;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getCompanyByIdFromDb: (id: string) => Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            userId: string;
            isOwner: boolean;
            joinedAt: Date;
            companyId: string;
        })[];
        jobs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            type: import("@/generated/prisma/enums").JobType;
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
            experienceLevel: import("@/generated/prisma/enums").ExperienceLevel;
            location: string | null;
            isRemote: boolean;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            salaryPeriod: string | null;
            techStack: string[];
            status: import("@/generated/prisma/enums").JobStatus;
            applicationCount: number;
            viewCount: number;
            publishedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        description: string | null;
        industry: string | null;
        size: CompanySize | null;
        founded: number | null;
        country: string | null;
        city: string | null;
        isVerified: boolean;
        isActive: boolean;
    }>;
    getCompanyBySlugFromDb: (slug: string) => Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            userId: string;
            isOwner: boolean;
            joinedAt: Date;
            companyId: string;
        })[];
        jobs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            type: import("@/generated/prisma/enums").JobType;
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
            experienceLevel: import("@/generated/prisma/enums").ExperienceLevel;
            location: string | null;
            isRemote: boolean;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            salaryPeriod: string | null;
            techStack: string[];
            status: import("@/generated/prisma/enums").JobStatus;
            applicationCount: number;
            viewCount: number;
            publishedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        description: string | null;
        industry: string | null;
        size: CompanySize | null;
        founded: number | null;
        country: string | null;
        city: string | null;
        isVerified: boolean;
        isActive: boolean;
    }>;
    updateCompanyInDb: (id: string, data: UpdateCompanyInput) => Promise<{
        members: {
            id: string;
            userId: string;
            isOwner: boolean;
            joinedAt: Date;
            companyId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        description: string | null;
        industry: string | null;
        size: CompanySize | null;
        founded: number | null;
        country: string | null;
        city: string | null;
        isVerified: boolean;
        isActive: boolean;
    }>;
    deleteCompanyFromDb: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        description: string | null;
        industry: string | null;
        size: CompanySize | null;
        founded: number | null;
        country: string | null;
        city: string | null;
        isVerified: boolean;
        isActive: boolean;
    }>;
    verifyCompanyInDb: (id: string, isVerified: boolean) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        description: string | null;
        industry: string | null;
        size: CompanySize | null;
        founded: number | null;
        country: string | null;
        city: string | null;
        isVerified: boolean;
        isActive: boolean;
    }>;
    getUserCompaniesFromDb: (userId: string) => Promise<{
        userRole: string;
        members: {
            id: string;
            userId: string;
            isOwner: boolean;
            joinedAt: Date;
            companyId: string;
        }[];
        jobs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            type: import("@/generated/prisma/enums").JobType;
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
            experienceLevel: import("@/generated/prisma/enums").ExperienceLevel;
            location: string | null;
            isRemote: boolean;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            salaryPeriod: string | null;
            techStack: string[];
            status: import("@/generated/prisma/enums").JobStatus;
            applicationCount: number;
            viewCount: number;
            publishedAt: Date | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        linkedinUrl: string | null;
        description: string | null;
        industry: string | null;
        size: CompanySize | null;
        founded: number | null;
        country: string | null;
        city: string | null;
        isVerified: boolean;
        isActive: boolean;
    }[]>;
    addCompanyMemberInDb: (companyId: string, userId: string, isOwner?: boolean) => Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        userId: string;
        isOwner: boolean;
        joinedAt: Date;
        companyId: string;
    }>;
    removeCompanyMemberFromDb: (companyId: string, userId: string) => Promise<{
        id: string;
        userId: string;
        isOwner: boolean;
        joinedAt: Date;
        companyId: string;
    }>;
    getCompanyMembersFromDb: (companyId: string) => Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        userId: string;
        isOwner: boolean;
        joinedAt: Date;
        companyId: string;
    })[]>;
};
export {};
//# sourceMappingURL=company.service.d.ts.map