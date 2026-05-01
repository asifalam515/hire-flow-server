import {
  Role,
  __esm,
  __export,
  __require,
  __toCommonJS,
  prisma,
  profileService
} from "./chunk-PHN3MCJV.js";

// src/config/redis.ts
var redis_exports = {};
__export(redis_exports, {
  cacheGet: () => cacheGet,
  cacheSet: () => cacheSet,
  default: () => redis_default,
  del: () => del,
  invalidateJobsCache: () => invalidateJobsCache2,
  keys: () => keys,
  redis: () => redis
});
import NodeCache from "node-cache";
var ttlDefault, cache, cacheGet, cacheSet, keys, del, invalidateJobsCache2, redisClient, redis, redis_default;
var init_redis = __esm({
  "src/config/redis.ts"() {
    "use strict";
    ttlDefault = 60;
    cache = new NodeCache({ stdTTL: ttlDefault, checkperiod: 120 });
    cacheGet = async (key) => {
      const v = cache.get(key);
      return v === void 0 ? null : v;
    };
    cacheSet = async (key, value, ttlSec = ttlDefault) => {
      cache.set(key, value, ttlSec);
    };
    keys = async (pattern) => {
      const regex = new RegExp(
        "^" + pattern.split("*").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$"
      );
      return cache.keys().filter((k) => regex.test(k));
    };
    del = async (...ks) => {
      return cache.del(ks);
    };
    invalidateJobsCache2 = async () => {
      try {
        const ks = await keys("jobs:list:*");
        if (ks && ks.length > 0) {
          await del(...ks);
        }
      } catch (err) {
        console.error("Failed to invalidate jobs cache", err);
      }
    };
    redisClient = null;
    try {
      const IORedis = __require("ioredis");
      const client = new IORedis(process.env.REDIS_URL || void 0);
      redisClient = client;
    } catch (err) {
      redisClient = {
        async incr(key) {
          const cur = cache.get(key) ?? 0;
          const next = Number(cur) + 1;
          cache.set(key, next);
          return next;
        },
        async get(key) {
          const v = cache.get(key);
          return v === void 0 || v === null ? null : String(v);
        },
        async keys(pattern) {
          return keys(pattern);
        },
        async del(...ks) {
          return del(...ks);
        }
      };
    }
    redis = redisClient;
    redis_default = cache;
  }
});

// src/server.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import http from "http";
import cron from "node-cron";
import { Server as IOServer } from "socket.io";

// src/lib/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
var auth = betterAuth({
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.CANDIDATE
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  },
  callbacks: {
    session: async ({ user: user2, session }) => {
      return {
        ...session,
        user: {
          ...user2,
          role: user2.role
          // 👈 IMPORTANT
        }
      };
    }
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  advanced: {
    disableOriginCheck: process.env.NODE_ENV !== "production"
  }
});

// src/middleware/auth.middleware.ts
var authenticate = async (req, res, next) => {
  try {
    const sessionHeader = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionHeader) {
      throw new AppError("No session token provided", 401);
    }
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session?.user) {
      throw new AppError("Invalid or expired session", 401);
    }
    req.user = session.user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Authentication failed"
      });
    }
  }
};
var authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated", 401);
      }
      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(
          `Access denied. Required roles: ${allowedRoles.join(", ")}`,
          403
        );
      }
      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Authorization failed"
        });
      }
    }
  };
};
var requireAdmin = authorize(["ADMIN"]);
var requireRecruiter = authorize(["RECRUITER", "ADMIN"]);
var requireCandidate = authorize(["CANDIDATE", "RECRUITER", "ADMIN"]);

// src/app/module/Admin/admin.router.ts
import { Router } from "express";

// src/utils/adminLog.ts
var logAdminAction = (actorId, action, entityType, entityId, metadata) => {
  prisma.adminLog.create({
    data: {
      actorId,
      action,
      entityType,
      entityId,
      metadata: metadata ?? null
    }
  }).catch((err) => {
    console.error("Failed to write admin log:", err);
  });
};

// src/lib/asyncHandler.ts
var asyncHandler = (handler) => {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
};

// src/app/module/Admin/admin.service.ts
var getUsersFromDb = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        createdAt: true
      }
    }),
    prisma.user.count()
  ]);
  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var toggleUserSuspensionInDb = async (userId, isSuspended) => {
  const user2 = await prisma.user.findUnique({ where: { id: userId } });
  if (!user2) {
    throw new AppError("User not found", 404);
  }
  const previousStatus = user2.isSuspended;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isSuspended },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isSuspended: true
    }
  });
  return { updatedUser, previousStatus };
};
var assignUserRoleInDb = async (userId, role) => {
  const user2 = await prisma.user.findUnique({ where: { id: userId } });
  if (!user2) {
    throw new AppError("User not found", 404);
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isSuspended: true
    }
  });
  return updatedUser;
};
var getPendingJobsFromDb = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { status: "PENDING_APPROVAL" },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        company: {
          select: { name: true, slug: true, logoUrl: true }
        },
        recruiter: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.job.count({ where: { status: "PENDING_APPROVAL" } })
  ]);
  return {
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var moderateJobInDb = async (jobId, status) => {
  if (status !== "PUBLISHED" && status !== "REJECTED") {
    throw new AppError("Status must be PUBLISHED or REJECTED", 400);
  }
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: {
      status,
      ...status === "PUBLISHED" && { publishedAt: /* @__PURE__ */ new Date() }
    }
  });
  return updatedJob;
};
var getPlatformAnalyticsFromDb = async () => {
  const [totalUsers, totalJobs, totalApplications] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count()
  ]);
  const thirtyDaysAgo = /* @__PURE__ */ new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true }
  });
  const signupsPerDay = users.reduce(
    (acc, user2) => {
      const date = user2.createdAt.toISOString().slice(0, 10);
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );
  const signupsChart = Object.entries(signupsPerDay).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
  return {
    totalUsers,
    totalJobs,
    totalApplications,
    signupsChart
  };
};
var getPendingCompaniesFromDb = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where: { isVerified: false },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.company.count({ where: { isVerified: false } })
  ]);
  return {
    data: companies,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var verifyCompanyInDb = async (companyId, isVerified) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: { isVerified }
  });
  return updatedCompany;
};
var forceCloseJobInDb = async (jobId, reason) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: { status: "CLOSED" }
  });
  return updatedJob;
};
var globalAdminSearchFromDb = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [users, companies, jobs] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } }
        ]
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { industry: { contains: query, mode: "insensitive" } }
        ]
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        industry: true,
        isVerified: true
      }
    }),
    prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } }
        ]
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        status: true,
        type: true,
        createdAt: true
      }
    })
  ]);
  return {
    users,
    companies,
    jobs,
    pagination: {
      page,
      limit
    }
  };
};
var getAuditLogsFromDb = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        changedBy: { select: { name: true, email: true } },
        application: { select: { id: true, stage: true, candidateId: true } }
      }
    }),
    prisma.auditLog.count()
  ]);
  return {
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAdminAuditTrailFromDb = async (filters = {}, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.actorId) where.actorId = filters.actorId;
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.action) where.action = filters.action;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }
  const [data, total] = await Promise.all([
    prisma.adminLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { actor: { select: { id: true, email: true, name: true } } }
    }),
    prisma.adminLog.count({ where })
  ]);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var adminService = {
  getUsersFromDb,
  toggleUserSuspensionInDb,
  assignUserRoleInDb,
  getPendingJobsFromDb,
  moderateJobInDb,
  getPlatformAnalyticsFromDb,
  getPendingCompaniesFromDb,
  verifyCompanyInDb,
  globalAdminSearchFromDb,
  getAuditLogsFromDb,
  getAdminAuditTrailFromDb,
  forceCloseJobInDb
};

