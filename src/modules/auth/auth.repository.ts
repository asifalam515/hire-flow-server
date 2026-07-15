import { Prisma, User, Company, Role } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateCompanyDTO {
  name: string;
  slug: string;
  field?: string | undefined;
  description?: string | undefined;
  logoUrl?: string | undefined;
}

export interface CreateEmployerUserDTO {
  email: string;
  passwordHash: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  role: Role;
  companyId?: string | undefined;
  isEmailVerified: boolean;
  otpCode?: string | undefined;
  otpExpiresAt?: Date | undefined;
}

// ---------------------------------------------------------------------------
// Auth Repository (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Find a user by email address.
 */
export const findUserByEmailRecord = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Find a company by its unique slug.
 */
export const findCompanyBySlugRecord = async (slug: string): Promise<Company | null> => {
  return prisma.company.findUnique({
    where: { slug },
  });
};

/**
 * Create a new company record with profile details.
 */
export const createCompanyRecord = async (data: CreateCompanyDTO): Promise<Company> => {
  return prisma.company.create({
    data: {
      name: data.name,
      slug: data.slug,
      ...(data.field && { field: data.field }),
      ...(data.description && { description: data.description }),
      ...(data.logoUrl && { logoUrl: data.logoUrl }),
    },
  });
};

/**
 * Create a new employer/user record.
 */
export const createEmployerUserRecord = async (data: CreateEmployerUserDTO): Promise<User> => {
  const createData: Prisma.UserCreateInput = {
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role,
    isEmailVerified: data.isEmailVerified,
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.otpCode && { otpCode: data.otpCode }),
    ...(data.otpExpiresAt && { otpExpiresAt: data.otpExpiresAt }),
    ...(data.companyId && {
      company: {
        connect: { id: data.companyId },
      },
    }),
  };

  return prisma.user.create({
    data: createData,
  });
};

/**
 * Update user verification status after successful OTP match.
 */
export const updateUserVerificationRecord = async (userId: string): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isEmailVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    },
  });
};

/**
 * Update user OTP code and expiration for resending verification.
 */
export const updateUserOtpRecord = async (
  userId: string,
  otpCode: string,
  otpExpiresAt: Date,
): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      otpCode,
      otpExpiresAt,
      isEmailVerified: false,
    },
  });
};

/**
 * Find a user by their unique ID, including their linked company.
 */
export const findUserByIdRecord = async (id: string): Promise<(User & { company?: Company | null }) | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });
};
