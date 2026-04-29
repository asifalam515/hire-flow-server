import { authenticate, authorize } from "@middleware/auth.middleware";
import { Router } from "express";
import { adminController } from "./admin.controller";
const router = Router();
// All routes require authentication and ADMIN role
router.use(authenticate, authorize(["ADMIN"]));
// User Management
router.get("/users", adminController.getUsers);
router.patch("/users/:id/suspend", adminController.suspendUser);
router.patch("/users/:id/role", adminController.assignUserRole);
// Job Moderation
router.get("/jobs/pending", adminController.getPendingJobs);
router.patch("/jobs/:id/moderate", adminController.moderateJob);
// Platform Analytics
router.get("/analytics", adminController.getPlatformAnalytics);
export const adminRouter = router;
//# sourceMappingURL=admin.router.js.map