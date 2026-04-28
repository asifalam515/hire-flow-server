import type { ApplicationStage } from "@/generated/prisma/enums";
import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";

const applicationStages: ApplicationStage[] = [
  "APPLIED",
  "SCREENING",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
];

type TimeBucket = "week" | "month";

interface DateRangeFilter {
  from?: Date;
  to?: Date;
  bucket: TimeBucket;
}

const normalizeBucket = (value?: string): TimeBucket => {
  return value === "month" ? "month" : "week";
};

const parseDateRangeFilter = (
  from?: string,
  to?: string,
  bucket?: string,
): DateRangeFilter => {
  const parsedFrom = from ? new Date(from) : undefined;
  const parsedTo = to ? new Date(to) : undefined;

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
    bucket: normalizeBucket(bucket),
  };
};

const buildDateWhere = (field: string, range: DateRangeFilter) => {
  const where: Record<string, unknown> = {};

  if (range.from || range.to) {
    where[field] = {
      ...(range.from ? { gte: range.from } : {}),
      ...(range.to ? { lte: range.to } : {}),
    };
  }

  return where;
};

const getRecruiterCompanyFromDb = async (userId: string) => {
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
          isActive: true,
        },
      },
    },
  });

  if (!membership) {
    throw new AppError(
      "No company is connected to this recruiter. Join a company first.",
      404,
    );
  }

  return membership;
};

const buildStageCountMap = () => {
  return applicationStages.reduce<Record<ApplicationStage, number>>(
    (acc, stage) => {
      acc[stage] = 0;
      return acc;
    },
    {} as Record<ApplicationStage, number>,
  );
};