// src/app/module/Admin/admin.controller.ts
var getUsers = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const result = await adminService.getUsersFromDb(page, limit);
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});
var suspendUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { isSuspended } = req.body;
  if (typeof isSuspended !== "boolean") {
    throw new AppError("isSuspended boolean is required", 400);
  }
  const { updatedUser, previousStatus } = await adminService.toggleUserSuspensionInDb(userId, isSuspended);
  try {
    logAdminAction(req.user.id, "USER_SUSPENDED", "USER", userId, {
      reason: req.body.reason ?? null,
      previousStatus,
      newStatus: isSuspended
    });
  } catch (err) {
  }
  res.status(200).json({
    success: true,
    message: `User suspension status updated to ${isSuspended}`,
    data: updatedUser
  });
});
var assignUserRole = asyncHandler(
  async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    if (!role) {
      throw new AppError("role is required", 400);
    }
    const updatedUser = await adminService.assignUserRoleInDb(
      userId,
      role
    );
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser
    });
  }
);
var getPendingJobs = asyncHandler(
  async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const result = await adminService.getPendingJobsFromDb(page, limit);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var moderateJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const { status } = req.body;
  if (!status) {
    throw new AppError("status is required", 400);
  }
  const updatedJob = await adminService.moderateJobInDb(
    jobId,
    status
  );
  res.status(200).json({
    success: true,
    message: `Job status updated to ${status}`,
    data: updatedJob
  });
});
var getPlatformAnalytics = asyncHandler(
  async (req, res) => {
    const analytics = await adminService.getPlatformAnalyticsFromDb();
    res.status(200).json({
      success: true,
      data: analytics
    });
  }
);
var getPendingCompanies = asyncHandler(
  async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const result = await adminService.getPendingCompaniesFromDb(page, limit);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var verifyCompany = asyncHandler(
  async (req, res) => {
    const companyId = req.params.id;
    const { isVerified } = req.body;
    if (typeof isVerified !== "boolean") {
      throw new AppError("isVerified boolean is required", 400);
    }
    const updatedCompany = await adminService.verifyCompanyInDb(
      companyId,
      isVerified
    );
    try {
      logAdminAction(
        req.user.id,
        "COMPANY_VERIFIED",
        "COMPANY",
        companyId,
        {
          previousVerified: !isVerified ? false : null,
          newVerified: isVerified
        }
      );
    } catch (err) {
    }
    res.status(200).json({
      success: true,
      message: `Company verification status updated to ${isVerified}`,
      data: updatedCompany
    });
  }
);
var forceCloseJob = asyncHandler(
  async (req, res) => {
    const jobId = req.params.id;
    const { reason } = req.body;
    const updatedJob = await adminService.forceCloseJobInDb(jobId);
    try {
      logAdminAction(req.user.id, "JOB_FORCE_CLOSED", "JOB", jobId, {
        reason: reason ?? null
      });
    } catch (err) {
    }
    res.status(200).json({
      success: true,
      message: `Job ${jobId} force-closed`,
      data: updatedJob
    });
  }
);
var globalAdminSearch = asyncHandler(
  async (req, res) => {
    const query = req.query.q;
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    if (!query) {
      throw new AppError("Search query 'q' is required", 400);
    }
    const result = await adminService.globalAdminSearchFromDb(
      query,
      page,
      limit
    );
    res.status(200).json({
      success: true,
      data: result
    });
  }
);
var getAuditLogs = asyncHandler(
  async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const result = await adminService.getAuditLogsFromDb(page, limit);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var getAdminAuditTrail = asyncHandler(
  async (req, res) => {
    const actorId = req.query.actorId;
    const entityType = req.query.entityType;
    const action = req.query.action;
    const from = req.query.from;
    const to = req.query.to;
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const result = await adminService.getAdminAuditTrailFromDb(
      { actorId, entityType, action, from, to },
      page,
      limit
    );
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var adminController = {
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
  forceCloseJob,
  getAdminAuditTrail
};

// src/app/module/Admin/admin.router.ts
var router = Router();
router.use(authenticate, authorize(["ADMIN"]));
router.get("/users", adminController.getUsers);
router.patch("/users/:id/suspend", adminController.suspendUser);
router.patch("/users/:id/role", adminController.assignUserRole);
router.get("/jobs/pending", adminController.getPendingJobs);
router.patch("/jobs/:id/moderate", adminController.moderateJob);
router.patch("/jobs/:id/force-close", adminController.forceCloseJob);
router.get("/analytics", adminController.getPlatformAnalytics);
router.get("/companies/pending", adminController.getPendingCompanies);
router.patch("/companies/:id/verify", adminController.verifyCompany);
router.get("/audit-trail", adminController.getAdminAuditTrail);
router.get("/search", adminController.globalAdminSearch);
router.get("/audit-logs", adminController.getAuditLogs);
var adminRouter = router;

// src/app/module/Analytics/analytics.router.ts
import { Router as Router2 } from "express";

// src/app/module/Analytics/analytics.service.ts
var applicationStages = [
  "APPLIED",
  "SCREENING",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
  "WITHDRAWN"
];
var normalizeBucket = (value) => {
  return value === "month" ? "month" : "week";
};
var parseDateRangeFilter = (from, to, bucket) => {
  const parsedFrom = from ? new Date(from) : void 0;
  const parsedTo = to ? new Date(to) : void 0;
  if (parsedFrom && Number.isNaN(parsedFrom.getTime())) {
    throw new AppError("Invalid 'from' date", 400);
  }
  if (parsedTo && Number.isNaN(parsedTo.getTime())) {
    throw new AppError("Invalid 'to' date", 400);
  }
  if (parsedFrom && parsedTo && parsedFrom > parsedTo) {
    throw new AppError("'from' date must be earlier than 'to' date", 400);
  }
  return {
    from: parsedFrom,
    to: parsedTo,
    bucket: normalizeBucket(bucket)
  };
};
var buildDateWhere = (field, range) => {
  const where = {};
  if (range.from || range.to) {
    where[field] = {
      ...range.from ? { gte: range.from } : {},
      ...range.to ? { lte: range.to } : {}
    };
  }
  return where;
};
var getRecruiterCompanyFromDb = async (userId) => {
  const membership = await prisma.companyMember.findUnique({
    where: { userId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          isVerified: true,
          isActive: true
        }
      }
    }
  });
  if (!membership) {
    throw new AppError(
      "No company is connected to this recruiter. Join a company first.",
      404
    );
  }
  return membership;
};
var buildStageCountMap = () => {
  return applicationStages.reduce(
    (acc, stage) => {
      acc[stage] = 0;
      return acc;
    },
    {}
  );
};
var bucketDate = (date, bucket) => {
  const value = new Date(date);
  if (bucket === "month") {
    return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}`;
  }
  const day = value.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  value.setUTCDate(value.getUTCDate() - diffToMonday);
  value.setUTCHours(0, 0, 0, 0);
  return value.toISOString().slice(0, 10);
};
var getChartSeries = (applications, bucket) => {
  const map = /* @__PURE__ */ new Map();
  for (const application of applications) {
    const label = bucketDate(application.createdAt, bucket);
    const current = map.get(label) ?? {
      label,
      total: 0,
      stages: buildStageCountMap()
    };
    current.total += 1;
    current.stages[application.stage] += 1;
    map.set(label, current);
  }
  return Array.from(map.values()).sort(
    (a, b) => a.label.localeCompare(b.label)
  );
};
var getJobPipelineCounts = async (jobIds, from, to) => {
  if (jobIds.length === 0) {
    return [];
  }
  return prisma.application.groupBy({
    by: ["jobId", "stage"],
    where: {
      jobId: { in: jobIds },
      ...from || to ? {
        createdAt: {
          ...from ? { gte: from } : {},
          ...to ? { lte: to } : {}
        }
      } : {}
    },
    _count: { stage: true }
  });
};
var getRecruiterOverviewFromDb = async (userId, range) => {
  const membership = await getRecruiterCompanyFromDb(userId);
  const jobDateFilter = buildDateWhere("createdAt", range);
  const applicationDateFilter = buildDateWhere("createdAt", range);
  const companyJobs = await prisma.job.findMany({
    where: { companyId: membership.companyId, ...jobDateFilter },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
      publishedAt: true,
      _count: {
        select: { applications: true, savedBy: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  const companyJobIds = companyJobs.map((job) => job.id);
  const applications = companyJobIds.length > 0 ? await prisma.application.findMany({
    where: {
      jobId: { in: companyJobIds },
      ...applicationDateFilter
    },
    select: {
      id: true,
      jobId: true,
      stage: true,
      createdAt: true,
      source: true,
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  }) : [];
  const [
    totalJobs,
    publishedJobs,
    draftJobs,
    pausedJobs,
    closedJobs,
    expiredJobs,
    stageRows
  ] = await Promise.all([
    prisma.job.count({
      where: { companyId: membership.companyId, ...jobDateFilter }
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "PUBLISHED",
        ...jobDateFilter
      }
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "DRAFT",
        ...jobDateFilter
      }
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "PAUSED",
        ...jobDateFilter
      }
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "CLOSED",
        ...jobDateFilter
      }
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "EXPIRED",
        ...jobDateFilter
      }
    }),
    companyJobIds.length > 0 ? prisma.application.groupBy({
      by: ["stage"],
      where: {
        jobId: { in: companyJobIds },
        ...applicationDateFilter
      },
      _count: { stage: true }
    }) : Promise.resolve([])
  ]);
  const stageCounts = buildStageCountMap();
  for (const row of stageRows) {
    stageCounts[row.stage] = row._count.stage;
  }
  const topJobs = companyJobs.map((job) => ({
    id: job.id,
    title: job.title,
    slug: job.slug,
    status: job.status,
    createdAt: job.createdAt,
    publishedAt: job.publishedAt,
    applications: job._count.applications,
    savedCount: job._count.savedBy
  })).sort((a, b) => b.applications - a.applications).slice(0, 5);
  const recentApplications = applications.slice(0, 10).map((application) => ({
    id: application.id,
    stage: application.stage,
    createdAt: application.createdAt,
    candidate: application.candidate,
    job: application.job
  }));
  const chart = getChartSeries(applications, range.bucket);
  const sourceBreakdown = {};
  for (const app2 of applications) {
    const src = app2.source || "UNKNOWN";
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  }
  const applicationIds = applications.map((app2) => app2.id);
  const auditLogs = applicationIds.length > 0 ? await prisma.auditLog.findMany({
    where: { applicationId: { in: applicationIds } },
    orderBy: { createdAt: "asc" }
  }) : [];
  const timePerStage = {};
  for (const appId of applicationIds) {
    const logs = auditLogs.filter((log) => log.applicationId === appId);
    if (logs.length === 0) continue;
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (log.fromStage) {
        const nextTime = i + 1 < logs.length ? logs[i + 1].createdAt.getTime() : Date.now();
        const duration = nextTime - log.createdAt.getTime();
        if (!timePerStage[log.fromStage]) {
          timePerStage[log.fromStage] = { totalMs: 0, count: 0 };
        }
        timePerStage[log.fromStage].totalMs += duration;
        timePerStage[log.fromStage].count += 1;
      }
    }
  }
  const averageTimePerStage = {};
  for (const [stage, data] of Object.entries(timePerStage)) {
    averageTimePerStage[stage] = parseFloat((data.totalMs / data.count / (1e3 * 60 * 60 * 24)).toFixed(1));
  }
  return {
    company: membership.company,
    recruiter: {
      id: userId,
      role: membership.isOwner ? "OWNER" : "RECRUITER"
    },
    filters: {
      from: range.from ?? null,
      to: range.to ?? null,
      bucket: range.bucket
    },
    jobs: {
      total: totalJobs,
      published: publishedJobs,
      draft: draftJobs,
      paused: pausedJobs,
      closed: closedJobs,
      expired: expiredJobs
    },
    applications: {
      total: applications.length,
      byStage: stageCounts,
      sourceBreakdown,
      averageTimePerStageDays: averageTimePerStage
    },
    topJobs,
    recentApplications,
    chart
  };
};
var getRecruiterFunnelFromDb = async (userId, range) => {
  const membership = await getRecruiterCompanyFromDb(userId);
  const jobs = await prisma.job.findMany({
    where: { companyId: membership.companyId },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  const jobIds = jobs.map((job) => job.id);
  const grouped = await getJobPipelineCounts(jobIds, range.from, range.to);
  const groupedMap = /* @__PURE__ */ new Map();
  for (const job of jobs) {
    groupedMap.set(job.id, buildStageCountMap());
  }
  for (const row of grouped) {
    const current = groupedMap.get(row.jobId);
    if (!current) continue;
    current[row.stage] = row._count.stage;
  }
  const pipeline = jobs.map((job) => {
    const stageCounts = groupedMap.get(job.id) ?? buildStageCountMap();
    const applied = stageCounts.APPLIED || 0;
    const screening = stageCounts.SCREENING || 0;
    const assessment = stageCounts.ASSESSMENT || 0;
    const interview = stageCounts.INTERVIEW || 0;
    const offer = stageCounts.OFFER || 0;
    const hired = stageCounts.HIRED || 0;
    const dropOff = {
      appliedToScreening: applied > 0 ? Number(((applied - screening) / applied * 100).toFixed(2)) : 0,
      screeningToAssessment: screening > 0 ? Number(((screening - assessment) / screening * 100).toFixed(2)) : 0,
      assessmentToInterview: assessment > 0 ? Number(((assessment - interview) / assessment * 100).toFixed(2)) : 0,
      interviewToOffer: interview > 0 ? Number(((interview - offer) / interview * 100).toFixed(2)) : 0,
      offerToHired: offer > 0 ? Number(((offer - hired) / offer * 100).toFixed(2)) : 0
    };
    return {
      job: {
        id: job.id,
        title: job.title,
        slug: job.slug,
        status: job.status,
        publishedAt: job.publishedAt
      },
      applications: job._count.applications,
      stages: stageCounts,
      dropOff,
      conversionRateToHire: job._count.applications > 0 ? Number((hired / job._count.applications * 100).toFixed(2)) : 0
    };
  });
  return {
    company: membership.company,
    filters: {
      from: range.from ?? null,
      to: range.to ?? null,
      bucket: range.bucket
    },
    pipeline
  };
};
var parseAnalyticsRange = (query) => parseDateRangeFilter(query.from, query.to, query.bucket);
var analyticsService = {
  getRecruiterOverviewFromDb,
  getRecruiterFunnelFromDb,
  parseAnalyticsRange
};

// src/app/module/Analytics/analytics.controller.ts
var getOverview = asyncHandler(async (req, res) => {
  const range = analyticsService.parseAnalyticsRange({
    from: req.query.from,
    to: req.query.to,
    bucket: req.query.bucket
  });
  const overview = await analyticsService.getRecruiterOverviewFromDb(
    req.user?.id,
    range
  );
  res.status(200).json({
    success: true,
    data: overview
  });
});
var getFunnel = asyncHandler(async (req, res) => {
  const range = analyticsService.parseAnalyticsRange({
    from: req.query.from,
    to: req.query.to,
    bucket: req.query.bucket
  });
  const funnel = await analyticsService.getRecruiterFunnelFromDb(
    req.user?.id,
    range
  );
  res.status(200).json({
    success: true,
    data: funnel
  });
});
var analyticsController = {
  getOverview,
  getFunnel
};

// src/app/module/Analytics/analytics.router.ts
var router2 = Router2();
router2.get(
  "/overview",
  authenticate,
  requireRecruiter,
  analyticsController.getOverview
);
router2.get(
  "/funnel",
  authenticate,
  requireRecruiter,
  analyticsController.getFunnel
);
var analyticsRouter = router2;

// src/app/module/Applications/application.router.ts
import { Router as Router3 } from "express";

// src/lib/socket.ts
var io = null;
var connectedUsers = /* @__PURE__ */ new Map();
var authenticateSocket = async (socket) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return null;
    }
    const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
    return userId;
  } catch (err) {
    console.error("Socket authentication failed", err);
    return null;
  }
};
var addConnectedUser = (userId, socketId) => {
  if (!connectedUsers.has(userId)) {
    connectedUsers.set(userId, /* @__PURE__ */ new Set());
  }
  connectedUsers.get(userId).add(socketId);
};
var removeConnectedUser = (userId, socketId) => {
  const userSockets = connectedUsers.get(userId);
  if (userSockets) {
    userSockets.delete(socketId);
    if (userSockets.size === 0) {
      connectedUsers.delete(userId);
    }
  }
};
var getUserSockets = (userId) => {
  const sockets = connectedUsers.get(userId);
  return sockets ? Array.from(sockets) : [];
};
var emitToUser = (userId, event, data) => {
  const sockets = getUserSockets(userId);
  const io_instance = getIO();
  if (io_instance) {
    sockets.forEach((socketId) => {
      io_instance.to(socketId).emit(event, data);
    });
  }
};
var setIO = (server2) => {
  io = server2;
};
var getIO = () => io;

// src/modules/notifications/notifications.service.ts
var createNotification = async (userId, type, title, body, data) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      // Prisma will coerce enum string values
      type,
      title,
      body,
      data: data ? data : null
    }
  });
  try {
    emitToUser(userId, "notification:new", {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      createdAt: notification.createdAt
    });
  } catch (err) {
  }
  return notification;
};
var getNotifications = async (userId, unreadOnly = false, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const where = { userId };
  if (unreadOnly) where.isRead = false;
  const [data, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.notification.count({ where })
  ]);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUnreadCount = async (userId) => {
  return prisma.notification.count({ where: { userId, isRead: false } });
};
var markAsRead = async (notificationId, userId) => {
  const updated2 = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: /* @__PURE__ */ new Date() }
  });
  return updated2.count > 0;
};
var markAllAsRead = async (userId) => {
  const res = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: /* @__PURE__ */ new Date() }
  });
  try {
    emitToUser(userId, "notification:read_all", {});
  } catch (err) {
  }
  return res.count;
};
var deleteNotification = async (notificationId, userId) => {
  const deleted = await prisma.notification.deleteMany({
    where: { id: notificationId, userId }
  });
  return deleted.count > 0;
};
var deleteAllNotifications = async (userId) => {
  const res = await prisma.notification.deleteMany({ where: { userId } });
  return res.count;
};
var notifications_service_default = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
};

// src/app/module/Company/emailTemplates.service.ts
var createTemplate = async (companyId, payload) => {
  if (payload.isDefault) {
    await prisma.emailTemplate.updateMany({
      where: { companyId, isDefault: true },
      data: { isDefault: false }
    });
  }
  const t = await prisma.emailTemplate.create({
    data: {
      companyId,
      name: payload.name,
      subject: payload.subject,
      body: payload.body,
      stage: payload.stage,
      isDefault: payload.isDefault ?? false
    }
  });
  return t;
};
var getTemplates = async (companyId) => {
  return await prisma.emailTemplate.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" }
  });
};
var updateTemplate = async (companyId, templateId, payload) => {
  const tpl = await prisma.emailTemplate.findUnique({
    where: { id: templateId }
  });
  if (!tpl || tpl.companyId !== companyId) {
    throw new AppError("Template not found", 404);
  }
  if (payload.isDefault) {
    await prisma.emailTemplate.updateMany({
      where: { companyId, isDefault: true },
      data: { isDefault: false }
    });
  }
  const updated2 = await prisma.emailTemplate.update({
    where: { id: templateId },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.subject !== void 0 && { subject: payload.subject },
      ...payload.body !== void 0 && { body: payload.body },
      ...payload.stage !== void 0 && { stage: payload.stage },
      ...payload.isDefault !== void 0 && { isDefault: payload.isDefault }
    }
  });
  return updated2;
};
var deleteTemplate = async (companyId, templateId) => {
  const tpl = await prisma.emailTemplate.findUnique({
    where: { id: templateId }
  });
  if (!tpl || tpl.companyId !== companyId) {
    throw new AppError("Template not found", 404);
  }
  await prisma.emailTemplate.delete({ where: { id: templateId } });
  return { success: true };
};
var applyVariables = (text, vars) => {
  let out = text;
  for (const k of Object.keys(vars)) {
    const v = vars[k] ?? "";
    const re = new RegExp(`{{\\s*${k}\\s*}}`, "g");
    out = out.replace(re, String(v));
  }
  return out;
};
var resolveTemplate = async (companyId, stage, variables = {}) => {
  let tpl = null;
  if (stage) {
    tpl = await prisma.emailTemplate.findFirst({ where: { companyId, stage } });
  }
  if (!tpl) {
    tpl = await prisma.emailTemplate.findFirst({
      where: { companyId, isDefault: true }
    });
  }
  if (tpl) {
    const subject = applyVariables(tpl.subject, variables);
    const body = applyVariables(tpl.body, variables);
    return { subject, body };
  }
  const defaultSubject = "Application update: {{jobTitle}} \u2014 {{stage}}";
  const defaultBody = `<p>Hi {{candidateName}},</p><p>Your application for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> is now in <strong>{{stage}}</strong> stage.</p><p>Regards,<br/>{{companyName}}</p>`;
  return {
    subject: applyVariables(defaultSubject, variables),
    body: applyVariables(defaultBody, variables)
  };
};
var emailTemplatesService = {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
  resolveTemplate
};

// src/lib/mailer.ts
import nodemailer from "nodemailer";
var host = process.env.SMTP_HOST;
var port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : void 0;
var user = process.env.SMTP_USER;
var pass = process.env.SMTP_PASS;
var transporter = null;
if (host && port && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });
} else {
  transporter = null;
}
var sendMail = async (to, subject, html, text) => {
  if (!transporter) {
    console.log("[mailer] sendMail fallback \u2014 no SMTP configured");
    console.log({ to, subject, text, html });
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `no-reply@example.com`,
    to,
    subject,
    text: text ?? void 0,
    html
  });
};
var sendStageChangeEmail = async (companyId, to, variables) => {
  const resolved = await emailTemplatesService.resolveTemplate(
    companyId,
    variables.stage,
    variables
  );
  await sendMail(to, resolved.subject, resolved.body);
};

// src/lib/richTextUtils.ts
var sanitizeHTML = (html) => {
  if (!html || typeof html !== "string") return "";
  let sanitized = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");
  sanitized = sanitized.replace(
    /\s(href|src)\s*=\s*["']?data:/gi,
    ' $1="javascript:void(0)"'
  );
  sanitized = sanitized.replace(
    /\s(href|src)\s*=\s*["']?javascript:/gi,
    ' $1="javascript:void(0)"'
  );
  return sanitized;
};
var validateHTMLLength = (html, maxLength = 5e3) => {
  return html && typeof html === "string" && html.length <= maxLength;
};

// src/app/module/Applications/notification.service.ts
var sendApplicationReceivedEmail = async (recruiterEmail, recruiterName, context) => {
  const subject = `New Application: ${context.jobTitle}`;
  const html = `
    <p>Hi ${recruiterName},</p>
    <p><strong>${context.candidateName}</strong> has applied for the <strong>${context.jobTitle}</strong> position at <strong>${context.companyName}</strong>.</p>
    <p>
      <strong>Candidate Email:</strong> ${context.candidateEmail}<br/>
      <strong>Job Title:</strong> ${context.jobTitle}<br/>
      <strong>Company:</strong> ${context.companyName}
    </p>
    <p>Log in to review the application and take action.</p>
    <p>Regards,<br/>HireFlow Team</p>
  `;
  try {
    await sendMail(recruiterEmail, subject, html);
  } catch (err) {
    console.error("Failed to send application received email", err);
  }
};
var sendInterviewScheduledEmail = async (candidateEmail, candidateName, context) => {
  const interviewType = context.interviewDetails?.type || "Interview";
  const dateTime = context.interviewDetails?.dateTime ? new Date(context.interviewDetails.dateTime).toLocaleString() : "TBD";
  const location = context.interviewDetails?.location || "To be confirmed";
  const meetingUrl = context.interviewDetails?.meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${context.interviewDetails.meetingUrl}">${context.interviewDetails.meetingUrl}</a></p>` : "";
  const subject = `Interview Scheduled: ${context.jobTitle} at ${context.companyName}`;
  const html = `
    <p>Hi ${candidateName},</p>
    <p>Great news! We would like to invite you for an interview for the <strong>${context.jobTitle}</strong> position at <strong>${context.companyName}</strong>.</p>
    <p>
      <strong>Interview Type:</strong> ${interviewType}<br/>
      <strong>Date & Time:</strong> ${dateTime}<br/>
      <strong>Location:</strong> ${location}
    </p>
    ${meetingUrl}
    <p>Please confirm your availability and let us know if you have any questions.</p>
    <p>Regards,<br/>${context.companyName}</p>
  `;
  try {
    await sendMail(candidateEmail, subject, html);
  } catch (err) {
    console.error("Failed to send interview scheduled email", err);
  }
};
var sendOfferExtendedEmail = async (candidateEmail, candidateName, context) => {
  const salary = context.salaryOffer ? `${context.salaryCurrency || "USD"} ${context.salaryOffer.toLocaleString()}/year` : "Competitive";
  const subject = `Job Offer: ${context.jobTitle} at ${context.companyName}`;
  const html = `
    <p>Hi ${candidateName},</p>
    <p>We're excited to offer you the position of <strong>${context.jobTitle}</strong> at <strong>${context.companyName}</strong>!</p>
    <p>
      <strong>Position:</strong> ${context.jobTitle}<br/>
      <strong>Company:</strong> ${context.companyName}<br/>
      <strong>Offered Salary:</strong> ${salary}
    </p>
    <p>Please review the offer details and let us know of your decision at your earliest convenience.</p>
    <p>Regards,<br/>${context.companyName}</p>
  `;
  try {
    await sendMail(candidateEmail, subject, html);
  } catch (err) {
    console.error("Failed to send offer extended email", err);
  }
};

// src/app/module/Applications/application.service.ts
var isUserAdmin = async (userId) => {
  const user2 = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  return user2?.role === "ADMIN";
};
var submitApplicationToDb = async (jobId, candidateId, payload) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      postedById: true,
      title: true,
      status: true,
      expiresAt: true,
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true
        }
      }
    }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  if (job.status !== "PUBLISHED") {
    throw new AppError("This job is not accepting applications", 400);
  }
  if (job.expiresAt && job.expiresAt < /* @__PURE__ */ new Date()) {
    throw new AppError("This job posting has expired", 400);
  }
  const existing = await prisma.application.findUnique({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId
      }
    },
    select: { id: true }
  });
  if (existing) {
    throw new AppError("You have already applied for this job", 409);
  }
  let sanitizedCoverLetter = payload.coverLetter;
  if (sanitizedCoverLetter) {
    if (!validateHTMLLength(sanitizedCoverLetter, 5e3)) {
      throw new AppError(
        "Cover letter exceeds maximum length of 5000 characters",
        400
      );
    }
    sanitizedCoverLetter = sanitizeHTML(sanitizedCoverLetter);
  }
  const application = await prisma.application.create({
    data: {
      candidateId,
      jobId,
      resumeUrl: payload.resumeUrl,
      ...payload.resumeFileName && { resumeFileName: payload.resumeFileName },
      ...sanitizedCoverLetter && { coverLetter: sanitizedCoverLetter },
      source: payload.source ?? "DIRECT",
      ...payload.referralCode && { referralCode: payload.referralCode },
      ...payload.answers && {
        screeningAnswers: {
          create: payload.answers.map((a) => ({
            questionId: a.questionId,
            answer: a.answer
          }))
        }
      }
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true
            }
          }
        }
      },
      candidate: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });
  await prisma.job.update({
    where: { id: jobId },
    data: {
      applicationCount: {
        increment: 1
      }
    }
  });
  try {
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      select: { name: true, email: true }
    });
    const recruiter = await prisma.user.findUnique({
      where: { id: job.postedById },
      select: { name: true, email: true }
    });
    if (recruiter?.email && candidate?.email) {
      await sendApplicationReceivedEmail(
        recruiter.email,
        recruiter.name || "Recruiter",
        {
          candidateName: candidate.name || "Candidate",
          candidateEmail: candidate.email,
          jobTitle: job.title,
          companyName: job.company.name
        }
      );
    }
  } catch (err) {
    console.error("Failed to send application received notification", err);
  }
  try {
    const io3 = getIO();
    if (io3) {
      emitToUser(job.postedById, "application:new", {
        jobId: job.id,
        applicationId: application.id,
        jobTitle: job.title,
        candidateName: application.candidate?.name || "Candidate",
        candidateImage: application.candidate?.image || null,
        appliedAt: application.createdAt
      });
    }
  } catch (err) {
  }
  try {
    await notifications_service_default.createNotification(
      updated.candidate.id,
      "STAGE_UPDATED",
      `Application updated \u2014 ${updated.job.title}`,
      `Your application for ${updated.job.title} is now ${updated.stage}`,
      {
        applicationId: updated.id,
        jobId: updated.job.id,
        stage: updated.stage
      }
    );
    await notifications_service_default.createNotification(
      recruiterId,
      "STAGE_UPDATED",
      `Applicant updated \u2014 ${updated.job.title}`,
      `${updated.candidate.name || "Candidate"} moved to ${updated.stage}`,
      {
        applicationId: updated.id,
        candidateId: updated.candidate.id,
        stage: updated.stage
      }
    );
  } catch (err) {
  }
  try {
    await notifications_service_default.createNotification(
      job.postedById,
      "APPLICATION_RECEIVED",
      `New application: ${job.title}`,
      `${application.candidate?.name || "Candidate"} applied for ${job.title}`,
      {
        jobId: job.id,
        applicationId: application.id
      }
    );
  } catch (err) {
  }
  return application;
};
var getMyApplicationsFromDb = async (candidateId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = { candidateId };
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            experienceLevel: true,
            location: true,
            isRemote: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            salaryPeriod: true,
            status: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.application.count({ where })
  ]);
  return {
    data: applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getApplicantsForJobFromDb = async (jobId, recruiterId2, page = 1, limit = 10) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      postedById: true,
      title: true,
      company: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to view applicants for this job",
      403
    );
  }
  const skip = (page - 1) * limit;
  const where = { jobId };
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.application.count({ where })
  ]);
  return {
    job,
    data: applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var moveApplicantStageInDb = async (applicationId, recruiterId2, payload) => {
  const existing = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          id: true,
          postedById: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  if (!existing) {
    throw new AppError("Application not found", 404);
  }
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && existing.job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to update this application",
      403
    );
  }
  if (existing.stage === payload.stage) {
    throw new AppError(`Application is already in ${payload.stage} stage`, 400);
  }
  const updated2 = await prisma.application.update({
    where: { id: applicationId },
    data: {
      stage: payload.stage
    },
    include: {
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    }
  });
  await prisma.auditLog.create({
    data: {
      applicationId,
      changedById: recruiterId2,
      fromStage: existing.stage,
      toStage: payload.stage,
      ...payload.reason && { reason: payload.reason }
    }
  });
  try {
    if (updated2.candidate.email) {
      await sendStageChangeEmail(
        updated2.job.company.id,
        updated2.candidate.email,
        {
          candidateName: updated2.candidate.name || "Candidate",
          jobTitle: updated2.job.title,
          companyName: updated2.job.company.name,
          stage: payload.stage
        }
      );
    }
  } catch (err) {
    console.error("Failed to send stage update email", err);
  }
  try {
    const io3 = getIO();
    if (io3) {
      emitToUser(updated2.candidate.id, "application:stage_updated", {
        applicationId: updated2.id,
        jobId: updated2.job.id,
        stage: updated2.stage,
        previousStage: existing.stage,
        companyName: updated2.job.company.name
      });
      emitToUser(recruiterId2, "applicant:stage_updated", {
        applicationId: updated2.id,
        candidateId: updated2.candidate.id,
        stage: updated2.stage
      });
    }
  } catch (err) {
  }
  return updated2;
};
var bulkMoveApplicantStagesInDb = async (applicationIds, recruiterId2, stage, reason) => {
  const admin = await isUserAdmin(recruiterId2);
  const results = [];
  for (const id of applicationIds) {
    try {
      const updated2 = await moveApplicantStageInDb(id, recruiterId2, {
        stage,
        ...reason && { reason }
      });
      results.push({ id, status: "success", data: updated2 });
    } catch (error) {
      results.push({ id, status: "error", message: error.message });
    }
  }
  return results;
};
var exportApplicantsToCSVFromDb = async (jobId, recruiterId2) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { postedById: true }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to export applicants for this job",
      403
    );
  }
  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      candidate: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  const csvRows = ["Name,Email,Stage,AppliedAt,Source"];
  applications.forEach((app2) => {
    csvRows.push(
      `"${app2.candidate.name}","${app2.candidate.email}","${app2.stage}","${app2.createdAt.toISOString()}","${app2.source}"`
    );
  });
  return csvRows.join("\\n");
};
var addApplicationNoteToDb = async (applicationId, authorId, content) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      job: { select: { postedById: true } }
    }
  });
  if (!application) {
    throw new AppError("Application not found", 404);
  }
  const admin = await isUserAdmin(authorId);
  if (!admin && application.job.postedById !== authorId) {
    throw new AppError(
      "You do not have permission to add notes to this application",
      403
    );
  }
  const note = await prisma.applicationNote.create({
    data: {
      applicationId,
      authorId,
      content
    }
  });
  return note;
};
var getApplicationNotesFromDb = async (applicationId, recruiterId2) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      job: { select: { postedById: true } }
    }
  });
  if (!application) {
    throw new AppError("Application not found", 404);
  }
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && application.job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to view notes for this application",
      403
    );
  }
  const notes = await prisma.applicationNote.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });
  return notes;
};
var getApplicationTimelineFromDb = async (applicationId, userId) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      candidateId: true,
      job: { select: { postedById: true } }
    }
  });
  if (!application) {
    throw new AppError("Application not found", 404);
  }
  const admin = await isUserAdmin(userId);
  if (!admin && application.job.postedById !== userId && application.candidateId !== userId) {
    throw new AppError(
      "You do not have permission to view this application timeline",
      403
    );
  }
  const logs = await prisma.auditLog.findMany({
    where: { applicationId },
    include: { changedBy: { select: { name: true, image: true, role: true } } }
  });
  const notes = await prisma.applicationNote.findMany({
    where: { applicationId },
    include: { author: { select: { name: true, image: true, role: true } } }
  });
  const timeline = [
    ...logs.map((log) => ({
      type: "STAGE_CHANGE",
      data: log,
      timestamp: log.createdAt
    })),
    ...notes.map((note) => ({
      type: "NOTE",
      data: note,
      timestamp: note.createdAt
    }))
  ];
  timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  return timeline;
};
var withdrawApplicationFromDb = async (applicationId, candidateId) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId }
  });
  if (!application) {
    throw new AppError("Application not found", 404);
  }
  if (application.candidateId !== candidateId) {
    throw new AppError(
      "You do not have permission to withdraw this application",
      403
    );
  }
  if (application.stage === "WITHDRAWN" || application.stage === "HIRED" || application.stage === "REJECTED") {
    throw new AppError(
      `Cannot withdraw application in ${application.stage} stage`,
      400
    );
  }
  const updated2 = await prisma.application.update({
    where: { id: applicationId },
    data: { stage: "WITHDRAWN" }
  });
  await prisma.auditLog.create({
    data: {
      applicationId,
      changedById: candidateId,
      fromStage: application.stage,
      toStage: "WITHDRAWN",
      reason: "Candidate voluntarily withdrew application"
    }
  });
  return updated2;
};
var getKanbanBoardFromDb = async (jobId, recruiterId2) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { postedById: true }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to view applicants for this job",
      403
    );
  }
  const applications = await prisma.application.findMany({
    where: { jobId, isArchived: false },
    include: {
      candidate: {
        select: { id: true, name: true, image: true, headline: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });
  const kanban = {
    APPLIED: [],
    SCREENING: [],
    ASSESSMENT: [],
    INTERVIEW: [],
    OFFER: [],
    HIRED: [],
    REJECTED: [],
    WITHDRAWN: []
  };
  for (const app2 of applications) {
    kanban[app2.stage].push(app2);
  }
  return kanban;
};
var updateApplicationLabelsInDb = async (applicationId, recruiterId2, labels) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { job: { select: { postedById: true } } }
  });
  if (!application) {
    throw new AppError("Application not found", 404);
  }
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && application.job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to update labels for this application",
      403
    );
  }
  const updated2 = await prisma.application.update({
    where: { id: applicationId },
    data: { labels }
  });
  return updated2;
};
var addLabelToApplicationInDb = async (applicationId, label, recruiterId2) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { job: { select: { postedById: true } }, labels: true }
  });
  if (!application) throw new AppError("Application not found", 404);
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && application.job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to update labels for this application",
      403
    );
  }
  const existing = application.labels || [];
  if (existing.includes(label)) {
    return await prisma.application.findUnique({
      where: { id: applicationId }
    });
  }
  const updated2 = await prisma.application.update({
    where: { id: applicationId },
    data: { labels: { push: label } }
  });
  return updated2;
};
var removeLabelFromApplicationInDb = async (applicationId, label, recruiterId2) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { job: { select: { postedById: true } }, labels: true }
  });
  if (!application) throw new AppError("Application not found", 404);
  const admin = await isUserAdmin(recruiterId2);
  if (!admin && application.job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to update labels for this application",
      403
    );
  }
  const updatedLabels = (application.labels || []).filter((l) => l !== label);
  const updated2 = await prisma.application.update({
    where: { id: applicationId },
    data: { labels: updatedLabels }
  });
  return updated2;
};
var applicationService = {
  submitApplicationToDb,
  getMyApplicationsFromDb,
  getApplicantsForJobFromDb,
  moveApplicantStageInDb,
  bulkMoveApplicantStagesInDb,
  exportApplicantsToCSVFromDb,
  addApplicationNoteToDb,
  getApplicationNotesFromDb,
  getApplicationTimelineFromDb,
  withdrawApplicationFromDb,
  getKanbanBoardFromDb,
  updateApplicationLabelsInDb,
  addLabelToApplicationInDb,
  removeLabelFromApplicationInDb
};

