import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { tagsService } from "./tags.service";

export const searchSkills = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const limit = Number.parseInt(req.query.limit as string, 10) || 10;

    if (!query) {
      throw new AppError("Search query 'q' is required", 400);
    }

    const skills = await tagsService.searchSkillsFromDb(query, limit);

    res.status(200).json({
      success: true,
      data: skills,
    });
  },
);

export const getPopularSkills = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number.parseInt(req.query.limit as string, 10) || 30;

    const skills = await tagsService.getPopularSkillsFromDb(limit);

    res.status(200).json({
      success: true,
      data: skills,
    });
  },
);

export const tagsController = {
  searchSkills,
  getPopularSkills,
};
