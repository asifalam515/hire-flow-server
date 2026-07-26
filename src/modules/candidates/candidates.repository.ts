import { prisma } from '../../config/prisma';
import { CandidateProfile, WorkExperience, Education } from '@prisma/client';

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
  data: Partial<CandidateProfile>
) => {
  return prisma.candidateProfile.upsert({
    where: { userId },
    update: data,
    create: {
      ...data,
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
