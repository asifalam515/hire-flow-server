import { Prisma, Company } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface ListCompaniesFilter {
  search?: string | undefined;
  limit?: number | undefined;
}

export type CompanyWithCount = Company & {
  _count: {
    jobs: number;
  };
};

export type CompanyDetail = Company & {
  jobs: Array<{
    id: string;
    title: string;
    locationCity: string;
    locationCountry: string;
    minSalary: number;
    maxSalary: number;
    employmentTypes: string[];
    createdAt: Date;
  }>;
  _count: {
    jobs: number;
    followers: number;
  };
};

/**
 * List companies with optional search filter and job count aggregation.
 */
export const findCompaniesRecord = async (
  filters: ListCompaniesFilter,
): Promise<CompanyWithCount[]> => {
  const where: Prisma.CompanyWhereInput = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { field: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.company.findMany({
    where,
    take: filters.limit ?? 50,
    include: {
      _count: {
        select: { jobs: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Find a single company by slug including its latest published jobs and follower count.
 */
export const findCompanyBySlugRecord = async (
  slug: string,
): Promise<CompanyDetail | null> => {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          locationCity: true,
          locationCountry: true,
          minSalary: true,
          maxSalary: true,
          employmentTypes: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: { jobs: true, followers: true },
      },
    },
  });
};

/**
 * Find a single company by ID.
 */
export const findCompanyByIdRecord = async (id: string): Promise<Company | null> => {
  return prisma.company.findUnique({
    where: { id },
  });
};

/**
 * Find user IDs of candidates following a company.
 */
export const findCompanyFollowerUserIdsRecord = async (companyId: string): Promise<string[]> => {
  const followers = await prisma.followedCompany.findMany({
    where: { companyId },
    select: { userId: true },
  });
  return followers.map((f: { userId: string }) => f.userId);
};
