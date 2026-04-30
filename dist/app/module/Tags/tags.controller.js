import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { tagsService } from "./tags.service";
export const searchSkills = asyncHandler(async (req, res) => {
    const query = req.query.q;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    if (!query) {
        throw new AppError("Search query 'q' is required", 400);
    }
    const skills = await tagsService.searchSkillsFromDb(query, limit);
    res.status(200).json({
        success: true,
        data: skills,
    });
});
export const getPopularSkills = asyncHandler(async (req, res) => {
    const limit = Number.parseInt(req.query.limit, 10) || 30;
    const skills = await tagsService.getPopularSkillsFromDb(limit);
    res.status(200).json({
        success: true,
        data: skills,
    });
});
export const tagsController = {
    searchSkills,
    getPopularSkills,
};
//# sourceMappingURL=tags.controller.js.map