interface CreateEducationInput {
    institution: string;
    degree: string;
    field: string;
    startDate: string | Date;
    endDate?: string | Date;
    current?: boolean;
    gpa?: number;
}
interface UpdateEducationInput {
    institution?: string;
    degree?: string;
    field?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    current?: boolean;
    gpa?: number;
}
export declare const educationService: {
    createEducation: (profileId: string, data: CreateEducationInput) => Promise<{
        id: string;
        createdAt: Date;
        institution: string;
        degree: string;
        field: string;
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        gpa: number | null;
        profileId: string;
    }>;
    getEducationByProfileId: (profileId: string) => Promise<{
        id: string;
        createdAt: Date;
        institution: string;
        degree: string;
        field: string;
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        gpa: number | null;
        profileId: string;
    }[]>;
    getEducationById: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        institution: string;
        degree: string;
        field: string;
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        gpa: number | null;
        profileId: string;
    } | null>;
    updateEducation: (id: string, data: UpdateEducationInput) => Promise<{
        id: string;
        createdAt: Date;
        institution: string;
        degree: string;
        field: string;
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        gpa: number | null;
        profileId: string;
    }>;
    deleteEducation: (id: string) => Promise<void>;
};
export {};
//# sourceMappingURL=education.service.d.ts.map