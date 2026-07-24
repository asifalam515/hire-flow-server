import { Router } from 'express';
import { registerController, loginController, updateAvatarController, updateEmployerProfileController } from './users.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema, updateEmployerProfileSchema } from './users.validation';
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

export const userRoutes = router;
