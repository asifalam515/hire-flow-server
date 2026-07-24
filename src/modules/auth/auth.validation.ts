import { z } from 'zod';

// ---------------------------------------------------------------------------
// Zod Validation Schemas for Auth Module (Employer Sign-Up & OTP)
// ---------------------------------------------------------------------------

export const employerSignUpSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    companyName: z.string().min(1, 'Company name is required'),
    companyField: z.string().optional(),
    companyDescription: z.string().min(1, 'Company description is required'),
    logoUrl: z.string().optional(),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otpCode: z.string().length(4, 'OTP code must be exactly 4 digits'),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const candidateSignUpSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

// Type inferences
export type EmployerSignUpInput = z.infer<typeof employerSignUpSchema>['body'];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
export type ResendOtpInput = z.infer<typeof resendOtpSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type CandidateSignUpInput = z.infer<typeof candidateSignUpSchema>['body'];
