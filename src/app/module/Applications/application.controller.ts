import type { ApplicationStage } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { applicationService } from "./application.service";

export const applyToJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id as string;
  const {
    resumeUrl,
    resumeFileName,
    coverLetter,
    source,
    referralCode,
    useSavedResume,
    answers,
  } = req.body;

  if (!jobId) {
    throw new AppError("Job id is required", 400);
  }

  let finalResumeUrl = resumeUrl;
  let finalResumeFileName = resumeFileName;

  if (useSavedResume) {
    // pull from candidate profile
    const profile = await (
      await import("@/app/module/Candidate/profile.service")
    ).profileService.getProfileFromDb(req.user?.id as string);
    if (!profile?.resumeUrl) {
      throw new AppError("No saved resume found on profile", 400);
    }
    finalResumeUrl = profile.resumeUrl;
    finalResumeFileName = profile.resumeFileName;
  }

  if (!finalResumeUrl) {
    throw new AppError("resumeUrl is required", 400);
  }

  const application = await applicationService.submitApplicationToDb(
    jobId,
    req.user?.id as string,
    {
      resumeUrl: finalResumeUrl,
      ...(finalResumeFileName && { resumeFileName: finalResumeFileName }),
      ...(coverLetter && { coverLetter }),
      ...(source && { source }),
      ...(referralCode && { referralCode }),
      ...(answers && { answers }),
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
    const jobId = req.params.id as string;
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
    const applicationId = req.params.id as string;
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

export const bulkMoveApplicantStages = asyncHandler(
  async (req: Request, res: Response) => {
    const { applicationIds, stage, reason } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds)) {
      throw new AppError("applicationIds array is required", 400);
    }

    if (!stage) {
      throw new AppError("stage is required", 400);
    }

    const results = await applicationService.bulkMoveApplicantStagesInDb(
      applicationIds,
      req.user?.id as string,
      stage as ApplicationStage,
      reason,
    );

    res.status(200).json({
      success: true,
      message: "Bulk stage update completed",
      data: results,
    });
  },
);

export const exportApplicantsToCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id as string;

    if (!jobId) {
      throw new AppError("Job id is required", 400);
    }

    const csvData = await applicationService.exportApplicantsToCSVFromDb(
      jobId,
      req.user?.id as string,
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=applicants-${jobId}.csv`,
    );
    res.status(200).send(csvData);
  },
);

export const addApplicationNote = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id as string;
    const { content } = req.body;

    if (!applicationId) {
      throw new AppError("Application id is required", 400);
    }

    if (!content) {
      throw new AppError("content is required", 400);
    }

    const note = await applicationService.addApplicationNoteToDb(
      applicationId,
      req.user?.id as string,
      content,
    );

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: note,
    });
  },
);

export const getApplicationNotes = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id as string;

    if (!applicationId) {
      throw new AppError("Application id is required", 400);
    }

    const notes = await applicationService.getApplicationNotesFromDb(
      applicationId,
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      data: notes,
    });
  },
);

export const getApplicationTimeline = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id as string;
    if (!applicationId) throw new AppError("Application id is required", 400);

    const timeline = await applicationService.getApplicationTimelineFromDb(
      applicationId,
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      data: timeline,
    });
  },
);

export const withdrawApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id as string;
    if (!applicationId) throw new AppError("Application id is required", 400);

    const updated = await applicationService.withdrawApplicationFromDb(
      applicationId,
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: updated,
    });
  },
);

export const getKanbanBoard = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id as string;
    if (!jobId) throw new AppError("Job id is required", 400);

    const kanban = await applicationService.getKanbanBoardFromDb(
      jobId,
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      data: kanban,
    });
  },
);

export const updateApplicationLabels = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id as string;
    const { labels } = req.body;

    if (!applicationId) throw new AppError("Application id is required", 400);
    if (!Array.isArray(labels))
      throw new AppError("labels array is required", 400);

    const updated = await applicationService.updateApplicationLabelsInDb(
      applicationId,
      req.user?.id as string,
      labels,
    );

    res.status(200).json({
      success: true,
      message: "Labels updated successfully",
      data: updated,
    });
  },
);

export const addApplicationLabel = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id as string;
    const { label } = req.body;

    if (!applicationId) throw new AppError("Application id is required", 400);
    if (!label) throw new AppError("label is required", 400);

    const updated = await applicationService.addLabelToApplicationInDb(
      applicationId,
      label,
      req.user?.id as string,
    );

    res
      .status(200)
      .json({ success: true, message: "Label added", data: updated });
  },
);

export const removeApplicationLabel = asyncHandler(
  async (req: Request, res: Response) => {
    const applicationId = req.params.id as string;
    const label = req.params.label as string;

    if (!applicationId) throw new AppError("Application id is required", 400);
    if (!label) throw new AppError("label is required", 400);

    const updated = await applicationService.removeLabelFromApplicationInDb(
      applicationId,
      label,
      req.user?.id as string,
    );

    res
      .status(200)
      .json({ success: true, message: "Label removed", data: updated });
  },
);

export const applicationController = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  moveApplicantStage,
  bulkMoveApplicantStages,
  exportApplicantsToCSV,
  addApplicationNote,
  getApplicationNotes,
  getApplicationTimeline,
  withdrawApplication,
  getKanbanBoard,
  updateApplicationLabels,
  addApplicationLabel,
  removeApplicationLabel,
};
