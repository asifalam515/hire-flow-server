import { authenticate, requireRecruiter } from "@middleware/auth.middleware";
import { Router } from "express";
import { jobController } from "./job.controller";

const router = Router();

// Public routes (search & filter)
router.get("/", jobController.searchAndFilterJobs);
router.get("/slug/:slug", jobController.getJobBySlug);
router.get("/:id", jobController.getJobById);
router.get("/company/:companyId", jobController.getJobsByCompany);

// Protected routes (require authentication)
router.post("/", authenticate, requireRecruiter, jobController.createJob);

// User routes (require authentication)
router.get(
  "/recruiter/my-jobs",
  authenticate,
  requireRecruiter,
  jobController.getMyJobs,
);

// Job modification routes (require authentication - poster or admin)
router.patch("/:id", authenticate, requireRecruiter, jobController.updateJob);
router.delete("/:id", authenticate, requireRecruiter, jobController.deleteJob);

export const jobRouter = router;
