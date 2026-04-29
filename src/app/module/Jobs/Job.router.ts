import { applicationController } from "@/app/module/Applications/application.controller";
import {
  authenticate,
  authorize,
  requireRecruiter,
} from "@middleware/auth.middleware";
import { Router } from "express";
import { jobController } from "./job.controller";

const router = Router();

// Public routes (search & filter)
router.get("/", jobController.searchAndFilterJobs);
router.get("/slug/:slug", jobController.getJobBySlug);
router.get("/company/:companyId", jobController.getJobsByCompany);
router.get("/:id/similar", jobController.getSimilarJobs);
router.get("/:id", jobController.getJobById);

// Protected routes (require authentication)
router.post("/", authenticate, requireRecruiter, jobController.createJob);
router.post(
  "/:id/apply",
  authenticate,
  authorize(["CANDIDATE"]),
  applicationController.applyToJob,
);
router.get(
  "/:id/match-score",
  authenticate,
  authorize(["CANDIDATE"]),
  jobController.getMatchScore,
);
router.post(
  "/:id/save",
  authenticate,
  authorize(["CANDIDATE"]),
  jobController.saveJob,
);
router.delete(
  "/:id/save",
  authenticate,
  authorize(["CANDIDATE"]),
  jobController.unsaveJob,
);
router.get(
  "/:id/applications",
  authenticate,
  requireRecruiter,
  applicationController.getApplicantsForJob,
);

// User routes (require authentication)
router.get(
  "/recruiter/my-jobs",
  authenticate,
  requireRecruiter,
  jobController.getMyJobs,
);

// Job modification routes (require authentication - poster or admin)
router.patch("/:id/status", authenticate, requireRecruiter, jobController.updateJobStatus);
router.patch("/:id", authenticate, requireRecruiter, jobController.updateJob);
router.delete("/:id", authenticate, requireRecruiter, jobController.deleteJob);

export const jobRouter = router;
