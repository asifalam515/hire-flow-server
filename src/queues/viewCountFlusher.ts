import { redis } from "@/config/redis";
import { prisma } from "@lib/prisma";

export const flushViewCounts = async () => {
  try {
    if (!redis || !redis.keys) return;

    const keys: string[] = (await redis.keys("jobs:views:*")) || [];
    if (!keys.length) return;

    const updates: any[] = [];

    for (const key of keys) {
      try {
        const val = await redis.get(key);
        const count = val ? parseInt(String(val), 10) || 0 : 0;
        // extract jobId from key: jobs:views:{jobId}
        const parts = key.split(":");
        const jobId = parts.slice(2).join(":");
        if (count > 0 && jobId) {
          updates.push(
            prisma.job.update({
              where: { id: jobId },
              data: { viewCount: { increment: count } },
            }),
          );
        }
      } catch (innerErr) {
        // If a key fails, continue with others
        // eslint-disable-next-line no-console
        console.error(`Failed to process view key ${key}:`, innerErr);
      }
    }

    // Delete keys after reading values
    try {
      if (keys.length && redis.del) {
        await redis.del(...keys);
      }
    } catch (err) {
      // ignore deletion errors
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
      // eslint-disable-next-line no-console
      console.log(`Flushed view counts for ${updates.length} jobs`);
    }
  } catch (err) {
    // Log but do not crash the app if Redis or DB are unreachable
    // eslint-disable-next-line no-console
    console.error("flushViewCounts failed:", err);
  }
};

export default flushViewCounts;
