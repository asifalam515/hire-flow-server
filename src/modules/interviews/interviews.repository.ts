import { InterviewRoom, InterviewStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateInterviewRoomDTO {
  applicationId: string;
  liveKitRoomName: string;
  scheduledAt: Date;
  recruiterNotes?: string | null | undefined;
}

// ---------------------------------------------------------------------------
// Interviews Repository (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Create a new interview room record for an application with included relations.
 */
export const createInterviewRoomRecord = async (data: CreateInterviewRoomDTO) => {
  return prisma.interviewRoom.create({
    data: {
      applicationId: data.applicationId,
      liveKitRoomName: data.liveKitRoomName,
      scheduledAt: data.scheduledAt,
      recruiterNotes: data.recruiterNotes ?? null,
      status: InterviewStatus.SCHEDULED,
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
 * Find an interview room by ID with all relational data for tenant verification.
 */
export const findInterviewRoomByIdRecord = async (id: string) => {
  return prisma.interviewRoom.findUnique({
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
                select: { id: true, name: true },
              },
            },
          },
          candidate: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true },
              },
            },
          },
        },
      },
    },
  });
};

/**
 * Find the latest interview room for a specific application.
 */
export const findInterviewRoomByApplicationIdRecord = async (applicationId: string) => {
  return prisma.interviewRoom.findFirst({
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
 * Find application with full relations for interview permissions checking.
 */
export const findApplicationForInterviewRecord = async (applicationId: string) => {
  return prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          companyId: true,
          company: {
            select: { id: true, name: true },
          },
        },
      },
      candidate: {
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });
};

/**
 * Update interview room status.
 */
export const updateInterviewRoomStatusRecord = async (
  id: string,
  status: InterviewStatus,
): Promise<InterviewRoom> => {
  return prisma.interviewRoom.update({
    where: { id },
    data: { status },
  });
};

/**
 * Update recruiter private notes.
 */
export const updateInterviewRoomNotesRecord = async (
  id: string,
  recruiterNotes: string,
): Promise<InterviewRoom> => {
  return prisma.interviewRoom.update({
    where: { id },
    data: { recruiterNotes },
  });
};
