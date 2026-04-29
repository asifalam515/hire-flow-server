import { authenticate, requireCandidate } from "@middleware/auth.middleware";
import { Router } from "express";
import { educationController } from "./education.controller";
const router = Router();
router.post("/", authenticate, requireCandidate, educationController.createEducation);
router.get("/", authenticate, requireCandidate, educationController.getMyEducations);
router.put("/:id", authenticate, requireCandidate, educationController.updateEducation);
router.delete("/:id", authenticate, requireCandidate, educationController.deleteEducation);
export const educationRouter = router;
//# sourceMappingURL=education.router.js.map