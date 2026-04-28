import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";

const saveJobInDb = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError("Job not found", 404);

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing) throw new AppError("Job already saved", 400);

  const saved = await prisma.savedJob.create({ data: { userId, jobId } });
  return saved;
};

const removeSavedJobFromDb = async (userId: string, jobId: string) => {
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (!existing) throw new AppError("Saved job not found", 404);

  await prisma.savedJob.delete({ where: { userId_jobId: { userId, jobId } } });
  return { success: true };
};

const listSavedJobsFromDb = async (userId: string, page = 1, limit = 20) => {
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
              select: { id: true, name: true, slug: true, logoUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.savedJob.count({ where: { userId } }),
  ]);

  return {
    data: items.map((s) => ({ ...s.job, savedAt: s.createdAt })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const savedJobsService = {
  saveJobInDb,
  removeSavedJobFromDb,
  listSavedJobsFromDb,
};
