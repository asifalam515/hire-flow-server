import { z } from 'zod';

export const updateCandidateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatarUrl: z.string().optional(),
    resumeUrl: z.string().optional(),
    mobileNumber: z.string().optional(),
    maritalStatus: z.string().optional(),
    city: z.string().optional(),
    yearOfBirth: z.number().int().optional(),
    gender: z.string().optional(),
    aboutMe: z.string().optional(),
    skills: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    preferredBenefits: z.array(z.string()).optional(),
    jobPreferences: z.any().optional(),
    links: z.any().optional(),
  }),
});

export const addWorkExperienceSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    company: z.string().min(1, 'Company is required'),
    startDate: z.string().datetime({ offset: true }).or(z.date()),
    endDate: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
    isCurrent: z.boolean().optional(),
    description: z.string().optional().nullable(),
  }),
});

export const updateWorkExperienceSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  body: z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    startDate: z.string().datetime({ offset: true }).or(z.date()).optional(),
    endDate: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
    isCurrent: z.boolean().optional(),
    description: z.string().optional().nullable(),
  }),
});

export const addEducationSchema = z.object({
  body: z.object({
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().optional().nullable(),
    institution: z.string().min(1, 'Institution is required'),
    startDate: z.string().datetime({ offset: true }).or(z.date()),
    endDate: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
    isCurrent: z.boolean().optional(),
  }),
});

export const updateEducationSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  body: z.object({
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional().nullable(),
    institution: z.string().optional(),
    startDate: z.string().datetime({ offset: true }).or(z.date()).optional(),
    endDate: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
    isCurrent: z.boolean().optional(),
  }),
});
