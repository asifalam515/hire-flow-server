import { z } from 'zod';
import { InterviewStatus } from '@prisma/client';

export const scheduleInterviewSchema = z.object({
  body: z.object({
    applicationId: z.string().min(1, 'Application ID is required'),
    scheduledAt: z.string().datetime({ message: 'scheduledAt must be a valid ISO 8601 date string' }),
    recruiterNotes: z.string().optional(),
  }),
});

export const generateTokenSchema = z.object({
  body: z.object({
    applicationId: z.string().min(1, 'Application ID is required'),
  }),
});

export const updateNotesSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Interview ID is required'),
  }),
  body: z.object({
    recruiterNotes: z.string(),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Interview ID is required'),
  }),
  body: z.object({
    status: z.nativeEnum(InterviewStatus),
  }),
});

export const applicationIdParamSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1, 'Application ID is required'),
  }),
});

export const interviewIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Interview ID is required'),
  }),
});

export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>['body'];
export type GenerateTokenInput = z.infer<typeof generateTokenSchema>['body'];
export type UpdateNotesInput = z.infer<typeof updateNotesSchema>['body'];
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>['body'];

