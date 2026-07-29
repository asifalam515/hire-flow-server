import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const logos = [
  'https://logo.clearbit.com/apple.com',
  'https://logo.clearbit.com/google.com',
  'https://logo.clearbit.com/microsoft.com',
  'https://logo.clearbit.com/amazon.com',
  'https://logo.clearbit.com/meta.com',
  'https://logo.clearbit.com/netflix.com',
  'https://logo.clearbit.com/spotify.com',
  'https://logo.clearbit.com/uber.com',
  'https://logo.clearbit.com/airbnb.com',
  'https://logo.clearbit.com/stripe.com'
];

async function updateLogos() {
  const companies = await prisma.company.findMany();
  let updatedCount = 0;
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    if (!company.logoUrl || company.logoUrl.trim() === '') {
      const randomLogo = logos[Math.floor(Math.random() * logos.length)];
      await prisma.company.update({
        where: { id: company.id },
        data: { logoUrl: randomLogo }
      });
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} companies with logos`);
}

updateLogos().catch(console.error).finally(() => prisma.$disconnect());
