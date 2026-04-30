import type { FileType } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import cloudinary from "@lib/cloudinary";
import { prisma } from "@lib/prisma";

export const generateSignedUrl = (
  folder: string,
  allowedFormats: string[],
  maxBytes: number,
) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      allowed_formats: allowedFormats,
    },
    cloudinary.config().api_secret as string,
  );

  return {
    signature,
    timestamp,
    cloudName: cloudinary.config().cloud_name,
    apiKey: cloudinary.config().api_key,
    folder,
    allowedFormats,
    maxBytes,
  };
};

export const confirmResumeUpload = async (
  userId: string,
  data: {
    publicId: string;
    secureUrl: string;
    fileName: string;
    fileSize: number;
  },
) => {
  const { publicId, secureUrl, fileName, fileSize } = data;

  return await prisma.$transaction(async (tx) => {
    const userFile = await tx.userFile.create({
      data: {
        userId,
        publicId,
        secureUrl,
        fileName,
        fileSize,
        type: "RESUME" as FileType,
      },
    });

    const candidateProfile = await tx.candidateProfile.findUnique({
      where: { userId },
    });

    if (candidateProfile) {
      await tx.candidateProfile.update({
        where: { userId },
        data: {
          resumeUrl: secureUrl,
          resumeFileName: fileName,
        },
      });
    }

    return userFile;
  });
};

export const confirmAvatarUpload = async (
  userId: string,
  data: {
    publicId: string;
    secureUrl: string;
    fileName: string;
    fileSize: number;
  },
) => {
  const { publicId, secureUrl, fileName, fileSize } = data;

  return await prisma.$transaction(async (tx) => {
    // Check if there is an existing avatar
    const existingAvatar = await tx.userFile.findFirst({
      where: { userId, type: "AVATAR" as FileType },
    });

    if (existingAvatar) {
      try {
        await cloudinary.uploader.destroy(existingAvatar.publicId);
      } catch (error) {
        console.error("Failed to delete old avatar from Cloudinary:", error);
      }

      await tx.userFile.delete({
        where: { id: existingAvatar.id },
      });
    }

    const userFile = await tx.userFile.create({
      data: {
        userId,
        publicId,
        secureUrl,
        fileName,
        fileSize,
        type: "AVATAR" as FileType,
      },
    });

    const candidateProfile = await tx.candidateProfile.findUnique({
      where: { userId },
    });

    if (candidateProfile) {
      await tx.candidateProfile.update({
        where: { userId },
        data: {
          avatarUrl: secureUrl,
        },
      });
    }

    // Also update User image
    await tx.user.update({
      where: { id: userId },
      data: { image: secureUrl },
    });

    return userFile;
  });
};

export const deleteFile = async (userId: string, publicId: string) => {
  const file = await prisma.userFile.findFirst({
    where: { userId, publicId },
  });

  if (!file) {
    throw new AppError("File not found or unauthorized", 404);
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(publicId);

  // Delete from DB
  await prisma.userFile.delete({
    where: { id: file.id },
  });

  // Nullify URLs in CandidateProfile if they match
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });
  if (profile) {
    if (profile.resumeUrl === file.secureUrl) {
      await prisma.candidateProfile.update({
        where: { userId },
        data: { resumeUrl: null, resumeFileName: null },
      });
    } else if (profile.avatarUrl === file.secureUrl) {
      await prisma.candidateProfile.update({
        where: { userId },
        data: { avatarUrl: null },
      });
      // also user image
      await prisma.user.update({
        where: { id: userId },
        data: { image: null },
      });
    }
  }

  return file;
};

export const uploadsService = {
  generateSignedUrl,
  confirmResumeUpload,
  confirmAvatarUpload,
  deleteFile,
};
