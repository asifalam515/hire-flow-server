import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { teamService } from "./team.service";
export const inviteMember = asyncHandler(async (req, res) => {
    const companyId = req.params.id;
    const { email, role } = req.body;
    const requesterId = req.user?.id;
    if (!requesterId)
        throw new AppError("Unauthorized", 401);
    if (!companyId)
        throw new AppError("Company ID is required", 400);
    if (!email)
        throw new AppError("Email is required", 400);
    const invite = await teamService.inviteMember(companyId, requesterId, email, role);
    res.status(201).json({
        success: true,
        message: "Invitation sent successfully",
        data: invite,
    });
});
export const acceptInvite = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const userId = req.user?.id;
    if (!userId)
        throw new AppError("Unauthorized", 401);
    if (!token)
        throw new AppError("Invitation token is required", 400);
    const member = await teamService.acceptInvite(token, userId);
    res.status(200).json({
        success: true,
        message: "Invitation accepted successfully",
        data: member,
    });
});
export const getMembers = asyncHandler(async (req, res) => {
    const companyId = req.params.id;
    const requesterId = req.user?.id;
    if (!requesterId)
        throw new AppError("Unauthorized", 401);
    if (!companyId)
        throw new AppError("Company ID is required", 400);
    const members = await teamService.getMembers(companyId, requesterId);
    res.status(200).json({
        success: true,
        data: members,
    });
});
export const updateMemberRole = asyncHandler(async (req, res) => {
    const companyId = req.params.id;
    const targetUserId = req.params.userId;
    const { isOwner } = req.body;
    const requesterId = req.user?.id;
    if (!requesterId)
        throw new AppError("Unauthorized", 401);
    if (!companyId || !targetUserId) {
        throw new AppError("Company ID and Target User ID are required", 400);
    }
    if (isOwner === undefined) {
        throw new AppError("isOwner is required", 400);
    }
    const member = await teamService.updateMemberRole(companyId, targetUserId, isOwner, requesterId);
    res.status(200).json({
        success: true,
        message: "Member role updated successfully",
        data: member,
    });
});
export const removeMember = asyncHandler(async (req, res) => {
    const companyId = req.params.id;
    const targetUserId = req.params.userId;
    const requesterId = req.user?.id;
    if (!requesterId)
        throw new AppError("Unauthorized", 401);
    if (!companyId || !targetUserId) {
        throw new AppError("Company ID and Target User ID are required", 400);
    }
    await teamService.removeMember(companyId, targetUserId, requesterId);
    res.status(200).json({
        success: true,
        message: "Member removed successfully",
    });
});
export const teamController = {
    inviteMember,
    acceptInvite,
    getMembers,
    updateMemberRole,
    removeMember,
};
//# sourceMappingURL=team.controller.js.map