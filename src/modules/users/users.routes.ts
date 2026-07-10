import { Router } from 'express';
import { registerController, loginController } from './users.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './users.validation';
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

export const userRoutes = router;
