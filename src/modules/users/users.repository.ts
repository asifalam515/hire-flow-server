import { Prisma, User, Company, Role } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  role: Role;
  companyId?: string | undefined;
}

// ---------------------------------------------------------------------------
// Users Repository (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Find a user by their exact email address.
 */
export const findUserByEmailRecord = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Find a user by ID.
 */
export const findUserByIdRecord = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
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
 * Create a new company record.
 */
export const createCompanyRecord = async (name: string, slug: string): Promise<Company> => {
  return prisma.company.create({
    data: {
      name,
      slug,
    },
  });
};

/**
 * Create a new user with optional association to a company.
 */
export const createUserRecord = async (data: CreateUserDTO): Promise<User> => {
  const createData: Prisma.UserCreateInput = {
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role,
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
 * Update user record.
 */
export const updateUserRecord = async (id: string, data: Partial<User>): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * Update company record.
 */
export const updateCompanyRecord = async (id: string, data: Partial<Company>): Promise<Company> => {
  return prisma.company.update({
    where: { id },
    data,
  });
};
