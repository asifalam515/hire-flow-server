import { Router } from 'express';
import { registerController, loginController, updateAvatarController, updateEmployerProfileController, updateEmailController, updatePasswordController, updateNotificationsController, deleteUserController } from './users.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema, updateEmployerProfileSchema, updateEmailSchema, updatePasswordSchema, updateNotificationsSchema } from './users.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// ---------------------------------------------------------------------------
// Users Routes
// ---------------------------------------------------------------------------
// POST /register - Register a new user
// POST /login    - Authenticate and receive access + refresh tokens
// ---------------------------------------------------------------------------

router.post(
  '/register',
  validateRequest(registerSchema),
  catchAsync(registerController),
);

router.post(
  '/login',
  validateRequest(loginSchema),
  catchAsync(loginController),
);

router.patch(
  '/me/avatar',
  requireAuth,
  catchAsync(updateAvatarController),
);

router.patch(
  '/me/employer-profile',
  requireAuth,
  validateRequest(updateEmployerProfileSchema),
  catchAsync(updateEmployerProfileController),
);

router.patch(
  '/me/email',
  requireAuth,
  validateRequest(updateEmailSchema),
  catchAsync(updateEmailController),
);

router.patch(
  '/me/password',
  requireAuth,
  validateRequest(updatePasswordSchema),
  catchAsync(updatePasswordController),
);

router.patch(
  '/me/notifications',
  requireAuth,
  validateRequest(updateNotificationsSchema),
  catchAsync(updateNotificationsController),
);

router.delete(
  '/me',
  requireAuth,
  catchAsync(deleteUserController),
);

export const userRoutes = router;
