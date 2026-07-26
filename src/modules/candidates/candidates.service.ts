import * as candidateRepo from './candidates.repository';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';

export const getResume = async (userId: string) => {
  let profile = await candidateRepo.getCandidateProfileByUserId(userId);
  if (!profile) {
    // Create empty profile if not exists
    profile = await candidateRepo.createOrUpdateCandidateProfile(userId, {});
    profile = await candidateRepo.getCandidateProfileByUserId(userId);
  }
  return profile;
};

export const updateResumeProfile = async (userId: string, data: any) => {
  // If firstName, lastName, or avatarUrl are provided, update the User model
  if (data.firstName !== undefined || data.lastName !== undefined || data.avatarUrl !== undefined) {
    const userUpdate: any = {};
    if (data.firstName !== undefined) userUpdate.firstName = data.firstName;
    if (data.lastName !== undefined) userUpdate.lastName = data.lastName;
    if (data.avatarUrl !== undefined) userUpdate.avatarUrl = data.avatarUrl;

    await prisma.user.update({
      where: { id: userId },
      data: userUpdate,
    });
  }

  // Extract Profile Data
  const profileData = { ...data };
  delete profileData.firstName;
  delete profileData.lastName;
  delete profileData.avatarUrl;

  // Ensure JSON fields are handled correctly (Prisma handles arrays and JSONs directly, but if data is undefined we shouldn't pass it)
  // Clean undefined properties
  Object.keys(profileData).forEach(key => profileData[key] === undefined && delete profileData[key]);

  return candidateRepo.createOrUpdateCandidateProfile(userId, profileData);
};

export const addWorkExperience = async (userId: string, data: any) => {
  const profile = await getResume(userId);
  return candidateRepo.createWorkExperience({
    ...data,
    candidateProfileId: profile!.id,
  });
};

export const updateWorkExperience = async (userId: string, experienceId: string, data: any) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.updateWorkExperience(experienceId, profile!.id, data);
  } catch (error) {
    throw new AppError(404, 'Work experience not found or unauthorized');
  }
};

export const deleteWorkExperience = async (userId: string, experienceId: string) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.deleteWorkExperience(experienceId, profile!.id);
  } catch (error) {
    throw new AppError(404, 'Work experience not found or unauthorized');
  }
};

export const addEducation = async (userId: string, data: any) => {
  const profile = await getResume(userId);
  return candidateRepo.createEducation({
    ...data,
    candidateProfileId: profile!.id,
  });
};

export const updateEducation = async (userId: string, educationId: string, data: any) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.updateEducation(educationId, profile!.id, data);
  } catch (error) {
    throw new AppError(404, 'Education not found or unauthorized');
  }
};

export const deleteEducation = async (userId: string, educationId: string) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.deleteEducation(educationId, profile!.id);
  } catch (error) {
    throw new AppError(404, 'Education not found or unauthorized');
  }
};
