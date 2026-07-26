import { Router } from 'express';
import {
  getResumeController,
  updateResumeProfileController,
  addWorkExperienceController,
  updateWorkExperienceController,
  deleteWorkExperienceController,
  addEducationController,
  updateEducationController,
  deleteEducationController,
  downloadResumePdfController,
  generateAiResumePdfController,
} from './candidates.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/auth.middleware';
import {
  updateCandidateProfileSchema,
  addWorkExperienceSchema,
  updateWorkExperienceSchema,
  addEducationSchema,
  updateEducationSchema,
} from './candidates.validation';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// All resume routes require authentication
router.use(requireAuth);

// Resume / Profile
router.get('/me/resume', catchAsync(getResumeController));
router.get('/me/resume/download', catchAsync(downloadResumePdfController));
router.get('/me/resume/generate-ai', catchAsync(generateAiResumePdfController));
router.patch(
  '/me/resume',
  validateRequest(updateCandidateProfileSchema),
  catchAsync(updateResumeProfileController)
);

// Work Experience
router.post(
  '/me/experience',
  validateRequest(addWorkExperienceSchema),
  catchAsync(addWorkExperienceController)
);
router.patch(
  '/me/experience/:id',
  validateRequest(updateWorkExperienceSchema),
  catchAsync(updateWorkExperienceController)
);
router.delete(
  '/me/experience/:id',
  catchAsync(deleteWorkExperienceController)
);

// Education
router.post(
  '/me/education',
  validateRequest(addEducationSchema),
  catchAsync(addEducationController)
);
router.patch(
  '/me/education/:id',
  validateRequest(updateEducationSchema),
  catchAsync(updateEducationController)
);
router.delete(
  '/me/education/:id',
  catchAsync(deleteEducationController)
);

export const candidateRoutes = router;
