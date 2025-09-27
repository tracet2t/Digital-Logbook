import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in reverse order of dependencies
  await prisma.review.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.report.deleteMany();
  await prisma.project.deleteMany();
  await prisma.student.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.user.deleteMany();

  // Password hashing setup
  const saltRounds = 10;
  const defaultPassword = "t2tuser";
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  try {
    // Create mentors
    const mentor1 = await prisma.user.create({
      data: {
        firstName: "Sam",
        lastName: "De",
        email: "mentor1@gmail.com",
        password: hashedPassword,
        role: "MENTOR",
        emailConfirmed: true,
        mentor: {
          create: {
            expertise: "Software Engineering",
          },
        },
      },
    });

    const mentor2 = await prisma.user.create({
      data: {
        firstName: "Jane",
        lastName: "Smith",
        email: "mentor2@gmail.com",
        password: hashedPassword,
        role: "MENTOR",
        emailConfirmed: true,
        mentor: {
          create: {
            expertise: "Data Science",
          },
        },
      },
    });

    // Create students
    const student1 = await prisma.user.create({
      data: {
        firstName: "Alice",
        lastName: "Johnson",
        email: "student1@gmail.com",
        password: hashedPassword,
        role: "STUDENT",
        emailConfirmed: true,
        student: {
          create: {
            university: "MIT",
            internshipStartDate: new Date("2024-06-01"),
            duration: 6,
            mentorID: mentor1.userID,
          },
        },
      },
    });

    const student2 = await prisma.user.create({
      data: {
        firstName: "Bob",
        lastName: "Williams",
        email: "student2@gmail.com",
        password: hashedPassword,
        role: "STUDENT",
        emailConfirmed: true,
        student: {
          create: {
            university: "Harvard",
            internshipStartDate: new Date("2024-07-01"),
            duration: 5,
            mentorID: mentor2.userID,
          },
        },
      },
    });

    // Create a project
    const project = await prisma.project.create({
      data: {
        projectTitle: "AI Chatbot Development",
        projectDescription: "Building a chatbot using NLP techniques.",
        progress: 10.0,
        startedAt: new Date(),
        deadline: new Date("2024-12-01"),
        teamName: "AI Innovators",
        mentorID: mentor1.userID,
        students: {
          connect: [{ userID: student1.userID }],
        },
      },
    });

    // Create an activity
    const activity = await prisma.activity.create({
      data: {
        role: "STUDENT",
        timeSpent: 5,
        title: "Research on NLP",
        description: "Studied various NLP techniques for chatbot development.",
        userID: student1.userID,
      },
    });

    // Create a review
    const review = await prisma.review.create({
      data: {
        review: "Great work! Keep it up.",
        reviewedAt: new Date(),
        status: "approved",
        activityID: activity.activityID,
        mentorID: mentor1.userID,
      },
    });

    // Create a report
    const report = await prisma.report.create({
      data: {
        reportDate: new Date(),
        status: "Generated",
        mentorID: mentor1.userID,
      },
    });

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
