import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly CandidateProfile: "CandidateProfile";
    readonly WorkExperience: "WorkExperience";
    readonly Education: "Education";
    readonly Company: "Company";
    readonly CompanyMember: "CompanyMember";
    readonly Job: "Job";
    readonly SavedJob: "SavedJob";
    readonly Application: "Application";
    readonly ApplicationNote: "ApplicationNote";
    readonly AuditLog: "AuditLog";
    readonly Interview: "Interview";
    readonly Session: "Session";
    readonly Account: "Account";
    readonly Verification: "Verification";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly emailVerified: "emailVerified";
    readonly image: "image";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly role: "role";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CandidateProfileScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly avatarUrl: "avatarUrl";
    readonly headline: "headline";
    readonly bio: "bio";
    readonly location: "location";
    readonly country: "country";
    readonly phone: "phone";
    readonly linkedinUrl: "linkedinUrl";
    readonly githubUrl: "githubUrl";
    readonly portfolioUrl: "portfolioUrl";
    readonly resumeUrl: "resumeUrl";
    readonly resumeFileName: "resumeFileName";
    readonly skills: "skills";
    readonly expectedSalaryMin: "expectedSalaryMin";
    readonly expectedSalaryMax: "expectedSalaryMax";
    readonly salaryCurrency: "salaryCurrency";
    readonly openToWork: "openToWork";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CandidateProfileScalarFieldEnum = (typeof CandidateProfileScalarFieldEnum)[keyof typeof CandidateProfileScalarFieldEnum];
export declare const WorkExperienceScalarFieldEnum: {
    readonly id: "id";
    readonly profileId: "profileId";
    readonly company: "company";
    readonly title: "title";
    readonly location: "location";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly current: "current";
    readonly description: "description";
    readonly skills: "skills";
    readonly createdAt: "createdAt";
};
export type WorkExperienceScalarFieldEnum = (typeof WorkExperienceScalarFieldEnum)[keyof typeof WorkExperienceScalarFieldEnum];
export declare const EducationScalarFieldEnum: {
    readonly id: "id";
    readonly profileId: "profileId";
    readonly institution: "institution";
    readonly degree: "degree";
    readonly field: "field";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly current: "current";
    readonly gpa: "gpa";
    readonly createdAt: "createdAt";
};
export type EducationScalarFieldEnum = (typeof EducationScalarFieldEnum)[keyof typeof EducationScalarFieldEnum];
export declare const CompanyScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly logoUrl: "logoUrl";
    readonly bannerUrl: "bannerUrl";
    readonly website: "website";
    readonly linkedinUrl: "linkedinUrl";
    readonly description: "description";
    readonly industry: "industry";
    readonly size: "size";
    readonly founded: "founded";
    readonly country: "country";
    readonly city: "city";
    readonly isVerified: "isVerified";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum];
export declare const CompanyMemberScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly companyId: "companyId";
    readonly isOwner: "isOwner";
    readonly joinedAt: "joinedAt";
};
export type CompanyMemberScalarFieldEnum = (typeof CompanyMemberScalarFieldEnum)[keyof typeof CompanyMemberScalarFieldEnum];
export declare const JobScalarFieldEnum: {
    readonly id: "id";
    readonly companyId: "companyId";
    readonly postedById: "postedById";
    readonly title: "title";
    readonly slug: "slug";
    readonly description: "description";
    readonly requirements: "requirements";
    readonly responsibilities: "responsibilities";
    readonly benefits: "benefits";
    readonly type: "type";
    readonly experienceLevel: "experienceLevel";
    readonly location: "location";
    readonly isRemote: "isRemote";
    readonly country: "country";
    readonly city: "city";
    readonly salaryMin: "salaryMin";
    readonly salaryMax: "salaryMax";
    readonly salaryCurrency: "salaryCurrency";
    readonly salaryPeriod: "salaryPeriod";
    readonly techStack: "techStack";
    readonly status: "status";
    readonly applicationCount: "applicationCount";
    readonly viewCount: "viewCount";
    readonly publishedAt: "publishedAt";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum];
export declare const SavedJobScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly jobId: "jobId";
    readonly createdAt: "createdAt";
};
export type SavedJobScalarFieldEnum = (typeof SavedJobScalarFieldEnum)[keyof typeof SavedJobScalarFieldEnum];
export declare const ApplicationScalarFieldEnum: {
    readonly id: "id";
    readonly candidateId: "candidateId";
    readonly jobId: "jobId";
    readonly resumeUrl: "resumeUrl";
    readonly resumeFileName: "resumeFileName";
    readonly coverLetter: "coverLetter";
    readonly stage: "stage";
    readonly aiMatchScore: "aiMatchScore";
    readonly source: "source";
    readonly referralCode: "referralCode";
    readonly isArchived: "isArchived";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum];
export declare const ApplicationNoteScalarFieldEnum: {
    readonly id: "id";
    readonly applicationId: "applicationId";
    readonly authorId: "authorId";
    readonly content: "content";
    readonly isPinned: "isPinned";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ApplicationNoteScalarFieldEnum = (typeof ApplicationNoteScalarFieldEnum)[keyof typeof ApplicationNoteScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly applicationId: "applicationId";
    readonly changedById: "changedById";
    readonly fromStage: "fromStage";
    readonly toStage: "toStage";
    readonly reason: "reason";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const InterviewScalarFieldEnum: {
    readonly id: "id";
    readonly applicationId: "applicationId";
    readonly scheduledById: "scheduledById";
    readonly type: "type";
    readonly scheduledAt: "scheduledAt";
    readonly durationMins: "durationMins";
    readonly location: "location";
    readonly meetingUrl: "meetingUrl";
    readonly notes: "notes";
    readonly feedback: "feedback";
    readonly rating: "rating";
    readonly cancelledAt: "cancelledAt";
    readonly cancelReason: "cancelReason";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InterviewScalarFieldEnum = (typeof InterviewScalarFieldEnum)[keyof typeof InterviewScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly expiresAt: "expiresAt";
    readonly token: "token";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly userId: "userId";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly id: "id";
    readonly accountId: "accountId";
    readonly providerId: "providerId";
    readonly userId: "userId";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly idToken: "idToken";
    readonly accessTokenExpiresAt: "accessTokenExpiresAt";
    readonly refreshTokenExpiresAt: "refreshTokenExpiresAt";
    readonly scope: "scope";
    readonly password: "password";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const VerificationScalarFieldEnum: {
    readonly id: "id";
    readonly identifier: "identifier";
    readonly value: "value";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map