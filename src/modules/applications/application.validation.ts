import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

// ---------------------------------------------------------------------------
// Zod Validation Schemas for Applications Module
// ---------------------------------------------------------------------------

export const ApplyToJobSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID is required'),
  }),
});

export const UpdateApplicationStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Application ID is required'),
  }),
  body: z.object({
    status: z.nativeEnum(ApplicationStatus, {
      message: 'Invalid application status. Allowed values: APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED',
    }),
  }),
});

export const getApplicationsByJobSchema = z.object({
  params: z.object({
    jobId: z.string().min(1, 'Job ID is required'),
  }),
});

// Type inferences
export type ApplyToJobInput = z.infer<typeof ApplyToJobSchema>['body'];
export type UpdateApplicationStatusInput = z.infer<typeof UpdateApplicationStatusSchema>['body'];
