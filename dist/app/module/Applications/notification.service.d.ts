interface ApplicationEmailContext {
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    companyName: string;
    applicationId?: string;
    stage?: string;
    interviewDetails?: {
        type?: string;
        dateTime?: Date;
        location?: string;
        meetingUrl?: string;
    };
    salaryOffer?: number;
    salaryCurrency?: string;
}
/**
 * Send email when application is received (to recruiter)
 */
export declare const sendApplicationReceivedEmail: (recruiterEmail: string, recruiterName: string, context: ApplicationEmailContext) => Promise<void>;
/**
 * Send email when application stage is updated (to candidate)
 */
export declare const sendApplicationStageUpdateEmail: (candidateEmail: string, candidateName: string, context: ApplicationEmailContext) => Promise<void>;
/**
 * Send email when interview is scheduled (to candidate)
 */
export declare const sendInterviewScheduledEmail: (candidateEmail: string, candidateName: string, context: ApplicationEmailContext) => Promise<void>;
/**
 * Send email when offer is extended (to candidate)
 */
export declare const sendOfferExtendedEmail: (candidateEmail: string, candidateName: string, context: ApplicationEmailContext) => Promise<void>;
/**
 * Send email when job is expiring soon (to recruiter)
 */
export declare const sendJobExpiringEmail: (recruiterEmail: string, recruiterName: string, jobTitle: string, companyName: string, expiresAt: Date) => Promise<void>;
declare const _default: {
    sendApplicationReceivedEmail: (recruiterEmail: string, recruiterName: string, context: ApplicationEmailContext) => Promise<void>;
    sendApplicationStageUpdateEmail: (candidateEmail: string, candidateName: string, context: ApplicationEmailContext) => Promise<void>;
    sendInterviewScheduledEmail: (candidateEmail: string, candidateName: string, context: ApplicationEmailContext) => Promise<void>;
    sendOfferExtendedEmail: (candidateEmail: string, candidateName: string, context: ApplicationEmailContext) => Promise<void>;
    sendJobExpiringEmail: (recruiterEmail: string, recruiterName: string, jobTitle: string, companyName: string, expiresAt: Date) => Promise<void>;
};
export default _default;
//# sourceMappingURL=notification.service.d.ts.map