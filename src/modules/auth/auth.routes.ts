import { Router } from 'express';
import {
  employerRegisterController,
  candidateRegisterController,
  verifyOtpController,
  resendOtpController,
  loginController,
  meController,
  logoutController,
  getSessionsController,
  deleteSessionController,
  deleteAllOtherSessionsController,
} from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/auth.middleware';
import {
  employerSignUpSchema,
  candidateSignUpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
} from './auth.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// ---------------------------------------------------------------------------
// Auth & Employer Registration Routes
// ---------------------------------------------------------------------------
// POST /auth/employer/register - Register a new recruiter/employer with company setup
// POST /auth/verify-otp        - Verify 4-digit OTP code sent to user email
// POST /auth/resend-otp        - Request a new 4-digit OTP code
// POST /auth/login             - Log in user with email & password and set refresh cookie
// GET  /auth/me                - Get currently authenticated user & company profile
// POST /auth/logout            - Log out current user and clear refresh token cookie
// GET  /auth/sessions          - Get active sessions for the current user
// DELETE /auth/sessions/:id    - Terminate a specific session
// DELETE /auth/sessions        - Terminate all other sessions except the current one
// ---------------------------------------------------------------------------

router.post(
  '/employer/register',
  validateRequest(employerSignUpSchema),
  catchAsync(employerRegisterController),
);

router.post(
  '/candidate/register',
  validateRequest(candidateSignUpSchema),
  catchAsync(candidateRegisterController),
);

router.post(
  '/verify-otp',
  validateRequest(verifyOtpSchema),
  catchAsync(verifyOtpController),
);

router.post(
  '/resend-otp',
  validateRequest(resendOtpSchema),
  catchAsync(resendOtpController),
);

router.post(
  '/login',
  validateRequest(loginSchema),
  catchAsync(loginController),
);

router.get(
  '/me',
  requireAuth,
  catchAsync(meController),
);

router.post(
  '/logout',
  catchAsync(logoutController),
);

router.get(
  '/sessions',
  requireAuth,
  catchAsync(getSessionsController),
);

router.delete(
  '/sessions/:id',
  requireAuth,
  catchAsync(deleteSessionController),
);

router.delete(
  '/sessions',
  requireAuth,
  catchAsync(deleteAllOtherSessionsController),
);

export const authRoutes = router;
