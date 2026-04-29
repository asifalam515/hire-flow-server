import { authenticate, requireRecruiter } from "@middleware/auth.middleware";
import { Router } from "express";
import { analyticsController } from "./analytics.controller";
const router = Router();
router.get("/overview", authenticate, requireRecruiter, analyticsController.getOverview);
router.get("/funnel", authenticate, requireRecruiter, analyticsController.getFunnel);
export const analyticsRouter = router;
//# sourceMappingURL=analytics.router.js.map