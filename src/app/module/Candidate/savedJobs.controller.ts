import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { savedJobsService } from "./savedJobs.service";

const saveJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const saved = await savedJobsService.saveJobInDb(
    req.user?.id as string,
    jobId,
  );
  res.status(201).json({ success: true, data: saved });
});

const removeSavedJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const result = await savedJobsService.removeSavedJobFromDb(
    req.user?.id as string,
    jobId,
  );
  res.status(200).json({ success: true, data: result });
});

const listSavedJobs = asyncHandler(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string, 10) || 1;
  const limit = Number.parseInt(req.query.limit as string, 10) || 20;
  const result = await savedJobsService.listSavedJobsFromDb(
    req.user?.id as string,
    page,
    limit,
  );
  res
    .status(200)
    .json({ success: true, data: result.data, pagination: result.pagination });
});

export const savedJobsController = { saveJob, removeSavedJob, listSavedJobs };
