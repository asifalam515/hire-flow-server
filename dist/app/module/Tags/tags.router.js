import { Router } from "express";
import { tagsController } from "./tags.controller";
const router = Router();
// Public routes for skills
router.get("/skills/popular", tagsController.getPopularSkills);
router.get("/skills", tagsController.searchSkills);
export const tagsRouter = router;
//# sourceMappingURL=tags.router.js.map