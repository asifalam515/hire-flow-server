import type { ApplicationStage } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { applicationService } from "./application.service";

export const applyToJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const { resumeUrl, resumeFileName, coverLetter, source, referralCode } =
    req.body;

  if (!jobId) {
    throw new AppError("Job id is required", 400);
  }

  if (!resumeUrl) {
    throw new AppError("resumeUrl is required", 400);
  }

  const application = await applicationService.submitApplicationToDb(
    jobId,
    req.user?.id as string,
    {
      resumeUrl,
      resumeFileName,
      coverLetter,
      source,
      referralCode,
    },
  );

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    data: application,
  });
});

export const getMyApplications = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 10;

    const result = await applicationService.getMyApplicationsFromDb(
      req.user?.id as string,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const getApplicantsForJob = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 10;

    if (!jobId) {
      throw new AppError("Job id is required", 400);
    }

    const result = await applicationService.getApplicantsForJobFromDb(
      jobId,
      req.user?.id as string,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      job: result.job,
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const moveApplicantStage = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id;
    const { stage, reason } = req.body;

    if (!applicationId) {
      throw new AppError("Application id is required", 400);
    }

    if (!stage) {
      throw new AppError("stage is required", 400);
    }

    const updated = await applicationService.moveApplicantStageInDb(
      applicationId,
      req.user?.id as string,
      {
        stage: stage as ApplicationStage,
        reason,
      },
    );

    res.status(200).json({
      success: true,
      message: "Application stage updated successfully",
      data: updated,
    });
  },
);

export const applicationController = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  moveApplicantStage,
};
