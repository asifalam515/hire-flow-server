export declare const savedJobsService: {
    saveJobInDb: (userId: string, jobId: string) => Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        jobId: string;
    }>;
    removeSavedJobFromDb: (userId: string, jobId: string) => Promise<{
        success: boolean;
    }>;
    listSavedJobsFromDb: (userId: string, page?: number, limit?: number) => Promise<{
        data: {
            savedAt: Date;
            id: string;
            expiresAt: Date | null;
            _count: {
                applications: number;
            };
            companyId: string;
            title: string;
            slug: string;
            status: import("../../../generated/prisma/enums").JobStatus;
            company: {
                id: string;
                name: string;
                slug: string;
                logoUrl: string | null;
            };
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
};
//# sourceMappingURL=savedJobs.service.d.ts.map