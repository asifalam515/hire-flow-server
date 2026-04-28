import { authenticate, requireCandidate } from "@middleware/auth.middleware";
import { Router } from "express";
import { savedJobsController } from "./savedJobs.controller";

const router = Router();

router.post(
  "/:jobId",
  authenticate,
  requireCandidate,
  savedJobsController.saveJob,
);

router.delete(
  "/:jobId",
  authenticate,
  requireCandidate,
  savedJobsController.removeSavedJob,
);

router.get(
  "/",
  authenticate,
  requireCandidate,
  savedJobsController.listSavedJobs,
);

export const savedJobsRouter = router;
