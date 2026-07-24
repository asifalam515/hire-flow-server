import { z } from 'zod';
import { JobStatus } from '@prisma/client';

// ---------------------------------------------------------------------------
// Zod Validation Schemas for Jobs Module
// ---------------------------------------------------------------------------

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters long'),
    description: z.string().optional(),
    status: z.nativeEnum(JobStatus).optional().default(JobStatus.PUBLISHED),
    category: z.string().min(1, 'Category is required'),
    nature: z.string().min(1, 'Nature is required'),
    vacancies: z.coerce.number().int().nonnegative().optional(),
    employmentTypes: z.array(z.string()).min(1, 'At least one employment type is required'),
    locationCountry: z.string().min(1, 'Country is required'),
    locationCity: z.string().min(1, 'City is required'),
    exactAddress: z.string().optional(),
    minSalary: z.coerce.number().int().nonnegative(),
    maxSalary: z.coerce.number().int().nonnegative(),
    isSalaryNegotiable: z.boolean().optional().default(false),
    benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
    educationLevel: z.string().min(1, 'Education level is required'),
    yearsOfExperience: z.string().min(1, 'Years of experience is required'),
    gender: z.string().min(1, 'Gender preference is required'),
    candidateExperience: z.array(z.string()).min(1, 'Candidate experience is required'),
    languages: z.array(z.string()).min(1, 'At least one language is required'),
    softwareSkills: z.array(z.string()).min(1, 'At least one software skill is required'),
    responsibilities: z.string().optional(),
    requirements: z.string().optional(),
    companyId: z.string().optional(),
  }).refine((data) => data.minSalary <= data.maxSalary, {
    message: 'Minimum salary cannot be greater than maximum salary',
    path: ['maxSalary'],
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
