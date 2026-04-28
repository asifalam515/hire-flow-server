import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { companyService } from "./company.service";

// POST /companies - Create a new company
export const createCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      slug,
      logoUrl,
      bannerUrl,
      website,
      linkedinUrl,
      description,
      industry,
      size,
      founded,
      country,
      city,
    } = req.body;

    if (!name || !slug) {
      throw new AppError("Name and slug are required", 400);
    }

    const company = await companyService.createCompanyInDb(
      {
        name,
        slug,
        logoUrl,
        bannerUrl,
        website,
        linkedinUrl,
        description,
        industry,
        size,
        founded,
        country,
        city,
      },
      req.user?.id as string,
    );

    res.status(201).json({
      success: true,
      data: company,
      message: "Company created successfully",
    });
  },
);

// GET /companies - Get all companies with pagination
export const getAllCompanies = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isActive =
      req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
          ? false
          : undefined;
    const isVerified =
      req.query.isVerified === "true"
        ? true
        : req.query.isVerified === "false"
          ? false
          : undefined;
    const search = (req.query.search as string) || undefined;

    const result = await companyService.getAllCompaniesFromDb(page, limit, {
      isActive,
      isVerified,
      search,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  },
);

// GET /companies/:id - Get company by ID
export const getCompanyById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const company = await companyService.getCompanyByIdFromDb(id);

    res.status(200).json({
      success: true,
      data: company,
    });
  },
);

// GET /companies/slug/:slug - Get company by slug
export const getCompanyBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const company = await companyService.getCompanyBySlugFromDb(slug);

    res.status(200).json({
      success: true,
      data: company,
    });
  },
);

// PATCH /companies/:id - Update company
export const updateCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      name,
      logoUrl,
      bannerUrl,
      website,
      linkedinUrl,
      description,
      industry,
      size,
      founded,
      country,
      city,
      isActive,
    } = req.body;

    // Check if user is company owner or admin
    const company = await companyService.getCompanyByIdFromDb(id);
    const isOwner = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner,
    );

    if (!isOwner && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to update this company",
        403,
      );
    }

    const updatedCompany = await companyService.updateCompanyInDb(id, {
      name,
      logoUrl,
      bannerUrl,
      website,
      linkedinUrl,
      description,
      industry,
      size,
      founded,
      country,
      city,
      isActive,
    });

    res.status(200).json({
      success: true,
      data: updatedCompany,
      message: "Company updated successfully",
    });
  },
);

// DELETE /companies/:id - Delete company
export const deleteCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if user is company owner or admin
    const company = await companyService.getCompanyByIdFromDb(id);
    const isOwner = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner,
    );

    if (!isOwner && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to delete this company",
        403,
      );
    }

    const deletedCompany = await companyService.deleteCompanyFromDb(id);

    res.status(200).json({
      success: true,
      data: deletedCompany,
      message: "Company deleted successfully",
    });
  },
);

// POST /companies/:id/verify - Verify company (Admin only)
export const verifyCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      throw new AppError("isVerified must be a boolean", 400);
    }

    const company = await companyService.verifyCompanyInDb(id, isVerified);

    res.status(200).json({
      success: true,
      data: company,
      message: `Company ${isVerified ? "verified" : "unverified"} successfully`,
    });
  },
);

// GET /companies/user/my-companies - Get companies for current user
export const getUserCompanies = asyncHandler(
  async (req: Request, res: Response) => {
    const companies = await companyService.getUserCompaniesFromDb(
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      data: companies,
    });
  },
);

// POST /companies/:id/members - Add member to company
export const addCompanyMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, isOwner } = req.body;

    if (!userId) {
      throw new AppError("userId is required", 400);
    }

    // Check if user is company owner
    const company = await companyService.getCompanyByIdFromDb(id);
    const isCompanyOwner = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner,
    );

    if (!isCompanyOwner && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to add members to this company",
        403,
      );
    }

    const member = await companyService.addCompanyMemberInDb(
      id,
      userId,
      isOwner || false,
    );

    res.status(201).json({
      success: true,
      data: member,
      message: "Member added successfully",
    });
  },
);

// POST /companies/:id/join - Join company (self)
export const joinCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Only authenticated users can join; caller identity is used
  const userId = req.user?.id as string;
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const member = await companyService.addCompanyMemberInDb(id, userId, false);

  res.status(201).json({
    success: true,
    data: member,
    message: "Joined company successfully",
  });
});

// DELETE /companies/:id/members/:userId - Remove member from company
export const removeCompanyMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, userId } = req.params;

    // Check if user is company owner
    const company = await companyService.getCompanyByIdFromDb(id);
    const isCompanyOwner = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner,
    );

    if (!isCompanyOwner && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to remove members from this company",
        403,
      );
    }

    const member = await companyService.removeCompanyMemberFromDb(id, userId);

    res.status(200).json({
      success: true,
      data: member,
      message: "Member removed successfully",
    });
  },
);

// GET /companies/:id/members - Get company members
export const getCompanyMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const members = await companyService.getCompanyMembersFromDb(id);

    res.status(200).json({
      success: true,
      data: members,
    });
  },
);

export const companyController = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  getCompanyBySlug,
  updateCompany,
  deleteCompany,
  verifyCompany,
  getUserCompanies,
  addCompanyMember,
  removeCompanyMember,
  getCompanyMembers,
  joinCompany,
};
