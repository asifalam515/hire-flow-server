import { authenticate } from "@middleware/auth.middleware";
import { Router } from "express";
import { uploadsController } from "./uploads.controller";

const router = Router();

// Protect all upload routes
router.use(authenticate);

// Generate signed URLs
router.post("/resume/signed-url", uploadsController.getResumeSignedUrl);
router.post("/avatar/signed-url", uploadsController.getAvatarSignedUrl);

// Confirm uploads
router.post("/resume/confirm", uploadsController.confirmResume);
router.post("/avatar/confirm", uploadsController.confirmAvatar);

// Delete file
router.delete("/:publicId", uploadsController.deleteFile);

export const uploadsRouter = router;
