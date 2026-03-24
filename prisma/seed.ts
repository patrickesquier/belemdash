import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
    },
  });

  console.log({ admin });

  // Optional: Create initial sellers
  const sellers = [
    { name: 'Vendedor 1' },
    { name: 'Vendedor 2' },
  ];

  for (const seller of sellers) {
    await prisma.seller.upsert({
      where: { name: seller.name },
      update: {},
      create: seller,
    });
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
