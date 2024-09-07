const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in the reverse order of dependencies
  await prisma.mentorFeedback.deleteMany({}); 
  await prisma.report.deleteMany({});          
  await prisma.activity.deleteMany({});        
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

  
  // console.log({ mentor1, mentor2, student1, student2, student3, feedback1, feedback2, report1, report2 });
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