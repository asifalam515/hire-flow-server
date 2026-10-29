import { prisma } from '../../config/prisma';
import { Prisma, WorkExperience, Education } from '@prisma/client';

export const getCandidateProfileByUserId = async (userId: string) => {
  return prisma.candidateProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        },
      },
      workExperiences: {
        orderBy: { startDate: 'desc' },
      },
      educations: {
        orderBy: { startDate: 'desc' },
      },
    },
  });
};

export const createOrUpdateCandidateProfile = async (
  userId: string,
  data: Prisma.CandidateProfileUpdateInput
) => {
  return prisma.candidateProfile.upsert({
    where: { userId },
    update: data,
    create: {
      ...(data as Prisma.CandidateProfileUncheckedCreateInput),
      userId,
    },
  });
};

export const createWorkExperience = async (data: Omit<WorkExperience, 'id'>) => {
  return prisma.workExperience.create({
    data,
  });
};

export const updateWorkExperience = async (id: string, candidateProfileId: string, data: Partial<WorkExperience>) => {
  return prisma.workExperience.update({
    where: { id, candidateProfileId },
    data,
  });
};

export const deleteWorkExperience = async (id: string, candidateProfileId: string) => {
  return prisma.workExperience.delete({
    where: { id, candidateProfileId },
  });
};

export const createEducation = async (data: Omit<Education, 'id'>) => {
  return prisma.education.create({
    data,
  });
};

export const updateEducation = async (id: string, candidateProfileId: string, data: Partial<Education>) => {
  return prisma.education.update({
    where: { id, candidateProfileId },
    data,
  });
};

export const deleteEducation = async (id: string, candidateProfileId: string) => {
  return prisma.education.delete({
    where: { id, candidateProfileId },
  });
};

export const updateCandidateUserRecord = async (userId: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const findCandidateApplicationsRecord = async (candidateId: string, status?: any) => {
  return prisma.application.findMany({
    where: {
      candidateId,
      ...(status && { status }),
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: { appliedAt: 'desc' },
  });
};

export const findCandidateFollowedCompaniesRecord = async (userId: string) => {
  return prisma.followedCompany.findMany({
    where: { userId },
    include: {
      company: {
        include: {
          _count: {
            select: { jobs: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createFollowedCompanyRecord = async (userId: string, companyId: string) => {
  return prisma.followedCompany.create({
    data: { userId, companyId },
  });
};

export const deleteFollowedCompanyRecord = async (userId: string, companyId: string) => {
  return prisma.followedCompany.delete({
    where: {
      userId_companyId: { userId, companyId },
    },
  });
};

export const updateCandidateProfileParsedTextAndEmbedding = async (
  profileId: string,
  parsedText: string,
  embeddingValues?: number[] | null
) => {
  if (embeddingValues && embeddingValues.length > 0) {
    try {
      const vectorStr = `[${embeddingValues.join(',')}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE candidate_profiles SET embedding = $1::vector, "parsedText" = $2 WHERE id = $3`,
        vectorStr,
        parsedText,
        profileId
      );
      return;
    } catch (err) {
      console.warn('Failed to update raw pgvector column, updating parsedText only:', err);
    }
  }

  await prisma.candidateProfile.update({
    where: { id: profileId },
    data: { parsedText },
  });
};