// src/app/module/Applications/application.controller.ts
var applyToJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const {
    resumeUrl,
    resumeFileName,
    coverLetter,
    source,
    referralCode,
    useSavedResume,
    answers
  } = req.body;
  if (!jobId) {
    throw new AppError("Job id is required", 400);
  }
  let finalResumeUrl = resumeUrl;
  let finalResumeFileName = resumeFileName;
  if (useSavedResume) {
    const profile = await (await import("./profile.service-4MUAPRHM.js")).profileService.getProfileFromDb(req.user?.id);
    if (!profile?.resumeUrl) {
      throw new AppError("No saved resume found on profile", 400);
    }
    finalResumeUrl = profile.resumeUrl;
    finalResumeFileName = profile.resumeFileName;
  }
  if (!finalResumeUrl) {
    throw new AppError("resumeUrl is required", 400);
  }
  const application = await applicationService.submitApplicationToDb(
    jobId,
    req.user?.id,
    {
      resumeUrl: finalResumeUrl,
      ...finalResumeFileName && { resumeFileName: finalResumeFileName },
      ...coverLetter && { coverLetter },
      ...source && { source },
      ...referralCode && { referralCode },
      ...answers && { answers }
    }
  );
  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    data: application
  });
});
var getMyApplications = asyncHandler(
  async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const result = await applicationService.getMyApplicationsFromDb(
      req.user?.id,
      page,
      limit
    );
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var getApplicantsForJob = asyncHandler(
  async (req, res) => {
    const jobId = req.params.id;
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    if (!jobId) {
      throw new AppError("Job id is required", 400);
    }
    const result = await applicationService.getApplicantsForJobFromDb(
      jobId,
      req.user?.id,
      page,
      limit
    );
    res.status(200).json({
      success: true,
      job: result.job,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var moveApplicantStage = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    const { stage, reason } = req.body;
    if (!applicationId) {
      throw new AppError("Application id is required", 400);
    }
    if (!stage) {
      throw new AppError("stage is required", 400);
    }
    const updated2 = await applicationService.moveApplicantStageInDb(
      applicationId,
      req.user?.id,
      {
        stage,
        reason
      }
    );
    res.status(200).json({
      success: true,
      message: "Application stage updated successfully",
      data: updated2
    });
  }
);
var bulkMoveApplicantStages = asyncHandler(
  async (req, res) => {
    const { applicationIds, stage, reason } = req.body;
    if (!applicationIds || !Array.isArray(applicationIds)) {
      throw new AppError("applicationIds array is required", 400);
    }
    if (!stage) {
      throw new AppError("stage is required", 400);
    }
    const results = await applicationService.bulkMoveApplicantStagesInDb(
      applicationIds,
      req.user?.id,
      stage,
      reason
    );
    res.status(200).json({
      success: true,
      message: "Bulk stage update completed",
      data: results
    });
  }
);
var exportApplicantsToCSV = asyncHandler(
  async (req, res) => {
    const jobId = req.params.id;
    if (!jobId) {
      throw new AppError("Job id is required", 400);
    }
    const csvData = await applicationService.exportApplicantsToCSVFromDb(
      jobId,
      req.user?.id
    );
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=applicants-${jobId}.csv`
    );
    res.status(200).send(csvData);
  }
);
var addApplicationNote = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    const { content } = req.body;
    if (!applicationId) {
      throw new AppError("Application id is required", 400);
    }
    if (!content) {
      throw new AppError("content is required", 400);
    }
    const note = await applicationService.addApplicationNoteToDb(
      applicationId,
      req.user?.id,
      content
    );
    res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: note
    });
  }
);
var getApplicationNotes = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    if (!applicationId) {
      throw new AppError("Application id is required", 400);
    }
    const notes = await applicationService.getApplicationNotesFromDb(
      applicationId,
      req.user?.id
    );
    res.status(200).json({
      success: true,
      data: notes
    });
  }
);
var getApplicationTimeline = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    if (!applicationId) throw new AppError("Application id is required", 400);
    const timeline = await applicationService.getApplicationTimelineFromDb(
      applicationId,
      req.user?.id
    );
    res.status(200).json({
      success: true,
      data: timeline
    });
  }
);
var withdrawApplication = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    if (!applicationId) throw new AppError("Application id is required", 400);
    const updated2 = await applicationService.withdrawApplicationFromDb(
      applicationId,
      req.user?.id
    );
    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: updated2
    });
  }
);
var getKanbanBoard = asyncHandler(
  async (req, res) => {
    const jobId = req.params.id;
    if (!jobId) throw new AppError("Job id is required", 400);
    const kanban = await applicationService.getKanbanBoardFromDb(
      jobId,
      req.user?.id
    );
    res.status(200).json({
      success: true,
      data: kanban
    });
  }
);
var updateApplicationLabels = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    const { labels } = req.body;
    if (!applicationId) throw new AppError("Application id is required", 400);
    if (!Array.isArray(labels))
      throw new AppError("labels array is required", 400);
    const updated2 = await applicationService.updateApplicationLabelsInDb(
      applicationId,
      req.user?.id,
      labels
    );
    res.status(200).json({
      success: true,
      message: "Labels updated successfully",
      data: updated2
    });
  }
);
var addApplicationLabel = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    const { label } = req.body;
    if (!applicationId) throw new AppError("Application id is required", 400);
    if (!label) throw new AppError("label is required", 400);
    const updated2 = await applicationService.addLabelToApplicationInDb(
      applicationId,
      label,
      req.user?.id
    );
    res.status(200).json({ success: true, message: "Label added", data: updated2 });
  }
);
var removeApplicationLabel = asyncHandler(
  async (req, res) => {
    const applicationId = req.params.id;
    const label = req.params.label;
    if (!applicationId) throw new AppError("Application id is required", 400);
    if (!label) throw new AppError("label is required", 400);
    const updated2 = await applicationService.removeLabelFromApplicationInDb(
      applicationId,
      label,
      req.user?.id
    );
    res.status(200).json({ success: true, message: "Label removed", data: updated2 });
  }
);
var applicationController = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  moveApplicantStage,
  bulkMoveApplicantStages,
  exportApplicantsToCSV,
  addApplicationNote,
  getApplicationNotes,
  getApplicationTimeline,
  withdrawApplication,
  getKanbanBoard,
  updateApplicationLabels,
  addApplicationLabel,
  removeApplicationLabel
};

// src/app/module/Applications/interview.service.ts
var scheduleInterview = async (applicationId, recruiterId2, data) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          postedById: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      candidate: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  if (!application) {
    throw new AppError("Application not found", 404);
  }
  const admin = await isUserAdmin2(recruiterId2);
  if (!admin && application.job.postedById !== recruiterId2) {
    throw new AppError(
      "You do not have permission to schedule interviews for this application",
      403
    );
  }
  const interview = await prisma.interview.create({
    data: {
      applicationId,
      scheduledById: recruiterId2,
      type: data.type,
      scheduledAt: new Date(data.scheduledAt),
      durationMins: data.durationMins || 60,
      ...data.location && { location: data.location },
      ...data.meetingUrl && { meetingUrl: data.meetingUrl },
      ...data.notes && { notes: data.notes }
    }
  });
  try {
    if (application.candidate.email) {
      await sendInterviewScheduledEmail(
        application.candidate.email,
        application.candidate.name || "Candidate",
        {
          candidateName: application.candidate.name || "Candidate",
          candidateEmail: application.candidate.email,
          jobTitle: application.job.title,
          companyName: application.job.company.name,
          interviewDetails: {
            type: data.type,
            dateTime: data.scheduledAt,
            ...data.location && { location: data.location },
            ...data.meetingUrl && { meetingUrl: data.meetingUrl }
          }
        }
      );
    }
  } catch (err) {
    console.error("Failed to send interview scheduled email", err);
  }
  return interview;
};
var sendOfferEmail = async (applicationId, salaryOffer) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      candidate: {
        select: {
          name: true,
          email: true
        }
      },
      job: {
        select: {
          title: true,
          salaryMax: true,
          salaryCurrency: true,
          company: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
  if (!application || !application.candidate.email) {
    throw new AppError("Application or candidate email not found", 404);
  }
  try {
    await sendOfferExtendedEmail(
      application.candidate.email,
      application.candidate.name || "Candidate",
      {
        candidateName: application.candidate.name || "Candidate",
        candidateEmail: application.candidate.email,
        jobTitle: application.job.title,
        companyName: application.job.company.name,
        salaryOffer: salaryOffer || application.job.salaryMax || 0,
        salaryCurrency: application.job.salaryCurrency || "USD"
      }
    );
  } catch (err) {
    console.error("Failed to send offer email", err);
  }
};
var isUserAdmin2 = async (userId) => {
  const user2 = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  return user2?.role === "ADMIN";
};
var interviewService = {
  scheduleInterview,
  sendOfferEmail
};

// src/app/module/Applications/interview.controller.ts
var scheduleInterview2 = asyncHandler(async (req, res) => {
  const recruiterId2 = req.user?.id;
  if (!recruiterId2) throw new AppError("Authentication required", 401);
  const applicationId = req.params.applicationId;
  if (!applicationId) throw new AppError("Application ID required", 400);
  const { type, scheduledAt, durationMins, location, meetingUrl, notes } = req.body;
  if (!type || !scheduledAt) {
    throw new AppError("Interview type and scheduled time are required", 400);
  }
  const interview = await interviewService.scheduleInterview(
    applicationId,
    recruiterId2,
    {
      type,
      scheduledAt: new Date(scheduledAt),
      ...durationMins && { durationMins },
      ...location && { location },
      ...meetingUrl && { meetingUrl },
      ...notes && { notes }
    }
  );
  res.status(201).json({ success: true, data: interview });
});
var interviewController = {
  scheduleInterview: scheduleInterview2
};

// src/app/module/Applications/application.router.ts
var router3 = Router3();
router3.get(
  "/mine",
  authenticate,
  authorize(["CANDIDATE"]),
  applicationController.getMyApplications
);
router3.get(
  "/job/:id",
  authenticate,
  requireRecruiter,
  applicationController.getApplicantsForJob
);
router3.put(
  "/:id/stage",
  authenticate,
  requireRecruiter,
  applicationController.moveApplicantStage
);
router3.post(
  "/:applicationId/interview",
  authenticate,
  requireRecruiter,
  interviewController.scheduleInterview
);
router3.put(
  "/bulk/stage",
  authenticate,
  requireRecruiter,
  applicationController.bulkMoveApplicantStages
);
router3.get(
  "/job/:id/export",
  authenticate,
  requireRecruiter,
  applicationController.exportApplicantsToCSV
);
router3.post(
  "/:id/notes",
  authenticate,
  requireRecruiter,
  applicationController.addApplicationNote
);
router3.get(
  "/:id/notes",
  authenticate,
  requireRecruiter,
  applicationController.getApplicationNotes
);
router3.get(
  "/job/:id/kanban",
  authenticate,
  requireRecruiter,
  applicationController.getKanbanBoard
);
router3.get(
  "/:id/timeline",
  authenticate,
  applicationController.getApplicationTimeline
);
router3.patch(
  "/:id/withdraw",
  authenticate,
  authorize(["CANDIDATE"]),
  applicationController.withdrawApplication
);
router3.patch(
  "/:id/labels",
  authenticate,
  requireRecruiter,
  applicationController.updateApplicationLabels
);
router3.post(
  "/:id/labels",
  authenticate,
  requireRecruiter,
  applicationController.addApplicationLabel
);
router3.delete(
  "/:id/labels/:label",
  authenticate,
  requireRecruiter,
  applicationController.removeApplicationLabel
);
var applicationRouter = router3;

// src/app/module/Candidate/education.router.ts
import { Router as Router4 } from "express";

// src/app/module/Candidate/education.service.ts
var createEducation = async (profileId, data) => {
  const education = await prisma.education.create({
    data: {
      profileId,
      institution: data.institution,
      degree: data.degree,
      field: data.field,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current ?? false,
      gpa: data.gpa
    }
  });
  return education;
};
var getEducationByProfileId = async (profileId) => {
  const educations = await prisma.education.findMany({
    where: { profileId },
    orderBy: { startDate: "desc" }
  });
  return educations;
};
var getEducationById = async (id) => {
  const education = await prisma.education.findUnique({
    where: { id }
  });
  return education;
};
var updateEducation = async (id, data) => {
  const updateData = {};
  if (data.institution !== void 0) updateData.institution = data.institution;
  if (data.degree !== void 0) updateData.degree = data.degree;
  if (data.field !== void 0) updateData.field = data.field;
  if (data.startDate !== void 0)
    updateData.startDate = new Date(data.startDate);
  if (data.endDate !== void 0)
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.current !== void 0) updateData.current = data.current;
  if (data.gpa !== void 0) updateData.gpa = data.gpa;
  const education = await prisma.education.update({
    where: { id },
    data: updateData
  });
  return education;
};
var deleteEducation = async (id) => {
  await prisma.education.delete({
    where: { id }
  });
};
var educationService = {
  createEducation,
  getEducationByProfileId,
  getEducationById,
  updateEducation,
  deleteEducation
};

// src/app/module/Candidate/education.controller.ts
var createEducation2 = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Authentication required", 401);
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError("Profile not found. Create profile first.", 404);
  }
  const { institution, degree, field, startDate, endDate, current, gpa } = req.body;
  if (!institution || !degree || !field || !startDate) {
    throw new AppError(
      "Institution, degree, field, and startDate are required",
      400
    );
  }
  const education = await educationService.createEducation(profile.id, {
    institution,
    degree,
    field,
    startDate,
    endDate,
    current,
    gpa
  });
  res.status(201).json({ success: true, data: education });
});
var getMyEducations = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Authentication required", 401);
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }
  const educations = await educationService.getEducationByProfileId(profile.id);
  res.status(200).json({ success: true, data: educations });
});
var updateEducation2 = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) throw new AppError("Authentication required", 401);
  if (!id) throw new AppError("Education ID required", 400);
  const education = await educationService.getEducationById(id);
  if (!education) {
    throw new AppError("Education not found", 404);
  }
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });
  if (!profile || education.profileId !== profile.id) {
    throw new AppError("You do not have permission to update this", 403);
  }
  const updated2 = await educationService.updateEducation(id, req.body);
  res.status(200).json({ success: true, data: updated2 });
});
var deleteEducation2 = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) throw new AppError("Authentication required", 401);
  if (!id) throw new AppError("Education ID required", 400);
  const education = await educationService.getEducationById(id);
  if (!education) {
    throw new AppError("Education not found", 404);
  }
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });
  if (!profile || education.profileId !== profile.id) {
    throw new AppError("You do not have permission to delete this", 403);
  }
  await educationService.deleteEducation(id);
  res.status(200).json({ success: true, message: "Education deleted" });
});
var educationController = {
  createEducation: createEducation2,
  getMyEducations,
  updateEducation: updateEducation2,
  deleteEducation: deleteEducation2
};

// src/app/module/Candidate/education.router.ts
var router4 = Router4();
router4.post(
  "/",
  authenticate,
  requireCandidate,
  educationController.createEducation
);
router4.get(
  "/",
  authenticate,
  requireCandidate,
  educationController.getMyEducations
);
router4.put(
  "/:id",
  authenticate,
  requireCandidate,
  educationController.updateEducation
);
router4.delete(
  "/:id",
  authenticate,
  requireCandidate,
  educationController.deleteEducation
);
var educationRouter = router4;

// src/app/module/Candidate/profile.router.ts
import { Router as Router5 } from "express";

// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
var cloudName = process.env.CLOUDINARY_CLOUD_NAME;
var apiKey = process.env.CLOUDINARY_API_KEY;
var apiSecret = process.env.CLOUDINARY_API_SECRET;
if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    "Cloudinary not fully configured (CLOUDINARY_* env vars missing)"
  );
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}
var uploadBuffer = async (buffer, folder) => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary not configured");
  }
  const base64 = buffer.toString("base64");
  const dataUri = `data:application/octet-stream;base64,${base64}`;
  const opts = { resource_type: "auto" };
  if (folder) opts.folder = folder;
  const result = await cloudinary.uploader.upload(dataUri, opts);
  return result;
};
var cloudinary_default = cloudinary;

// src/app/module/Candidate/profile.controller.ts
import multer from "multer";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});
var getMyProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfileFromDb(req.user?.id);
  res.status(200).json({ success: true, data: profile });
});
var upsertMyProfile = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!req.user?.id) throw new AppError("Authentication required", 401);
  const profile = await profileService.upsertProfileInDb(req.user.id, payload);
  res.status(200).json({ success: true, data: profile });
});
var profileController = {
  getMyProfile,
  upsertMyProfile
};
var uploadProfileFile = asyncHandler(
  async (req, res) => {
    if (!req.user?.id) throw new AppError("Authentication required", 401);
    const file = req.file;
    const type = req.body.type || req.query.type || "avatar";
    if (!file) {
      throw new AppError("File is required", 400);
    }
    try {
      const folder = `hireflow/${req.user.id}`;
      const result = await uploadBuffer(file.buffer, folder);
      const url = result.secure_url || result.url;
      const payload = {};
      if (type === "resume") {
        payload.resumeUrl = url;
        payload.resumeFileName = file.originalname;
      } else {
        payload.avatarUrl = url;
      }
      const profile = await profileService.upsertProfileInDb(
        req.user.id,
        payload
      );
      res.status(200).json({ success: true, data: { url, profile } });
    } catch (err) {
      throw new AppError(`Upload failed: ${err.message || err}`, 500);
    }
  }
);

// src/app/module/Candidate/profile.router.ts
var router5 = Router5();
router5.get(
  "/mine",
  authenticate,
  requireCandidate,
  profileController.getMyProfile
);
router5.post(
  "/mine",
  authenticate,
  requireCandidate,
  profileController.upsertMyProfile
);
router5.post(
  "/upload",
  authenticate,
  requireCandidate,
  upload.single("file"),
  uploadProfileFile
);
var profileRouter = router5;

// src/app/module/Candidate/savedJobs.router.ts
import { Router as Router6 } from "express";

// src/app/module/Candidate/savedJobs.service.ts
var saveJobInDb = async (userId, jobId) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError("Job not found", 404);
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } }
  });
  if (existing) throw new AppError("Job already saved", 400);
  const saved = await prisma.savedJob.create({ data: { userId, jobId } });
  return saved;
};
var removeSavedJobFromDb = async (userId, jobId) => {
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } }
  });
  if (!existing) throw new AppError("Saved job not found", 404);
  await prisma.savedJob.delete({ where: { userId_jobId: { userId, jobId } } });
  return { success: true };
};
var listSavedJobsFromDb = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.savedJob.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            companyId: true,
            _count: { select: { applications: true } },
            expiresAt: true,
            status: true,
            company: {
              select: { id: true, name: true, slug: true, logoUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.savedJob.count({ where: { userId } })
  ]);
  return {
    data: items.map((s) => ({ ...s.job, savedAt: s.createdAt })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var savedJobsService = {
  saveJobInDb,
  removeSavedJobFromDb,
  listSavedJobsFromDb
};

// src/app/module/Candidate/savedJobs.controller.ts
var saveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const saved = await savedJobsService.saveJobInDb(
    req.user?.id,
    jobId
  );
  res.status(201).json({ success: true, data: saved });
});
var removeSavedJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const result = await savedJobsService.removeSavedJobFromDb(
    req.user?.id,
    jobId
  );
  res.status(200).json({ success: true, data: result });
});
var listSavedJobs = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 20;
  const result = await savedJobsService.listSavedJobsFromDb(
    req.user?.id,
    page,
    limit
  );
  res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
});
var savedJobsController = { saveJob, removeSavedJob, listSavedJobs };

// src/app/module/Candidate/savedJobs.router.ts
var router6 = Router6();
router6.post(
  "/:jobId",
  authenticate,
  requireCandidate,
  savedJobsController.saveJob
);
router6.delete(
  "/:jobId",
  authenticate,
  requireCandidate,
  savedJobsController.removeSavedJob
);
router6.get(
  "/",
  authenticate,
  requireCandidate,
  savedJobsController.listSavedJobs
);
var savedJobsRouter = router6;

// src/app/module/Candidate/workExperience.router.ts
import { Router as Router7 } from "express";

// src/app/module/Candidate/workExperience.service.ts
var createWorkExperience = async (profileId, data) => {
  const experience = await prisma.workExperience.create({
    data: {
      profileId,
      company: data.company,
      title: data.title,
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current ?? false,
      description: data.description,
      skills: data.skills || []
    }
  });
  return experience;
};
var getWorkExperienceByProfileId = async (profileId) => {
  const experiences = await prisma.workExperience.findMany({
    where: { profileId },
    orderBy: { startDate: "desc" }
  });
  return experiences;
};
var getWorkExperienceById = async (id) => {
  const experience = await prisma.workExperience.findUnique({
    where: { id }
  });
  return experience;
};
var updateWorkExperience = async (id, data) => {
  const updateData = {};
  if (data.company !== void 0) updateData.company = data.company;
  if (data.title !== void 0) updateData.title = data.title;
  if (data.location !== void 0) updateData.location = data.location;
  if (data.startDate !== void 0)
    updateData.startDate = new Date(data.startDate);
  if (data.endDate !== void 0)
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.current !== void 0) updateData.current = data.current;
  if (data.description !== void 0) updateData.description = data.description;
  if (data.skills !== void 0) updateData.skills = data.skills;
  const experience = await prisma.workExperience.update({
    where: { id },
    data: updateData
  });
  return experience;
};
var deleteWorkExperience = async (id) => {
  await prisma.workExperience.delete({
    where: { id }
  });
};
var workExperienceService = {
  createWorkExperience,
  getWorkExperienceByProfileId,
  getWorkExperienceById,
  updateWorkExperience,
  deleteWorkExperience
};

// src/app/module/Candidate/workExperience.controller.ts
var createWorkExperience2 = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Authentication required", 401);
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!profile) {
      throw new AppError("Profile not found. Create profile first.", 404);
    }
    const {
      company,
      title,
      location,
      startDate,
      endDate,
      current,
      description,
      skills
    } = req.body;
    if (!company || !title || !startDate) {
      throw new AppError("Company, title, and startDate are required", 400);
    }
    const experience = await workExperienceService.createWorkExperience(
      profile.id,
      {
        company,
        title,
        location,
        startDate,
        endDate,
        current,
        description,
        skills
      }
    );
    res.status(201).json({ success: true, data: experience });
  }
);
var getMyWorkExperiences = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Authentication required", 401);
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }
    const experiences = await workExperienceService.getWorkExperienceByProfileId(profile.id);
    res.status(200).json({ success: true, data: experiences });
  }
);
var updateWorkExperience2 = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new AppError("Authentication required", 401);
    if (!id) throw new AppError("Experience ID required", 400);
    const experience = await workExperienceService.getWorkExperienceById(id);
    if (!experience) {
      throw new AppError("Experience not found", 404);
    }
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!profile || experience.profileId !== profile.id) {
      throw new AppError("You do not have permission to update this", 403);
    }
    const updated2 = await workExperienceService.updateWorkExperience(
      id,
      req.body
    );
    res.status(200).json({ success: true, data: updated2 });
  }
);
var deleteWorkExperience2 = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new AppError("Authentication required", 401);
    if (!id) throw new AppError("Experience ID required", 400);
    const experience = await workExperienceService.getWorkExperienceById(id);
    if (!experience) {
      throw new AppError("Experience not found", 404);
    }
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!profile || experience.profileId !== profile.id) {
      throw new AppError("You do not have permission to delete this", 403);
    }
    await workExperienceService.deleteWorkExperience(id);
    res.status(200).json({ success: true, message: "Experience deleted" });
  }
);
var workExperienceController = {
  createWorkExperience: createWorkExperience2,
  getMyWorkExperiences,
  updateWorkExperience: updateWorkExperience2,
  deleteWorkExperience: deleteWorkExperience2
};

// src/app/module/Candidate/workExperience.router.ts
var router7 = Router7();
router7.post(
  "/",
  authenticate,
  requireCandidate,
  workExperienceController.createWorkExperience
);
router7.get(
  "/",
  authenticate,
  requireCandidate,
  workExperienceController.getMyWorkExperiences
);
router7.put(
  "/:id",
  authenticate,
  requireCandidate,
  workExperienceController.updateWorkExperience
);
router7.delete(
  "/:id",
  authenticate,
  requireCandidate,
  workExperienceController.deleteWorkExperience
);
var workExperienceRouter = router7;

// src/app/module/Company/company.router.ts
import { Router as Router9 } from "express";

// src/app/module/Company/company.service.ts
var isSlugUnique = async (slug, excludeId) => {
  const existingCompany = await prisma.company.findUnique({
    where: { slug }
  });
  if (!existingCompany) return true;
  if (excludeId && existingCompany.id === excludeId) return true;
  return false;
};
var createCompanyInDb = async (data, userId) => {
  const isUnique = await isSlugUnique(data.slug);
  if (!isUnique) {
    throw new AppError(`Slug "${data.slug}" is already taken`, 400);
  }
  const company = await prisma.company.create({
    data: {
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      website: data.website,
      linkedinUrl: data.linkedinUrl,
      description: data.description,
      industry: data.industry,
      size: data.size,
      founded: data.founded,
      country: data.country,
      city: data.city
    }
  });
  await prisma.companyMember.create({
    data: {
      userId,
      companyId: company.id,
      isOwner: true
    }
  });
  return company;
};
var getAllCompaniesFromDb = async (page = 1, limit = 10, filters) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters?.isActive !== void 0) where.isActive = filters.isActive;
  if (filters?.isVerified !== void 0) where.isVerified = filters.isVerified;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { slug: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } }
    ];
  }
  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      include: {
        members: true,
        jobs: {
          where: { status: "PUBLISHED" }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.company.count({ where })
  ]);
  return {
    data: companies,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getCompanyByIdFromDb = async (id) => {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true
            }
          }
        }
      },
      jobs: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 10
      }
    }
  });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  return company;
};
var getCompanyBySlugFromDb = async (slug) => {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true
            }
          }
        }
      },
      jobs: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 10
      }
    }
  });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  return company;
};
var updateCompanyInDb = async (id, data) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  if (data && "slug" in data && data.slug) {
    const isUnique = await isSlugUnique(data.slug, id);
    if (!isUnique) {
      throw new AppError(`Slug "${data.slug}" is already taken`, 400);
    }
  }
  const updatedCompany = await prisma.company.update({
    where: { id },
    data,
    include: {
      members: true
    }
  });
  return updatedCompany;
};
var deleteCompanyFromDb = async (id) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  const deletedCompany = await prisma.company.delete({
    where: { id }
  });
  return deletedCompany;
};
var verifyCompanyInDb2 = async (id, isVerified) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  const updatedCompany = await prisma.company.update({
    where: { id },
    data: { isVerified }
  });
  return updatedCompany;
};
var getUserCompaniesFromDb = async (userId) => {
  const members = await prisma.companyMember.findMany({
    where: { userId },
    include: {
      company: {
        include: {
          members: true,
          jobs: {
            where: { status: "PUBLISHED" }
          }
        }
      }
    }
  });
  return members.map((m) => ({
    ...m.company,
    userRole: m.isOwner ? "OWNER" : "MEMBER"
  }));
};
var addCompanyMemberInDb = async (companyId, userId, isOwner = false) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  const user2 = await prisma.user.findUnique({ where: { id: userId } });
  if (!user2) {
    throw new AppError("User not found", 404);
  }
  const existingMember = await prisma.companyMember.findUnique({
    where: { userId }
  });
  if (existingMember) {
    if (existingMember.companyId === companyId) {
      throw new AppError("User is already a member of this company", 400);
    }
    throw new AppError(
      "User already belongs to another company. Remove them from that company first.",
      400
    );
  }
  const member = await prisma.companyMember.create({
    data: {
      userId,
      companyId,
      isOwner
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true
        }
      }
    }
  });
  return member;
};
var removeCompanyMemberFromDb = async (companyId, userId) => {
  const member = await prisma.companyMember.findUnique({
    where: { userId }
  });
  if (!member || member.companyId !== companyId) {
    throw new AppError("Member not found in this company", 404);
  }
  if (member.isOwner) {
    const otherOwners = await prisma.companyMember.count({
      where: {
        companyId,
        isOwner: true,
        userId: { not: userId }
      }
    });
    if (otherOwners === 0) {
      throw new AppError("Cannot remove the last owner from the company", 400);
    }
  }
  const removedMember = await prisma.companyMember.delete({
    where: { userId }
  });
  return removedMember;
};
var getCompanyMembersFromDb = async (companyId) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  const members = await prisma.companyMember.findMany({
    where: { companyId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true
        }
      }
    }
  });
  return members;
};
var companyService = {
  createCompanyInDb,
  getAllCompaniesFromDb,
  getCompanyByIdFromDb,
  getCompanyBySlugFromDb,
  updateCompanyInDb,
  deleteCompanyFromDb,
  verifyCompanyInDb: verifyCompanyInDb2,
  getUserCompaniesFromDb,
  addCompanyMemberInDb,
  removeCompanyMemberFromDb,
  getCompanyMembersFromDb
};

// src/app/module/Company/company.controller.ts
var createCompany = asyncHandler(
  async (req, res) => {
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
      city
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
        city
      },
      req.user?.id
    );
    res.status(201).json({
      success: true,
      data: company,
      message: "Company created successfully"
    });
  }
);
var getAllCompanies = asyncHandler(
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const isActive = req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0;
    const isVerified = req.query.isVerified === "true" ? true : req.query.isVerified === "false" ? false : void 0;
    const search = req.query.search || void 0;
    const result = await companyService.getAllCompaniesFromDb(page, limit, {
      isActive,
      isVerified,
      search
    });
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var getCompanyById = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const company = await companyService.getCompanyByIdFromDb(id);
    res.status(200).json({
      success: true,
      data: company
    });
  }
);
var getCompanyBySlug = asyncHandler(
  async (req, res) => {
    const { slug } = req.params;
    const company = await companyService.getCompanyBySlugFromDb(slug);
    res.status(200).json({
      success: true,
      data: company
    });
  }
);
var updateCompany = asyncHandler(
  async (req, res) => {
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
      isActive
    } = req.body;
    const company = await companyService.getCompanyByIdFromDb(id);
    const isOwner = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner
    );
    if (!isOwner && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to update this company",
        403
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
      isActive
    });
    res.status(200).json({
      success: true,
      data: updatedCompany,
      message: "Company updated successfully"
    });
  }
);
var deleteCompany = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const company = await companyService.getCompanyByIdFromDb(id);
    const isOwner = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner
    );
    if (!isOwner && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to delete this company",
        403
      );
    }
    const deletedCompany = await companyService.deleteCompanyFromDb(id);
    res.status(200).json({
      success: true,
      data: deletedCompany,
      message: "Company deleted successfully"
    });
  }
);
var verifyCompany2 = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    if (typeof isVerified !== "boolean") {
      throw new AppError("isVerified must be a boolean", 400);
    }
    const company = await companyService.verifyCompanyInDb(id, isVerified);
    res.status(200).json({
      success: true,
      data: company,
      message: `Company ${isVerified ? "verified" : "unverified"} successfully`
    });
  }
);
var getUserCompanies = asyncHandler(
  async (req, res) => {
    const companies = await companyService.getUserCompaniesFromDb(
      req.user?.id
    );
    res.status(200).json({
      success: true,
      data: companies
    });
  }
);
var addCompanyMember = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { userId, isOwner } = req.body;
    if (!userId) {
      throw new AppError("userId is required", 400);
    }
    const company = await companyService.getCompanyByIdFromDb(id);
    const isCompanyOwner2 = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner
    );
    if (!isCompanyOwner2 && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to add members to this company",
        403
      );
    }
    const member = await companyService.addCompanyMemberInDb(
      id,
      userId,
      isOwner || false
    );
    res.status(201).json({
      success: true,
      data: member,
      message: "Member added successfully"
    });
  }
);
var joinCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }
  const member = await companyService.addCompanyMemberInDb(id, userId, false);
  res.status(201).json({
    success: true,
    data: member,
    message: "Joined company successfully"
  });
});
var removeCompanyMember = asyncHandler(
  async (req, res) => {
    const { id, userId } = req.params;
    const company = await companyService.getCompanyByIdFromDb(id);
    const isCompanyOwner2 = company.members.some(
      (m) => m.userId === req.user?.id && m.isOwner
    );
    if (!isCompanyOwner2 && req.user?.role !== "ADMIN") {
      throw new AppError(
        "You do not have permission to remove members from this company",
        403
      );
    }
    const member = await companyService.removeCompanyMemberFromDb(id, userId);
    res.status(200).json({
      success: true,
      data: member,
      message: "Member removed successfully"
    });
  }
);
var getCompanyMembers = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const members = await companyService.getCompanyMembersFromDb(id);
    res.status(200).json({
      success: true,
      data: members
    });
  }
);
var companyController = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  getCompanyBySlug,
  updateCompany,
  deleteCompany,
  verifyCompany: verifyCompany2,
  getUserCompanies,
  addCompanyMember,
  removeCompanyMember,
  getCompanyMembers,
  joinCompany
};

// src/app/module/Company/emailTemplates.controller.ts
var ensureCompanyMember = async (companyId, userId) => {
  const member = await prisma.companyMember.findFirst({
    where: { companyId, userId }
  });
  return !!member;
};
var createTemplate2 = async (req, res) => {
  const companyId = req.params.id;
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  const isMember = await ensureCompanyMember(companyId, userId);
  if (!isMember)
    throw new AppError("You are not a member of this company", 403);
  const { name, subject, body, stage, isDefault } = req.body;
  const tpl = await emailTemplatesService.createTemplate(companyId, {
    name,
    subject,
    body,
    stage,
    isDefault
  });
  res.json(tpl);
};
var getTemplates2 = async (req, res) => {
  const companyId = req.params.id;
  const templates = await emailTemplatesService.getTemplates(companyId);
  res.json(templates);
};
var updateTemplate2 = async (req, res) => {
  const companyId = req.params.id;
  const templateId = req.params.templateId;
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  const isMember = await ensureCompanyMember(companyId, userId);
  if (!isMember)
    throw new AppError("You are not a member of this company", 403);
  const payload = req.body;
  const updated2 = await emailTemplatesService.updateTemplate(
    companyId,
    templateId,
    payload
  );
  res.json(updated2);
};
var deleteTemplate2 = async (req, res) => {
  const companyId = req.params.id;
  const templateId = req.params.templateId;
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  const isMember = await ensureCompanyMember(companyId, userId);
  if (!isMember)
    throw new AppError("You are not a member of this company", 403);
  const result = await emailTemplatesService.deleteTemplate(
    companyId,
    templateId
  );
  res.json(result);
};
var emailTemplatesController = {
  createTemplate: createTemplate2,
  getTemplates: getTemplates2,
  updateTemplate: updateTemplate2,
  deleteTemplate: deleteTemplate2
};

// src/app/module/Company/team.router.ts
import { Router as Router8 } from "express";

// src/app/module/Company/team.service.ts
import crypto from "crypto";
var isCompanyOwner = async (companyId, userId) => {
  const member = await prisma.companyMember.findFirst({
    where: { companyId, userId, isOwner: true }
  });
  return !!member;
};
var isCompanyMember = async (companyId, userId) => {
  const member = await prisma.companyMember.findFirst({
    where: { companyId, userId }
  });
  return !!member;
};
var inviteMember = async (companyId, inviterUserId, email, role = "MEMBER") => {
  const isOwner = await isCompanyOwner(companyId, inviterUserId);
  if (!isOwner) {
    throw new AppError("Only company owners can invite members", 403);
  }
  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (targetUser) {
    const existingMember = await isCompanyMember(companyId, targetUser.id);
    if (existingMember) {
      throw new AppError("User is already a member of this company", 400);
    }
  }
  const token = crypto.randomUUID();
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);
  const invite = await prisma.companyInvite.create({
    data: {
      companyId,
      email,
      token,
      role,
      expiresAt
    },
    include: {
      company: {
        select: { name: true }
      }
    }
  });
  const clientUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const inviteLink = `${clientUrl}/join?token=${token}`;
  await sendMail(
    email,
    `Invitation to join ${invite.company.name} on HireFlow`,
    `<p>You have been invited to join <strong>${invite.company.name}</strong> as a ${role}.</p>
     <p>Please click the link below to accept the invitation. This link expires in 48 hours.</p>
     <a href="${inviteLink}">Accept Invitation</a>`
  );
  return invite;
};
var acceptInvite = async (token, userId) => {
  const invite = await prisma.companyInvite.findUnique({
    where: { token }
  });
  if (!invite) {
    throw new AppError("Invalid invitation token", 404);
  }
  if (invite.acceptedAt) {
    throw new AppError("Invitation has already been accepted", 400);
  }
  if (/* @__PURE__ */ new Date() > invite.expiresAt) {
    throw new AppError("Invitation has expired", 400);
  }
  const user2 = await prisma.user.findUnique({ where: { id: userId } });
  if (!user2) {
    throw new AppError("User not found", 404);
  }
  if (user2.email.toLowerCase() !== invite.email.toLowerCase()) {
    throw new AppError("This invitation was sent to a different email address", 403);
  }
  const existingMember = await isCompanyMember(invite.companyId, userId);
  if (existingMember) {
    throw new AppError("You are already a member of this company", 400);
  }
  return await prisma.$transaction(async (tx) => {
    await tx.companyInvite.update({
      where: { id: invite.id },
      data: { acceptedAt: /* @__PURE__ */ new Date() }
    });
    const member = await tx.companyMember.create({
      data: {
        companyId: invite.companyId,
        userId,
        isOwner: invite.role === "OWNER"
      }
    });
    if (user2.role === "CANDIDATE") {
      await tx.user.update({
        where: { id: userId },
        data: { role: "RECRUITER" }
      });
    }
    return member;
  });
};
var getMembers = async (companyId, requesterId) => {
  const isMember = await isCompanyMember(companyId, requesterId);
  const user2 = await prisma.user.findUnique({ where: { id: requesterId } });
  if (!isMember && user2?.role !== "ADMIN") {
    throw new AppError("You do not have access to this company's members", 403);
  }
  const members = await prisma.companyMember.findMany({
    where: { companyId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          candidateProfile: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        }
      }
    },
    orderBy: {
      joinedAt: "asc"
    }
  });
  return members;
};
var updateMemberRole = async (companyId, targetUserId, isOwner, requesterId) => {
  const isRequesterOwner = await isCompanyOwner(companyId, requesterId);
  if (!isRequesterOwner) {
    throw new AppError("Only company owners can update member roles", 403);
  }
  const targetMember = await prisma.companyMember.findFirst({
    where: { companyId, userId: targetUserId }
  });
  if (!targetMember) {
    throw new AppError("Target user is not a member of this company", 404);
  }
  if (targetMember.isOwner && !isOwner) {
    const ownerCount = await prisma.companyMember.count({
      where: { companyId, isOwner: true }
    });
    if (ownerCount <= 1) {
      throw new AppError("Cannot demote the last owner of the company", 400);
    }
  }
  const updatedMember = await prisma.companyMember.update({
    where: { id: targetMember.id },
    data: { isOwner }
  });
  return updatedMember;
};
var removeMember = async (companyId, targetUserId, requesterId) => {
  const targetMember = await prisma.companyMember.findFirst({
    where: { companyId, userId: targetUserId }
  });
  if (!targetMember) {
    throw new AppError("Target user is not a member of this company", 404);
  }
  if (requesterId !== targetUserId) {
    const isRequesterOwner = await isCompanyOwner(companyId, requesterId);
    if (!isRequesterOwner) {
      throw new AppError("Only company owners can remove other members", 403);
    }
  }
  if (targetMember.isOwner) {
    const ownerCount = await prisma.companyMember.count({
      where: { companyId, isOwner: true }
    });
    if (ownerCount <= 1) {
      throw new AppError("Cannot remove the last owner of the company", 400);
    }
  }
  await prisma.companyMember.delete({
    where: { id: targetMember.id }
  });
  return { success: true };
};
var teamService = {
  inviteMember,
  acceptInvite,
  getMembers,
  updateMemberRole,
  removeMember
};

// src/app/module/Company/team.controller.ts
var inviteMember2 = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const { email, role } = req.body;
  const requesterId = req.user?.id;
  if (!requesterId) throw new AppError("Unauthorized", 401);
  if (!companyId) throw new AppError("Company ID is required", 400);
  if (!email) throw new AppError("Email is required", 400);
  const invite = await teamService.inviteMember(
    companyId,
    requesterId,
    email,
    role
  );
  res.status(201).json({
    success: true,
    message: "Invitation sent successfully",
    data: invite
  });
});
var acceptInvite2 = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  if (!token) throw new AppError("Invitation token is required", 400);
  const member = await teamService.acceptInvite(token, userId);
  res.status(200).json({
    success: true,
    message: "Invitation accepted successfully",
    data: member
  });
});
var getMembers2 = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const requesterId = req.user?.id;
  if (!requesterId) throw new AppError("Unauthorized", 401);
  if (!companyId) throw new AppError("Company ID is required", 400);
  const members = await teamService.getMembers(companyId, requesterId);
  res.status(200).json({
    success: true,
    data: members
  });
});
var updateMemberRole2 = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const targetUserId = req.params.userId;
  const { isOwner } = req.body;
  const requesterId = req.user?.id;
  if (!requesterId) throw new AppError("Unauthorized", 401);
  if (!companyId || !targetUserId) {
    throw new AppError("Company ID and Target User ID are required", 400);
  }
  if (isOwner === void 0) {
    throw new AppError("isOwner is required", 400);
  }
  const member = await teamService.updateMemberRole(
    companyId,
    targetUserId,
    isOwner,
    requesterId
  );
  res.status(200).json({
    success: true,
    message: "Member role updated successfully",
    data: member
  });
});
var removeMember2 = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const targetUserId = req.params.userId;
  const requesterId = req.user?.id;
  if (!requesterId) throw new AppError("Unauthorized", 401);
  if (!companyId || !targetUserId) {
    throw new AppError("Company ID and Target User ID are required", 400);
  }
  await teamService.removeMember(companyId, targetUserId, requesterId);
  res.status(200).json({
    success: true,
    message: "Member removed successfully"
  });
});
var teamController = {
  inviteMember: inviteMember2,
  acceptInvite: acceptInvite2,
  getMembers: getMembers2,
  updateMemberRole: updateMemberRole2,
  removeMember: removeMember2
};

// src/app/module/Company/team.router.ts
var router8 = Router8();
router8.post("/join", authenticate, teamController.acceptInvite);
router8.post(
  "/:id/invite",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  teamController.inviteMember
);
router8.get(
  "/:id/members",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  teamController.getMembers
);
router8.patch(
  "/:id/members/:userId",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  teamController.updateMemberRole
);
router8.delete(
  "/:id/members/:userId",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  teamController.removeMember
);
var teamRouter = router8;

// src/app/module/Company/company.router.ts
var router9 = Router9();
router9.get("/", companyController.getAllCompanies);
router9.get("/slug/:slug", companyController.getCompanyBySlug);
router9.get("/:id", companyController.getCompanyById);
router9.get("/:id/members", companyController.getCompanyMembers);
router9.post(
  "/",
  authenticate,
  requireRecruiter,
  companyController.createCompany
);
router9.post(
  "/:id/join",
  authenticate,
  requireRecruiter,
  companyController.joinCompany
);
router9.patch("/:id", authenticate, companyController.updateCompany);
router9.delete("/:id", authenticate, companyController.deleteCompany);
router9.post("/:id/members", authenticate, companyController.addCompanyMember);
router9.delete(
  "/:id/members/:userId",
  authenticate,
  companyController.removeCompanyMember
);
router9.get(
  "/user/my-companies",
  authenticate,
  companyController.getUserCompanies
);
router9.post(
  "/:id/verify",
  authenticate,
  requireAdmin,
  companyController.verifyCompany
);
router9.use("/", teamRouter);
router9.get(
  "/:id/email-templates",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  emailTemplatesController.getTemplates
);
router9.post(
  "/:id/email-templates",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  emailTemplatesController.createTemplate
);
router9.put(
  "/:id/email-templates/:templateId",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  emailTemplatesController.updateTemplate
);
router9.delete(
  "/:id/email-templates/:templateId",
  authenticate,
  authorize(["RECRUITER", "ADMIN"]),
  emailTemplatesController.deleteTemplate
);
var companyRouter = router9;

// src/app/module/Jobs/Job.router.ts
import { Router as Router10 } from "express";

// src/app/module/Search/search.service.ts
var getCurrentWeekKey = () => {
  const d = /* @__PURE__ */ new Date();
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 864e5 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${weekNo}`;
};
var trackSearch = async (term) => {
  if (!term || typeof term !== "string") return;
  const normalizedTerm = term.toLowerCase().trim();
  if (normalizedTerm.length < 2) return;
  try {
    const weekKey = getCurrentWeekKey();
    await prisma.searchTerm.upsert({
      where: {
        term_weekKey: { term: normalizedTerm, weekKey: "global" }
        // use "global" string for the null equivalent to avoid unique constraint issues with nulls if db doesn't handle null uniqueness well, but schema says weekKey is String? Wait, in Prisma, nulls in unique constraints can be tricky. Let's use "global" instead of null to be safe.
      },
      update: {
        count: { increment: 1 }
      },
      create: {
        term: normalizedTerm,
        weekKey: "global",
        count: 1
      }
    });
    await prisma.searchTerm.upsert({
      where: {
        term_weekKey: { term: normalizedTerm, weekKey }
      },
      update: {
        count: { increment: 1 }
      },
      create: {
        term: normalizedTerm,
        weekKey,
        count: 1
      }
    });
  } catch (error) {
    console.error("Postgres trackSearch error:", error);
  }
};
var getSuggestions = async (q, limit = 8) => {
  if (!q) return [];
  const prefix = q.toLowerCase().trim();
  try {
    const results = await prisma.searchTerm.findMany({
      where: {
        weekKey: "global",
        term: { startsWith: prefix }
      },
      orderBy: { count: "desc" },
      take: limit,
      select: { term: true }
    });
    return results.map((r) => r.term);
  } catch (error) {
    console.error("Postgres getSuggestions error:", error);
    return [];
  }
};
var getTrending = async (limit = 10) => {
  try {
    const weekKey = getCurrentWeekKey();
    const results = await prisma.searchTerm.findMany({
      where: { weekKey },
      orderBy: { count: "desc" },
      take: limit,
      select: { term: true, count: true }
    });
    return results.map((r) => ({
      term: r.term,
      score: r.count
    }));
  } catch (error) {
    console.error("Postgres getTrending error:", error);
    return [];
  }
};
var searchService = {
  trackSearch,
  getSuggestions,
  getTrending
};

// src/app/module/Jobs/job.service.ts
init_redis();
var isSlugUnique2 = async (slug, excludeId) => {
  const existingJob = await prisma.job.findUnique({
    where: { slug }
  });
  if (!existingJob) return true;
  if (excludeId && existingJob.id === excludeId) return true;
  return false;
};
var createJobInDb = async (data, userId) => {
  const isUnique = await isSlugUnique2(data.slug);
  if (!isUnique) {
    throw new AppError(`Slug "${data.slug}" is already taken`, 400);
  }
  const company = await prisma.company.findUnique({
    where: { id: data.companyId }
  });
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  const companyMember = await prisma.companyMember.findUnique({
    where: { userId }
  });
  if (!companyMember || companyMember.companyId !== data.companyId) {
    throw new AppError("You are not a member of this company", 403);
  }
  const job = await prisma.job.create({
    data: {
      companyId: data.companyId,
      postedById: userId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      benefits: data.benefits,
      type: data.type,
      experienceLevel: data.experienceLevel,
      location: data.location,
      isRemote: data.isRemote || false,
      country: data.country,
      city: data.city,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      salaryCurrency: data.salaryCurrency || "USD",
      salaryPeriod: data.salaryPeriod || "YEAR",
      techStack: data.techStack || [],
      status: data.status || "DRAFT",
      ...data.expiresAt && { expiresAt: data.expiresAt },
      ...data.screeningQuestions && {
        screeningQuestions: {
          create: data.screeningQuestions.map((q) => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            required: q.required !== void 0 ? q.required : true
          }))
        }
      }
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true
        }
      }
    }
  });
  try {
    await invalidateJobsCache();
  } catch (err) {
  }
  return job;
};
var getAllJobsFromDb = async (page = 1, limit = 10, filters) => {
  const skip = (page - 1) * limit;
  if (filters?.search) {
    const result = await fetchJobsFromDb(page, limit, filters);
    return { ...result, cached: false };
  }
  const key = `jobs:list:page=${page}:limit=${limit}:type=${filters?.type ?? ""}:remote=${filters?.isRemote ?? ""}:level=${filters?.experienceLevel ?? ""}`;
  const cached = await cacheGet(key);
  if (cached) {
    return { ...cached, cached: true };
  }
  const fresh = await fetchJobsFromDb(page, limit, filters);
  try {
    await cacheSet(key, fresh, 60);
  } catch (err) {
    console.error("Failed to set jobs cache", err);
  }
  return { ...fresh, cached: false };
};
var fetchJobsFromDb = async (page, limit, filters) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters?.status) {
    where.status = filters.status;
  } else {
    where.status = "PUBLISHED";
  }
  if (filters?.companyId) where.companyId = filters.companyId;
  if (filters?.type) where.type = filters.type;
  if (filters?.experienceLevel) where.experienceLevel = filters.experienceLevel;
  if (filters?.isRemote !== void 0) where.isRemote = filters.isRemote;
  if (filters?.country) where.country = filters.country;
  if (filters?.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }
  if (filters?.salaryMin !== void 0 || filters?.salaryMax !== void 0) {
    where.AND = [];
    if (filters?.salaryMin !== void 0) {
      where.AND.push({
        OR: [{ salaryMax: { gte: filters.salaryMin } }, { salaryMax: null }]
      });
    }
    if (filters?.salaryMax !== void 0) {
      where.AND.push({
        OR: [{ salaryMin: { lte: filters.salaryMax } }, { salaryMin: null }]
      });
    }
  }
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { techStack: { hasSome: [filters.search] } }
    ];
  }
  if (filters?.techStack && filters.techStack.length > 0) {
    where.techStack = { hasSome: filters.techStack };
  }
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            isVerified: true
          }
        },
        _count: {
          select: { applications: true, savedBy: true }
        }
      },
      orderBy: { publishedAt: "desc" }
    }),
    prisma.job.count({ where })
  ]);
  return {
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getJobByIdFromDb = async (id) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          bannerUrl: true,
          website: true,
          description: true,
          industry: true,
          size: true,
          isVerified: true
        }
      },
      _count: {
        select: { applications: true, savedBy: true }
      },
      screeningQuestions: true
    }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  try {
    void (async () => {
      try {
        const r = (init_redis(), __toCommonJS(redis_exports));
        if (r && r.redis && typeof r.redis.incr === "function") {
          r.redis.incr(`jobs:views:${id}`);
        }
      } catch (e) {
      }
    })();
  } catch (err) {
  }
  return job;
};
var getJobBySlugFromDb = async (slug) => {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          bannerUrl: true,
          website: true,
          description: true,
          industry: true,
          size: true,
          isVerified: true
        }
      },
      _count: {
        select: { applications: true, savedBy: true }
      },
      screeningQuestions: true
    }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  await prisma.job.update({
    where: { id: job.id },
    data: { viewCount: { increment: 1 } }
  });
  return job;
};
var getJobsByCompanyIdFromDb = async (companyId, page = 1, limit = 10, includeAllStatuses = false) => {
  const skip = (page - 1) * limit;
  const where = { companyId };
  if (!includeAllStatuses) {
    where.status = "PUBLISHED";
  }
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true
          }
        },
        _count: {
          select: { applications: true, savedBy: true }
        }
      },
      orderBy: { publishedAt: "desc" }
    }),
    prisma.job.count({ where })
  ]);
  return {
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updateJobInDb = async (id, userId, data) => {
  const job = await prisma.job.findUnique({
    where: { id }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  if (job.postedById !== userId && !await isUserAdmin3(userId)) {
    throw new AppError("You do not have permission to update this job", 403);
  }
  if (data.slug && data.slug !== job.slug) {
    const isUnique = await isSlugUnique2(data.slug, id);
    if (!isUnique) {
      throw new AppError(`Slug "${data.slug}" is already taken`, 400);
    }
  }
  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      ...data,
      ...data.screeningQuestions && {
        screeningQuestions: {
          deleteMany: {},
          // Clean up existing and replace with new
          create: data.screeningQuestions.map((q) => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            required: q.required !== void 0 ? q.required : true
          }))
        }
      }
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true
        }
      },
      screeningQuestions: true
    }
  });
  try {
    await invalidateJobsCache();
  } catch (err) {
  }
  return updatedJob;
};
var deleteJobFromDb = async (id, userId) => {
  const job = await prisma.job.findUnique({
    where: { id }
  });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  if (job.postedById !== userId && !await isUserAdmin3(userId)) {
    throw new AppError("You do not have permission to delete this job", 403);
  }
  const deletedJob = await prisma.job.delete({
    where: { id }
  });
  try {
    await invalidateJobsCache();
  } catch (err) {
  }
  return deletedJob;
};
var getJobsByRecruiterIdFromDb = async (recruiterId2, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { postedById: recruiterId2 },
      skip,
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true
          }
        },
        _count: {
          select: { applications: true, savedBy: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.job.count({ where: { postedById: recruiterId2 } })
  ]);
  return {
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var isUserAdmin3 = async (userId) => {
  const user2 = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  return user2?.role === "ADMIN";
};
var getSimilarJobsFromDb = async (id, limit = 5) => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new AppError("Job not found", 404);
  if (!job.techStack || job.techStack.length === 0) {
    return await prisma.job.findMany({
      where: {
        id: { not: id },
        status: "PUBLISHED",
        experienceLevel: job.experienceLevel
      },
      take: limit,
      include: {
        company: { select: { id: true, name: true, logoUrl: true } }
      },
      orderBy: { publishedAt: "desc" }
    });
  }
  const similarJobs = await prisma.$queryRaw`
    SELECT j.*, 
           c.id as "companyId", c.name as "companyName", c."logoUrl" as "companyLogo",
           (
             SELECT count(*) 
             FROM unnest(j."techStack") AS t1 
             JOIN unnest(${job.techStack}::text[]) AS t2 ON t1 = t2
           ) as "overlapCount"
    FROM "jobs" j
    JOIN "companies" c ON j."companyId" = c.id
    WHERE j."techStack" && ${job.techStack}::text[]
      AND j.status = 'PUBLISHED'
      AND j.id != ${id}
    ORDER BY "overlapCount" DESC, j."publishedAt" DESC
    LIMIT ${limit}
  `;
  return similarJobs.map((sj) => ({
    ...sj,
    company: {
      id: sj.companyId,
      name: sj.companyName,
      logoUrl: sj.companyLogo
    },
    // Remove the flattened company fields from the root if desired
    companyId: sj.companyId,
    companyName: void 0,
    companyLogo: void 0,
    overlapCount: void 0
  }));
};
var calculateMatchScore = async (jobId, candidateId) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId: candidateId },
    include: { experiences: true }
  });
  if (!job) throw new AppError("Job not found", 404);
  if (!profile) throw new AppError("Candidate profile not found", 404);
  const jobTech = job.techStack || [];
  const candidateSkills = profile.skills || [];
  const matchedSkills = jobTech.filter((s) => candidateSkills.includes(s));
  const missingSkills = jobTech.filter((s) => !candidateSkills.includes(s));
  let techScore = 0;
  if (jobTech.length > 0) {
    techScore = matchedSkills.length / jobTech.length * 50;
  }
  let salaryScore = 0;
  let salaryMatch = false;
  const jMin = job.salaryMin ?? null;
  const jMax = job.salaryMax ?? null;
  const cMin = profile.expectedSalaryMin ?? null;
  const cMax = profile.expectedSalaryMax ?? null;
  if (jMin !== null && jMax !== null && cMin !== null && cMax !== null) {
    if (jMin <= cMax && jMax >= cMin) {
      salaryScore = 25;
      salaryMatch = true;
    } else {
      salaryScore = 0;
      salaryMatch = false;
    }
  } else if ((jMin !== null || jMax !== null) && (cMin !== null || cMax !== null)) {
    salaryScore = 12;
    salaryMatch = true;
  } else {
    salaryScore = 0;
    salaryMatch = false;
  }
  const levelOrder = ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"];
  const jobLevel = job.experienceLevel;
  let profileLevelIndex = -1;
  if (profile.experiences && profile.experiences.length > 0) {
    const years = profile.experiences.reduce((acc, we) => {
      if (we.startDate && we.endDate) {
        const start = new Date(we.startDate).getFullYear();
        const end = new Date(we.endDate).getFullYear();
        return acc + Math.max(0, end - start);
      }
      return acc + 0;
    }, 0);
    if (years <= 1)
      profileLevelIndex = 0;
    else if (years <= 3)
      profileLevelIndex = 1;
    else if (years <= 5)
      profileLevelIndex = 2;
    else if (years <= 8)
      profileLevelIndex = 3;
    else profileLevelIndex = 4;
  }
  let levelScore = 0;
  let levelMatch = false;
  if (jobLevel) {
    const jobIdx = levelOrder.indexOf(jobLevel);
    if (profileLevelIndex >= 0 && jobIdx >= 0) {
      const diff = Math.abs(jobIdx - profileLevelIndex);
      if (diff === 0) {
        levelScore = 25;
        levelMatch = true;
      } else if (diff === 1) {
        levelScore = 12;
        levelMatch = true;
      } else {
        levelScore = 0;
        levelMatch = false;
      }
    } else {
      levelScore = 12;
      levelMatch = false;
    }
  }
  const totalScore = Math.round(techScore + salaryScore + levelScore);
  return {
    score: Math.min(100, totalScore),
    matchedSkills,
    missingSkills,
    salaryMatch,
    levelMatch
  };
};
var updateJobStatusInDb = async (id, userId, status) => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new AppError("Job not found", 404);
  if (job.postedById !== userId && !await isUserAdmin3(userId)) {
    throw new AppError(
      "You do not have permission to update this job status",
      403
    );
  }
  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" && !job.publishedAt ? /* @__PURE__ */ new Date() : job.publishedAt
    }
  });
  try {
    await invalidateJobsCache();
  } catch (err) {
  }
  return updatedJob;
};
var saveJobInDb2 = async (jobId, userId) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError("Job not found", 404);
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } }
  });
  if (existing) throw new AppError("Job already saved", 400);
  const savedJob = await prisma.savedJob.create({
    data: {
      userId,
      jobId
    }
  });
  return savedJob;
};
var unsaveJobFromDb = async (jobId, userId) => {
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } }
  });
  if (!existing) throw new AppError("Job not saved", 400);
  const deletedJob = await prisma.savedJob.delete({
    where: {
      userId_jobId: {
        userId,
        jobId
      }
    }
  });
  return deletedJob;
};
var jobService = {
  getAllJobsFromDb,
  getJobByIdFromDb,
  getJobBySlugFromDb,
  getJobsByCompanyIdFromDb,
  getJobsByRecruiterIdFromDb,
  createJobInDb,
  updateJobInDb,
  deleteJobFromDb,
  getSimilarJobsFromDb,
  calculateMatchScore,
  updateJobStatusInDb,
  saveJobInDb: saveJobInDb2,
  unsaveJobFromDb
};

