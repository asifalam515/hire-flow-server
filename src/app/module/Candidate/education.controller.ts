import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { prisma } from "@lib/prisma";
import type { Request, Response } from "express";
import { educationService } from "./education.service";

const createEducation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Authentication required", 401);

  // Get profile for this user
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Profile not found. Create profile first.", 404);
  }

  const { institution, degree, field, startDate, endDate, current, gpa } =
    req.body;

  if (!institution || !degree || !field || !startDate) {
    throw new AppError(
      "Institution, degree, field, and startDate are required",
      400,
    );
  }

  const education = await educationService.createEducation(profile.id, {
    institution,
    degree,
    field,
    startDate,
    endDate,
    current,
    gpa,
  });

  res.status(201).json({ success: true, data: education });
});

const getMyEducations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Authentication required", 401);

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  const educations = await educationService.getEducationByProfileId(profile.id);

  res.status(200).json({ success: true, data: educations });
});

const updateEducation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) throw new AppError("Authentication required", 401);
  if (!id) throw new AppError("Education ID required", 400);

  // Verify ownership
  const education = await educationService.getEducationById(id);
  if (!education) {
    throw new AppError("Education not found", 404);
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!profile || education.profileId !== profile.id) {
    throw new AppError("You do not have permission to update this", 403);
  }

  const updated = await educationService.updateEducation(id, req.body);
  res.status(200).json({ success: true, data: updated });
});

const deleteEducation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) throw new AppError("Authentication required", 401);
  if (!id) throw new AppError("Education ID required", 400);

  // Verify ownership
  const education = await educationService.getEducationById(id);
  if (!education) {
    throw new AppError("Education not found", 404);
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!profile || education.profileId !== profile.id) {
    throw new AppError("You do not have permission to delete this", 403);
  }

  await educationService.deleteEducation(id);
  res.status(200).json({ success: true, message: "Education deleted" });
});

export const educationController = {
  createEducation,
  getMyEducations,
  updateEducation,
  deleteEducation,
};
