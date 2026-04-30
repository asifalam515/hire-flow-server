import NodeCache from "node-cache";
const ttlDefault = 60; // seconds
const cache = new NodeCache({ stdTTL: ttlDefault, checkperiod: 120 });
export const cacheGet = async (key) => {
    const v = cache.get(key);
    return v === undefined ? null : v;
};
export const cacheSet = async (key, value, ttlSec = ttlDefault) => {
    cache.set(key, value, ttlSec);
};
// Return keys matching a simple glob pattern like 'jobs:list:*'
export const keys = async (pattern) => {
    // Convert glob '*' to regex
    const regex = new RegExp("^" +
        pattern
            .split("*")
            .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join(".*") +
        "$");
    return cache.keys().filter((k) => regex.test(k));
};
export const del = async (...ks) => {
    return cache.del(ks);
};
export const invalidateJobsCache = async () => {
    try {
        const ks = await keys("jobs:list:*");
        if (ks && ks.length > 0) {
            await del(...ks);
        }
    }
    catch (err) {
        // don't throw on cache errors
        // eslint-disable-next-line no-console
        console.error("Failed to invalidate jobs cache", err);
    }
};
// Export a redis-like client named `redis` that uses ioredis if available,
// otherwise falls back to the in-memory NodeCache implementation above.
let redisClient = null;
try {
    // Try to require ioredis dynamically
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require("ioredis");
    const client = new IORedis(process.env.REDIS_URL || undefined);
    redisClient = client;
}
catch (err) {
    // Fallback wrapper around NodeCache to provide minimal redis API used by code
    redisClient = {
        async incr(key) {
            const cur = cache.get(key) ?? 0;
            const next = Number(cur) + 1;
            cache.set(key, next);
            return next;
        },
        async get(key) {
            const v = cache.get(key);
            return v === undefined || v === null ? null : String(v);
        },
        async keys(pattern) {
            return keys(pattern);
        },
        async del(...ks) {
            return del(...ks);
        },
    };
}
export const redis = redisClient;
export default cache;
//# sourceMappingURL=redis.js.map