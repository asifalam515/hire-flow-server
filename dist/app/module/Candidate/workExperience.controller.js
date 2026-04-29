import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { prisma } from "@lib/prisma";
import { workExperienceService } from "./workExperience.service";
const createWorkExperience = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new AppError("Authentication required", 401);
    // Get profile for this user
    const profile = await prisma.candidateProfile.findUnique({
        where: { userId },
    });
    if (!profile) {
        throw new AppError("Profile not found. Create profile first.", 404);
    }
    const { company, title, location, startDate, endDate, current, description, skills, } = req.body;
    if (!company || !title || !startDate) {
        throw new AppError("Company, title, and startDate are required", 400);
    }
    const experience = await workExperienceService.createWorkExperience(profile.id, {
        company,
        title,
        location,
        startDate,
        endDate,
        current,
        description,
        skills,
    });
    res.status(201).json({ success: true, data: experience });
});
const getMyWorkExperiences = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new AppError("Authentication required", 401);
    const profile = await prisma.candidateProfile.findUnique({
        where: { userId },
    });
    if (!profile) {
        throw new AppError("Profile not found", 404);
    }
    const experiences = await workExperienceService.getWorkExperienceByProfileId(profile.id);
    res.status(200).json({ success: true, data: experiences });
});
const updateWorkExperience = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId)
        throw new AppError("Authentication required", 401);
    if (!id)
        throw new AppError("Experience ID required", 400);
    // Verify ownership
    const experience = await workExperienceService.getWorkExperienceById(id);
    if (!experience) {
        throw new AppError("Experience not found", 404);
    }
    const profile = await prisma.candidateProfile.findUnique({
        where: { userId },
    });
    if (!profile || experience.profileId !== profile.id) {
        throw new AppError("You do not have permission to update this", 403);
    }
    const updated = await workExperienceService.updateWorkExperience(id, req.body);
    res.status(200).json({ success: true, data: updated });
});
const deleteWorkExperience = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId)
        throw new AppError("Authentication required", 401);
    if (!id)
        throw new AppError("Experience ID required", 400);
    // Verify ownership
    const experience = await workExperienceService.getWorkExperienceById(id);
    if (!experience) {
        throw new AppError("Experience not found", 404);
    }
    const profile = await prisma.candidateProfile.findUnique({
        where: { userId },
    });
    if (!profile || experience.profileId !== profile.id) {
        throw new AppError("You do not have permission to delete this", 403);
    }
    await workExperienceService.deleteWorkExperience(id);
    res.status(200).json({ success: true, message: "Experience deleted" });
});
export const workExperienceController = {
    createWorkExperience,
    getMyWorkExperiences,
    updateWorkExperience,
    deleteWorkExperience,
};
//# sourceMappingURL=workExperience.controller.js.map