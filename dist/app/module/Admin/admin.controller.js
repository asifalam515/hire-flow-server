import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { adminService } from "./admin.service";
export const getUsers = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const result = await adminService.getUsersFromDb(page, limit);
    res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});
export const suspendUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { isSuspended } = req.body;
    if (typeof isSuspended !== "boolean") {
        throw new AppError("isSuspended boolean is required", 400);
    }
    const updatedUser = await adminService.toggleUserSuspensionInDb(userId, isSuspended);
    res.status(200).json({
        success: true,
        message: `User suspension status updated to ${isSuspended}`,
        data: updatedUser,
    });
});
export const assignUserRole = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    if (!role) {
        throw new AppError("role is required", 400);
    }
    const updatedUser = await adminService.assignUserRoleInDb(userId, role);
    res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        data: updatedUser,
    });
});
export const getPendingJobs = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const result = await adminService.getPendingJobsFromDb(page, limit);
    res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});
export const moderateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const { status } = req.body;
    if (!status) {
        throw new AppError("status is required", 400);
    }
    const updatedJob = await adminService.moderateJobInDb(jobId, status);
    res.status(200).json({
        success: true,
        message: `Job status updated to ${status}`,
        data: updatedJob,
    });
});
export const getPlatformAnalytics = asyncHandler(async (req, res) => {
    const analytics = await adminService.getPlatformAnalyticsFromDb();
    res.status(200).json({
        success: true,
        data: analytics,
    });
});
export const adminController = {
    getUsers,
    suspendUser,
    assignUserRole,
    getPendingJobs,
    moderateJob,
    getPlatformAnalytics,
};
//# sourceMappingURL=admin.controller.js.map