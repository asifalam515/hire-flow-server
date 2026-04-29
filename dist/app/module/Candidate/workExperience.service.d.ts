interface CreateWorkExperienceInput {
    company: string;
    title: string;
    location?: string;
    startDate: string | Date;
    endDate?: string | Date;
    current?: boolean;
    description?: string;
    skills?: string[];
}
interface UpdateWorkExperienceInput {
    company?: string;
    title?: string;
    location?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    current?: boolean;
    description?: string;
    skills?: string[];
}
export declare const workExperienceService: {
    createWorkExperience: (profileId: string, data: CreateWorkExperienceInput) => Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        company: string;
        skills: string[];
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        profileId: string;
    }>;
    getWorkExperienceByProfileId: (profileId: string) => Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        company: string;
        skills: string[];
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        profileId: string;
    }[]>;
    getWorkExperienceById: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        company: string;
        skills: string[];
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        profileId: string;
    } | null>;
    updateWorkExperience: (id: string, data: UpdateWorkExperienceInput) => Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        company: string;
        skills: string[];
        startDate: Date;
        endDate: Date | null;
        current: boolean;
        profileId: string;
    }>;
    deleteWorkExperience: (id: string) => Promise<void>;
};
export {};
//# sourceMappingURL=workExperience.service.d.ts.map