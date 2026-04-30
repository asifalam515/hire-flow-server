import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { uploadsService } from "./uploads.service";

export const getResumeSignedUrl = asyncHandler(
  async (req: Request, res: Response) => {
    // Generate signed url for resumes (PDF/DOC)
    const folder = "resumes";
    const allowedFormats = ["pdf", "doc", "docx"];
    const maxBytes = 5 * 1024 * 1024; // 5MB

    const data = uploadsService.generateSignedUrl(
      folder,
      allowedFormats,
      maxBytes,
    );

    res.status(200).json({
      success: true,
      data,
    });
  },
);

export const getAvatarSignedUrl = asyncHandler(
  async (req: Request, res: Response) => {
    // Generate signed url for avatars (images)
    const folder = "avatars";
    const allowedFormats = ["jpg", "jpeg", "png", "webp"];
    const maxBytes = 2 * 1024 * 1024; // 2MB

    const data = uploadsService.generateSignedUrl(
      folder,
      allowedFormats,
      maxBytes,
    );

    res.status(200).json({
      success: true,
      data,
    });
  },
);

export const confirmResume = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id; // Assuming user is attached via authenticate middleware
    const { publicId, secureUrl, fileName, fileSize } = req.body;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    if (!publicId || !secureUrl || !fileName || !fileSize) {
      throw new AppError("Missing required file data", 400);
    }

    const result = await uploadsService.confirmResumeUpload(userId, {
      publicId,
      secureUrl,
      fileName,
      fileSize,
    });

    res.status(200).json({
      success: true,
      message: "Resume upload confirmed and saved",
      data: result,
    });
  },
);

export const confirmAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { publicId, secureUrl, fileName, fileSize } = req.body;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    if (!publicId || !secureUrl || !fileName || !fileSize) {
      throw new AppError("Missing required file data", 400);
    }

    const result = await uploadsService.confirmAvatarUpload(userId, {
      publicId,
      secureUrl,
      fileName,
      fileSize,
    });

    res.status(200).json({
      success: true,
      message: "Avatar upload confirmed and saved",
      data: result,
    });
  },
);

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const publicId = req.params.publicId;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  await uploadsService.deleteFile(userId, publicId as string);

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
  });
});

export const uploadsController = {
  getResumeSignedUrl,
  getAvatarSignedUrl,
  confirmResume,
  confirmAvatar,
  deleteFile,
};
