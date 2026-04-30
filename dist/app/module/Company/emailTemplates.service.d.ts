type TemplateVars = {
    candidateName?: string;
    jobTitle?: string;
    companyName?: string;
    stage?: string;
    [key: string]: any;
};
export declare const emailTemplatesService: {
    createTemplate: (companyId: string, payload: {
        name: string;
        subject: string;
        body: string;
        stage?: string | null;
        isDefault?: boolean;
    }) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        body: string;
        companyId: string;
        stage: import("../../../generated/prisma/enums").ApplicationStage | null;
        subject: string;
        isDefault: boolean;
    }>;
    getTemplates: (companyId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        body: string;
        companyId: string;
        stage: import("../../../generated/prisma/enums").ApplicationStage | null;
        subject: string;
        isDefault: boolean;
    }[]>;
    updateTemplate: (companyId: string, templateId: string, payload: {
        name?: string;
        subject?: string;
        body?: string;
        stage?: string | null;
        isDefault?: boolean;
    }) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        body: string;
        companyId: string;
        stage: import("../../../generated/prisma/enums").ApplicationStage | null;
        subject: string;
        isDefault: boolean;
    }>;
    deleteTemplate: (companyId: string, templateId: string) => Promise<{
        success: boolean;
    }>;
    resolveTemplate: (companyId: string, stage?: string | null, variables?: TemplateVars) => Promise<{
        subject: string;
        body: string;
    }>;
};
export default emailTemplatesService;
//# sourceMappingURL=emailTemplates.service.d.ts.map