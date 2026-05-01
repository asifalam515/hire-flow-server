import { randomUUID } from "crypto";
import { prisma } from "../src/lib/prisma";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

const jobsData = [
  {
    companySlug: "acme-corp",
    title: "Senior Backend Engineer",
    description:
      "Build and scale the core services that power our enterprise cloud platform.",
    requirements:
      "5+ years backend experience, strong TypeScript and PostgreSQL skills.",
    responsibilities:
      "Design APIs, improve reliability, and mentor engineers on the platform team.",
    benefits: "Competitive salary, remote flexibility, annual learning budget.",
    type: "FULL_TIME",
    experienceLevel: "SENIOR",
    location: "San Francisco, CA",
    isRemote: true,
    country: "United States",
    city: "San Francisco",
    salaryMin: 150000,
    salaryMax: 200000,
    salaryCurrency: "USD",
    salaryPeriod: "YEAR",
    techStack: ["TypeScript", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    companySlug: "techstartup-labs",
    title: "Full Stack Developer",
    description:
      "Ship new product features across the web stack for an AI-powered startup.",
    requirements:
      "3+ years with React, Node.js, and REST APIs. Comfortable in fast-moving teams.",
    responsibilities:
      "Build customer-facing product flows and backend integrations.",
    benefits: "Equity, flexible hours, high-ownership environment.",
    type: "FULL_TIME",
    experienceLevel: "MID",
    location: "New York, NY",
    isRemote: false,
    country: "United States",
    city: "New York",
    salaryMin: 120000,
    salaryMax: 160000,
    salaryCurrency: "USD",
    salaryPeriod: "YEAR",
    techStack: ["React", "Next.js", "TypeScript", "Node.js"],
  },
  {
    companySlug: "globaltech-solutions",
    title: "DevOps Engineer",
    description:
      "Own infrastructure automation and delivery pipelines for enterprise clients.",
    requirements: "Strong Docker, Kubernetes, and cloud deployment experience.",
    responsibilities:
      "Maintain CI/CD workflows and improve observability across services.",
    benefits: "Global team, learning stipend, comprehensive benefits.",
    type: "FULL_TIME",
    experienceLevel: "SENIOR",
    location: "Toronto, ON",
    isRemote: true,
    country: "Canada",
    city: "Toronto",
    salaryMin: 130000,
    salaryMax: 175000,
    salaryCurrency: "CAD",
    salaryPeriod: "YEAR",
    techStack: ["Docker", "Kubernetes", "AWS", "Terraform"],
  },
  {
    companySlug: "creative-design-co",
    title: "Product Designer",
    description:
      "Craft polished user experiences for high-growth brands and campaigns.",
    requirements:
      "Portfolio with product UI work, strong Figma and prototyping skills.",
    responsibilities:
      "Collaborate with PMs and engineers on flows, visuals, and design systems.",
    benefits: "Creative team, hybrid schedule, conference budget.",
    type: "FULL_TIME",
    experienceLevel: "MID",
    location: "London, UK",
    isRemote: false,
    country: "United Kingdom",
    city: "London",
    salaryMin: 65000,
    salaryMax: 90000,
    salaryCurrency: "GBP",
    salaryPeriod: "YEAR",
    techStack: ["Figma", "Design Systems", "Prototyping", "User Research"],
  },
  {
    companySlug: "finserve-innovations",
    title: "Frontend Engineer",
    description:
      "Build secure, accessible financial dashboards for enterprise customers.",
    requirements:
      "Strong React and TypeScript fundamentals with attention to detail.",
    responsibilities:
      "Implement UI workflows, charts, and performance-sensitive interfaces.",
    benefits: "Fintech impact, strong compensation, modern stack.",
    type: "FULL_TIME",
    experienceLevel: "MID",
    location: "Singapore",
    isRemote: true,
    country: "Singapore",
    city: "Singapore",
    salaryMin: 90000,
    salaryMax: 130000,
    salaryCurrency: "SGD",
    salaryPeriod: "YEAR",
    techStack: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
  },
  {
    companySlug: "ecogreen-energy",
    title: "Data Analyst",
    description:
      "Analyze energy usage patterns and help optimize renewable deployments.",
    requirements:
      "Experience with SQL, dashboards, and clean reporting workflows.",
    responsibilities:
      "Build reporting queries and support sustainability metrics tracking.",
    benefits: "Mission-driven work, flexible hours, impact-focused team.",
    type: "PART_TIME",
    experienceLevel: "JUNIOR",
    location: "Berlin, Germany",
    isRemote: false,
    country: "Germany",
    city: "Berlin",
    salaryMin: 45000,
    salaryMax: 60000,
    salaryCurrency: "EUR",
    salaryPeriod: "YEAR",
    techStack: ["SQL", "Power BI", "Python", "Excel"],
  },
  {
    companySlug: "healthtech-pro",
    title: "Mobile Engineer",
    description:
      "Develop mobile experiences that connect patients and doctors.",
    requirements:
      "React Native or Flutter experience with production mobile apps.",
    responsibilities: "Ship appointment, messaging, and telehealth features.",
    benefits: "Healthcare domain, remote-first culture, annual bonus.",
    type: "FULL_TIME",
    experienceLevel: "MID",
    location: "Sydney, Australia",
    isRemote: true,
    country: "Australia",
    city: "Sydney",
    salaryMin: 110000,
    salaryMax: 150000,
    salaryCurrency: "AUD",
    salaryPeriod: "YEAR",
    techStack: ["React Native", "TypeScript", "GraphQL", "Firebase"],
  },
  {
    companySlug: "dataflow-systems",
    title: "Data Engineer",
    description:
      "Build pipelines and warehouse tooling for analytics-heavy customers.",
    requirements:
      "Experience with ETL, orchestration, and modern warehouse stacks.",
    responsibilities:
      "Maintain reliable data pipelines and support analytics teams.",
    benefits: "Enterprise clients, strong salary, hybrid setup.",
    type: "FULL_TIME",
    experienceLevel: "SENIOR",
    location: "Amsterdam, Netherlands",
    isRemote: false,
    country: "Netherlands",
    city: "Amsterdam",
    salaryMin: 85000,
    salaryMax: 115000,
    salaryCurrency: "EUR",
    salaryPeriod: "YEAR",
    techStack: ["Python", "Airflow", "PostgreSQL", "dbt"],
  },
  {
    companySlug: "cloudvault-inc",
    title: "Security Engineer",
    description:
      "Protect cloud storage products with practical security engineering.",
    requirements:
      "Knowledge of cloud security, IAM, and incident response practices.",
    responsibilities:
      "Review security controls, improve detection, and support audits.",
    benefits: "Security-focused team, flexible remote policy, growth budget.",
    type: "CONTRACT",
    experienceLevel: "SENIOR",
    location: "Dublin, Ireland",
    isRemote: true,
    country: "Ireland",
    city: "Dublin",
    salaryMin: 900,
    salaryMax: 1200,
    salaryCurrency: "EUR",
    salaryPeriod: "DAY",
    techStack: ["Cloud Security", "AWS", "IAM", "SIEM"],
  },
  {
    companySlug: "devops-masters",
    title: "Junior Platform Engineer",
    description:
      "Support infrastructure automation and internal developer tooling.",
    requirements:
      "Basic Linux, Docker, and scripting knowledge with a desire to learn.",
    responsibilities:
      "Help maintain deployment pipelines and internal platform services.",
    benefits: "Mentorship, modern tooling, and strong technical exposure.",
    type: "INTERNSHIP",
    experienceLevel: "ENTRY",
    location: "Paris, France",
    isRemote: false,
    country: "France",
    city: "Paris",
    salaryMin: 1800,
    salaryMax: 2400,
    salaryCurrency: "EUR",
    salaryPeriod: "MONTH",
    techStack: ["Linux", "Docker", "Bash", "GitHub Actions"],
  },
];

const seedSkills = async () => {
  const commonSkills = [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "NestJS",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "GraphQL",
    "REST",
    "Prisma",
    "Sequelize",
    "Python",
    "Django",
    "FastAPI",
    "Java",
    "Spring Boot",
    "C#",
    ".NET",
    "Ruby",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "Go",
    "Rust",
    "C++",
    "C",
    "Swift",
    "Kotlin",
    "React Native",
    "Flutter",
    "Vue.js",
    "Angular",
    "Svelte",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "SASS",
    "LESS",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "CI/CD",
    "Jenkins",
    "Travis CI",
  ];

  console.log("\n🌱 Seeding common skills...");

  const skillData = commonSkills.map((skillName) => {
    const slug = skillName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return {
      name: skillName,
      slug,
      usageCount: Math.floor(Math.random() * 100),
    };
  });

  await prisma.skill.createMany({
    data: skillData,
    skipDuplicates: true,
  });

  console.log("✅ Skills seeded.");
};

async function main() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing companies and their relations
    console.log("🗑️  Clearing existing company data...");
    await prisma.job.deleteMany({});
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
    const recruitersByCompanySlug = new Map<
      string,
      { companyId: string; recruiterId: string }
    >();
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

      recruitersByCompanySlug.set(c.slug, {
        companyId: c.id,
        recruiterId: recruiter.id,
      });

      console.log(`👤 Created recruiter ${recruiter.email} for ${c.slug}`);
    }

    console.log("\n💼 Seeding jobs with screening questions...");
    for (const job of jobsData) {
      const company = recruitersByCompanySlug.get(job.companySlug);
      if (!company) {
        throw new Error(`Missing seeded company for job ${job.title}`);
      }

      const createdJob = await prisma.job.create({
        data: {
          companyId: company.companyId,
          postedById: company.recruiterId,
          title: job.title,
          slug: `${job.companySlug}-${slugify(job.title)}`,
          description: job.description,
          requirements: job.requirements,
          responsibilities: job.responsibilities,
          benefits: job.benefits,
          type: job.type as any,
          experienceLevel: job.experienceLevel as any,
          location: job.location,
          isRemote: job.isRemote,
          country: job.country,
          city: job.city,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          salaryCurrency: job.salaryCurrency,
          salaryPeriod: job.salaryPeriod,
          techStack: job.techStack,
          status: "PUBLISHED",
          publishedAt: new Date(),
          screeningQuestions: {
            create: [
              {
                question: "What is your main area of expertise?",
                type: "TEXT",
                required: true,
              },
              {
                question: "Do you have experience with our tech stack?",
                type: "YES_NO",
                required: true,
              },
              {
                question: "What is your expected salary range?",
                type: "TEXT",
                required: false,
              },
            ],
          },
        },
        include: {
          screeningQuestions: true,
        },
      });

      console.log(`✅ Created job: ${job.title} (${job.companySlug})`);
      console.log(
        `   └─ Added ${createdJob.screeningQuestions.length} screening questions`,
      );
    }

    await seedSkills();

    console.log("\n🎉 Database seeded successfully!");
    console.log(`📊 Total companies created: ${companiesData.length}`);
    console.log(`📊 Total jobs created: ${jobsData.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
