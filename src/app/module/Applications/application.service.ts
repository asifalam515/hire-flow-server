import type { ApplicationStage } from "@/generated/prisma/enums";
import notificationsService from "@/modules/notifications/notifications.service";
import { AppError } from "@lib/appError";
import { sendStageChangeEmail } from "@lib/mailer";
import { prisma } from "@lib/prisma";
import { sanitizeHTML, validateHTMLLength } from "@lib/richTextUtils";
import { emitToUser, getIO } from "@lib/socket";
import { sendApplicationReceivedEmail } from "./notification.service";

interface SubmitApplicationInput {
  resumeUrl: string;
  resumeFileName?: string;
  coverLetter?: string;
  source?: string;
  referralCode?: string;
  answers?: { questionId: string; answer: string }[];
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
      ...(payload.resumeFileName && { resumeFileName: payload.resumeFileName }),
      ...(sanitizedCoverLetter && { coverLetter: sanitizedCoverLetter }),
      source: payload.source ?? "DIRECT",
      ...(payload.referralCode && { referralCode: payload.referralCode }),
      ...(payload.answers && {
        screeningAnswers: {
          create: payload.answers.map((a) => ({
            questionId: a.questionId,
            answer: a.answer,
          })),
        },
      }),
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
              logoUrl: true,
            },
          },
        },
      },
      candidate: {
        select: {
          id: true,
          name: true,
          image: true,
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

  // Create DB notifications for candidate and recruiter
  try {
    // Candidate notification
    await notificationsService.createNotification(
      updated.candidate.id,
      "STAGE_UPDATED",
      `Application updated — ${updated.job.title}`,
      `Your application for ${updated.job.title} is now ${updated.stage}`,
      {
        applicationId: updated.id,
        jobId: updated.job.id,
        stage: updated.stage,
      },
    );

    // Recruiter notification (who performed the change already gets socket event)
    await notificationsService.createNotification(
      recruiterId,
      "STAGE_UPDATED",
      `Applicant updated — ${updated.job.title}`,
      `${updated.candidate.name || "Candidate"} moved to ${updated.stage}`,
      {
        applicationId: updated.id,
        candidateId: updated.candidate.id,
        stage: updated.stage,
      },
    );
  } catch (err) {
    // ignore notification errors
  }

  // Create DB notification for recruiter (will emit notification:new)
  try {
    await notificationsService.createNotification(
      job.postedById,
      "APPLICATION_RECEIVED",
      `New application: ${job.title}`,
      `${application.candidate?.name || "Candidate"} applied for ${job.title}`,
      {
        jobId: job.id,
        applicationId: application.id,
      },
    );
  } catch (err) {
    // ignore notification errors
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
      ...(payload.reason && { reason: payload.reason }),
    },
  });

  // Send templated stage-change email (company-level template fallback)
  try {
    if (updated.candidate.email) {
      await sendStageChangeEmail(
        updated.job.company.id,
        updated.candidate.email,
        {
          candidateName: updated.candidate.name || "Candidate",
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
        ...(reason && { reason }),
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

export const getApplicationTimelineFromDb = async (
  applicationId: string,
  userId: string,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      candidateId: true,
      job: { select: { postedById: true } },
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const admin = await isUserAdmin(userId);
  if (
    !admin &&
    application.job.postedById !== userId &&
    application.candidateId !== userId
  ) {
    throw new AppError(
      "You do not have permission to view this application timeline",
      403,
    );
  }

  const logs = await prisma.auditLog.findMany({
    where: { applicationId },
    include: { changedBy: { select: { name: true, image: true, role: true } } },
  });

  const notes = await prisma.applicationNote.findMany({
    where: { applicationId },
    include: { author: { select: { name: true, image: true, role: true } } },
  });

  const timeline = [
    ...logs.map((log) => ({
      type: "STAGE_CHANGE",
      data: log,
      timestamp: log.createdAt,
    })),
    ...notes.map((note) => ({
      type: "NOTE",
      data: note,
      timestamp: note.createdAt,
    })),
  ];

  timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return timeline;
};

export const withdrawApplicationFromDb = async (
  applicationId: string,
  candidateId: string,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (application.candidateId !== candidateId) {
    throw new AppError(
      "You do not have permission to withdraw this application",
      403,
    );
  }

  if (
    application.stage === "WITHDRAWN" ||
    application.stage === "HIRED" ||
    application.stage === "REJECTED"
  ) {
    throw new AppError(
      `Cannot withdraw application in ${application.stage} stage`,
      400,
    );
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { stage: "WITHDRAWN" },
  });

  await prisma.auditLog.create({
    data: {
      applicationId,
      changedById: candidateId,
      fromStage: application.stage,
      toStage: "WITHDRAWN",
      reason: "Candidate voluntarily withdrew application",
    },
  });

  return updated;
};

export const getKanbanBoardFromDb = async (
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
      "You do not have permission to view applicants for this job",
      403,
    );
  }

  const applications = await prisma.application.findMany({
    where: { jobId, isArchived: false },
    include: {
      candidate: {
        select: { id: true, name: true, image: true, headline: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const kanban: Record<ApplicationStage, typeof applications> = {
    APPLIED: [],
    SCREENING: [],
    ASSESSMENT: [],
    INTERVIEW: [],
    OFFER: [],
    HIRED: [],
    REJECTED: [],
    WITHDRAWN: [],
  };

  for (const app of applications) {
    kanban[app.stage].push(app);
  }

  return kanban;
};

export const updateApplicationLabelsInDb = async (
  applicationId: string,
  recruiterId: string,
  labels: string[],
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { job: { select: { postedById: true } } },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const admin = await isUserAdmin(recruiterId);
  if (!admin && application.job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to update labels for this application",
      403,
    );
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { labels },
  });

  return updated;
};

// Add a single label (push)
export const addLabelToApplicationInDb = async (
  applicationId: string,
  label: string,
  recruiterId: string,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { job: { select: { postedById: true } }, labels: true },
  });

  if (!application) throw new AppError("Application not found", 404);

  const admin = await isUserAdmin(recruiterId);
  if (!admin && application.job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to update labels for this application",
      403,
    );
  }

  // Prevent duplicates
  const existing = application.labels || [];
  if (existing.includes(label)) {
    return await prisma.application.findUnique({
      where: { id: applicationId },
    });
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { labels: { push: label } },
  });

  return updated;
};

// Remove a single label
export const removeLabelFromApplicationInDb = async (
  applicationId: string,
  label: string,
  recruiterId: string,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { job: { select: { postedById: true } }, labels: true },
  });

  if (!application) throw new AppError("Application not found", 404);

  const admin = await isUserAdmin(recruiterId);
  if (!admin && application.job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to update labels for this application",
      403,
    );
  }

  const updatedLabels = (application.labels || []).filter((l) => l !== label);

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { labels: updatedLabels },
  });

  return updated;
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
  getApplicationTimelineFromDb,
  withdrawApplicationFromDb,
  getKanbanBoardFromDb,
  updateApplicationLabelsInDb,
  addLabelToApplicationInDb,
  removeLabelFromApplicationInDb,
};
