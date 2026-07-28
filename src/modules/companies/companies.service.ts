import { prisma } from '../../config/prisma';

export const listCompanies = async (filters: { search?: string, limit?: number }) => {
  const where: any = {};
  
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { field: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.company.findMany({
    where,
    take: filters.limit || 50,
    include: {
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getCompanyBySlug = async (slug: string) => {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      _count: {
        select: { jobs: true, followers: true }
      }
    }
  });
};
