import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialCategories = ['Land Animal', 'Bird', 'Fish', 'Insect'];

async function main() {
  console.log('Seeding initial categories...');
  for (const name of initialCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Initial categories seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
