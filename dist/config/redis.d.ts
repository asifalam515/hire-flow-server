import NodeCache from "node-cache";
declare const cache: NodeCache;
export declare const cacheGet: <T = any>(key: string) => Promise<T | null>;
export declare const cacheSet: (key: string, value: any, ttlSec?: number) => Promise<void>;
export declare const keys: (pattern: string) => Promise<string[]>;
export declare const del: (...ks: string[]) => Promise<number>;
export declare const invalidateJobsCache: () => Promise<void>;
export declare const redis: any;
export default cache;
//# sourceMappingURL=redis.d.ts.map