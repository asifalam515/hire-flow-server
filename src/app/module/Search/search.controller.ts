import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { searchService } from "./search.service";

export const getSuggestions = asyncHandler(
  async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 8;

    if (!q) {
      throw new AppError("Query parameter 'q' is required", 400);
    }

    const suggestions = await searchService.getSuggestions(q, limit);

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  },
);

export const getTrending = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

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
