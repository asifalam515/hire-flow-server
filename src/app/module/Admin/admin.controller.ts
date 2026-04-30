import type { JobStatus, Role } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import type { Request, Response } from "express";
import { adminService } from "./admin.service";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string, 10) || 1;
  const limit = Number.parseInt(req.query.limit as string, 10) || 10;

  const result = await adminService.getUsersFromDb(page, limit);

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const suspendUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { isSuspended } = req.body;

  if (typeof isSuspended !== "boolean") {
    throw new AppError("isSuspended boolean is required", 400);
  }

  const updatedUser = await adminService.toggleUserSuspensionInDb(
    userId,
    isSuspended,
  );

  res.status(200).json({
    success: true,
    message: `User suspension status updated to ${isSuspended}`,
    data: updatedUser,
  });
});

export const assignUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      throw new AppError("role is required", 400);
    }

    const updatedUser = await adminService.assignUserRoleInDb(
      userId,
      role as Role,
    );

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser,
    });
  },
);

export const getPendingJobs = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 10;

    const result = await adminService.getPendingJobsFromDb(page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const moderateJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const { status } = req.body;

  if (!status) {
    throw new AppError("status is required", 400);
  }

  const updatedJob = await adminService.moderateJobInDb(
    jobId as string,
    status as JobStatus,
  );

  res.status(200).json({
    success: true,
    message: `Job status updated to ${status}`,
    data: updatedJob,
  });
});

export const getPlatformAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await adminService.getPlatformAnalyticsFromDb();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  },
);

export const getPendingCompanies = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 10;

    const result = await adminService.getPendingCompaniesFromDb(page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const verifyCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.params.id;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      throw new AppError("isVerified boolean is required", 400);
    }

    const updatedCompany = await adminService.verifyCompanyInDb(
      companyId as string,
      isVerified,
    );

    res.status(200).json({
      success: true,
      message: `Company verification status updated to ${isVerified}`,
      data: updatedCompany,
    });
  },
);

export const globalAdminSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 10;

    if (!query) {
      throw new AppError("Search query 'q' is required", 400);
    }

    const result = await adminService.globalAdminSearchFromDb(query, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const getAuditLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 10;

    const result = await adminService.getAuditLogsFromDb(page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const adminController = {
  getUsers,
  suspendUser,
  assignUserRole,
  getPendingJobs,
  moderateJob,
  getPlatformAnalytics,
  getPendingCompanies,
  verifyCompany,
  globalAdminSearch,
  getAuditLogs,
};
