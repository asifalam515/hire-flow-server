import { asyncHandler } from "@lib/asyncHandler";
import {
  authenticate,
  authorize,
  optionalAuth,
  requireCandidate,
  requireRecruiter,
} from "@middleware/auth.middleware";
import { Router } from "express";

const router = Router();

/**
 * Public route - no auth required
 */
router.get(
  "/",
  optionalAuth,
  asyncHandler((req, res) => {
    res.send("Hello from Jobs router!");
  }),
);

/**
 * Get job details - optional auth (shows different data if authenticated)
 */
router.get(
  "/:jobId",
  optionalAuth,
  asyncHandler((req, res) => {
    // req.user will be populated if authenticated, undefined otherwise
    res.json({ jobId: req.params.jobId, user: req.user || null });
  }),
);

/**
 * Create a new job - requires RECRUITER or ADMIN role
 */
router.post(
  "/",
  authenticate,
  requireRecruiter,
  asyncHandler(async (req, res) => {
    // Only RECRUITER and ADMIN can create jobs
    res.json({ message: "Job created", userId: req.user?.id });
  }),
);

/**
 * Apply for a job - requires CANDIDATE role (RECRUITER and ADMIN can also apply)
 */
router.post(
  "/:jobId/apply",
  authenticate,
  requireCandidate,
  asyncHandler(async (req, res) => {
    res.json({ message: "Application submitted", userId: req.user?.id });
  }),
);

/**
 * Update job - only RECRUITER or ADMIN can update their own jobs
 */
router.patch(
  "/:jobId",
  authenticate,
  requireRecruiter,
  asyncHandler(async (req, res) => {
    res.json({ message: "Job updated", userId: req.user?.id });
  }),
);

/**
 * Delete job - requires ADMIN role only
 */
router.delete(
  "/:jobId",
  authenticate,
  authorize(["ADMIN"]),
  asyncHandler(async (req, res) => {
    res.json({ message: "Job deleted", userId: req.user?.id });
  }),
);

export default router;
