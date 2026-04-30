import NodeCache from "node-cache";

const ttlDefault = 60; // seconds

const cache = new NodeCache({ stdTTL: ttlDefault, checkperiod: 120 });

export const cacheGet = async <T = any>(key: string): Promise<T | null> => {
  const v = cache.get<T>(key);
  return v === undefined ? null : v;
};

export const cacheSet = async (
  key: string,
  value: any,
  ttlSec: number = ttlDefault,
) => {
  cache.set(key, value, ttlSec);
};

// Return keys matching a simple glob pattern like 'jobs:list:*'
export const keys = async (pattern: string): Promise<string[]> => {
  // Convert glob '*' to regex
  const regex = new RegExp(
    "^" +
      pattern
        .split("*")
        .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join(".*") +
      "$",
  );
  return cache.keys().filter((k) => regex.test(k));
};

export const del = async (...ks: string[]) => {
  return cache.del(ks);
};

export const invalidateJobsCache = async () => {
  try {
    const ks = await keys("jobs:list:*");
    if (ks && ks.length > 0) {
      await del(...ks);
    }
  } catch (err) {
    // don't throw on cache errors
    // eslint-disable-next-line no-console
    console.error("Failed to invalidate jobs cache", err);
  }
};

export default cache;
