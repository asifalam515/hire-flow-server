import { z } from 'zod';

export const startAiSessionSchema = z.object({
  body: z.object({
    applicationId: z.string().min(1, 'Application ID is required'),
  }),
});

export const getAiSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().min(1, 'Session ID is required'),
  }),
});

export const submitAnswerSchema = z.object({
  params: z.object({
    sessionId: z.string().min(1, 'Session ID is required'),
  }),
  body: z.object({
    answer: z.string().min(1, 'Answer cannot be empty').max(5000, 'Answer is too long'),
  }),
});

export const applicationIdParamSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1, 'Application ID is required'),
  }),
});

export type StartAiSessionInput = z.infer<typeof startAiSessionSchema>['body'];
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>['body'];
