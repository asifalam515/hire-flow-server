import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { analyticsService } from "./analytics.service";

const getOverview = asyncHandler(async (req: Request, res: Response) => {
  const range = analyticsService.parseAnalyticsRange({
    from: req.query.from as string | undefined,
    to: req.query.to as string | undefined,
    bucket: req.query.bucket as string | undefined,
  });

  const overview = await analyticsService.getRecruiterOverviewFromDb(
    req.user?.id as string,
    range,
  );

  res.status(200).json({
    success: true,
    data: overview,
  });
});

const getFunnel = asyncHandler(async (req: Request, res: Response) => {
  const range = analyticsService.parseAnalyticsRange({
    from: req.query.from as string | undefined,
    to: req.query.to as string | undefined,
    bucket: req.query.bucket as string | undefined,
  });

  const funnel = await analyticsService.getRecruiterFunnelFromDb(
    req.user?.id as string,
    range,
  );

  res.status(200).json({
    success: true,
    data: funnel,
  });
});

export const analyticsController = {
  getOverview,
  getFunnel,
};
