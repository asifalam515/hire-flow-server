import bcrypt from 'bcryptjs';
import { 
  Role, 
  JobStatus, 
  ApplicationStatus, 
  InterviewStatus, 
  AiInterviewStatus, 
  MessageType 
} from '@prisma/client';
import { prisma } from '../src/config/prisma';
import { encryptMessage } from '../src/utils/crypto';
import { generateTextEmbedding } from '../src/lib/geminiEmbedding';

/**
 * Ensures vectors conform to PostgreSQL Neon's vector(1536) column definition.
 * If 768-dim (Gemini), duplicating preserves the exact mathematical cosine similarity.
 */
function to1536Dimensions(vec: number[]): number[] {
  if (vec.length === 1536) return vec;
  if (vec.length === 768) {
    return [...vec, ...vec];
  }
  if (vec.length < 1536) {
    return [...vec, ...new Array(1536 - vec.length).fill(0)];
  }
  return vec.slice(0, 1536);
}

/**
 * Deterministic normalized 1536-dim vector fallback if Gemini API is offline or unavailable.
 */
function getFallbackVector(seed: string): number[] {
  const vector = new Array(1536).fill(0);
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < 1536; i++) {
    vector[i] = Math.sin(hash + i * 1.337) * 0.1;
  }
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map((v) => Number((v / (norm || 1)).toFixed(6)));
}

async function getEmbeddingOrFallback(text: string, seed: string): Promise<number[]> {
  try {
    const vec = await generateTextEmbedding(text);
    if (vec && vec.length > 0) {
      return to1536Dimensions(vec);
    }
  } catch {
    // fallback
  }
  return getFallbackVector(seed);
}

