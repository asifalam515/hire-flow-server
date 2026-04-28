import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";
// Check if slug is unique
const isSlugUnique = async (slug, excludeId) => {
    const existingCompany = await prisma.company.findUnique({
        where: { slug },
    });
    if (!existingCompany)
        return true;
    if (excludeId && existingCompany.id === excludeId)
        return true;
    return false;
};
// Create a new company
const createCompanyInDb = async (data, userId) => {
    // Validate slug uniqueness
    const isUnique = await isSlugUnique(data.slug);
    if (!isUnique) {
        throw new AppError(`Slug "${data.slug}" is already taken`, 400);
    }
    // Create company
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
            city: data.city,
        },
    });
    // Add the creator as company owner
    await prisma.companyMember.create({
        data: {
            userId,
            companyId: company.id,
            isOwner: true,
        },
    });
    return company;
};
// Get all companies with pagination
const getAllCompaniesFromDb = async (page = 1, limit = 10, filters) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filters?.isActive !== undefined)
        where.isActive = filters.isActive;
    if (filters?.isVerified !== undefined)
        where.isVerified = filters.isVerified;
    if (filters?.search) {
        where.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { slug: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
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
                    where: { status: "PUBLISHED" },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.company.count({ where }),
    ]);
    return {
        data: companies,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
// Get company by ID
const getCompanyByIdFromDb = async (id) => {
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
                            image: true,
                        },
                    },
                },
            },
            jobs: {
                where: { status: "PUBLISHED" },
                orderBy: { publishedAt: "desc" },
                take: 10,
            },
        },
    });
    if (!company) {
        throw new AppError("Company not found", 404);
    }
    return company;
};
// Get company by slug
const getCompanyBySlugFromDb = async (slug) => {
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
                            image: true,
                        },
                    },
                },
            },
            jobs: {
                where: { status: "PUBLISHED" },
                orderBy: { publishedAt: "desc" },
                take: 10,
            },
        },
    });
    if (!company) {
        throw new AppError("Company not found", 404);
    }
    return company;
};
// Update company
const updateCompanyInDb = async (id, data) => {
    // Check if company exists
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
        throw new AppError("Company not found", 404);
    }
    // If slug is being updated, check uniqueness
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
            members: true,
        },
    });
    return updatedCompany;
};
// Delete company
const deleteCompanyFromDb = async (id) => {
    // Check if company exists
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
        throw new AppError("Company not found", 404);
    }
    // Delete company (cascades to members and jobs)
    const deletedCompany = await prisma.company.delete({
        where: { id },
    });
    return deletedCompany;
};
// Verify company (Admin only)
const verifyCompanyInDb = async (id, isVerified) => {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
        throw new AppError("Company not found", 404);
    }
    const updatedCompany = await prisma.company.update({
        where: { id },
        data: { isVerified },
    });
    return updatedCompany;
};
// Get companies for a user (companies where user is a member)
const getUserCompaniesFromDb = async (userId) => {
    const members = await prisma.companyMember.findMany({
        where: { userId },
        include: {
            company: {
                include: {
                    members: true,
                    jobs: {
                        where: { status: "PUBLISHED" },
                    },
                },
            },
        },
    });
    return members.map((m) => ({
        ...m.company,
        userRole: m.isOwner ? "OWNER" : "MEMBER",
    }));
};
// Add member to company
const addCompanyMemberInDb = async (companyId, userId, isOwner = false) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
        throw new AppError("Company not found", 404);
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    // Check if member already exists
    const existingMember = await prisma.companyMember.findUnique({
        where: { userId },
    });
    if (existingMember?.companyId === companyId) {
        throw new AppError("User is already a member of this company", 400);
    }
    const member = await prisma.companyMember.create({
        data: {
            userId,
            companyId,
            isOwner,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                },
            },
        },
    });
    return member;
};
// Remove member from company
const removeCompanyMemberFromDb = async (companyId, userId) => {
    const member = await prisma.companyMember.findUnique({
        where: { userId },
    });
    if (!member || member.companyId !== companyId) {
        throw new AppError("Member not found in this company", 404);
    }
    if (member.isOwner) {
        // Check if there are other owners
        const otherOwners = await prisma.companyMember.count({
            where: {
                companyId,
                isOwner: true,
                userId: { not: userId },
            },
        });
        if (otherOwners === 0) {
            throw new AppError("Cannot remove the last owner from the company", 400);
        }
    }
    const removedMember = await prisma.companyMember.delete({
        where: { userId },
    });
    return removedMember;
};
// Get company members
const getCompanyMembersFromDb = async (companyId) => {
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
                    image: true,
                },
            },
        },
    });
    return members;
};
export const companyService = {
    createCompanyInDb,
    getAllCompaniesFromDb,
    getCompanyByIdFromDb,
    getCompanyBySlugFromDb,
    updateCompanyInDb,
    deleteCompanyFromDb,
    verifyCompanyInDb,
    getUserCompaniesFromDb,
    addCompanyMemberInDb,
    removeCompanyMemberFromDb,
    getCompanyMembersFromDb,
};
//# sourceMappingURL=company.service.js.map