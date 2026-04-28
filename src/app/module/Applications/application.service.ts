import type { ApplicationStage } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { sendMail } from "@lib/mailer";
import { prisma } from "@lib/prisma";
import { sanitizeHTML, validateHTMLLength } from "@lib/richTextUtils";
import { emitToUser, getIO } from "@lib/socket";
import {
  sendApplicationReceivedEmail,
  sendApplicationStageUpdateEmail,
} from "./notification.service";

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
      postedById: true,
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

  // Sanitize and validate cover letter if provided
  let sanitizedCoverLetter = payload.coverLetter;
  if (sanitizedCoverLetter) {
    if (!validateHTMLLength(sanitizedCoverLetter, 5000)) {
      throw new AppError(
        "Cover letter exceeds maximum length of 5000 characters",
        400,
      );
    }
    sanitizedCoverLetter = sanitizeHTML(sanitizedCoverLetter);
  }

  const application = await prisma.application.create({
    data: {
      candidateId,
      jobId,
      resumeUrl: payload.resumeUrl,
      resumeFileName: payload.resumeFileName,
      coverLetter: sanitizedCoverLetter,
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

  // Send recruiter notification after the record is created successfully.
  try {
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      select: { name: true, email: true },
    });

    const recruiter = await prisma.user.findUnique({
      where: { id: job.postedById },
      select: { name: true, email: true },
    });

    if (recruiter?.email && candidate?.email) {
      await sendApplicationReceivedEmail(
        recruiter.email,
        recruiter.name || "Recruiter",
        {
          candidateName: candidate.name || "Candidate",
          candidateEmail: candidate.email,
          jobTitle: job.title,
          companyName: job.company.name,
        },
      );
    }
  } catch (err) {
    console.error("Failed to send application received notification", err);
  }

  // Emit real-time notification to the recruiter
  try {
    const io = getIO();
    if (io) {
      emitToUser(job.postedById, "application:new", {
        jobId: job.id,
        applicationId: application.id,
        jobTitle: job.title,
        candidateName: application.candidate?.name || "Candidate",
        candidateImage: application.candidate?.image || null,
        appliedAt: application.createdAt,
      });
    }
  } catch (err) {
    // ignore socket errors
  }

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

  // Send notification email to candidate
  try {
    const subject = `Application update: ${updated.job.title} — ${updated.stage}`;
    const html = `<p>Hi ${updated.candidate.name},</p>
      <p>Your application for <strong>${updated.job.title}</strong> is now in <strong>${updated.stage}</strong> stage.</p>
      <p>Regards,<br/>${updated.job.company.name}</p>`;

    if (updated.candidate.email) {
      await sendMail(updated.candidate.email, subject, html);
    }
  } catch (err) {
    // swallow mail errors but log
    // eslint-disable-next-line no-console
    console.error("Failed to send application stage email", err);
  }

  // Send stage-specific notification emails
  try {
    if (updated.candidate.email) {
      await sendApplicationStageUpdateEmail(
        updated.candidate.email,
        updated.candidate.name || "Candidate",
        {
          candidateName: updated.candidate.name || "Candidate",
          candidateEmail: updated.candidate.email,
          jobTitle: updated.job.title,
          companyName: updated.job.company.name,
          stage: payload.stage,
        },
      );
    }
  } catch (err) {
    console.error("Failed to send stage update email", err);
  }

  // Emit socket.io event for realtime updates (if server has io)
  try {
    const io = getIO();
    if (io) {
      // Emit to candidate room
      emitToUser(updated.candidate.id, "application:stage_updated", {
        applicationId: updated.id,
        jobId: updated.job.id,
        stage: updated.stage,
        previousStage: existing.stage,
        companyName: updated.job.company.name,
      });

      // Emit to recruiter who made the change
      emitToUser(recruiterId, "applicant:stage_updated", {
        applicationId: updated.id,
        candidateId: updated.candidate.id,
        stage: updated.stage,
      });
    }
  } catch (err) {
    // ignore socket errors
  }

  return updated;
};

export const bulkMoveApplicantStagesInDb = async (
  applicationIds: string[],
  recruiterId: string,
  stage: ApplicationStage,
  reason?: string,
) => {
  const admin = await isUserAdmin(recruiterId);
  const results = [];

  for (const id of applicationIds) {
    try {
      const updated = await moveApplicantStageInDb(id, recruiterId, {
        stage,
        reason,
      });
      results.push({ id, status: "success", data: updated });
    } catch (error: any) {
      results.push({ id, status: "error", message: error.message });
    }
  }

  return results;
};

export const exportApplicantsToCSVFromDb = async (
  jobId: string,
  recruiterId: string,
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { postedById: true },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const admin = await isUserAdmin(recruiterId);
  if (!admin && job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to export applicants for this job",
      403,
    );
  }

  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      candidate: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const csvRows = ["Name,Email,Stage,AppliedAt,Source"];
  applications.forEach((app) => {
    csvRows.push(
      `"${app.candidate.name}","${app.candidate.email}","${app.stage}","${app.createdAt.toISOString()}","${app.source}"`,
    );
  });

  return csvRows.join("\\n");
};

export const addApplicationNoteToDb = async (
  applicationId: string,
  authorId: string,
  content: string,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      job: { select: { postedById: true } },
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const admin = await isUserAdmin(authorId);
  if (!admin && application.job.postedById !== authorId) {
    throw new AppError(
      "You do not have permission to add notes to this application",
      403,
    );
  }

  const note = await prisma.applicationNote.create({
    data: {
      applicationId,
      authorId,
      content,
    },
  });

  return note;
};

export const getApplicationNotesFromDb = async (
  applicationId: string,
  recruiterId: string,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      job: { select: { postedById: true } },
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const admin = await isUserAdmin(recruiterId);
  if (!admin && application.job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to view notes for this application",
      403,
    );
  }

  const notes = await prisma.applicationNote.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return notes;
};

export const applicationService = {
  submitApplicationToDb,
  getMyApplicationsFromDb,
  getApplicantsForJobFromDb,
  moveApplicantStageInDb,
  bulkMoveApplicantStagesInDb,
  exportApplicantsToCSVFromDb,
  addApplicationNoteToDb,
  getApplicationNotesFromDb,
};

