import { z } from 'zod';
import { JobStatus } from '@prisma/client';

// ---------------------------------------------------------------------------
// Zod Validation Schemas for Jobs Module
// ---------------------------------------------------------------------------

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters long'),
    description: z.string().min(10, 'Job description must be at least 10 characters long'),
    status: z
      .nativeEnum(JobStatus, {
        message: 'Invalid status. Allowed values: DRAFT, PUBLISHED, CLOSED',
      })
      .optional()
      .default(JobStatus.PUBLISHED),
    companyId: z.string().optional(),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Job ID is required'),
  }),
  body: z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters long').optional(),
    description: z.string().min(10, 'Job description must be at least 10 characters long').optional(),
    status: z
      .nativeEnum(JobStatus, {
        message: 'Invalid status. Allowed values: DRAFT, PUBLISHED, CLOSED',
      })
      .optional(),
  }),
});

export const jobIdParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Job ID is required'),
  }),
});

export const listJobsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z
      .nativeEnum(JobStatus, {
        message: 'Invalid status filter. Allowed values: DRAFT, PUBLISHED, CLOSED',
      })
      .optional(),
    companyId: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

// Type inferences
export type CreateJobInput = z.infer<typeof createJobSchema>['body'];
export type UpdateJobInput = z.infer<typeof updateJobSchema>['body'];
export type ListJobsQuery = z.infer<typeof listJobsSchema>['query'];
