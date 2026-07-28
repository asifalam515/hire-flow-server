import { Router } from 'express';
import { healthRoutes } from './modules/health/health.routes';
import { userRoutes } from './modules/users/users.routes';
import { jobsRoutes } from './modules/jobs/jobs.routes';
import { applicationRoutes } from './modules/applications/application.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { uploadRouter } from './modules/upload/upload.routes';
import { candidateRoutes } from './modules/candidates/candidates.routes';
import { companiesRoutes } from './modules/companies/companies.routes';

const router = Router();

// ---------------------------------------------------------------------------
// Main API Router
// ---------------------------------------------------------------------------
// All feature modules are mounted here.
// ---------------------------------------------------------------------------

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationRoutes);
router.use('/upload', uploadRouter);
router.use('/candidates', candidateRoutes);
router.use('/companies', companiesRoutes);

export const apiRouter = router;