// src/app/module/Jobs/job.controller.ts
var slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
var createJob = asyncHandler(async (req, res) => {
  const {
    companyId,
    title,
    slug,
    description,
    requirements,
    responsibilities,
    benefits,
    type,
    experienceLevel,
    location,
    isRemote,
    country,
    city,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    techStack,
    status,
    expiresAt,
    screeningQuestions
  } = req.body;
  const generatedSlug = slug ? String(slug).trim() : slugify(String(title || ""));
  if (!companyId || !title || !description || !type || !experienceLevel) {
    throw new AppError(
      "companyId, title, description, type, and experienceLevel are required",
      400
    );
  }
  if (!generatedSlug) {
    throw new AppError("Could not generate a valid slug from title", 400);
  }
  const job = await jobService.createJobInDb(
    {
      companyId,
      title,
      slug: generatedSlug,
      description,
      requirements,
      responsibilities,
      benefits,
      type,
      experienceLevel,
      location,
      isRemote,
      country,
      city,
      salaryMin,
      salaryMax,
      salaryCurrency,
      salaryPeriod,
      techStack,
      status,
      expiresAt,
      screeningQuestions
    },
    req.user?.id
  );
  res.status(201).json({
    success: true,
    data: job,
    message: "Job created successfully"
  });
});
var searchAndFilterJobs = asyncHandler(
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const companyId = req.query.companyId || void 0;
    const status = req.query.status || void 0;
    const type = req.query.type || void 0;
    const experienceLevel = req.query.experienceLevel || void 0;
    const isRemote = req.query.isRemote === "true" ? true : req.query.isRemote === "false" ? false : void 0;
    const country = req.query.country || void 0;
    const location = req.query.location || void 0;
    const salaryMin = req.query.salaryMin ? parseInt(req.query.salaryMin) : void 0;
    const salaryMax = req.query.salaryMax ? parseInt(req.query.salaryMax) : void 0;
    const search = req.query.search || void 0;
    const techStack = req.query.techStack ? Array.isArray(req.query.techStack) ? req.query.techStack : [req.query.techStack] : void 0;
    const filters = {};
    if (companyId) filters.companyId = companyId;
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (experienceLevel) filters.experienceLevel = experienceLevel;
    if (isRemote !== void 0) filters.isRemote = isRemote;
    if (country) filters.country = country;
    if (location) filters.location = location;
    if (salaryMin !== void 0) filters.salaryMin = salaryMin;
    if (salaryMax !== void 0) filters.salaryMax = salaryMax;
    if (search) {
      filters.search = search;
      searchService.trackSearch(search).catch((err) => {
        console.error("Failed to track search term:", err);
      });
    }
    if (techStack) filters.techStack = techStack;
    const result = await jobService.getAllJobsFromDb(page, limit, filters);
    if (filters.search) {
      res.setHeader("Cache-Control", "no-store");
    } else if (result.cached) {
      res.setHeader("Cache-Control", "public, max-age=60");
    } else {
      res.setHeader("Cache-Control", "no-store");
    }
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var getJobById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const job = await jobService.getJobByIdFromDb(id);
  res.status(200).json({
    success: true,
    data: job
  });
});
var getJobBySlug = asyncHandler(
  async (req, res) => {
    const slug = req.params.slug;
    const job = await jobService.getJobBySlugFromDb(slug);
    res.status(200).json({
      success: true,
      data: job
    });
  }
);
var getJobsByCompany = asyncHandler(
  async (req, res) => {
    const companyId = req.params.companyId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await jobService.getJobsByCompanyIdFromDb(
      companyId,
      page,
      limit
    );
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }
);
var getMyJobs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await jobService.getJobsByRecruiterIdFromDb(
    req.user?.id,
    page,
    limit
  );
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});
var updateJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    title,
    description,
    requirements,
    responsibilities,
    benefits,
    type,
    experienceLevel,
    location,
    isRemote,
    country,
    city,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    techStack,
    status,
    expiresAt,
    slug,
    screeningQuestions
  } = req.body;
  const updatedJob = await jobService.updateJobInDb(
    id,
    req.user?.id,
    {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      type,
      experienceLevel,
      location,
      isRemote,
      country,
      city,
      salaryMin,
      salaryMax,
      salaryCurrency,
      salaryPeriod,
      techStack,
      status,
      expiresAt,
      slug,
      screeningQuestions
    }
  );
  res.status(200).json({
    success: true,
    data: updatedJob,
    message: "Job updated successfully"
  });
});
var deleteJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deletedJob = await jobService.deleteJobFromDb(
    id,
    req.user?.id
  );
  res.status(200).json({
    success: true,
    data: deletedJob,
    message: "Job deleted successfully"
  });
});
var getSimilarJobs = asyncHandler(
  async (req, res) => {
    const id = req.params.id;
    const limit = parseInt(req.query.limit) || 5;
    const similarJobs = await jobService.getSimilarJobsFromDb(id, limit);
    res.status(200).json({
      success: true,
      data: similarJobs
    });
  }
);
var getMatchScore = asyncHandler(
  async (req, res) => {
    const id = req.params.id;
    const result = await jobService.calculateMatchScore(
      id,
      req.user?.id
    );
    res.status(200).json({
      success: true,
      data: result
    });
  }
);
var updateJobStatus = asyncHandler(
  async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
      throw new AppError("Status is required", 400);
    }
    const updatedJob = await jobService.updateJobStatusInDb(
      id,
      req.user?.id,
      status
    );
    res.status(200).json({
      success: true,
      data: updatedJob,
      message: "Job status updated successfully"
    });
  }
);
var saveJob2 = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const savedJob = await jobService.saveJobInDb(id, req.user?.id);
  res.status(201).json({
    success: true,
    data: savedJob,
    message: "Job saved successfully"
  });
});
var unsaveJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deletedJob = await jobService.unsaveJobFromDb(
    id,
    req.user?.id
  );
  res.status(200).json({
    success: true,
    data: deletedJob,
    message: "Job unsaved successfully"
  });
});
var jobController = {
  createJob,
  searchAndFilterJobs,
  getJobById,
  getJobBySlug,
  getJobsByCompany,
  getMyJobs,
  updateJob,
  deleteJob,
  getSimilarJobs,
  getMatchScore,
  updateJobStatus,
  saveJob: saveJob2,
  unsaveJob
};

