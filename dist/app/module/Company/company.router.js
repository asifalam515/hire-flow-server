import { authenticate, authorize, requireAdmin, requireRecruiter, } from "@middleware/auth.middleware";
import { Router } from "express";
import { companyController } from "./company.controller";
import { emailTemplatesController } from "./emailTemplates.controller";
import { teamRouter } from "./team.router";
const router = Router();
// Public routes
router.get("/", companyController.getAllCompanies);
router.get("/slug/:slug", companyController.getCompanyBySlug);
router.get("/:id", companyController.getCompanyById);
router.get("/:id/members", companyController.getCompanyMembers);
// Protected routes - require authentication
router.post("/", authenticate, requireRecruiter, companyController.createCompany);
// Recruiter self-join route
router.post("/:id/join", authenticate, requireRecruiter, companyController.joinCompany);
// Routes requiring company ownership or admin
router.patch("/:id", authenticate, companyController.updateCompany);
router.delete("/:id", authenticate, companyController.deleteCompany);
router.post("/:id/members", authenticate, companyController.addCompanyMember);
router.delete("/:id/members/:userId", authenticate, companyController.removeCompanyMember);
// User routes
router.get("/user/my-companies", authenticate, companyController.getUserCompanies);
// Admin only routes
router.post("/:id/verify", authenticate, requireAdmin, companyController.verifyCompany);
// Mount team routes (this effectively adds /companies/:id/invite, /companies/join, etc)
router.use("/", teamRouter);
// Email templates
router.get("/:id/email-templates", authenticate, authorize(["RECRUITER", "ADMIN"]), emailTemplatesController.getTemplates);
router.post("/:id/email-templates", authenticate, authorize(["RECRUITER", "ADMIN"]), emailTemplatesController.createTemplate);
router.put("/:id/email-templates/:templateId", authenticate, authorize(["RECRUITER", "ADMIN"]), emailTemplatesController.updateTemplate);
router.delete("/:id/email-templates/:templateId", authenticate, authorize(["RECRUITER", "ADMIN"]), emailTemplatesController.deleteTemplate);
export const companyRouter = router;
//# sourceMappingURL=company.router.js.map