const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  await prisma.mentorship.deleteMany({});
  await prisma.user.deleteMany({});
  
  // Symmetric key for password hashing
  const saltRounds = 10;
  const defaultPassword = 't2tuser';
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  // Create mentors
  try {
  const mentor1 = await prisma.user.create({
    data: {
      firstName: 'Sam',
      lastName: 'De',
      email: 'mentor1@gmail.com',
      passwordHash: hashedPassword,
      role: 'mentor',
    }
  });

  const mentor2 = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'mentor2@gmail.com',
      passwordHash: hashedPassword,
      role: 'mentor',
    }
  });

  // Create students
  const student1 = await prisma.user.create({
    data: {
      firstName: 'Ema',
      lastName: 'Johnson',
      email: 'student1@gmail.com',
      passwordHash: hashedPassword,
      role: 'student',
    }
  });

  const student2 = await prisma.user.create({
    data: {
      firstName: 'Rob',
      lastName: 'Brown',
      email: 'student2@gmail.com',
      passwordHash: hashedPassword,
      role: 'student',
    }
  });

  const student3 = await prisma.user.create({
    data: {
      firstName: 'Charlie',
      lastName: 'Dev',
      email: 'student3@gmail.com',
      passwordHash: hashedPassword,
      role: 'student',
    }
  });

  // Create mentorships (relations between mentors and students)
  await prisma.mentorship.createMany({
    data: [
      { mentorId: mentor1.id, studentId: student1.id },
      { mentorId: mentor1.id, studentId: student3.id },
      { mentorId: mentor2.id, studentId: student2.id }
    ],
    skipDuplicates: true //  duplicate errors
  });

  console.log({ mentor1, mentor2, student1, student2, student3 });
} catch (error) {
  console.error('Error seeding data:', error);
}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
