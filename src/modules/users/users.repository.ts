import { Prisma, User, Company, Role } from '@prisma/client';
import { prisma } from '../../config/prisma';

export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  role: Role;
  companyId?: string | undefined;
}

// ---------------------------------------------------------------------------
// Users Repository
// ---------------------------------------------------------------------------
// Encapsulates all Prisma database interactions for users and companies.
// Services must not invoke Prisma directly and must call repository methods.
// ---------------------------------------------------------------------------

export class UsersRepository {
  /**
   * Find a user by their exact email address.
   */
  public async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by ID.
   */
  public async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find a company by its unique slug.
   */
  public async findCompanyBySlug(slug: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { slug },
    });
  }

  /**
   * Create a new company record.
   */
  public async createCompany(name: string, slug: string): Promise<Company> {
    return prisma.company.create({
      data: {
        name,
        slug,
      },
    });
  }

  /**
   * Create a new user with optional association to a company.
   */
  public async createUser(data: CreateUserDTO): Promise<User> {
    const createData: Prisma.UserCreateInput = {
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      ...(data.companyId && {
        company: {
          connect: { id: data.companyId },
        },
      }),
    };

    return prisma.user.create({
      data: createData,
    });
  }
}
