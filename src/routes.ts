import { Router } from 'express';
import { healthRoutes } from './modules/health/health.routes';

const router = Router();

// ---------------------------------------------------------------------------
// Main API Router
// ---------------------------------------------------------------------------
// All feature modules are mounted here.
// ---------------------------------------------------------------------------

router.use('/health', healthRoutes);

// Example for upcoming modules:
// import { authRoutes } from './modules/auth/auth.routes';
// router.use('/auth', authRoutes);

// import { userRoutes } from './modules/users/users.routes';
// router.use('/users', userRoutes);

export const apiRouter = router;
