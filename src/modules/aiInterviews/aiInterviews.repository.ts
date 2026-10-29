import { Prisma, AiInterviewStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateAiSessionRecordDTO {
  applicationId: string;
  questions: Prisma.InputJsonValue;
  transcript: Prisma.InputJsonValue;
  status?: AiInterviewStatus;
}

export interface UpdateAiSessionRecordDTO {
  status?: AiInterviewStatus;
  currentQuestionIndex?: number;
  transcript?: Prisma.InputJsonValue;
  startedAt?: Date | null;
  completedAt?: Date | null;
  overallScore?: number | null;
  technicalScore?: number | null;
  communicationScore?: number | null;
  problemSolvingScore?: number | null;
  rubricFeedback?: Prisma.InputJsonValue;
}

// ---------------------------------------------------------------------------
// AI Interviews Repository (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Creates an AI Interview Session record with relation includes for ownership checking.
 */
export const createAiSessionRecord = async (data: CreateAiSessionRecordDTO) => {
  return prisma.aiInterviewSession.create({
    data: {
      applicationId: data.applicationId,
      questions: data.questions,
      transcript: data.transcript,
      status: data.status ?? AiInterviewStatus.IN_PROGRESS,
      startedAt: new Date(),
    },
    include: {
      application: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyId: true,
              company: {
                select: { id: true, name: true, logoUrl: true },
              },
            },
          },
          candidate: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
              },
            },
          },
        },
      },
    },
  });
};

/**
 * Finds an AI Interview Session by primary ID with full relations.
 */
export const findAiSessionByIdRecord = async (id: string) => {
  return prisma.aiInterviewSession.findUnique({
    where: { id },
    include: {
      application: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyId: true,
              company: {
                select: { id: true, name: true, logoUrl: true },
              },
            },
          },
          candidate: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
              },
            },
          },
        },
      },
    },
  });
};

/**
 * Finds the latest AI Interview Session for a given application ID.
 */
export const findLatestAiSessionByApplicationIdRecord = async (applicationId: string) => {
  return prisma.aiInterviewSession.findFirst({
    where: { applicationId },
    orderBy: { createdAt: 'desc' },
    include: {
      application: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyId: true,
              company: {
                select: { id: true, name: true, logoUrl: true },
              },
            },
          },
          candidate: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
              },
            },
          },
        },
      },
    },
  });
};

/**
 * Updates an AI Interview Session state.
 */
export const updateAiSessionRecord = async (id: string, data: UpdateAiSessionRecordDTO) => {
  return prisma.aiInterviewSession.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(typeof data.currentQuestionIndex === 'number' ? { currentQuestionIndex: data.currentQuestionIndex } : {}),
      ...(data.transcript ? { transcript: data.transcript } : {}),
      ...(data.startedAt !== undefined ? { startedAt: data.startedAt } : {}),
      ...(data.completedAt !== undefined ? { completedAt: data.completedAt } : {}),
      ...(data.overallScore !== undefined ? { overallScore: data.overallScore } : {}),
      ...(data.technicalScore !== undefined ? { technicalScore: data.technicalScore } : {}),
      ...(data.communicationScore !== undefined ? { communicationScore: data.communicationScore } : {}),
      ...(data.problemSolvingScore !== undefined ? { problemSolvingScore: data.problemSolvingScore } : {}),
      ...(data.rubricFeedback ? { rubricFeedback: data.rubricFeedback } : {}),
    },
    include: {
      application: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyId: true,
              company: {
                select: { id: true, name: true, logoUrl: true },
              },
            },
          },
          candidate: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
              },
            },
          },
        },
      },
    },
  });
};

/**
 * Finds application details with full job context and candidate qualifications for generating tailored AI questions.
 */
export const findApplicationForAiInterviewRecord = async (applicationId: string) => {
  return prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          description: true,
          softwareSkills: true,
          companyId: true,
          company: {
            select: { id: true, name: true },
          },
        },
      },
      candidate: {
        include: {
          workExperiences: {
            orderBy: { startDate: 'desc' },
            take: 3,
          },
          educations: {
            orderBy: { startDate: 'desc' },
            take: 2,
          },
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });
};

