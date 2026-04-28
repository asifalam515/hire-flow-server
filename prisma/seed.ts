import { randomUUID } from "crypto";
import { prisma } from "../src/lib/prisma";

const companiesData = [
  {
    name: "Acme Corporation",
    slug: "acme-corp",
    logoUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop",
    website: "https://acme-corp.example.com",
    linkedinUrl: "https://linkedin.com/company/acme-corp",
    description:
      "Leading innovator in cloud computing and enterprise solutions. We help businesses transform their operations through cutting-edge technology.",
    industry: "Technology",
    size: "LARGE",
    founded: 2010,
    country: "United States",
    city: "San Francisco",
    isVerified: true,
    isActive: true,
  },
  {
    name: "TechStartup Labs",
    slug: "techstartup-labs",
    logoUrl:
      "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=1200&h=400&fit=crop",
    website: "https://techstartup-labs.example.com",
    linkedinUrl: "https://linkedin.com/company/techstartup-labs",
    description:
      "Disruptive AI and machine learning startup focused on building the future. We're hiring talented engineers to join our mission.",
    industry: "Artificial Intelligence",
    size: "STARTUP",
    founded: 2022,
    country: "United States",
    city: "New York",
    isVerified: true,
    isActive: true,
  },
  {
    name: "GlobalTech Solutions",
    slug: "globaltech-solutions",
    logoUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop",
    website: "https://globaltech-solutions.example.com",
    linkedinUrl: "https://linkedin.com/company/globaltech-solutions",
    description:
      "Enterprise software solutions provider serving Fortune 500 companies. Specializing in data analytics, cybersecurity, and digital transformation.",
    industry: "Enterprise Software",
    size: "ENTERPRISE",
    founded: 2005,
    country: "Canada",
    city: "Toronto",
    isVerified: true,
    isActive: true,
  },
  {
    name: "Creative Design Co",
    slug: "creative-design-co",
    logoUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop",
    website: "https://creativedesignco.example.com",
    linkedinUrl: "https://linkedin.com/company/creative-design-co",
    description:
      "Full-service design and branding agency. We create beautiful digital experiences for innovative brands worldwide.",
    industry: "Design & Marketing",
    size: "MEDIUM",
    founded: 2015,
    country: "United Kingdom",
    city: "London",
    isVerified: true,
    isActive: true,
  },
  {
    name: "FinServe Innovations",
    slug: "finserve-innovations",
    logoUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop",
    website: "https://finserve-innovations.example.com",
    linkedinUrl: "https://linkedin.com/company/finserve-innovations",
    description:
      "Revolutionary fintech company transforming financial services. Blockchain, AI, and secure payment solutions for the modern era.",
    industry: "Financial Technology",
    size: "MEDIUM",
    founded: 2018,
    country: "Singapore",
    city: "Singapore",
    isVerified: true,
    isActive: true,
  },
  {
    name: "EcoGreen Energy",
    slug: "ecogreen-energy",
    logoUrl:
      "https://images.unsplash.com/photo-1559163499-641a2e97e15f?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1559163499-641a2e97e15f?w=1200&h=400&fit=crop",
    website: "https://ecogreen-energy.example.com",
    linkedinUrl: "https://linkedin.com/company/ecogreen-energy",
    description:
      "Sustainable renewable energy solutions. We're building a cleaner future with solar and wind technology innovations.",
    industry: "Renewable Energy",
    size: "SMALL",
    founded: 2020,
    country: "Germany",
    city: "Berlin",
    isVerified: false,
    isActive: true,
  },
  {
    name: "HealthTech Pro",
    slug: "healthtech-pro",
    logoUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop",
    website: "https://healthtech-pro.example.com",
    linkedinUrl: "https://linkedin.com/company/healthtech-pro",
    description:
      "Healthcare technology platform connecting patients with doctors. Telemedicine, AI diagnostics, and patient records management.",
    industry: "Healthcare Technology",
    size: "SMALL",
    founded: 2021,
    country: "Australia",
    city: "Sydney",
    isVerified: true,
    isActive: true,
  },
  {
    name: "DataFlow Systems",
    slug: "dataflow-systems",
    logoUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop",
    website: "https://dataflow-systems.example.com",
    linkedinUrl: "https://linkedin.com/company/dataflow-systems",
    description:
      "Advanced data engineering and analytics platform. Real-time processing, warehousing, and business intelligence solutions.",
    industry: "Data Analytics",
    size: "LARGE",
    founded: 2012,
    country: "Netherlands",
    city: "Amsterdam",
    isVerified: true,
    isActive: true,
  },
  {
    name: "CloudVault Inc",
    slug: "cloudvault-inc",
    logoUrl:
      "https://images.unsplash.com/photo-1559163499-641a2e97e15f?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1559163499-641a2e97e15f?w=1200&h=400&fit=crop",
    website: "https://cloudvault-inc.example.com",
    linkedinUrl: "https://linkedin.com/company/cloudvault-inc",
    description:
      "Secure cloud storage and collaboration platform. Enterprise-grade security with seamless team collaboration features.",
    industry: "Cloud Computing",
    size: "MEDIUM",
    founded: 2016,
    country: "Ireland",
    city: "Dublin",
    isVerified: true,
    isActive: true,
  },
  {
    name: "DevOps Masters",
    slug: "devops-masters",
    logoUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop",
    website: "https://devops-masters.example.com",
    linkedinUrl: "https://linkedin.com/company/devops-masters",
    description:
      "Infrastructure automation and DevOps consulting. CI/CD, containerization, and cloud infrastructure expertise.",
    industry: "Technology",
    size: "SMALL",
    founded: 2019,
    country: "France",
    city: "Paris",
    isVerified: true,
    isActive: true,
  },
];

async function main() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing companies and their relations
    console.log("🗑️  Clearing existing company data...");
    await prisma.companyMember.deleteMany({});
    await prisma.company.deleteMany({});

    console.log("✨ Creating companies...");
    for (const company of companiesData) {
      const createdCompany = await prisma.company.create({
        data: company,
      });
      console.log(
        `✅ Created: ${createdCompany.name} (${createdCompany.slug})`,
      );
    }

    // Create a global admin user (if not exists) and a recruiter for each company
    console.log("\n🔐 Seeding admin and recruiters...");

    // Remove previously seeded example users to avoid duplicates
    await prisma.user.deleteMany({
      where: { email: { contains: "@example.com" } },
    });

    const adminId = randomUUID();
    const admin = await prisma.user.create({
      data: {
        id: adminId,
        name: "System Admin",
        email: "admin@example.com",
        emailVerified: true,
        role: "ADMIN",
      },
    });
    console.log(`🛡️  Created admin: ${admin.email}`);

    const companies = await prisma.company.findMany();
    for (const c of companies) {
      const recruiterId = randomUUID();
      const recruiterEmail = `recruiter+${c.slug}@example.com`;
      const recruiter = await prisma.user.create({
        data: {
          id: recruiterId,
          name: `Recruiter — ${c.name}`,
          email: recruiterEmail,
          emailVerified: true,
          role: "RECRUITER",
          image: "",
        },
      });

      await prisma.companyMember.create({
        data: {
          userId: recruiter.id,
          companyId: c.id,
          isOwner: true,
        },
      });

      console.log(`👤 Created recruiter ${recruiter.email} for ${c.slug}`);
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log(`📊 Total companies created: ${companiesData.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