// src/app/module/Jobs/Job.router.ts
var router10 = Router10();
router10.get("/", jobController.searchAndFilterJobs);
router10.get("/slug/:slug", jobController.getJobBySlug);
router10.get("/company/:companyId", jobController.getJobsByCompany);
router10.get("/:id/similar", jobController.getSimilarJobs);
router10.get("/:id", jobController.getJobById);
router10.post("/", authenticate, requireRecruiter, jobController.createJob);
router10.post(
  "/:id/apply",
  authenticate,
  authorize(["CANDIDATE"]),
  applicationController.applyToJob
);
router10.get(
  "/:id/match-score",
  authenticate,
  authorize(["CANDIDATE"]),
  jobController.getMatchScore
);
router10.post(
  "/:id/save",
  authenticate,
  authorize(["CANDIDATE"]),
  jobController.saveJob
);
router10.delete(
  "/:id/save",
  authenticate,
  authorize(["CANDIDATE"]),
  jobController.unsaveJob
);
router10.get(
  "/:id/applications",
  authenticate,
  requireRecruiter,
  applicationController.getApplicantsForJob
);
router10.get(
  "/recruiter/my-jobs",
  authenticate,
  requireRecruiter,
  jobController.getMyJobs
);
router10.patch("/:id/status", authenticate, requireRecruiter, jobController.updateJobStatus);
router10.patch("/:id", authenticate, requireRecruiter, jobController.updateJob);
router10.delete("/:id", authenticate, requireRecruiter, jobController.deleteJob);
var jobRouter = router10;

