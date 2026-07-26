import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const userId = "test-user-id"; // We can put a fake user ID just to see the error message
    // If it requires user to exist, we might get a foreign key error
    await prisma.candidateProfile.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
