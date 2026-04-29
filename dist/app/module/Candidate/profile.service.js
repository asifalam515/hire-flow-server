import { prisma } from "@lib/prisma";
const getProfileFromDb = async (userId) => {
    const profile = await prisma.candidateProfile.findUnique({
        where: { userId },
    });
    return profile;
};
const upsertProfileInDb = async (userId, data) => {
    const existing = await prisma.candidateProfile.findUnique({
        where: { userId },
    });
    if (existing) {
        const updated = await prisma.candidateProfile.update({
            where: { userId },
            data,
        });
        return updated;
    }
    const created = await prisma.candidateProfile.create({
        data: {
            userId,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            avatarUrl: data.avatarUrl,
            headline: data.headline,
            bio: data.bio,
            location: data.location,
            country: data.country,
            phone: data.phone,
            linkedinUrl: data.linkedinUrl,
            githubUrl: data.githubUrl,
            portfolioUrl: data.portfolioUrl,
            resumeUrl: data.resumeUrl,
            resumeFileName: data.resumeFileName,
            skills: data.skills || [],
            expectedSalaryMin: data.expectedSalaryMin,
            expectedSalaryMax: data.expectedSalaryMax,
            salaryCurrency: data.salaryCurrency,
            openToWork: data.openToWork,
            jobAlerts: data.jobAlerts,
            applicationUpdates: data.applicationUpdates,
            promotionalEmails: data.promotionalEmails,
        },
    });
    return created;
};
export const profileService = {
    getProfileFromDb,
    upsertProfileInDb,
};
//# sourceMappingURL=profile.service.js.map