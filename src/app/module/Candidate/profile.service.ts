import { prisma } from "@lib/prisma";

interface UpsertProfileInput {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  country?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  skills?: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  salaryCurrency?: string;
  openToWork?: boolean;
  jobAlerts?: boolean;
  applicationUpdates?: boolean;
  promotionalEmails?: boolean;
}

const getProfileFromDb = async (userId: string) => {
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  return profile;
};

const upsertProfileInDb = async (userId: string, data: UpsertProfileInput) => {
  const existing = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    const updated = await prisma.candidateProfile.update({
      where: { userId },
      data,
    });
    return updated;
  }

  const created = await prisma.candidateProfile.create({
    data: {
      userId,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      avatarUrl: data.avatarUrl,
      headline: data.headline,
      bio: data.bio,
      location: data.location,
      country: data.country,
      phone: data.phone,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl,
      resumeUrl: data.resumeUrl,
      resumeFileName: data.resumeFileName,
      skills: data.skills || [],
      expectedSalaryMin: data.expectedSalaryMin,
      expectedSalaryMax: data.expectedSalaryMax,
      salaryCurrency: data.salaryCurrency,
      openToWork: data.openToWork,
      jobAlerts: data.jobAlerts,
      applicationUpdates: data.applicationUpdates,
      promotionalEmails: data.promotionalEmails,
    },
  });

  return created;
};

export const profileService = {
  getProfileFromDb,
  upsertProfileInDb,
};
