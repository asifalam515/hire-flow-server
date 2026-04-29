import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { interviewService } from "./interview.service";
const scheduleInterview = asyncHandler(async (req, res) => {
    const recruiterId = req.user?.id;
    if (!recruiterId)
        throw new AppError("Authentication required", 401);
    const { applicationId } = req.params;
    if (!applicationId)
        throw new AppError("Application ID required", 400);
    const { type, scheduledAt, durationMins, location, meetingUrl, notes } = req.body;
    if (!type || !scheduledAt) {
        throw new AppError("Interview type and scheduled time are required", 400);
    }
    const interview = await interviewService.scheduleInterview(applicationId, recruiterId, {
        type,
        scheduledAt: new Date(scheduledAt),
        durationMins,
        location,
        meetingUrl,
        notes,
    });
    res.status(201).json({ success: true, data: interview });
});
export const interviewController = {
    scheduleInterview,
};
//# sourceMappingURL=interview.controller.js.map