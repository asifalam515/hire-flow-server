import { asyncHandler } from "@lib/asyncHandler";
import { analyticsService } from "./analytics.service";
const getOverview = asyncHandler(async (req, res) => {
    const range = analyticsService.parseAnalyticsRange({
        from: req.query.from,
        to: req.query.to,
        bucket: req.query.bucket,
    });
    const overview = await analyticsService.getRecruiterOverviewFromDb(req.user?.id, range);
    res.status(200).json({
        success: true,
        data: overview,
    });
});
const getFunnel = asyncHandler(async (req, res) => {
    const range = analyticsService.parseAnalyticsRange({
        from: req.query.from,
        to: req.query.to,
        bucket: req.query.bucket,
    });
    const funnel = await analyticsService.getRecruiterFunnelFromDb(req.user?.id, range);
    res.status(200).json({
        success: true,
        data: funnel,
    });
});
export const analyticsController = {
    getOverview,
    getFunnel,
};
//# sourceMappingURL=analytics.controller.js.map