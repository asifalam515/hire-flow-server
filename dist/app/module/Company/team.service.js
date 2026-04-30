import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";
import { sendMail } from "@lib/mailer";
import crypto from "crypto";
// Helper: check if a user is an owner of the company
const isCompanyOwner = async (companyId, userId) => {
    const member = await prisma.companyMember.findFirst({
        where: { companyId, userId, isOwner: true },
    });
    return !!member;
};
// Helper: check if a user is a member of the company
const isCompanyMember = async (companyId, userId) => {
    const member = await prisma.companyMember.findFirst({
        where: { companyId, userId },
    });
    return !!member;
};
export const inviteMember = async (companyId, inviterUserId, email, role = "MEMBER") => {
    // Check if inviter is owner
    const isOwner = await isCompanyOwner(companyId, inviterUserId);
    if (!isOwner) {
        throw new AppError("Only company owners can invite members", 403);
    }
    // Check if target user is already a member
    const targetUser = await prisma.user.findUnique({ where: { email } });
    if (targetUser) {
        const existingMember = await isCompanyMember(companyId, targetUser.id);
        if (existingMember) {
            throw new AppError("User is already a member of this company", 400);
        }
    }
    // Generate token and expiry (48 hours)
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    const invite = await prisma.companyInvite.create({
        data: {
            companyId,
            email,
            token,
            role,
            expiresAt,
        },
        include: {
            company: {
                select: { name: true },
            },
        },
    });
    const clientUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const inviteLink = `${clientUrl}/join?token=${token}`;
    await sendMail(email, `Invitation to join ${invite.company.name} on HireFlow`, `<p>You have been invited to join <strong>${invite.company.name}</strong> as a ${role}.</p>
     <p>Please click the link below to accept the invitation. This link expires in 48 hours.</p>
     <a href="${inviteLink}">Accept Invitation</a>`);
    return invite;
};
export const acceptInvite = async (token, userId) => {
    const invite = await prisma.companyInvite.findUnique({
        where: { token },
    });
    if (!invite) {
        throw new AppError("Invalid invitation token", 404);
    }
    if (invite.acceptedAt) {
        throw new AppError("Invitation has already been accepted", 400);
    }
    if (new Date() > invite.expiresAt) {
        throw new AppError("Invitation has expired", 400);
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    // Optional: enforce that only the invited email can accept, or allow any logged-in user with the link
    if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
        throw new AppError("This invitation was sent to a different email address", 403);
    }
    const existingMember = await isCompanyMember(invite.companyId, userId);
    if (existingMember) {
        throw new AppError("You are already a member of this company", 400);
    }
    return await prisma.$transaction(async (tx) => {
        // Mark invite as accepted
        await tx.companyInvite.update({
            where: { id: invite.id },
            data: { acceptedAt: new Date() },
        });
        // Create company member
        const member = await tx.companyMember.create({
            data: {
                companyId: invite.companyId,
                userId: userId,
                isOwner: invite.role === "OWNER",
            },
        });
        // Upgrade user role if they are CANDIDATE
        if (user.role === "CANDIDATE") {
            await tx.user.update({
                where: { id: userId },
                data: { role: "RECRUITER" },
            });
        }
        return member;
    });
};
export const getMembers = async (companyId, requesterId) => {
    const isMember = await isCompanyMember(companyId, requesterId);
    const user = await prisma.user.findUnique({ where: { id: requesterId } });
    if (!isMember && user?.role !== "ADMIN") {
        throw new AppError("You do not have access to this company's members", 403);
    }
    const members = await prisma.companyMember.findMany({
        where: { companyId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    candidateProfile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            joinedAt: "asc",
        },
    });
    return members;
};
export const updateMemberRole = async (companyId, targetUserId, isOwner, requesterId) => {
    const isRequesterOwner = await isCompanyOwner(companyId, requesterId);
    if (!isRequesterOwner) {
        throw new AppError("Only company owners can update member roles", 403);
    }
    const targetMember = await prisma.companyMember.findFirst({
        where: { companyId, userId: targetUserId },
    });
    if (!targetMember) {
        throw new AppError("Target user is not a member of this company", 404);
    }
    // Prevent removing the last owner
    if (targetMember.isOwner && !isOwner) {
        const ownerCount = await prisma.companyMember.count({
            where: { companyId, isOwner: true },
        });
        if (ownerCount <= 1) {
            throw new AppError("Cannot demote the last owner of the company", 400);
        }
    }
    const updatedMember = await prisma.companyMember.update({
        where: { id: targetMember.id },
        data: { isOwner },
    });
    return updatedMember;
};
export const removeMember = async (companyId, targetUserId, requesterId) => {
    const targetMember = await prisma.companyMember.findFirst({
        where: { companyId, userId: targetUserId },
    });
    if (!targetMember) {
        throw new AppError("Target user is not a member of this company", 404);
    }
    // A member can remove themselves, or an owner can remove anyone.
    if (requesterId !== targetUserId) {
        const isRequesterOwner = await isCompanyOwner(companyId, requesterId);
        if (!isRequesterOwner) {
            throw new AppError("Only company owners can remove other members", 403);
        }
    }
    // Prevent removing the last owner
    if (targetMember.isOwner) {
        const ownerCount = await prisma.companyMember.count({
            where: { companyId, isOwner: true },
        });
        if (ownerCount <= 1) {
            throw new AppError("Cannot remove the last owner of the company", 400);
        }
    }
    await prisma.companyMember.delete({
        where: { id: targetMember.id },
    });
    return { success: true };
};
export const teamService = {
    inviteMember,
    acceptInvite,
    getMembers,
    updateMemberRole,
    removeMember,
};
//# sourceMappingURL=team.service.js.map