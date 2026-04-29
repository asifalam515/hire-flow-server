import type { ApplicationStage } from "@/generated/prisma/enums";
type TimeBucket = "week" | "month";
interface DateRangeFilter {
    from?: Date;
    to?: Date;
    bucket: TimeBucket;
}
export declare const analyticsService: {
    getRecruiterOverviewFromDb: (userId: string, range: DateRangeFilter) => Promise<{
        company: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
            isVerified: boolean;
            isActive: boolean;
        };
        recruiter: {
            id: string;
            role: string;
        };
        filters: {
            from: Date | null;
            to: Date | null;
            bucket: TimeBucket;
        };
        jobs: {
            total: number;
            published: number;
            draft: number;
            paused: number;
            closed: number;
            expired: number;
        };
        applications: {
            total: number;
            byStage: Record<ApplicationStage, number>;
            sourceBreakdown: Record<string, number>;
            averageTimePerStageDays: Record<string, number>;
        };
        topJobs: {
            id: string;
            title: string;
            slug: string;
            status: import("@/generated/prisma/enums").JobStatus;
            createdAt: Date;
            publishedAt: Date | null;
            applications: number;
            savedCount: number;
        }[];
        recentApplications: {
            id: string;
            stage: ApplicationStage;
            createdAt: Date;
            candidate: {
                id: string;
                email: string;
                name: string;
                image: string | null;
            };
            job: {
                id: string;
                title: string;
                slug: string;
                company: {
                    id: string;
                    name: string;
                    slug: string;
                    logoUrl: string | null;
                };
            };
        }[];
        chart: {
            label: string;
            total: number;
            stages: Record<ApplicationStage, number>;
        }[];
    }>;
    getRecruiterFunnelFromDb: (userId: string, range: DateRangeFilter) => Promise<{
        company: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
            isVerified: boolean;
            isActive: boolean;
        };
        filters: {
            from: Date | null;
            to: Date | null;
            bucket: TimeBucket;
        };
        pipeline: {
            job: {
                id: string;
                title: string;
                slug: string;
                status: import("@/generated/prisma/enums").JobStatus;
                publishedAt: Date | null;
            };
            applications: number;
            stages: Record<ApplicationStage, number>;
            dropOff: {
                appliedToScreening: number;
                screeningToAssessment: number;
                assessmentToInterview: number;
                interviewToOffer: number;
                offerToHired: number;
            };
            conversionRateToHire: number;
        }[];
    }>;
    parseAnalyticsRange: (query: {
        from?: string;
        to?: string;
        bucket?: string;
    }) => DateRangeFilter;
};
export {};
//# sourceMappingURL=analytics.service.d.ts.map