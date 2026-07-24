import { Request, Response } from 'express';
import {
  registerEmployerService,
  registerCandidateService,
  verifyOtpService,
  resendOtpService,
  loginAuthService,
  getMeAuthService,
  logoutAuthService,
} from './auth.service';
import { env } from '../../config/env';

// ---------------------------------------------------------------------------
// Auth Controller (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Attach the Refresh Token to an HttpOnly, Secure, SameSite=Strict cookie.
 */
const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

/**
 * POST /auth/employer/register
 * Register an employer with personal and company profile details.
 */
export const employerRegisterController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await registerEmployerService(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: 'Employer account registered successfully. Please verify your email with the OTP sent.',
    data: {
      user: result.user,
      company: result.company,
      accessToken: result.accessToken,
      verification: result.verification, // In dev/test environments, return OTP code for testing convenience
    },
  });
};

/**
 * POST /auth/candidate/register
 * Register a candidate.
 */
export const candidateRegisterController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await registerCandidateService(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: 'Candidate account registered successfully. Please verify your email with the OTP sent.',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      verification: result.verification,
    },
  });
};

/**
 * POST /auth/verify-otp
 * Verify email address with 4-digit OTP code.
 */
export const verifyOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await verifyOtpService(req.body);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. Welcome to Joblin!',
    data: result,
  });
};

/**
 * POST /auth/resend-otp
 * Resend a new 4-digit OTP code to the user.
 */
export const resendOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await resendOtpService(req.body);

  res.status(200).json({
    success: true,
    message: 'Verification code resent successfully.',
    data: result,
  });
};

/**
 * POST /auth/login
 * Authenticate an existing user and set refresh token cookie.
 */
export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await loginAuthService(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: {
      user: result.user,
      company: result.company,
      accessToken: result.accessToken,
    },
  });
};

/**
 * GET /auth/me
 * Retrieve the currently logged-in user and company profile.
 */
export const meController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // `req.user` is attached by the authenticate middleware
  const userId = (req as any).user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized access. Please log in.',
    });
    return;
  }

  const result = await getMeAuthService(userId);

  res.status(200).json({
    success: true,
    message: 'Current user profile fetched.',
    data: result,
  });
};

/**
 * POST /auth/logout
 * Log out the user by clearing the HttpOnly refresh token cookie and performing backend cleanup.
 */
export const logoutController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = (req as any).user?.id;
  await logoutAuthService(userId);

  // Clear the HttpOnly refreshToken cookie exactly matching cookie options set during login/register
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
    data: null,
  });
};
