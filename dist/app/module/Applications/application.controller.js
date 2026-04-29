import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { applicationService } from "./application.service";
export const applyToJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const { resumeUrl, resumeFileName, coverLetter, source, referralCode, useSavedResume, } = req.body;
    if (!jobId) {
        throw new AppError("Job id is required", 400);
    }
    let finalResumeUrl = resumeUrl;
    let finalResumeFileName = resumeFileName;
    if (useSavedResume) {
        // pull from candidate profile
        const profile = await (await import("@/app/module/Candidate/profile.service")).profileService.getProfileFromDb(req.user?.id);
        if (!profile?.resumeUrl) {
            throw new AppError("No saved resume found on profile", 400);
        }
        finalResumeUrl = profile.resumeUrl;
        finalResumeFileName = profile.resumeFileName;
    }
    if (!finalResumeUrl) {
        throw new AppError("resumeUrl is required", 400);
    }
    const application = await applicationService.submitApplicationToDb(jobId, req.user?.id, {
        resumeUrl: finalResumeUrl,
        resumeFileName: finalResumeFileName,
        coverLetter,
        source,
        referralCode,
    });
    res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
    });
});
export const getMyApplications = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const result = await applicationService.getMyApplicationsFromDb(req.user?.id, page, limit);
    res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});
export const getApplicantsForJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    if (!jobId) {
        throw new AppError("Job id is required", 400);
    }
    const result = await applicationService.getApplicantsForJobFromDb(jobId, req.user?.id, page, limit);
    res.status(200).json({
        success: true,
        job: result.job,
        data: result.data,
        pagination: result.pagination,
    });
});
export const moveApplicantStage = asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    const { stage, reason } = req.body;
    if (!applicationId) {
        throw new AppError("Application id is required", 400);
    }
    if (!stage) {
        throw new AppError("stage is required", 400);
    }
    const updated = await applicationService.moveApplicantStageInDb(applicationId, req.user?.id, {
        stage: stage,
        reason,
    });
    res.status(200).json({
        success: true,
        message: "Application stage updated successfully",
        data: updated,
    });
});
export const bulkMoveApplicantStages = asyncHandler(async (req, res) => {
    const { applicationIds, stage, reason } = req.body;
    if (!applicationIds || !Array.isArray(applicationIds)) {
        throw new AppError("applicationIds array is required", 400);
    }
    if (!stage) {
        throw new AppError("stage is required", 400);
    }
    const results = await applicationService.bulkMoveApplicantStagesInDb(applicationIds, req.user?.id, stage, reason);
    res.status(200).json({
        success: true,
        message: "Bulk stage update completed",
        data: results,
    });
});
export const exportApplicantsToCSV = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    if (!jobId) {
        throw new AppError("Job id is required", 400);
    }
    const csvData = await applicationService.exportApplicantsToCSVFromDb(jobId, req.user?.id);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=applicants-${jobId}.csv`);
    res.status(200).send(csvData);
});
export const addApplicationNote = asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    const { content } = req.body;
    if (!applicationId) {
        throw new AppError("Application id is required", 400);
    }
    if (!content) {
        throw new AppError("content is required", 400);
    }
    const note = await applicationService.addApplicationNoteToDb(applicationId, req.user?.id, content);
    res.status(201).json({
        success: true,
        message: "Note added successfully",
        data: note,
    });
});
export const getApplicationNotes = asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    if (!applicationId) {
        throw new AppError("Application id is required", 400);
    }
    const notes = await applicationService.getApplicationNotesFromDb(applicationId, req.user?.id);
    res.status(200).json({
        success: true,
        data: notes,
    });
});
export const applicationController = {
    applyToJob,
    getMyApplications,
    getApplicantsForJob,
    moveApplicantStage,
    bulkMoveApplicantStages,
    exportApplicantsToCSV,
    addApplicationNote,
    getApplicationNotes,
};
//# sourceMappingURL=application.controller.js.map