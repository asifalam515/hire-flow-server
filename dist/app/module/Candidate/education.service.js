import { prisma } from "@lib/prisma";
const createEducation = async (profileId, data) => {
    const education = await prisma.education.create({
        data: {
            profileId,
            institution: data.institution,
            degree: data.degree,
            field: data.field,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            current: data.current ?? false,
            gpa: data.gpa,
        },
    });
    return education;
};
const getEducationByProfileId = async (profileId) => {
    const educations = await prisma.education.findMany({
        where: { profileId },
        orderBy: { startDate: "desc" },
    });
    return educations;
};
const getEducationById = async (id) => {
    const education = await prisma.education.findUnique({
        where: { id },
    });
    return education;
};
const updateEducation = async (id, data) => {
    const updateData = {};
    if (data.institution !== undefined)
        updateData.institution = data.institution;
    if (data.degree !== undefined)
        updateData.degree = data.degree;
    if (data.field !== undefined)
        updateData.field = data.field;
    if (data.startDate !== undefined)
        updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined)
        updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.current !== undefined)
        updateData.current = data.current;
    if (data.gpa !== undefined)
        updateData.gpa = data.gpa;
    const education = await prisma.education.update({
        where: { id },
        data: updateData,
    });
    return education;
};
const deleteEducation = async (id) => {
    await prisma.education.delete({
        where: { id },
    });
};
export const educationService = {
    createEducation,
    getEducationByProfileId,
    getEducationById,
    updateEducation,
    deleteEducation,
};
//# sourceMappingURL=education.service.js.map