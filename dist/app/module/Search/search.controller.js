import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { searchService } from "./search.service";
export const getSuggestions = asyncHandler(async (req, res) => {
    const q = req.query.q;
    const limit = parseInt(req.query.limit) || 8;
    if (!q) {
        throw new AppError("Query parameter 'q' is required", 400);
    }
    const suggestions = await searchService.getSuggestions(q, limit);
    res.status(200).json({
        success: true,
        data: suggestions,
    });
});
export const getTrending = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const trending = await searchService.getTrending(limit);
    res.status(200).json({
        success: true,
        data: trending,
    });
});
export const searchController = {
    getSuggestions,
    getTrending,
};
//# sourceMappingURL=search.controller.js.map