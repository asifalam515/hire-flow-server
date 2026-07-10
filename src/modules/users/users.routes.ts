import { Router } from 'express';
import { UsersController } from './users.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './users.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();
const usersController = new UsersController();

// ---------------------------------------------------------------------------
// Users Routes
// ---------------------------------------------------------------------------
// POST /register - Register a new user
// POST /login    - Authenticate and receive access + refresh tokens
// ---------------------------------------------------------------------------

router.post(
  '/register',
  validateRequest(registerSchema),
  catchAsync(usersController.register),
);

router.post(
  '/login',
  validateRequest(loginSchema),
  catchAsync(usersController.login),
);

export const userRoutes = router;
