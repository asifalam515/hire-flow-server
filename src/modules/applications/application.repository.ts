import { Application, ApplicationStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateApplicationDTO {
  candidateId: string;
  jobId: string;
}

// ---------------------------------------------------------------------------
// Application Repository (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Create a new application record.
 */
export const createApplicationRecord = async (data: CreateApplicationDTO): Promise<Application> => {
  return prisma.application.create({
    data: {
      candidateId: data.candidateId,
      jobId: data.jobId,
      status: ApplicationStatus.APPLIED,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          companyId: true,
        },
      },
    },
  });
};

/**
 * Check if an application already exists for the given candidate and job.
 */
export const checkExistingApplication = async (candidateId: string, jobId: string): Promise<Application | null> => {
  return prisma.application.findUnique({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId,
      },
    },
  });
};

/**
 * Fetch all applications for a specific job, strictly enforcing tenant isolation
 * by joining the Job table and filtering by `job.companyId === companyId`.
 */
export const getApplicationsByJobId = async (jobId: string, companyId: string): Promise<Application[]> => {
  return prisma.application.findMany({
    where: {
      jobId,
      job: {
        companyId,
      },
    },
    include: {
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
    orderBy: {
      appliedAt: 'desc',
    },
  });
};

/**
 * Fetch an application by ID including job details for ownership checks.
 */
export const findApplicationByIdWithJob = async (applicationId: string) => {
  return prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          id: true,
          companyId: true,
        },
      },
    },
  });
};

/**
 * Update the status of an application.
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
): Promise<Application> => {
  return prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: {
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          companyId: true,
        },
      },
    },
  });
};
