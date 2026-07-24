import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, Role, Company } from '@prisma/client';
import {
  findUserByEmailRecord,
  findCompanyBySlugRecord,
  createCompanyRecord,
  createEmployerUserRecord,
  createCandidateUserRecord,
  updateUserVerificationRecord,
  updateUserOtpRecord,
  findUserByIdRecord,
} from './auth.repository';
import {
  EmployerSignUpInput,
  VerifyOtpInput,
  ResendOtpInput,
  LoginInput,
  CandidateSignUpInput,
} from './auth.validation';
import { sendVerificationOtpEmail } from '../../utils/email';
import { AppError } from '../../utils/AppError';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { env } from '../../config/env';

export type UserResponse = Omit<User, 'passwordHash'>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface EmployerSignUpResult {
  user: UserResponse;
  company: Company;
  accessToken: string;
  refreshToken: string;
  verification: {
    otpCode: string;
    expiresIn: number; // in seconds
  };
}

export interface CandidateSignUpResult {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  verification: {
    otpCode: string;
    expiresIn: number; // in seconds
  };
}

export interface VerifyOtpResult {
  verified: boolean;
  user: UserResponse;
}

export interface ResendOtpResult {
  verification: {
    otpCode: string;
    expiresIn: number;
  };
}

export interface LoginResult {
  user: UserResponse;
  company?: Company | null | undefined;
  accessToken: string;
  refreshToken: string;
}

// ---------------------------------------------------------------------------
// Auth Service (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Strip sensitive fields from user record before sending response.
 */
export const sanitizeUser = (user: User): UserResponse => {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};

/**
 * Generate JWT Access Token and Refresh Token.
 */
export const generateTokens = (user: User): AuthTokens => {
  const payload = {
    id: user.id,
    role: user.role,
    companyId: user.companyId,
  };

  const accessToken = jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as SignOptions,
  );

  const refreshToken = jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Helper to generate a random 4-digit verification code.
 */
const generateFourDigitOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Register a new Employer (Recruiter) with complete Company Details and OTP.
 */
export const registerEmployerService = async (
  input: EmployerSignUpInput,
): Promise<EmployerSignUpResult> => {
  const email = input.email.toLowerCase().trim();
  const existingUser = await findUserByEmailRecord(email);

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  // Generate unique slug for Company
  const companyName = input.companyName.trim();
  const baseSlug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = baseSlug;
  const existingCompany = await findCompanyBySlugRecord(slug);
  if (existingCompany) {
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  let processedLogoUrl = input.logoUrl;
  if (processedLogoUrl && processedLogoUrl.startsWith('data:image/')) {
    try {
      const uploadRes = await uploadToCloudinary(processedLogoUrl, 'hire-flow/logos');
      processedLogoUrl = uploadRes.url;
    } catch (err) {
      console.warn('Could not auto-upload base64 logo to Cloudinary, keeping original value.');
    }
  }

  const company = await createCompanyRecord({
    name: companyName,
    slug,
    field: input.companyField?.trim(),
    description: input.companyDescription.trim(),
    logoUrl: processedLogoUrl,
  });

  // Generate OTP (valid for 10 minutes)
  const otpCode = generateFourDigitOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await createEmployerUserRecord({
    email,
    passwordHash,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    role: Role.RECRUITER,
    companyId: company.id,
    isEmailVerified: false,
    otpCode,
    otpExpiresAt,
  });

  // Dispatch email via Resend (async non-blocking or awaited)
  await sendVerificationOtpEmail({
    to: user.email,
    otpCode,
    firstName: user.firstName ?? undefined,
  });

  const tokens = generateTokens(user);

  return {
    user: sanitizeUser(user),
    company,
    ...tokens,
    verification: {
      otpCode,
      expiresIn: 600, // 10 minutes in seconds
    },
  };
};

/**
 * Register a new Candidate with OTP.
 */
export const registerCandidateService = async (
  input: CandidateSignUpInput,
): Promise<CandidateSignUpResult> => {
  const email = input.email.toLowerCase().trim();
  const existingUser = await findUserByEmailRecord(email);

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  // Generate OTP (valid for 10 minutes)
  const otpCode = generateFourDigitOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await createCandidateUserRecord({
    email,
    passwordHash,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    role: Role.CANDIDATE,
    isEmailVerified: false,
    otpCode,
    otpExpiresAt,
  });

  // Dispatch email via Resend
  await sendVerificationOtpEmail({
    to: user.email,
    otpCode,
    firstName: user.firstName ?? undefined,
  });

  const tokens = generateTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
    verification: {
      otpCode,
      expiresIn: 600, // 10 minutes in seconds
    },
  };
};

/**
 * Verify OTP code submitted by the user.
 */
export const verifyOtpService = async (
  input: VerifyOtpInput,
): Promise<VerifyOtpResult> => {
  const email = input.email.toLowerCase().trim();
  const user = await findUserByEmailRecord(email);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user.isEmailVerified) {
    return {
      verified: true,
      user: sanitizeUser(user),
    };
  }

  if (!user.otpCode || !user.otpExpiresAt) {
    throw new AppError('No verification code found. Please request a new code.', 400);
  }

  if (new Date() > user.otpExpiresAt) {
    throw new AppError('Verification code has expired. Please request a new code.', 400);
  }

  if (user.otpCode !== input.otpCode.trim()) {
    throw new AppError('Invalid verification code. Please try again.', 400);
  }

  const updatedUser = await updateUserVerificationRecord(user.id);

  return {
    verified: true,
    user: sanitizeUser(updatedUser),
  };
};

/**
 * Resend verification OTP code.
 */
export const resendOtpService = async (
  input: ResendOtpInput,
): Promise<ResendOtpResult> => {
  const email = input.email.toLowerCase().trim();
  const user = await findUserByEmailRecord(email);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email address is already verified.', 400);
  }

  const otpCode = generateFourDigitOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await updateUserOtpRecord(user.id, otpCode, otpExpiresAt);

  // Dispatch email via Resend
  await sendVerificationOtpEmail({
    to: user.email,
    otpCode,
    firstName: user.firstName ?? undefined,
  });

  return {
    verification: {
      otpCode,
      expiresIn: 600,
    },
  };
};

/**
 * Authenticate an existing user with email and password within the auth module.
 */
export const loginAuthService = async (input: LoginInput): Promise<LoginResult> => {
  const email = input.email.toLowerCase().trim();
  const userRecord = await findUserByIdRecord((await findUserByEmailRecord(email))?.id ?? '');

  if (!userRecord) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, userRecord.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const tokens = generateTokens(userRecord);
  return {
    user: sanitizeUser(userRecord),
    company: userRecord.company ?? null,
    ...tokens,
  };
};

/**
 * Get current authenticated user profile and company data.
 */
export const getMeAuthService = async (userId: string): Promise<{ user: UserResponse; company?: Company | null | undefined }> => {
  const userRecord = await findUserByIdRecord(userId);
  if (!userRecord) {
    throw new AppError('User session expired or user not found.', 404);
  }

  return {
    user: sanitizeUser(userRecord),
    company: userRecord.company ?? null,
  };
};

/**
 * Service to execute any server-side cleanup or token revocation during logout.
 */
export const logoutAuthService = async (_userId?: string): Promise<void> => {
  // Can be extended to blacklist tokens or clear session records if persistent sessions are added
};