// src/app/module/Search/search.router.ts
import { Router as Router11 } from "express";

// src/app/module/Search/search.controller.ts
var getSuggestions2 = asyncHandler(
  async (req, res) => {
    const q = req.query.q;
    const limit = parseInt(req.query.limit) || 8;
    if (!q) {
      throw new AppError("Query parameter 'q' is required", 400);
    }
    const suggestions = await searchService.getSuggestions(q, limit);
    res.status(200).json({
      success: true,
      data: suggestions
    });
  }
);
var getTrending2 = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const trending = await searchService.getTrending(limit);
  res.status(200).json({
    success: true,
    data: trending
  });
});
var searchController = {
  getSuggestions: getSuggestions2,
  getTrending: getTrending2
};

// src/app/module/Search/search.router.ts
var router11 = Router11();
router11.get("/suggestions", searchController.getSuggestions);
router11.get("/trending", searchController.getTrending);
var searchRouter = router11;

// src/app/module/Tags/tags.router.ts
import { Router as Router12 } from "express";

// src/app/module/Tags/tags.service.ts
import NodeCache2 from "node-cache";
var myCache = new NodeCache2({ stdTTL: 600, checkperiod: 120 });
var searchSkillsFromDb = async (query, limit = 10) => {
  const skills = await prisma.skill.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive"
      }
    },
    orderBy: {
      usageCount: "desc"
    },
    take: limit
  });
  return skills;
};
var getPopularSkillsFromDb = async (limit = 30) => {
  const cacheKey = `popular-skills-${limit}`;
  const cachedSkills = myCache.get(cacheKey);
  if (cachedSkills) {
    return cachedSkills;
  }
  const skills = await prisma.skill.findMany({
    orderBy: {
      usageCount: "desc"
    },
    take: limit
  });
  myCache.set(cacheKey, skills);
  return skills;
};
var tagsService = {
  searchSkillsFromDb,
  getPopularSkillsFromDb
};

