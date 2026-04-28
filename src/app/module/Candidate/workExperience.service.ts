import { prisma } from "@lib/prisma";

interface CreateWorkExperienceInput {
  company: string;
  title: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date;
  current?: boolean;
  description?: string;
  skills?: string[];
}

interface UpdateWorkExperienceInput {
  company?: string;
  title?: string;
  location?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  current?: boolean;
  description?: string;
  skills?: string[];
}

const createWorkExperience = async (
  profileId: string,
  data: CreateWorkExperienceInput,
) => {
  const experience = await prisma.workExperience.create({
    data: {
      profileId,
      company: data.company,
      title: data.title,
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current ?? false,
      description: data.description,
      skills: data.skills || [],
    },
  });

  return experience;
};

const getWorkExperienceByProfileId = async (profileId: string) => {
  const experiences = await prisma.workExperience.findMany({
    where: { profileId },
    orderBy: { startDate: "desc" },
  });

  return experiences;
};

const getWorkExperienceById = async (id: string) => {
  const experience = await prisma.workExperience.findUnique({
    where: { id },
  });

  return experience;
};

const updateWorkExperience = async (
  id: string,
  data: UpdateWorkExperienceInput,
) => {
  const updateData: any = {};

  if (data.company !== undefined) updateData.company = data.company;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.startDate !== undefined)
    updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.current !== undefined) updateData.current = data.current;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.skills !== undefined) updateData.skills = data.skills;

  const experience = await prisma.workExperience.update({
    where: { id },
    data: updateData,
  });

  return experience;
};

const deleteWorkExperience = async (id: string) => {
  await prisma.workExperience.delete({
    where: { id },
  });
};

export const workExperienceService = {
  createWorkExperience,
  getWorkExperienceByProfileId,
  getWorkExperienceById,
  updateWorkExperience,
  deleteWorkExperience,
};
