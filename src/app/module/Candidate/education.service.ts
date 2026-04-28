import { prisma } from "@lib/prisma";

interface CreateEducationInput {
  institution: string;
  degree: string;
  field: string;
  startDate: string | Date;
  endDate?: string | Date;
  current?: boolean;
  gpa?: number;
}

interface UpdateEducationInput {
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  current?: boolean;
  gpa?: number;
}

const createEducation = async (
  profileId: string,
  data: CreateEducationInput,
) => {
  const education = await prisma.education.create({
    data: {
      profileId,
      institution: data.institution,
      degree: data.degree,
      field: data.field,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current ?? false,
      gpa: data.gpa,
    },
  });

  return education;
};

const getEducationByProfileId = async (profileId: string) => {
  const educations = await prisma.education.findMany({
    where: { profileId },
    orderBy: { startDate: "desc" },
  });

  return educations;
};

const getEducationById = async (id: string) => {
  const education = await prisma.education.findUnique({
    where: { id },
  });

  return education;
};

const updateEducation = async (id: string, data: UpdateEducationInput) => {
  const updateData: any = {};

  if (data.institution !== undefined) updateData.institution = data.institution;
  if (data.degree !== undefined) updateData.degree = data.degree;
  if (data.field !== undefined) updateData.field = data.field;
  if (data.startDate !== undefined)
    updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.current !== undefined) updateData.current = data.current;
  if (data.gpa !== undefined) updateData.gpa = data.gpa;

  const education = await prisma.education.update({
    where: { id },
    data: updateData,
  });

  return education;
};

const deleteEducation = async (id: string) => {
  await prisma.education.delete({
    where: { id },
  });
};

export const educationService = {
  createEducation,
  getEducationByProfileId,
  getEducationById,
  updateEducation,
  deleteEducation,
};