// src/app/module/Tags/tags.controller.ts
var searchSkills = asyncHandler(
  async (req, res) => {
    const query = req.query.q;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    if (!query) {
      throw new AppError("Search query 'q' is required", 400);
    }
    const skills = await tagsService.searchSkillsFromDb(query, limit);
    res.status(200).json({
      success: true,
      data: skills
    });
  }
);
var getPopularSkills = asyncHandler(
  async (req, res) => {
    const limit = Number.parseInt(req.query.limit, 10) || 30;
    const skills = await tagsService.getPopularSkillsFromDb(limit);
    res.status(200).json({
      success: true,
      data: skills
    });
  }
);
var tagsController = {
  searchSkills,
  getPopularSkills
};

// src/app/module/Tags/tags.router.ts
var router12 = Router12();
router12.get("/skills/popular", tagsController.getPopularSkills);
router12.get("/skills", tagsController.searchSkills);
var tagsRouter = router12;

// src/app/module/Uploads/uploads.router.ts
import { Router as Router13 } from "express";

// src/app/module/Uploads/uploads.service.ts
var generateSignedUrl = (folder, allowedFormats, maxBytes) => {
  const timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3);
  const signature = cloudinary_default.utils.api_sign_request(
    {
      timestamp,
      folder,
      allowed_formats: allowedFormats
    },
    cloudinary_default.config().api_secret
  );
  return {
    signature,
    timestamp,
    cloudName: cloudinary_default.config().cloud_name,
    apiKey: cloudinary_default.config().api_key,
    folder,
    allowedFormats,
    maxBytes
  };
};
var confirmResumeUpload = async (userId, data) => {
  const { publicId, secureUrl, fileName, fileSize } = data;
  return await prisma.$transaction(async (tx) => {
    const userFile = await tx.userFile.create({
      data: {
        userId,
        publicId,
        secureUrl,
        fileName,
        fileSize,
        type: "RESUME"
      }
    });
    const candidateProfile = await tx.candidateProfile.findUnique({
      where: { userId }
    });
    if (candidateProfile) {
      await tx.candidateProfile.update({
        where: { userId },
        data: {
          resumeUrl: secureUrl,
          resumeFileName: fileName
        }
      });
    }
    return userFile;
  });
};
var confirmAvatarUpload = async (userId, data) => {
  const { publicId, secureUrl, fileName, fileSize } = data;
  return await prisma.$transaction(async (tx) => {
    const existingAvatar = await tx.userFile.findFirst({
      where: { userId, type: "AVATAR" }
    });
    if (existingAvatar) {
      try {
        await cloudinary_default.uploader.destroy(existingAvatar.publicId);
      } catch (error) {
        console.error("Failed to delete old avatar from Cloudinary:", error);
      }
      await tx.userFile.delete({
        where: { id: existingAvatar.id }
      });
    }
    const userFile = await tx.userFile.create({
      data: {
        userId,
        publicId,
        secureUrl,
        fileName,
        fileSize,
        type: "AVATAR"
      }
    });
    const candidateProfile = await tx.candidateProfile.findUnique({
      where: { userId }
    });
    if (candidateProfile) {
      await tx.candidateProfile.update({
        where: { userId },
        data: {
          avatarUrl: secureUrl
        }
      });
    }
    await tx.user.update({
      where: { id: userId },
      data: { image: secureUrl }
    });
    return userFile;
  });
};
var deleteFile = async (userId, publicId) => {
  const file = await prisma.userFile.findFirst({
    where: { userId, publicId }
  });
  if (!file) {
    throw new AppError("File not found or unauthorized", 404);
  }
  await cloudinary_default.uploader.destroy(publicId);
  await prisma.userFile.delete({
    where: { id: file.id }
  });
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });
  if (profile) {
    if (profile.resumeUrl === file.secureUrl) {
      await prisma.candidateProfile.update({
        where: { userId },
        data: { resumeUrl: null, resumeFileName: null }
      });
    } else if (profile.avatarUrl === file.secureUrl) {
      await prisma.candidateProfile.update({
        where: { userId },
        data: { avatarUrl: null }
      });
      await prisma.user.update({
        where: { id: userId },
        data: { image: null }
      });
    }
  }
  return file;
};
var uploadsService = {
  generateSignedUrl,
  confirmResumeUpload,
  confirmAvatarUpload,
  deleteFile
};

