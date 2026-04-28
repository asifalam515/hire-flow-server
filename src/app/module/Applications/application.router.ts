import {
  authenticate,
  authorize,
  requireRecruiter,
} from "@middleware/auth.middleware";
import { Router } from "express";
import { applicationController } from "./application.controller";

const router = Router();

router.get(
  "/mine",
  authenticate,
  authorize(["CANDIDATE"]),
  applicationController.getMyApplications,
);

router.put(
  "/:id/stage",
  authenticate,
  requireRecruiter,
  applicationController.moveApplicantStage,
);

export const applicationRouter = router;