const bucketDate = (date: Date, bucket: TimeBucket) => {
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

const getChartSeries = (
  applications: Array<{ createdAt: Date; stage: ApplicationStage }>,
  bucket: TimeBucket,
) => {
  const map = new Map<
    string,
    { label: string; total: number; stages: Record<ApplicationStage, number> }
  >();

  for (const application of applications) {
    const label = bucketDate(application.createdAt, bucket);
    const current = map.get(label) ?? {
      label,
      total: 0,
      stages: buildStageCountMap(),
    };

    current.total += 1;
    current.stages[application.stage] += 1;
    map.set(label, current);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
};

const getJobPipelineCounts = async (
  jobIds: string[],
  from?: Date,
  to?: Date,
) => {
  if (jobIds.length === 0) {
    return [] as Array<{
      jobId: string;
      stage: ApplicationStage;
      _count: { stage: number };
    }>;
  }

  return prisma.application.groupBy({
    by: ["jobId", "stage"],
    where: {
      jobId: { in: jobIds },
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
    _count: { stage: true },
  });
};

const getRecruiterOverviewFromDb = async (
  userId: string,
  range: DateRangeFilter,
) => {
  const membership = await getRecruiterCompanyFromDb(userId);

  const jobDateFilter = buildDateWhere("createdAt", range);
  const applicationDateFilter = buildDateWhere("createdAt", range);

  const companyJobs = await prisma.job.findMany({
    where: { companyId: membership.companyId, ...(jobDateFilter as object) },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
      publishedAt: true,
      _count: {
        select: { applications: true, savedBy: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const companyJobIds = companyJobs.map((job) => job.id);

  const applications =
    companyJobIds.length > 0
      ? await prisma.application.findMany({
          where: {
            jobId: { in: companyJobIds },
            ...(applicationDateFilter as object),
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
                image: true,
              },
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
                    logoUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

  const [
    totalJobs,
    publishedJobs,
    draftJobs,
    pausedJobs,
    closedJobs,
    expiredJobs,
    stageRows,
  ] = await Promise.all([
    prisma.job.count({
      where: { companyId: membership.companyId, ...(jobDateFilter as object) },
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "PUBLISHED",
        ...(jobDateFilter as object),
      },
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "DRAFT",
        ...(jobDateFilter as object),
      },
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "PAUSED",
        ...(jobDateFilter as object),
      },
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "CLOSED",
        ...(jobDateFilter as object),
      },
    }),
    prisma.job.count({
      where: {
        companyId: membership.companyId,
        status: "EXPIRED",
        ...(jobDateFilter as object),
      },
    }),
    companyJobIds.length > 0
      ? prisma.application.groupBy({
          by: ["stage"],
          where: {
            jobId: { in: companyJobIds },
            ...(applicationDateFilter as object),
          },
          _count: { stage: true },
        })
      : Promise.resolve([]),
  ]);

  const stageCounts = buildStageCountMap();

  for (const row of stageRows) {
    stageCounts[row.stage] = row._count.stage;
  }

  const topJobs = companyJobs
    .map((job) => ({
      id: job.id,
      title: job.title,
      slug: job.slug,
      status: job.status,
      createdAt: job.createdAt,
      publishedAt: job.publishedAt,
      applications: job._count.applications,
      savedCount: job._count.savedBy,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5);

  const recentApplications = applications.slice(0, 10).map((application) => ({
    id: application.id,
    stage: application.stage,
    createdAt: application.createdAt,
    candidate: application.candidate,
    job: application.job,
  }));

  const chart = getChartSeries(applications, range.bucket);

  const sourceBreakdown: Record<string, number> = {};
  for (const app of applications) {
    const src = app.source || "UNKNOWN";
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  }

  const applicationIds = applications.map(app => app.id);
  const auditLogs = applicationIds.length > 0 ? await prisma.auditLog.findMany({
    where: { applicationId: { in: applicationIds } },
    orderBy: { createdAt: "asc" }
  }) : [];

  const timePerStage: Record<string, { totalMs: number, count: number }> = {};
  
  for (const appId of applicationIds) {
    const logs = auditLogs.filter(log => log.applicationId === appId);
    if (logs.length === 0) continue;
    
    // assuming applied at createdAt of application, but let's use logs
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (log.fromStage) {
        const nextTime = i + 1 < logs.length ? logs[i+1].createdAt.getTime() : Date.now();
        const duration = nextTime - log.createdAt.getTime();
        
        if (!timePerStage[log.fromStage]) {
          timePerStage[log.fromStage] = { totalMs: 0, count: 0 };
        }
        timePerStage[log.fromStage].totalMs += duration;
        timePerStage[log.fromStage].count += 1;
      }
    }
  }

  const averageTimePerStage: Record<string, number> = {};
  for (const [stage, data] of Object.entries(timePerStage)) {
    // average days
    averageTimePerStage[stage] = parseFloat((data.totalMs / data.count / (1000 * 60 * 60 * 24)).toFixed(1));
  }

  return {
    company: membership.company,
    recruiter: {
      id: userId,
      role: membership.isOwner ? "OWNER" : "RECRUITER",
    },
    filters: {
      from: range.from ?? null,
      to: range.to ?? null,
      bucket: range.bucket,
    },
    jobs: {
      total: totalJobs,
      published: publishedJobs,
      draft: draftJobs,
      paused: pausedJobs,
      closed: closedJobs,
      expired: expiredJobs,
    },
    applications: {
      total: applications.length,
      byStage: stageCounts,
      sourceBreakdown,
      averageTimePerStageDays: averageTimePerStage
    },
    topJobs,
    recentApplications,
    chart,
  };
};

const getRecruiterFunnelFromDb = async (
  userId: string,
  range: DateRangeFilter,
) => {
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
        select: { applications: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const jobIds = jobs.map((job) => job.id);

  const grouped = await getJobPipelineCounts(jobIds, range.from, range.to);

  const groupedMap = new Map<string, Record<ApplicationStage, number>>();

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
      appliedToScreening:
        applied > 0
          ? Number((((applied - screening) / applied) * 100).toFixed(2))
          : 0,
      screeningToAssessment:
        screening > 0
          ? Number((((screening - assessment) / screening) * 100).toFixed(2))
          : 0,
      assessmentToInterview:
        assessment > 0
          ? Number((((assessment - interview) / assessment) * 100).toFixed(2))
          : 0,
      interviewToOffer:
        interview > 0
          ? Number((((interview - offer) / interview) * 100).toFixed(2))
          : 0,
      offerToHired:
        offer > 0 ? Number((((offer - hired) / offer) * 100).toFixed(2)) : 0,
    };

    return {
      job: {
        id: job.id,
        title: job.title,
        slug: job.slug,
        status: job.status,
        publishedAt: job.publishedAt,
      },
      applications: job._count.applications,
      stages: stageCounts,
      dropOff,
      conversionRateToHire:
        job._count.applications > 0
          ? Number(((hired / job._count.applications) * 100).toFixed(2))
          : 0,
    };
  });

  return {
    company: membership.company,
    filters: {
      from: range.from ?? null,
      to: range.to ?? null,
      bucket: range.bucket,
    },
    pipeline,
  };
};

const parseAnalyticsRange = (query: {
  from?: string;
  to?: string;
  bucket?: string;
}) => parseDateRangeFilter(query.from, query.to, query.bucket);

export const analyticsService = {
  getRecruiterOverviewFromDb,
  getRecruiterFunnelFromDb,
  parseAnalyticsRange,
};
