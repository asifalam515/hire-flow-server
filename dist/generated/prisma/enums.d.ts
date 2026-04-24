export declare const Role: {
    readonly CANDIDATE: "CANDIDATE";
    readonly RECRUITER: "RECRUITER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const JobType: {
    readonly FULL_TIME: "FULL_TIME";
    readonly PART_TIME: "PART_TIME";
    readonly CONTRACT: "CONTRACT";
    readonly FREELANCE: "FREELANCE";
    readonly INTERNSHIP: "INTERNSHIP";
    readonly REMOTE: "REMOTE";
};
export type JobType = (typeof JobType)[keyof typeof JobType];
export declare const ExperienceLevel: {
    readonly ENTRY: "ENTRY";
    readonly JUNIOR: "JUNIOR";
    readonly MID: "MID";
    readonly SENIOR: "SENIOR";
    readonly LEAD: "LEAD";
    readonly EXECUTIVE: "EXECUTIVE";
};
export type ExperienceLevel = (typeof ExperienceLevel)[keyof typeof ExperienceLevel];
export declare const JobStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
    readonly PAUSED: "PAUSED";
    readonly CLOSED: "CLOSED";
    readonly EXPIRED: "EXPIRED";
};
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
export declare const ApplicationStage: {
    readonly APPLIED: "APPLIED";
    readonly SCREENING: "SCREENING";
    readonly ASSESSMENT: "ASSESSMENT";
    readonly INTERVIEW: "INTERVIEW";
    readonly OFFER: "OFFER";
    readonly HIRED: "HIRED";
    readonly REJECTED: "REJECTED";
    readonly WITHDRAWN: "WITHDRAWN";
};
export type ApplicationStage = (typeof ApplicationStage)[keyof typeof ApplicationStage];
export declare const CompanySize: {
    readonly STARTUP: "STARTUP";
    readonly SMALL: "SMALL";
    readonly MEDIUM: "MEDIUM";
    readonly LARGE: "LARGE";
    readonly ENTERPRISE: "ENTERPRISE";
};
export type CompanySize = (typeof CompanySize)[keyof typeof CompanySize];
export declare const NotificationType: {
    readonly APPLICATION_RECEIVED: "APPLICATION_RECEIVED";
    readonly STAGE_UPDATED: "STAGE_UPDATED";
    readonly JOB_EXPIRING_SOON: "JOB_EXPIRING_SOON";
    readonly JOB_ALERT_MATCH: "JOB_ALERT_MATCH";
    readonly INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED";
    readonly OFFER_EXTENDED: "OFFER_EXTENDED";
    readonly APPLICATION_WITHDRAWN: "APPLICATION_WITHDRAWN";
    readonly SYSTEM: "SYSTEM";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const AlertFrequency: {
    readonly INSTANT: "INSTANT";
    readonly DAILY: "DAILY";
    readonly WEEKLY: "WEEKLY";
};
export type AlertFrequency = (typeof AlertFrequency)[keyof typeof AlertFrequency];
export declare const InterviewType: {
    readonly PHONE: "PHONE";
    readonly VIDEO: "VIDEO";
    readonly ONSITE: "ONSITE";
    readonly TECHNICAL: "TECHNICAL";
    readonly PANEL: "PANEL";
};
export type InterviewType = (typeof InterviewType)[keyof typeof InterviewType];
//# sourceMappingURL=enums.d.ts.map