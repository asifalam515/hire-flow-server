import { JobStatus } from '@prisma/client';
import { prisma } from '../src/config/prisma';

async function main() {
  console.log('Starting seed...');

  // 1. Create or get a Company
  let company = await prisma.company.findFirst();
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'Tech Innovators Inc.',
        slug: 'tech-innovators-inc',
        field: 'Technology',
        description: 'A leading technology company.',
        logoUrl: 'https://logo.clearbit.com/apple.com'
      }
    });
    console.log('Created dummy company');
  }

  // 2. Create 15 dummy jobs
  const jobTitles = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Engineer', 
    'UI/UX Designer', 'Product Manager', 'Data Scientist', 
    'DevOps Engineer', 'QA Automation Engineer', 'Mobile Developer (iOS)',
    'Mobile Developer (Android)', 'Cloud Architect', 'Security Analyst',
    'Database Administrator', 'Technical Support Specialist', 'Engineering Manager'
  ];

  for (let i = 0; i < 15; i++) {
    await prisma.job.create({
      data: {
        title: jobTitles[i],
        description: `This is a great opportunity to work as a ${jobTitles[i]}. We are looking for passionate individuals.`,
        status: JobStatus.PUBLISHED,
        category: 'Engineering',
        nature: i % 3 === 0 ? 'remote' : (i % 2 === 0 ? 'hybrid' : 'onsite'),
        vacancies: Math.floor(Math.random() * 5) + 1,
        employmentTypes: ['Full Time'],
        locationCountry: 'United States',
        locationCity: ['San Francisco', 'New York', 'Austin', 'Seattle'][i % 4],
        minSalary: 80000 + (i * 5000),
        maxSalary: 120000 + (i * 6000),
        isSalaryNegotiable: true,
        benefits: ['Health Insurance', '401k', 'PTO'],
        educationLevel: 'Bachelor Degree',
        yearsOfExperience: `${(i % 5) + 1} Years`,
        gender: 'Any',
        candidateExperience: ['Mid Level'],
        languages: ['English'],
        softwareSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        responsibilities: 'Build scalable applications and collaborate with cross-functional teams.',
        requirements: 'Strong problem-solving skills and experience with modern web technologies.',
        companyId: company.id
      }
    });
  }

  console.log('Successfully seeded 15 dummy jobs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
