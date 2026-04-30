export declare const sendMail: (to: string, subject: string, html: string, text?: string) => Promise<void>;
export declare const sendStageChangeEmail: (companyId: string, to: string, variables: {
    candidateName?: string;
    jobTitle?: string;
    companyName?: string;
    stage?: string;
}) => Promise<void>;
export default sendMail;
//# sourceMappingURL=mailer.d.ts.map