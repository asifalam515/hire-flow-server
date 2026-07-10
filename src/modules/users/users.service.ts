import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, Role } from '@prisma/client';
import {
  findUserByEmailRecord,
  findCompanyBySlugRecord,
  createCompanyRecord,
  createUserRecord,
} from './users.repository';
import { RegisterInput, LoginInput } from './users.validation';
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';

export type UserResponse = Omit<User, 'passwordHash'>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

// ---------------------------------------------------------------------------
// Users Service (Pure Arrow Functions)
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
 * Register a new user, optionally linking or creating a company for recruiters.
 */
export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const email = input.email.toLowerCase().trim();
  const existingUser = await findUserByEmailRecord(email);

  if (existingUser) {
    throw new AppError('User with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  let companyId: string | undefined;

  if (input.role === Role.RECRUITER && input.companyName) {
    const companyName = input.companyName.trim();
    const baseSlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let company = await findCompanyBySlugRecord(baseSlug);
    if (!company) {
      try {
        company = await createCompanyRecord(companyName, baseSlug);
      } catch (error) {
        const fallbackSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
        company = await createCompanyRecord(companyName, fallbackSlug);
      }
    }
    companyId = company.id;
  }

  const user = await createUserRecord({
    email,
    passwordHash,
    role: input.role,
    ...(companyId ? { companyId } : {}),
  });

  const tokens = generateTokens(user);
  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

/**
 * Authenticate an existing user with email and password.
 */
export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const email = input.email.toLowerCase().trim();
  const user = await findUserByEmailRecord(email);

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const tokens = generateTokens(user);
  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};
