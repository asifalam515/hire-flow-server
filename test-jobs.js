const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const jobs = await prisma.job.findMany();
  console.log('Total jobs:', jobs.length);
  console.log(jobs.map(j => ({ id: j.id, title: j.title, companyId: j.companyId, status: j.status })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
