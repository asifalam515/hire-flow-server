import { authenticate, requireCandidate } from "@middleware/auth.middleware";
import { Router } from "express";
import {
  profileController,
  upload,
  uploadProfileFile,
} from "./profile.controller";

const router = Router();

router.get(
  "/mine",
  authenticate,
  requireCandidate,
  profileController.getMyProfile,
);
router.post(
  "/mine",
  authenticate,
  requireCandidate,
  profileController.upsertMyProfile,
);

// Upload avatar or resume. Use form field `file` and body `type` = avatar|resume
router.post(
  "/upload",
  authenticate,
  requireCandidate,
  upload.single("file"),
  uploadProfileFile,
);

export const profileRouter = router;
