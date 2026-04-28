import type { ApplicationStage } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";

interface SubmitApplicationInput {
  resumeUrl: string;
  resumeFileName?: string;
  coverLetter?: string;
  source?: string;
  referralCode?: string;
}

interface MoveApplicationStageInput {
  stage: ApplicationStage;
  reason?: string;
}

const isUserAdmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
};

const submitApplicationToDb = async (
  jobId: string,
  candidateId: string,
  payload: SubmitApplicationInput,
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      status: true,
      expiresAt: true,
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.status !== "PUBLISHED") {
    throw new AppError("This job is not accepting applications", 400);
  }

  if (job.expiresAt && job.expiresAt < new Date()) {
    throw new AppError("This job posting has expired", 400);
  }

  const existing = await prisma.application.findUnique({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId,
      },
    },
    select: { id: true },
  });

  if (existing) {
    throw new AppError("You have already applied for this job", 409);
  }

  const application = await prisma.application.create({
    data: {
      candidateId,
      jobId,
      resumeUrl: payload.resumeUrl,
      resumeFileName: payload.resumeFileName,
      coverLetter: payload.coverLetter,
      source: payload.source ?? "DIRECT",
      referralCode: payload.referralCode,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
        },
      },
    },
  });

  await prisma.job.update({
    where: { id: jobId },
    data: {
      applicationCount: {
        increment: 1,
      },
    },
  });

  return application;
};

const getMyApplicationsFromDb = async (
  candidateId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const where = { candidateId };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            experienceLevel: true,
            location: true,
            isRemote: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            salaryPeriod: true,
            status: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    data: applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getApplicantsForJobFromDb = async (
  jobId: string,
  recruiterId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      postedById: true,
      title: true,
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const admin = await isUserAdmin(recruiterId);
  if (!admin && job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to view applicants for this job",
      403,
    );
  }

  const skip = (page - 1) * limit;
  const where = { jobId };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    job,
    data: applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const moveApplicantStageInDb = async (
  applicationId: string,
  recruiterId: string,
  payload: MoveApplicationStageInput,
) => {
  const existing = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          id: true,
          postedById: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!existing) {
    throw new AppError("Application not found", 404);
  }

  const admin = await isUserAdmin(recruiterId);
  if (!admin && existing.job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to update this application",
      403,
    );
  }

  if (existing.stage === payload.stage) {
    throw new AppError(`Application is already in ${payload.stage} stage`, 400);
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      stage: payload.stage,
    },
    include: {
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      applicationId,
      changedById: recruiterId,
      fromStage: existing.stage,
      toStage: payload.stage,
      reason: payload.reason,
    },
  });

  return updated;
};

export const applicationService = {
  submitApplicationToDb,
  getMyApplicationsFromDb,
  getApplicantsForJobFromDb,
  moveApplicantStageInDb,
};
