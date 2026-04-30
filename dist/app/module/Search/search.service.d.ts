export declare const trackSearch: (term: string) => Promise<void>;
export declare const getSuggestions: (q: string, limit?: number) => Promise<string[]>;
export declare const getTrending: (limit?: number) => Promise<{
    term: string;
    score: number;
}[]>;
export declare const searchService: {
    trackSearch: (term: string) => Promise<void>;
    getSuggestions: (q: string, limit?: number) => Promise<string[]>;
    getTrending: (limit?: number) => Promise<{
        term: string;
        score: number;
    }[]>;
};
//# sourceMappingURL=search.service.d.ts.map