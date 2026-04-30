import { prisma } from "@lib/prisma";
import NodeCache from "node-cache";
// Cache for 10 minutes (600 seconds)
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
export const searchSkillsFromDb = async (query, limit = 10) => {
    const skills = await prisma.skill.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
        },
        orderBy: {
            usageCount: "desc",
        },
        take: limit,
    });
    return skills;
};
export const getPopularSkillsFromDb = async (limit = 30) => {
    const cacheKey = `popular-skills-${limit}`;
    const cachedSkills = myCache.get(cacheKey);
    if (cachedSkills) {
        return cachedSkills;
    }
    const skills = await prisma.skill.findMany({
        orderBy: {
            usageCount: "desc",
        },
        take: limit,
    });
    myCache.set(cacheKey, skills);
    return skills;
};
export const tagsService = {
    searchSkillsFromDb,
    getPopularSkillsFromDb,
};
//# sourceMappingURL=tags.service.js.map