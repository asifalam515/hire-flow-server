import type { InterviewType } from "@/generated/prisma/enums";
interface ScheduleInterviewInput {
    type: InterviewType;
    scheduledAt: Date;
    durationMins?: number;
    location?: string;
    meetingUrl?: string;
    notes?: string;
}
/**
 * Schedule an interview for an application
 */
export declare const scheduleInterview: (applicationId: string, recruiterId: string, data: ScheduleInterviewInput) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: InterviewType;
    location: string | null;
    notes: string | null;
    applicationId: string;
    meetingUrl: string | null;
    scheduledAt: Date;
    durationMins: number;
    feedback: string | null;
    rating: number | null;
    cancelledAt: Date | null;
    cancelReason: string | null;
    scheduledById: string;
}>;
/**
 * Send offer extended email when application reaches OFFER stage
 */
export declare const sendOfferEmail: (applicationId: string, salaryOffer?: number) => Promise<void>;
export declare const interviewService: {
    scheduleInterview: (applicationId: string, recruiterId: string, data: ScheduleInterviewInput) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: InterviewType;
        location: string | null;
        notes: string | null;
        applicationId: string;
        meetingUrl: string | null;
        scheduledAt: Date;
        durationMins: number;
        feedback: string | null;
        rating: number | null;
        cancelledAt: Date | null;
        cancelReason: string | null;
        scheduledById: string;
    }>;
    sendOfferEmail: (applicationId: string, salaryOffer?: number) => Promise<void>;
};
export {};
//# sourceMappingURL=interview.service.d.ts.map