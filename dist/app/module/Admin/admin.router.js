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
router.patch("/jobs/:id/force-close", adminController.forceCloseJob);
// Platform Analytics
router.get("/analytics", adminController.getPlatformAnalytics);
// Company Verification
router.get("/companies/pending", adminController.getPendingCompanies);
router.patch("/companies/:id/verify", adminController.verifyCompany);
// Admin audit trail
router.get("/audit-trail", adminController.getAdminAuditTrail);
// Search & Audit
router.get("/search", adminController.globalAdminSearch);
router.get("/audit-logs", adminController.getAuditLogs);
export const adminRouter = router;
//# sourceMappingURL=admin.router.js.map