export async function seedShowcase(): Promise<void> {
  console.log('🚀 Starting HireFlow Complete Showcase Seeding...\n');

  // =========================================================================
  // 1. COMPANY: AeroCloud Technologies
  // =========================================================================
  console.log('1️⃣ Provisioning Showcase Company...');
  const company = await prisma.company.upsert({
    where: { slug: 'aerocloud-technologies' },
    update: {
      name: 'AeroCloud Technologies',
      field: 'Cloud Infrastructure & Enterprise AI',
      description: 'Building high-throughput edge AI runtime platforms and intelligent distributed workflows for modern software enterprises.',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    },
    create: {
      name: 'AeroCloud Technologies',
      slug: 'aerocloud-technologies',
      field: 'Cloud Infrastructure & Enterprise AI',
      description: 'Building high-throughput edge AI runtime platforms and intelligent distributed workflows for modern software enterprises.',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    },
  });
  console.log(`   🏢 Company active: ${company.name} (ID: ${company.id})`);

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // =========================================================================
  // 2. RECRUITER: Alex Morgan (recruiter@hireflow.dev)
  // =========================================================================
  console.log('\n2️⃣ Provisioning Demo Recruiter...');
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@hireflow.dev' },
    update: {
      firstName: 'Alex',
      lastName: 'Morgan',
      passwordHash,
      role: Role.RECRUITER,
      companyId: company.id,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
    create: {
      email: 'recruiter@hireflow.dev',
      firstName: 'Alex',
      lastName: 'Morgan',
      passwordHash,
      role: Role.RECRUITER,
      companyId: company.id,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
  });
  console.log(`   👔 Recruiter active: ${recruiter.firstName} ${recruiter.lastName} (${recruiter.email})`);

  // =========================================================================
  // 3. CANDIDATES (4 Diverse Profiles)
  // =========================================================================
  console.log('\n3️⃣ Provisioning 4 Diverse Candidates...');

  // Candidate 1: Sarah Jenkins (Star 94% Match)
  const sarahUser = await prisma.user.upsert({
    where: { email: 'candidate@hireflow.dev' },
    update: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    create: {
      email: 'candidate@hireflow.dev',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
  });

  const sarahParsedText = `Sarah Jenkins - Senior Full Stack Engineer. 5+ years experience designing and operating mission-critical web applications with TypeScript, React, Next.js, Node.js, and PostgreSQL. Engineered payment microservices handling $20M+ monthly transactions at Stripe. Reduced P99 API response latencies by 42% through Redis cluster caching and PostgreSQL composite index optimization. Deployed containerized services with Docker and Kubernetes on AWS.`;
  const sarahVec = await getEmbeddingOrFallback(sarahParsedText, 'sarah-jenkins-94');

  const sarahProfile = await prisma.candidateProfile.upsert({
    where: { userId: sarahUser.id },
    update: {
      aboutMe: 'Senior Full Stack Engineer passionate about high-concurrency web systems, TypeScript, and clean software architecture.',
      city: 'San Francisco',
      preferredJobTitle: 'Senior Full Stack Engineer',
      preferredJobTypes: ['Full Time'],
      favoriteCities: ['San Francisco', 'Remote', 'New York'],
      skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Redis'],
      languages: ['English', 'Spanish'],
      parsedText: sarahParsedText,
      receiveEmail: true,
    },
    create: {
      userId: sarahUser.id,
      aboutMe: 'Senior Full Stack Engineer passionate about high-concurrency web systems, TypeScript, and clean software architecture.',
      city: 'San Francisco',
      preferredJobTitle: 'Senior Full Stack Engineer',
      preferredJobTypes: ['Full Time'],
      favoriteCities: ['San Francisco', 'Remote', 'New York'],
      skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Redis'],
      languages: ['English', 'Spanish'],
      parsedText: sarahParsedText,
      receiveEmail: true,
    },
  });

  await prisma.$executeRawUnsafe(
    `UPDATE candidate_profiles SET embedding = $1::vector WHERE id = $2`,
    `[${sarahVec.join(',')}]`,
    sarahProfile.id
  );

  // Work Experiences for Sarah
  await prisma.workExperience.deleteMany({ where: { candidateProfileId: sarahProfile.id } });
  await prisma.workExperience.createMany({
    data: [
      {
        candidateProfileId: sarahProfile.id,
        title: 'Senior Software Engineer',
        company: 'Stripe',
        startDate: new Date('2022-03-01'),
        isCurrent: true,
        description: 'Architected distributed event-driven payment reconciliation pipelines using Node.js, TypeScript, and Kafka, processing over $20M monthly. Reduced database query latencies by 42% via PostgreSQL index optimization.',
      },
      {
        candidateProfileId: sarahProfile.id,
        title: 'Full Stack Engineer',
        company: 'Vercel',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-02-28'),
        isCurrent: false,
        description: 'Developed Next.js edge runtime components and real-time dashboard analytics, enhancing web vitals across millions of daily active deployments.',
      },
    ],
  });

  // Candidate 2: David Chen (82% Match - Backend Heavy)
  const davidUser = await prisma.user.upsert({
    where: { email: 'david.chen@example.com' },
    update: {
      firstName: 'David',
      lastName: 'Chen',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    create: {
      email: 'david.chen@example.com',
      firstName: 'David',
      lastName: 'Chen',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
  });

  const davidParsedText = `David Chen - Backend Software Engineer. 4 years experience with Go, Node.js, PostgreSQL, Docker, and AWS. Proven track record building microservices and REST/GraphQL APIs. Moderate React and TypeScript frontend knowledge.`;
  const davidVec = await getEmbeddingOrFallback(davidParsedText, 'david-chen-82');

  const davidProfile = await prisma.candidateProfile.upsert({
    where: { userId: davidUser.id },
    update: {
      aboutMe: 'Backend engineer focused on distributed systems, high throughput microservices, and database tuning.',
      city: 'Seattle',
      preferredJobTitle: 'Full Stack / Backend Engineer',
      preferredJobTypes: ['Full Time'],
      skills: ['Node.js', 'Go', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'REST APIs'],
      parsedText: davidParsedText,
    },
    create: {
      userId: davidUser.id,
      aboutMe: 'Backend engineer focused on distributed systems, high throughput microservices, and database tuning.',
      city: 'Seattle',
      preferredJobTitle: 'Full Stack / Backend Engineer',
      preferredJobTypes: ['Full Time'],
      skills: ['Node.js', 'Go', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'REST APIs'],
      parsedText: davidParsedText,
    },
  });

  await prisma.$executeRawUnsafe(
    `UPDATE candidate_profiles SET embedding = $1::vector WHERE id = $2`,
    `[${davidVec.join(',')}]`,
    davidProfile.id
  );

  // Candidate 3: Elena Rostova (68% Match - Junior Frontend Transitioning)
  const elenaUser = await prisma.user.upsert({
    where: { email: 'elena.rostova@example.com' },
    update: {
      firstName: 'Elena',
      lastName: 'Rostova',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    },
    create: {
      email: 'elena.rostova@example.com',
      firstName: 'Elena',
      lastName: 'Rostova',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    },
  });

  const elenaParsedText = `Elena Rostova - Frontend Web Developer. 2 years experience building accessible user interfaces with React, Next.js, and CSS. Learning Node.js and SQL to transition to full stack engineering.`;
  const elenaVec = await getEmbeddingOrFallback(elenaParsedText, 'elena-rostova-68');

  const elenaProfile = await prisma.candidateProfile.upsert({
    where: { userId: elenaUser.id },
    update: {
      aboutMe: 'Frontend developer passionate about responsive UI, React Server Components, and learning full stack development.',
      city: 'Austin',
      preferredJobTitle: 'Frontend / Full Stack Engineer',
      preferredJobTypes: ['Full Time'],
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Next.js'],
      parsedText: elenaParsedText,
    },
    create: {
      userId: elenaUser.id,
      aboutMe: 'Frontend developer passionate about responsive UI, React Server Components, and learning full stack development.',
      city: 'Austin',
      preferredJobTitle: 'Frontend / Full Stack Engineer',
      preferredJobTypes: ['Full Time'],
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Next.js'],
      parsedText: elenaParsedText,
    },
  });

  await prisma.$executeRawUnsafe(
    `UPDATE candidate_profiles SET embedding = $1::vector WHERE id = $2`,
    `[${elenaVec.join(',')}]`,
    elenaProfile.id
  );

  // Candidate 4: Marcus Vance (42% Match - Data/Business Analyst)
  const marcusUser = await prisma.user.upsert({
    where: { email: 'marcus.vance@example.com' },
    update: {
      firstName: 'Marcus',
      lastName: 'Vance',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    create: {
      email: 'marcus.vance@example.com',
      firstName: 'Marcus',
      lastName: 'Vance',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
  });

  const marcusParsedText = `Marcus Vance - Business & Data Analyst. 3 years experience with SQL queries, Excel financial modeling, and Tableau dashboards. Interested in software engineering opportunities.`;
  const marcusVec = await getEmbeddingOrFallback(marcusParsedText, 'marcus-vance-42');

  const marcusProfile = await prisma.candidateProfile.upsert({
    where: { userId: marcusUser.id },
    update: {
      aboutMe: 'Analytical problem solver with background in SQL and data visualization.',
      city: 'Chicago',
      preferredJobTitle: 'Junior Software Engineer',
      preferredJobTypes: ['Full Time'],
      skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Data Analysis'],
      parsedText: marcusParsedText,
    },
    create: {
      userId: marcusUser.id,
      aboutMe: 'Analytical problem solver with background in SQL and data visualization.',
      city: 'Chicago',
      preferredJobTitle: 'Junior Software Engineer',
      preferredJobTypes: ['Full Time'],
      skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Data Analysis'],
      parsedText: marcusParsedText,
    },
  });

  await prisma.$executeRawUnsafe(
    `UPDATE candidate_profiles SET embedding = $1::vector WHERE id = $2`,
    `[${marcusVec.join(',')}]`,
    marcusProfile.id
  );

  console.log('   ✅ 4 Candidate profiles seeded with vector embeddings.');

  // =========================================================================
  // 4. TECHNICAL JOBS (3 High-Impact Roles with pgvector)
  // =========================================================================
  console.log('\n4️⃣ Provisioning 3 High-Impact Technical Job Postings...');

  // Job 1: Senior Full Stack Engineer (Primary Showcase Job)
  let primaryJob = await prisma.job.findFirst({
    where: { companyId: company.id, title: 'Senior Full Stack Engineer (Next.js & TypeScript)' },
  });

  const primaryJobDescription = `We are seeking an elite Senior Full Stack Engineer to lead architecture across our distributed AI workflow platform. You will build high-throughput Next.js frontends and resilient Node.js / PostgreSQL backends serving thousands of concurrent enterprises. Requirements: 4+ years of professional TypeScript, React, Next.js, Node.js, and relational database design. Experience with Docker, Redis caching, and WebSockets is highly desired.`;
  const primaryJobVec = await getEmbeddingOrFallback(primaryJobDescription, 'job-fullstack-ts');

  if (!primaryJob) {
    primaryJob = await prisma.job.create({
      data: {
        companyId: company.id,
        title: 'Senior Full Stack Engineer (Next.js & TypeScript)',
        description: primaryJobDescription,
        status: JobStatus.PUBLISHED,
        category: 'Engineering',
        nature: 'remote',
        vacancies: 2,
        employmentTypes: ['Full Time'],
        locationCountry: 'United States',
        locationCity: 'San Francisco',
        minSalary: 150000,
        maxSalary: 195000,
        isSalaryNegotiable: true,
        benefits: ['Full Health & Dental', 'Unlimited PTO', '$3,000 Remote Setup Stipend', '401(k) 4% Match'],
        educationLevel: 'Bachelor Degree',
        yearsOfExperience: '4+ Years',
        gender: 'Any',
        candidateExperience: ['Senior Level', 'Mid Level'],
        languages: ['English'],
        softwareSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Redis'],
        responsibilities: 'Architect robust Next.js and Node.js microservices. Maintain 99.9% platform availability. Collaborate with engineering leadership on system design and mentorship.',
        requirements: 'Proven background designing scalable TypeScript applications. Deep familiarity with PostgreSQL indexing, Redis caching, and modern web vitals.',
      },
    });
  }

  await prisma.$executeRawUnsafe(
    `UPDATE jobs SET embedding = $1::vector WHERE id = $2`,
    `[${primaryJobVec.join(',')}]`,
    primaryJob.id
  );

  // Job 2: Staff AI Infrastructure Engineer
  const aiJobDesc = `Lead the design of distributed inference runtimes and vector retrieval pipelines. Strong proficiency with Python, PyTorch, LLM orchestration, Kubernetes, and pgvector.`;
  const aiJobVec = await getEmbeddingOrFallback(aiJobDesc, 'job-ai-infra');
  const aiJob = await prisma.job.upsert({
    where: { id: 'seed-job-ai-infra' },
    update: {},
    create: {
      id: 'seed-job-ai-infra',
      companyId: company.id,
      title: 'Staff AI Infrastructure Engineer',
      description: aiJobDesc,
      status: JobStatus.PUBLISHED,
      category: 'AI & Machine Learning',
      nature: 'hybrid',
      vacancies: 1,
      employmentTypes: ['Full Time'],
      locationCountry: 'United States',
      locationCity: 'San Francisco',
      minSalary: 190000,
      maxSalary: 245000,
      benefits: ['Equity Grants', 'Health & Dental', '401(k)'],
      educationLevel: 'Master Degree',
      yearsOfExperience: '6+ Years',
      gender: 'Any',
      candidateExperience: ['Staff Level', 'Senior Level'],
      languages: ['English'],
      softwareSkills: ['Python', 'PyTorch', 'LLMs', 'Vector Databases', 'Kubernetes', 'FastAPI'],
    },
  });
  await prisma.$executeRawUnsafe(
    `UPDATE jobs SET embedding = $1::vector WHERE id = $2`,
    `[${aiJobVec.join(',')}]`,
    aiJob.id
  );

  // Job 3: Frontend Platform Engineer
  const feJobDesc = `Build lightning-fast design systems and real-time WebRTC collaborative video experiences using React, Next.js, and Tailwind CSS.`;
  const feJobVec = await getEmbeddingOrFallback(feJobDesc, 'job-frontend-platform');
  const feJob = await prisma.job.upsert({
    where: { id: 'seed-job-fe-platform' },
    update: {},
    create: {
      id: 'seed-job-fe-platform',
      companyId: company.id,
      title: 'Frontend Platform Engineer',
      description: feJobDesc,
      status: JobStatus.PUBLISHED,
      category: 'Frontend Engineering',
      nature: 'remote',
      vacancies: 2,
      employmentTypes: ['Full Time'],
      locationCountry: 'United States',
      locationCity: 'New York',
      minSalary: 135000,
      maxSalary: 170000,
      benefits: ['Health & Dental', 'Remote Setup', 'Annual Learning Budget'],
      educationLevel: 'Bachelor Degree',
      yearsOfExperience: '3+ Years',
      gender: 'Any',
      candidateExperience: ['Mid Level'],
      languages: ['English'],
      softwareSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'WebRTC', 'Design Systems'],
    },
  });
  await prisma.$executeRawUnsafe(
    `UPDATE jobs SET embedding = $1::vector WHERE id = $2`,
    `[${feJobVec.join(',')}]`,
    feJob.id
  );

  console.log(`   ✅ 3 Published Jobs provisioned with vector embeddings.`);

  // =========================================================================
  // 5. APPLICATIONS WITH DIVERSE ATS MATCH SCORES & RUBRICS
  // =========================================================================
  console.log('\n5️⃣ Provisioning 4 Application Records with Diverse ATS Match Scores...');

  // Application 1: Sarah Jenkins (94% Fit - In Interview)
  const sarahApp = await prisma.application.upsert({
    where: {
      candidateId_jobId: {
        candidateId: sarahProfile.id,
        jobId: primaryJob.id,
      },
    },
    update: {
      status: ApplicationStatus.INTERVIEW,
      matchScore: 94,
      matchBreakdown: {
        overallScore: 94,
        semanticScore: 95,
        skillsScore: 92,
        experienceScore: 95,
        matchedSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Redis'],
        missingSkills: [],
        recommendation: 'STRONG_MATCH',
        summary: 'Exceptional candidate with 5+ years of verified high-scale TypeScript and distributed Node.js/PostgreSQL experience at Stripe and Vercel. Top 1% ATS match for architectural requirements.',
      },
    },
    create: {
      candidateId: sarahProfile.id,
      jobId: primaryJob.id,
      status: ApplicationStatus.INTERVIEW,
      matchScore: 94,
      matchBreakdown: {
        overallScore: 94,
        semanticScore: 95,
        skillsScore: 92,
        experienceScore: 95,
        matchedSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Redis'],
        missingSkills: [],
        recommendation: 'STRONG_MATCH',
        summary: 'Exceptional candidate with 5+ years of verified high-scale TypeScript and distributed Node.js/PostgreSQL experience at Stripe and Vercel. Top 1% ATS match for architectural requirements.',
      },
    },
  });

  // Application 2: David Chen (82% Fit - Shortlisted/Screening)
  await prisma.application.upsert({
    where: {
      candidateId_jobId: {
        candidateId: davidProfile.id,
        jobId: primaryJob.id,
      },
    },
    update: {
      status: ApplicationStatus.SCREENING,
      matchScore: 82,
      matchBreakdown: {
        overallScore: 82,
        semanticScore: 84,
        skillsScore: 78,
        experienceScore: 85,
        matchedSkills: ['Node.js', 'PostgreSQL', 'Docker', 'TypeScript'],
        missingSkills: ['Next.js', 'Tailwind CSS'],
        recommendation: 'GOOD_MATCH',
        summary: 'Strong backend engineering profile with solid Go and Node.js capabilities. Slightly less experience in frontend Next.js App Router patterns.',
      },
    },
    create: {
      candidateId: davidProfile.id,
      jobId: primaryJob.id,
      status: ApplicationStatus.SCREENING,
      matchScore: 82,
      matchBreakdown: {
        overallScore: 82,
        semanticScore: 84,
        skillsScore: 78,
        experienceScore: 85,
        matchedSkills: ['Node.js', 'PostgreSQL', 'Docker', 'TypeScript'],
        missingSkills: ['Next.js', 'Tailwind CSS'],
        recommendation: 'GOOD_MATCH',
        summary: 'Strong backend engineering profile with solid Go and Node.js capabilities. Slightly less experience in frontend Next.js App Router patterns.',
      },
    },
  });

  // Application 3: Elena Rostova (68% Fit - Applied)
  await prisma.application.upsert({
    where: {
      candidateId_jobId: {
        candidateId: elenaProfile.id,
        jobId: primaryJob.id,
      },
    },
    update: {
      status: ApplicationStatus.APPLIED,
      matchScore: 68,
      matchBreakdown: {
        overallScore: 68,
        semanticScore: 70,
        skillsScore: 65,
        experienceScore: 68,
        matchedSkills: ['React', 'Next.js', 'Tailwind CSS'],
        missingSkills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        recommendation: 'MODERATE_MATCH',
        summary: 'Demonstrated frontend prowess in React and Tailwind CSS. Needs growth in backend distributed systems, SQL, and database indexing.',
      },
    },
    create: {
      candidateId: elenaProfile.id,
      jobId: primaryJob.id,
      status: ApplicationStatus.APPLIED,
      matchScore: 68,
      matchBreakdown: {
        overallScore: 68,
        semanticScore: 70,
        skillsScore: 65,
        experienceScore: 68,
        matchedSkills: ['React', 'Next.js', 'Tailwind CSS'],
        missingSkills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        recommendation: 'MODERATE_MATCH',
        summary: 'Demonstrated frontend prowess in React and Tailwind CSS. Needs growth in backend distributed systems, SQL, and database indexing.',
      },
    },
  });

  // Application 4: Marcus Vance (42% Fit - Rejected)
  await prisma.application.upsert({
    where: {
      candidateId_jobId: {
        candidateId: marcusProfile.id,
        jobId: primaryJob.id,
      },
    },
    update: {
      status: ApplicationStatus.REJECTED,
      matchScore: 42,
      matchBreakdown: {
        overallScore: 42,
        semanticScore: 40,
        skillsScore: 25,
        experienceScore: 60,
        matchedSkills: [],
        missingSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        recommendation: 'LOW_MATCH',
        summary: 'Candidate profile is focused on BI and data analytics (Tableau, Excel) without foundational web development or full-stack software experience.',
      },
    },
    create: {
      candidateId: marcusProfile.id,
      jobId: primaryJob.id,
      status: ApplicationStatus.REJECTED,
      matchScore: 42,
      matchBreakdown: {
        overallScore: 42,
        semanticScore: 40,
        skillsScore: 25,
        experienceScore: 60,
        matchedSkills: [],
        missingSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        recommendation: 'LOW_MATCH',
        summary: 'Candidate profile is focused on BI and data analytics (Tableau, Excel) without foundational web development or full-stack software experience.',
      },
    },
  });

  console.log('   ✅ 4 Applications seeded with graduated ATS match scores (94%, 82%, 68%, 42%).');

  // =========================================================================
  // 6. PHASE 2 DELIVERABLE: LIVEKIT VIDEO INTERVIEW ROOM
  // =========================================================================
  console.log('\n6️⃣ Provisioning Phase 2 LiveKit Video Interview Room...');
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 1);
  scheduledDate.setHours(10, 0, 0, 0);

  const interviewRoom = await prisma.interviewRoom.upsert({
    where: { liveKitRoomName: `interview-${sarahApp.id}` },
    update: {
      scheduledAt: scheduledDate,
      status: InterviewStatus.SCHEDULED,
      recruiterNotes: 'Technical architectural deep dive: distributed caching, Next.js Server Components, and live pair coding.',
      applicationId: sarahApp.id,
    },
    create: {
      liveKitRoomName: `interview-${sarahApp.id}`,
      scheduledAt: scheduledDate,
      status: InterviewStatus.SCHEDULED,
      recruiterNotes: 'Technical architectural deep dive: distributed caching, Next.js Server Components, and live pair coding.',
      applicationId: sarahApp.id,
    },
  });
  console.log(`   📹 LiveKit Video Room created: ${interviewRoom.liveKitRoomName}`);

  // =========================================================================
  // 7. PHASE 3 DELIVERABLE: COMPLETED AUTONOMOUS AI INTERVIEW SESSION
  // =========================================================================
  console.log('\n7️⃣ Provisioning Phase 3 Completed AI Technical Interview Session...');

  const completedAiSession = await prisma.aiInterviewSession.upsert({
    where: { id: `ai-session-${sarahApp.id}` },
    update: {
      status: AiInterviewStatus.COMPLETED,
      overallScore: 88.5,
      technicalScore: 90.0,
      problemSolvingScore: 88.0,
      communicationScore: 92.0,
      currentQuestionIndex: 3,
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 1800000),
      questions: [
        {
          id: 1,
          question: 'How would you design a distributed caching layer for a Next.js App Router application handling millions of daily page views?',
          category: 'System Architecture',
        },
        {
          id: 2,
          question: 'Explain how PostgreSQL handles MVCC and what strategies you employ to eliminate write lock contention on frequently updated tables.',
          category: 'Database Systems',
        },
        {
          id: 3,
          question: 'Describe how you maintain stable real-time WebRTC audio/video streams under adverse network packet loss conditions.',
          category: 'Real-time Infrastructure',
        },
        {
          id: 4,
          question: 'Walk me through how you troubleshoot and resolve client-side hydration mismatches in deeply nested React Server Components.',
          category: 'Frontend Architecture',
        },
      ],
      transcript: [
        {
          speaker: 'AI',
          text: 'Welcome Sarah. Let us begin our technical assessment. How would you design a distributed caching layer for a Next.js App Router application handling millions of daily page views?',
          timestamp: '10:00:15',
        },
        {
          speaker: 'CANDIDATE',
          text: 'I recommend a tiered caching architecture: edge caching with Cloudflare for static assets and ISR pages, paired with a Redis cluster for server-side fetch deduplication using Next.js cache tags. This prevents thundering herd problems on downstream databases.',
          timestamp: '10:01:20',
        },
        {
          speaker: 'AI',
          text: 'Excellent clarity on cache tagging. Now, explain how PostgreSQL handles MVCC and what strategies you employ to eliminate write lock contention on hot tables.',
          timestamp: '10:01:45',
        },
        {
          speaker: 'CANDIDATE',
          text: 'PostgreSQL uses Multi-Version Concurrency Control where updates write new tuple versions rather than in-place mutation. To avoid lock contention on hot rows, I utilize optimistic concurrency control with version integers, along with background advisory lock queues.',
          timestamp: '10:03:00',
        },
        {
          speaker: 'AI',
          text: 'Very precise. How do you maintain stable WebRTC connections under severe packet loss?',
          timestamp: '10:03:20',
        },
        {
          speaker: 'CANDIDATE',
          text: 'By implementing Simulcast with adaptive bitrate throttling, NACK packet retransmission, and falling back gracefully through TURN relays if UDP packets encounter restrictive network drops.',
          timestamp: '10:04:35',
        },
        {
          speaker: 'AI',
          text: 'Lastly, how do you debug React Server Component hydration mismatches?',
          timestamp: '10:04:50',
        },
        {
          speaker: 'CANDIDATE',
          text: 'I inspect differences between server-rendered HTML and client VDOM trees, typically caused by non-deterministic values like Date.now() or window references evaluated during SSR, ensuring client-only state is gated in useEffect.',
          timestamp: '10:05:40',
        },
      ],
      rubricFeedback: {
        strengths: [
          'Mastery of Next.js App Router edge caching semantics and distributed tag revalidation.',
          'Precise explanation of PostgreSQL MVCC mechanics and row-level lock mitigation.',
          'Exceptional clarity and structured communication style.',
        ],
        improvements: [
          'Could elaborate slightly more on WebRTC congestion control algorithms (BBR vs GCC).',
        ],
        recommendation: 'STRONG_HIRE',
      },
    },
    create: {
      id: `ai-session-${sarahApp.id}`,
      applicationId: sarahApp.id,
      status: AiInterviewStatus.COMPLETED,
      overallScore: 88.5,
      technicalScore: 90.0,
      problemSolvingScore: 88.0,
      communicationScore: 92.0,
      currentQuestionIndex: 3,
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 1800000),
      questions: [
        {
          id: 1,
          question: 'How would you design a distributed caching layer for a Next.js App Router application handling millions of daily page views?',
          category: 'System Architecture',
        },
        {
          id: 2,
          question: 'Explain how PostgreSQL handles MVCC and what strategies you employ to eliminate write lock contention on frequently updated tables.',
          category: 'Database Systems',
        },
        {
          id: 3,
          question: 'Describe how you maintain stable real-time WebRTC audio/video streams under adverse network packet loss conditions.',
          category: 'Real-time Infrastructure',
        },
        {
          id: 4,
          question: 'Walk me through how you troubleshoot and resolve client-side hydration mismatches in deeply nested React Server Components.',
          category: 'Frontend Architecture',
        },
      ],
      transcript: [
        {
          speaker: 'AI',
          text: 'Welcome Sarah. Let us begin our technical assessment. How would you design a distributed caching layer for a Next.js App Router application handling millions of daily page views?',
          timestamp: '10:00:15',
        },
        {
          speaker: 'CANDIDATE',
          text: 'I recommend a tiered caching architecture: edge caching with Cloudflare for static assets and ISR pages, paired with a Redis cluster for server-side fetch deduplication using Next.js cache tags. This prevents thundering herd problems on downstream databases.',
          timestamp: '10:01:20',
        },
        {
          speaker: 'AI',
          text: 'Excellent clarity on cache tagging. Now, explain how PostgreSQL handles MVCC and what strategies you employ to eliminate write lock contention on hot tables.',
          timestamp: '10:01:45',
        },
        {
          speaker: 'CANDIDATE',
          text: 'PostgreSQL uses Multi-Version Concurrency Control where updates write new tuple versions rather than in-place mutation. To avoid lock contention on hot rows, I utilize optimistic concurrency control with version integers, along with background advisory lock queues.',
          timestamp: '10:03:00',
        },
        {
          speaker: 'AI',
          text: 'Very precise. How do you maintain stable WebRTC connections under severe packet loss?',
          timestamp: '10:03:20',
        },
        {
          speaker: 'CANDIDATE',
          text: 'By implementing Simulcast with adaptive bitrate throttling, NACK packet retransmission, and falling back gracefully through TURN relays if UDP packets encounter restrictive network drops.',
          timestamp: '10:04:35',
        },
        {
          speaker: 'AI',
          text: 'Lastly, how do you debug React Server Component hydration mismatches?',
          timestamp: '10:04:50',
        },
        {
          speaker: 'CANDIDATE',
          text: 'I inspect differences between server-rendered HTML and client VDOM trees, typically caused by non-deterministic values like Date.now() or window references evaluated during SSR, ensuring client-only state is gated in useEffect.',
          timestamp: '10:05:40',
        },
      ],
      rubricFeedback: {
        strengths: [
          'Mastery of Next.js App Router edge caching semantics and distributed tag revalidation.',
          'Precise explanation of PostgreSQL MVCC mechanics and row-level lock mitigation.',
          'Exceptional clarity and structured communication style.',
        ],
        improvements: [
          'Could elaborate slightly more on WebRTC congestion control algorithms (BBR vs GCC).',
        ],
        recommendation: 'STRONG_HIRE',
      },
    },
  });

  console.log(`   🤖 AI Interview Session active: Score ${completedAiSession.overallScore}/100 (Status: ${completedAiSession.status})`);

  // =========================================================================
  // 8. PHASE 4 DELIVERABLE: COLD OUTREACH CONVERSATION & ENCRYPTED MESSAGES
  // =========================================================================
  console.log('\n8️⃣ Provisioning Phase 4 Cold Outreach Conversation & Encrypted Messages...');

  const conversation = await prisma.conversation.upsert({
    where: {
      candidateId_recruiterId: {
        candidateId: sarahUser.id,
        recruiterId: recruiter.id,
      },
    },
    update: {
      companyId: company.id,
      lastMessageAt: new Date(),
    },
    create: {
      candidateId: sarahUser.id,
      recruiterId: recruiter.id,
      companyId: company.id,
      lastMessageAt: new Date(),
    },
  });

  // Clear previous demo messages for this conversation to prevent duplicate clutter
  await prisma.message.deleteMany({ where: { conversationId: conversation.id } });

  const pitchText = `Hi Alex,\n\nI came across the Senior Full Stack Engineer opening at AeroCloud Technologies and was immediately drawn to your distributed edge infrastructure roadmap.\n\nWith 5+ years of experience engineering high-throughput Next.js and Node.js systems at Stripe, and a 94% ATS compatibility fit for this role, I would love to learn more about the team's engineering goals.\n\nWould you be open to a brief 10-minute introductory sync this week?\n\nBest regards,\nSarah Jenkins`;
  const replyText = `Hi Sarah, thank you for reaching out! Your profile and 94% ATS compatibility score stand out, and your completed AI technical screening (88.5/100) was phenomenal. I have scheduled a 1-on-1 video interview for us tomorrow at 10:00 AM. Looking forward to speaking!`;

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: sarahUser.id,
      type: MessageType.TEXT,
      content: encryptMessage(pitchText),
      createdAt: new Date(Date.now() - 7200000),
      isRead: true,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: recruiter.id,
      type: MessageType.TEXT,
      content: encryptMessage(replyText),
      createdAt: new Date(Date.now() - 3600000),
      isRead: false,
    },
  });

  console.log(`   💬 Cold Outreach conversation provisioned with encrypted messages.`);
  console.log('\n🎉 ALL 4 PHASES SUCCESSFULLY SEEDED WITH SHOWCASE DATA!');
}

if (require.main === module) {
  seedShowcase()
    .catch((err) => {
      console.error('❌ Error during showcase seeding:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

