import { prisma } from "@lib/prisma";
const createWorkExperience = async (profileId, data) => {
    const experience = await prisma.workExperience.create({
        data: {
            profileId,
            company: data.company,
            title: data.title,
            location: data.location,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            current: data.current ?? false,
            description: data.description,
            skills: data.skills || [],
        },
    });
    return experience;
};
const getWorkExperienceByProfileId = async (profileId) => {
    const experiences = await prisma.workExperience.findMany({
        where: { profileId },
        orderBy: { startDate: "desc" },
    });
    return experiences;
};
const getWorkExperienceById = async (id) => {
    const experience = await prisma.workExperience.findUnique({
        where: { id },
    });
    return experience;
};
const updateWorkExperience = async (id, data) => {
    const updateData = {};
    if (data.company !== undefined)
        updateData.company = data.company;
    if (data.title !== undefined)
        updateData.title = data.title;
    if (data.location !== undefined)
        updateData.location = data.location;
    if (data.startDate !== undefined)
        updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined)
        updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.current !== undefined)
        updateData.current = data.current;
    if (data.description !== undefined)
        updateData.description = data.description;
    if (data.skills !== undefined)
        updateData.skills = data.skills;
    const experience = await prisma.workExperience.update({
        where: { id },
        data: updateData,
    });
    return experience;
};
const deleteWorkExperience = async (id) => {
    await prisma.workExperience.delete({
        where: { id },
    });
};
export const workExperienceService = {
    createWorkExperience,
    getWorkExperienceByProfileId,
    getWorkExperienceById,
    updateWorkExperience,
    deleteWorkExperience,
};
//# sourceMappingURL=workExperience.service.js.map