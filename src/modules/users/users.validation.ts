import { z } from 'zod';
import { Role } from '@prisma/client';

// ---------------------------------------------------------------------------
// Zod Validation Schemas for Users Module
// ---------------------------------------------------------------------------

export const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters long'),
      role: z.nativeEnum(Role, {
        message: 'Invalid role provided. Allowed roles: CANDIDATE, RECRUITER, ADMIN',
      }),
      companyName: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.role === Role.RECRUITER && (!data.companyName || data.companyName.trim() === '')) {
          return false;
        }
        return true;
      },
      {
        message: 'Company name is required when registering as a RECRUITER',
        path: ['companyName'],
      },
    ),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Type inferences
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