// src/app/module/Uploads/uploads.controller.ts
var getResumeSignedUrl = asyncHandler(
  async (req, res) => {
    const folder = "resumes";
    const allowedFormats = ["pdf", "doc", "docx"];
    const maxBytes = 5 * 1024 * 1024;
    const data = uploadsService.generateSignedUrl(
      folder,
      allowedFormats,
      maxBytes
    );
    res.status(200).json({
      success: true,
      data
    });
  }
);
var getAvatarSignedUrl = asyncHandler(
  async (req, res) => {
    const folder = "avatars";
    const allowedFormats = ["jpg", "jpeg", "png", "webp"];
    const maxBytes = 2 * 1024 * 1024;
    const data = uploadsService.generateSignedUrl(
      folder,
      allowedFormats,
      maxBytes
    );
    res.status(200).json({
      success: true,
      data
    });
  }
);
var confirmResume = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;
    const { publicId, secureUrl, fileName, fileSize } = req.body;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    if (!publicId || !secureUrl || !fileName || !fileSize) {
      throw new AppError("Missing required file data", 400);
    }
    const result = await uploadsService.confirmResumeUpload(userId, {
      publicId,
      secureUrl,
      fileName,
      fileSize
    });
    res.status(200).json({
      success: true,
      message: "Resume upload confirmed and saved",
      data: result
    });
  }
);
var confirmAvatar = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;
    const { publicId, secureUrl, fileName, fileSize } = req.body;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    if (!publicId || !secureUrl || !fileName || !fileSize) {
      throw new AppError("Missing required file data", 400);
    }
    const result = await uploadsService.confirmAvatarUpload(userId, {
      publicId,
      secureUrl,
      fileName,
      fileSize
    });
    res.status(200).json({
      success: true,
      message: "Avatar upload confirmed and saved",
      data: result
    });
  }
);
var deleteFile2 = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const publicId = req.params.publicId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  await uploadsService.deleteFile(userId, publicId);
  res.status(200).json({
    success: true,
    message: "File deleted successfully"
  });
});
var uploadsController = {
  getResumeSignedUrl,
  getAvatarSignedUrl,
  confirmResume,
  confirmAvatar,
  deleteFile: deleteFile2
};

// src/app/module/Uploads/uploads.router.ts
var router13 = Router13();
router13.use(authenticate);
router13.post("/resume/signed-url", uploadsController.getResumeSignedUrl);
router13.post("/avatar/signed-url", uploadsController.getAvatarSignedUrl);
router13.post("/resume/confirm", uploadsController.confirmResume);
router13.post("/avatar/confirm", uploadsController.confirmAvatar);
router13.delete("/:publicId", uploadsController.deleteFile);
var uploadsRouter = router13;

// src/middleware/errorHandler.ts
var errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message
  });
};

// src/queues/viewCountFlusher.ts
init_redis();
var flushViewCounts = async () => {
  try {
    if (!redis || !redis.keys) return;
    const keys2 = await redis.keys("jobs:views:*") || [];
    if (!keys2.length) return;
    const updates = [];
    for (const key of keys2) {
      try {
        const val = await redis.get(key);
        const count = val ? parseInt(String(val), 10) || 0 : 0;
        const parts = key.split(":");
        const jobId = parts.slice(2).join(":");
        if (count > 0 && jobId) {
          updates.push(
            prisma.job.update({
              where: { id: jobId },
              data: { viewCount: { increment: count } }
            })
          );
        }
      } catch (innerErr) {
        console.error(`Failed to process view key ${key}:`, innerErr);
      }
    }
    try {
      if (keys2.length && redis.del) {
        await redis.del(...keys2);
      }
    } catch (err) {
    }
    if (updates.length > 0) {
      await prisma.$transaction(updates);
      console.log(`Flushed view counts for ${updates.length} jobs`);
    }
  } catch (err) {
    console.error("flushViewCounts failed:", err);
  }
};
var viewCountFlusher_default = flushViewCounts;

// src/server.ts
var app = express();
var port2 = 5e3;
app.use(
  cors({
    origin: "http://localhost:3000",
    // Your frontend URL
    credentials: true
  })
);
app.all("/api/auth", toNodeHandler(auth));
app.all("/api/auth/*authPath", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/candidate/profile", profileRouter);
app.use("/api/v1/candidate/work-experience", workExperienceRouter);
app.use("/api/v1/candidate/education", educationRouter);
app.use("/api/v1/saved-jobs", savedJobsRouter);
app.use("/api/v1/uploads", uploadsRouter);
app.use("/api/v1/tags", tagsRouter);
app.use("/api/v1/search", searchRouter);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express!");
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});
app.use(errorHandler);
var server = http.createServer(app);
var io2 = new IOServer(server, {
  cors: { origin: "http://localhost:3000", credentials: true }
});
setIO(io2);
io2.on("connection", (socket) => {
  console.log("Socket connection attempt", socket.id);
  authenticateSocket(socket).then((userId) => {
    if (!userId) {
      console.log("Socket authentication failed", socket.id);
      socket.disconnect(true);
      return;
    }
    socket.data.userId = userId;
    addConnectedUser(userId, socket.id);
    socket.join(`user:${userId}`);
    console.log(`User ${userId} connected with socket ${socket.id}`);
    socket.emit("auth:success", { userId, socketId: socket.id });
    socket.on("join:application", (applicationId) => {
      socket.join(`application:${applicationId}`);
      console.log(`User ${userId} joined application room: ${applicationId}`);
    });
    socket.on("leave:application", (applicationId) => {
      socket.leave(`application:${applicationId}`);
      console.log(`User ${userId} left application room: ${applicationId}`);
    });
    socket.on("join:job", (jobId) => {
      socket.join(`job:${jobId}`);
      console.log(`User ${userId} joined job room: ${jobId}`);
    });
    socket.on("leave:job", (jobId) => {
      socket.leave(`job:${jobId}`);
      console.log(`User ${userId} left job room: ${jobId}`);
    });
  });
  socket.on("disconnect", () => {
    const userId = socket.data.userId || socket.handshake.auth.userId;
    if (userId) {
      removeConnectedUser(userId, socket.id);
      console.log(`User ${userId} disconnected with socket ${socket.id}`);
    } else {
      console.log(`Socket ${socket.id} disconnected (unauthenticated)`);
    }
  });
});
app.get("/", (req, res) => {
  res.send("Server works");
});
server.listen(port2, () => {
  console.log(`Server is running on http://localhost:${port2}`);
});
try {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await viewCountFlusher_default();
    } catch (err) {
      console.error("Error running flushViewCounts cron:", err);
    }
  });
} catch (err) {
}
var server_default = app;
export {
  server_default as default
};
