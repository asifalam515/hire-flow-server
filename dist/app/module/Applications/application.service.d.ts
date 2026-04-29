import type { ApplicationStage } from "@/generated/prisma/enums";
interface SubmitApplicationInput {
    resumeUrl: string;
    resumeFileName?: string;
    coverLetter?: string;
    source?: string;
    referralCode?: string;
}
interface MoveApplicationStageInput {
    stage: ApplicationStage;
    reason?: string;
}
export declare const bulkMoveApplicantStagesInDb: (applicationIds: string[], recruiterId: string, stage: ApplicationStage, reason?: string) => Promise<({
    id: string;
    status: string;
    data: {
        job: {
            id: string;
            title: string;
            slug: string;
            company: {
                id: string;
                name: string;
                slug: string;
            };
        };
        candidate: {
            id: string;
            email: string;
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        candidateId: string;
        jobId: string;
        resumeUrl: string;
        resumeFileName: string | null;
        coverLetter: string | null;
        stage: ApplicationStage;
        aiMatchScore: number | null;
        source: string | null;
        referralCode: string | null;
        isArchived: boolean;
    };
    message?: never;
} | {
    id: string;
    status: string;
    message: any;
    data?: never;
})[]>;
export declare const exportApplicantsToCSVFromDb: (jobId: string, recruiterId: string) => Promise<string>;
export declare const addApplicationNoteToDb: (applicationId: string, authorId: string, content: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    applicationId: string;
    content: string;
    isPinned: boolean;
    authorId: string;
}>;
export declare const getApplicationNotesFromDb: (applicationId: string, recruiterId: string) => Promise<({
    author: {
        name: string;
        image: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    applicationId: string;
    content: string;
    isPinned: boolean;
    authorId: string;
})[]>;
export declare const applicationService: {
    submitApplicationToDb: (jobId: string, candidateId: string, payload: SubmitApplicationInput) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        candidateId: string;
        jobId: string;
        resumeUrl: string;
        resumeFileName: string | null;
        coverLetter: string | null;
        stage: ApplicationStage;
        aiMatchScore: number | null;
        source: string | null;
        referralCode: string | null;
        isArchived: boolean;
    }>;
    getMyApplicationsFromDb: (candidateId: string, page?: number, limit?: number) => Promise<{
        data: ({
            job: {
                id: string;
                type: import("@/generated/prisma/enums").JobType;
                title: string;
                slug: string;
                experienceLevel: import("@/generated/prisma/enums").ExperienceLevel;
                location: string | null;
                isRemote: boolean;
                salaryMin: number | null;
                salaryMax: number | null;
                salaryCurrency: string | null;
                salaryPeriod: string | null;
                status: import("@/generated/prisma/enums").JobStatus;
                company: {
                    id: string;
                    name: string;
                    slug: string;
                    logoUrl: string | null;
                };
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            resumeUrl: string;
            resumeFileName: string | null;
            coverLetter: string | null;
            stage: ApplicationStage;
            aiMatchScore: number | null;
            source: string | null;
            referralCode: string | null;
            isArchived: boolean;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getApplicantsForJobFromDb: (jobId: string, recruiterId: string, page?: number, limit?: number) => Promise<{
        job: {
            id: string;
            postedById: string;
            title: string;
            company: {
                id: string;
                name: string;
                slug: string;
            };
        };
        data: ({
            candidate: {
                id: string;
                email: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            resumeUrl: string;
            resumeFileName: string | null;
            coverLetter: string | null;
            stage: ApplicationStage;
            aiMatchScore: number | null;
            source: string | null;
            referralCode: string | null;
            isArchived: boolean;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    moveApplicantStageInDb: (applicationId: string, recruiterId: string, payload: MoveApplicationStageInput) => Promise<{
        job: {
            id: string;
            title: string;
            slug: string;
            company: {
                id: string;
                name: string;
                slug: string;
            };
        };
        candidate: {
            id: string;
            email: string;
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        candidateId: string;
        jobId: string;
        resumeUrl: string;
        resumeFileName: string | null;
        coverLetter: string | null;
        stage: ApplicationStage;
        aiMatchScore: number | null;
        source: string | null;
        referralCode: string | null;
        isArchived: boolean;
    }>;
    bulkMoveApplicantStagesInDb: (applicationIds: string[], recruiterId: string, stage: ApplicationStage, reason?: string) => Promise<({
        id: string;
        status: string;
        data: {
            job: {
                id: string;
                title: string;
                slug: string;
                company: {
                    id: string;
                    name: string;
                    slug: string;
                };
            };
            candidate: {
                id: string;
                email: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            resumeUrl: string;
            resumeFileName: string | null;
            coverLetter: string | null;
            stage: ApplicationStage;
            aiMatchScore: number | null;
            source: string | null;
            referralCode: string | null;
            isArchived: boolean;
        };
        message?: never;
    } | {
        id: string;
        status: string;
        message: any;
        data?: never;
    })[]>;
    exportApplicantsToCSVFromDb: (jobId: string, recruiterId: string) => Promise<string>;
    addApplicationNoteToDb: (applicationId: string, authorId: string, content: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        content: string;
        isPinned: boolean;
        authorId: string;
    }>;
    getApplicationNotesFromDb: (applicationId: string, recruiterId: string) => Promise<({
        author: {
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        content: string;
        isPinned: boolean;
        authorId: string;
    })[]>;
};
export {};
//# sourceMappingURL=application.service.d.ts.map