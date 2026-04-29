import { asyncHandler } from "@lib/asyncHandler";
import { savedJobsService } from "./savedJobs.service";
const saveJob = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId;
    const saved = await savedJobsService.saveJobInDb(req.user?.id, jobId);
    res.status(201).json({ success: true, data: saved });
});
const removeSavedJob = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId;
    const result = await savedJobsService.removeSavedJobFromDb(req.user?.id, jobId);
    res.status(200).json({ success: true, data: result });
});
const listSavedJobs = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const result = await savedJobsService.listSavedJobsFromDb(req.user?.id, page, limit);
    res
        .status(200)
        .json({ success: true, data: result.data, pagination: result.pagination });
});
export const savedJobsController = { saveJob, removeSavedJob, listSavedJobs };
//# sourceMappingURL=savedJobs.controller.js.map