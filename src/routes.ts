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
import { userRoutes } from './modules/users/users.routes';
import { jobsRoutes } from './modules/jobs/jobs.routes';

router.use('/users', userRoutes);
router.use('/jobs', jobsRoutes);

export const apiRouter = router;
