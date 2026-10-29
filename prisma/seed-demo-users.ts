import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../src/config/prisma';

export async function seedDemoUsers(): Promise<void> {
  console.log('🌱 Seeding demo accounts (Recruiter & Candidate)...');

  // 1. Ensure default Company exists
  let company = await prisma.company.findFirst();
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'Tech Innovators Inc.',
        slug: 'tech-innovators-inc',
        field: 'Software & Technology',
        description: 'Pioneering next-generation cloud and AI software platforms.',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
      },
    });
    console.log('  🏢 Created default company: Tech Innovators Inc.');
  }

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Upsert Demo Recruiter
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@hireflow.dev' },
    update: {
      passwordHash,
      role: Role.RECRUITER,
      isEmailVerified: true,
      companyId: company.id,
      firstName: 'Alex',
      lastName: 'Morgan',
    },
    create: {
      email: 'recruiter@hireflow.dev',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Morgan',
      role: Role.RECRUITER,
      isEmailVerified: true,
      companyId: company.id,
    },
  });
  console.log(`  ✅ Demo Recruiter seeded: ${recruiter.email} (Company: ${company.name})`);

  // 3. Upsert Demo Candidate
  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@hireflow.dev' },
    update: {
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      firstName: 'Sarah',
      lastName: 'Jenkins',
    },
    create: {
      email: 'candidate@hireflow.dev',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      role: Role.CANDIDATE,
      isEmailVerified: true,
    },
  });
  console.log(`  ✅ Demo Candidate seeded: ${candidate.email}`);

  // 4. Ensure Candidate Profile exists for demo candidate
  const candidateProfile = await prisma.candidateProfile.upsert({
    where: { userId: candidate.id },
    update: {
      aboutMe: 'Passionate Full Stack Developer with 4+ years of experience building modern web applications with React, Next.js, TypeScript, and Node.js.',
      city: 'San Francisco',
      preferredJobTitle: 'Full Stack Engineer',
      preferredJobTypes: ['Full Time'],
      favoriteCities: ['San Francisco', 'New York', 'Austin'],
      skills: ['TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
      languages: ['English', 'Spanish'],
      receiveEmail: true,
    },
    create: {
      userId: candidate.id,
      aboutMe: 'Passionate Full Stack Developer with 4+ years of experience building modern web applications with React, Next.js, TypeScript, and Node.js.',
      city: 'San Francisco',
      preferredJobTitle: 'Full Stack Engineer',
      preferredJobTypes: ['Full Time'],
      favoriteCities: ['San Francisco', 'New York', 'Austin'],
      skills: ['TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
      languages: ['English', 'Spanish'],
      receiveEmail: true,
    },
  });
  console.log(`  ✅ Demo Candidate Profile linked (Profile ID: ${candidateProfile.id})`);
  console.log('🎉 Demo users seeding complete!');
}

if (require.main === module) {
  seedDemoUsers()
    .catch((err) => {
      console.error('❌ Failed to seed demo users:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
