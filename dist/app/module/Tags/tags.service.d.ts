export declare const searchSkillsFromDb: (query: string, limit?: number) => Promise<{
    id: string;
    name: string;
    slug: string;
    usageCount: number;
}[]>;
export declare const getPopularSkillsFromDb: (limit?: number) => Promise<{}>;
export declare const tagsService: {
    searchSkillsFromDb: (query: string, limit?: number) => Promise<{
        id: string;
        name: string;
        slug: string;
        usageCount: number;
    }[]>;
    getPopularSkillsFromDb: (limit?: number) => Promise<{}>;
};
//# sourceMappingURL=tags.service.d.ts.map