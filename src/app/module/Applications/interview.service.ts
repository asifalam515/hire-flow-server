import type { InterviewType } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";
import {
  sendInterviewScheduledEmail,
  sendOfferExtendedEmail,
} from "./notification.service";

interface ScheduleInterviewInput {
  type: InterviewType;
  scheduledAt: Date;
  durationMins?: number;
  location?: string;
  meetingUrl?: string;
  notes?: string;
}

/**
 * Schedule an interview for an application
 */
export const scheduleInterview = async (
  applicationId: string,
  recruiterId: string,
  data: ScheduleInterviewInput,
) => {
  // Verify application exists and recruiter has permission
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          postedById: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const admin = await isUserAdmin(recruiterId);
  if (!admin && application.job.postedById !== recruiterId) {
    throw new AppError(
      "You do not have permission to schedule interviews for this application",
      403,
    );
  }

  // Create interview
  const interview = await prisma.interview.create({
    data: {
      applicationId,
      scheduledById: recruiterId,
      type: data.type,
      scheduledAt: new Date(data.scheduledAt),
      durationMins: data.durationMins || 60,
      location: data.location,
      meetingUrl: data.meetingUrl,
      notes: data.notes,
    },
  });

  // Send interview scheduled email to candidate
  try {
    if (application.candidate.email) {
      await sendInterviewScheduledEmail(
        application.candidate.email,
        application.candidate.name || "Candidate",
        {
          candidateName: application.candidate.name || "Candidate",
          candidateEmail: application.candidate.email,
          jobTitle: application.job.title,
          companyName: application.job.company.name,
          interviewDetails: {
            type: data.type,
            dateTime: data.scheduledAt,
            location: data.location,
            meetingUrl: data.meetingUrl,
          },
        },
      );
    }
  } catch (err) {
    console.error("Failed to send interview scheduled email", err);
  }

  return interview;
};

/**
 * Send offer extended email when application reaches OFFER stage
 */
export const sendOfferEmail = async (
  applicationId: string,
  salaryOffer?: number,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      candidate: {
        select: {
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          title: true,
          salaryMax: true,
          salaryCurrency: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!application || !application.candidate.email) {
    throw new AppError("Application or candidate email not found", 404);
  }

  try {
    await sendOfferExtendedEmail(
      application.candidate.email,
      application.candidate.name || "Candidate",
      {
        candidateName: application.candidate.name || "Candidate",
        candidateEmail: application.candidate.email,
        jobTitle: application.job.title,
        companyName: application.job.company.name,
        salaryOffer: salaryOffer || application.job.salaryMax,
        salaryCurrency: application.job.salaryCurrency,
      },
    );
  } catch (err) {
    console.error("Failed to send offer email", err);
  }
};

const isUserAdmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
};

export const interviewService = {
  scheduleInterview,
  sendOfferEmail,
};
