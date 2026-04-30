import { prisma } from "@lib/prisma";

// Get current week string e.g., "2024-42"
const getCurrentWeekKey = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${weekNo}`;
};

export const trackSearch = async (term: string) => {
  if (!term || typeof term !== "string") return;

  const normalizedTerm = term.toLowerCase().trim();
  if (normalizedTerm.length < 2) return; // Ignore very short searches

  try {
    const weekKey = getCurrentWeekKey();

    // Track globally (weekKey is null)
    await prisma.searchTerm.upsert({
      where: {
        term_weekKey: { term: normalizedTerm, weekKey: "global" }, // use "global" string for the null equivalent to avoid unique constraint issues with nulls if db doesn't handle null uniqueness well, but schema says weekKey is String? Wait, in Prisma, nulls in unique constraints can be tricky. Let's use "global" instead of null to be safe.
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        term: normalizedTerm,
        weekKey: "global",
        count: 1,
      },
    });

    // Track weekly
    await prisma.searchTerm.upsert({
      where: {
        term_weekKey: { term: normalizedTerm, weekKey },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        term: normalizedTerm,
        weekKey,
        count: 1,
      },
    });
  } catch (error) {
    console.error("Postgres trackSearch error:", error);
  }
};

export const getSuggestions = async (q: string, limit: number = 8) => {
  if (!q) return [];

  const prefix = q.toLowerCase().trim();

  try {
    const results = await prisma.searchTerm.findMany({
      where: {
        weekKey: "global",
        term: { startsWith: prefix },
      },
      orderBy: { count: "desc" },
      take: limit,
      select: { term: true },
    });

    return results.map((r) => r.term);
  } catch (error) {
    console.error("Postgres getSuggestions error:", error);
    return [];
  }
};

export const getTrending = async (limit: number = 10) => {
  try {
    const weekKey = getCurrentWeekKey();

    const results = await prisma.searchTerm.findMany({
      where: { weekKey },
      orderBy: { count: "desc" },
      take: limit,
      select: { term: true, count: true },
    });

    return results.map((r) => ({
      term: r.term,
      score: r.count,
    }));
  } catch (error) {
    console.error("Postgres getTrending error:", error);
    return [];
  }
};

export const searchService = {
  trackSearch,
  getSuggestions,
  getTrending,
};
