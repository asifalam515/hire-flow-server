import { authenticate, requireCandidate } from "@middleware/auth.middleware";
import { Router } from "express";
import { workExperienceController } from "./workExperience.controller";
const router = Router();
router.post("/", authenticate, requireCandidate, workExperienceController.createWorkExperience);
router.get("/", authenticate, requireCandidate, workExperienceController.getMyWorkExperiences);
router.put("/:id", authenticate, requireCandidate, workExperienceController.updateWorkExperience);
router.delete("/:id", authenticate, requireCandidate, workExperienceController.deleteWorkExperience);
export const workExperienceRouter = router;
//# sourceMappingURL=workExperience.router.js.map