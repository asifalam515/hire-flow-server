import {
  authenticate,
  authorize,
  requireRecruiter,
} from "@middleware/auth.middleware";
import { Router } from "express";
import { applicationController } from "./application.controller";
import { interviewController } from "./interview.controller";

const router = Router();

router.get(
  "/mine",
  authenticate,
  authorize(["CANDIDATE"]),
  applicationController.getMyApplications,
);

router.get(
  "/job/:id",
  authenticate,
  requireRecruiter,
  applicationController.getApplicantsForJob,
);

router.put(
  "/:id/stage",
  authenticate,
  requireRecruiter,
  applicationController.moveApplicantStage,
);

router.post(
  "/:applicationId/interview",
  authenticate,
  requireRecruiter,
  interviewController.scheduleInterview,
);
router.put(
  "/bulk/stage",
  authenticate,
  requireRecruiter,
  applicationController.bulkMoveApplicantStages,
);

router.get(
  "/job/:id/export",
  authenticate,
  requireRecruiter,
  applicationController.exportApplicantsToCSV,
);

router.post(
  "/:id/notes",
  authenticate,
  requireRecruiter,
  applicationController.addApplicationNote,
);

router.get(
  "/:id/notes",
  authenticate,
  requireRecruiter,
  applicationController.getApplicationNotes,
);

router.get(
  "/job/:id/kanban",
  authenticate,
  requireRecruiter,
  applicationController.getKanbanBoard,
);

router.get(
  "/:id/timeline",
  authenticate,
  applicationController.getApplicationTimeline,
);

router.patch(
  "/:id/withdraw",
  authenticate,
  authorize(["CANDIDATE"]),
  applicationController.withdrawApplication,
);

router.patch(
  "/:id/labels",
  authenticate,
  requireRecruiter,
  applicationController.updateApplicationLabels,
);

router.post(
  "/:id/labels",
  authenticate,
  requireRecruiter,
  applicationController.addApplicationLabel,
);

router.delete(
  "/:id/labels/:label",
  authenticate,
  requireRecruiter,
  applicationController.removeApplicationLabel,
);

export const applicationRouter = router;
