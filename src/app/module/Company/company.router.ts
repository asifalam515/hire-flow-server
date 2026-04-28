import {
  authenticate,
  requireAdmin,
  requireRecruiter,
} from "@middleware/auth.middleware";
import { Router } from "express";
import { companyController } from "./company.controller";

const router = Router();

// Public routes
router.get("/", companyController.getAllCompanies);
router.get("/slug/:slug", companyController.getCompanyBySlug);
router.get("/:id", companyController.getCompanyById);
router.get("/:id/members", companyController.getCompanyMembers);

// Protected routes - require authentication
router.post(
  "/",
  authenticate,
  requireRecruiter,
  companyController.createCompany,
);

// Recruiter self-join route
router.post(
  "/:id/join",
  authenticate,
  requireRecruiter,
  companyController.joinCompany,
);

// Routes requiring company ownership or admin
router.patch("/:id", authenticate, companyController.updateCompany);
router.delete("/:id", authenticate, companyController.deleteCompany);
router.post("/:id/members", authenticate, companyController.addCompanyMember);
router.delete(
  "/:id/members/:userId",
  authenticate,
  companyController.removeCompanyMember,
);

// User routes
router.get(
  "/user/my-companies",
  authenticate,
  companyController.getUserCompanies,
);

// Admin only routes
router.post(
  "/:id/verify",
  authenticate,
  requireAdmin,
  companyController.verifyCompany,
);

export const companyRouter = router;
