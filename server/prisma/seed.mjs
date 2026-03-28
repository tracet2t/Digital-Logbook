import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in reverse order of dependencies
  await prisma.projectTechnology.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.projectAllocation.deleteMany();
  await prisma.projectMentor.deleteMany();
  await prisma.project.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.mentorActivity.deleteMany();
  await prisma.report.deleteMany();
  await prisma.mentorFeedback.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const defaultPassword = "t2tuser";
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  try {
    // Create Admin
    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: "admin@gmail.com",
        passwordHash: hashedPassword,
        role: "superAdmin",
        emailConfirmed: true,
        isFirstTimeLogin: false,
      },
    });

    // Create Mentors
    const mentor1 = await prisma.user.create({
      data: {
        firstName: "Sam",
        lastName: "De",
        email: "mentor1@gmail.com",
        passwordHash: hashedPassword,
        role: "mentor",
        emailConfirmed: true,
        isFirstTimeLogin: false,
      },
    });

    const mentor2 = await prisma.user.create({
      data: {
        firstName: "Jane",
        lastName: "Smith",
        email: "mentor2@gmail.com",
        passwordHash: hashedPassword,
        role: "mentor",
        emailConfirmed: true,
        isFirstTimeLogin: false,
      },
    });

    // Create Students
    const student1 = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "student1@gmail.com",
        passwordHash: hashedPassword,
        role: "student",
        emailConfirmed: true,
        isFirstTimeLogin: false,
      },
    });

    const student2 = await prisma.user.create({
      data: {
        firstName: "Alice",
        lastName: "Johnson",
        email: "student2@gmail.com",
        passwordHash: hashedPassword,
        role: "student",
        emailConfirmed: true,
        isFirstTimeLogin: false,
      },
    });

    const student3 = await prisma.user.create({
      data: {
        firstName: "Bob",
        lastName: "Wilson",
        email: "student3@gmail.com",
        passwordHash: hashedPassword,
        role: "student",
        emailConfirmed: true,
        isFirstTimeLogin: false,
      },
    });

    // Assign mentors to projects

    // Create Activities
    const activity1 = await prisma.activity.create({
      data: {
        studentId: student1.id,
        date: new Date("2025-01-15"),
        timeSpent: 120,
        notes: "Completed project module 1",
      },
    });

    const activity2 = await prisma.activity.create({
      data: {
        studentId: student1.id,
        date: new Date("2025-01-16"),
        timeSpent: 90,
        notes: "Worked on debugging issues",
      },
    });

    const activity3 = await prisma.activity.create({
      data: {
        studentId: student2.id,
        date: new Date("2025-01-15"),
        timeSpent: 150,
        notes: "Research phase for new feature",
      },
    });

    // Create MentorFeedback
    const feedback1 = await prisma.mentorFeedback.create({
      data: {
        activityId: activity1.id,
        mentorId: mentor1.id,
        status: "approved",
        feedbackNotes: "Great progress! Keep it up.",
      },
    });

    const feedback2 = await prisma.mentorFeedback.create({
      data: {
        activityId: activity2.id,
        mentorId: mentor1.id,
        status: "pending",
        feedbackNotes: "Review in progress",
      },
    });

    const feedback3 = await prisma.mentorFeedback.create({
      data: {
        activityId: activity3.id,
        mentorId: mentor1.id,
        status: "approved",
        feedbackNotes: "Excellent research quality",
      },
    });

    // Create MentorActivities
    const mentorActivity1 = await prisma.mentorActivity.create({
      data: {
        mentorId: mentor1.id,
        date: new Date("2025-01-15"),
        workingHours: 4,
        activities: "Reviewing student submissions, providing feedback",
      },
    });

    const mentorActivity2 = await prisma.mentorActivity.create({
      data: {
        mentorId: mentor2.id,
        date: new Date("2025-01-16"),
        workingHours: 3,
        activities: "One-on-one meeting with student",
      },
    });

    // Create Reports
    const report1 = await prisma.report.create({
      data: {
        mentorId: mentor1.id,
        status: "completed",
        reportData: {
          totalStudents: 2,
          activitiesReviewed: 3,
          averageScore: 85,
        },
      },
    });

    const report2 = await prisma.report.create({
      data: {
        mentorId: mentor2.id,
        status: "pending",
        reportData: {
          totalStudents: 1,
          activitiesReviewed: 0,
        },
      },
    });

    // Create Projects
    const project1 = await prisma.project.create({
      data: {
        name: "Digital Logbook MVP",
        description: "Initial version of the digital logbook system",
        domain: "software",
        createdBy: admin.id,
      },
    });

    const project2 = await prisma.project.create({
      data: {
        name: "Training Portal",
        description: "Online training platform",
        domain: "training",
        createdBy: admin.id,
      },
    });

    // Assign mentors to projects
    await prisma.projectMentor.create({
      data: { projectId: project1.id, mentorId: mentor1.id },
    });
    await prisma.projectMentor.create({
      data: { projectId: project2.id, mentorId: mentor2.id },
    });

    // Create ProjectAllocations
    const assignment1 = await prisma.projectAllocation.create({
      data: {
        projectId: project1.id,
        studentId: student1.id,
      },
    });

    const assignment2 = await prisma.projectAllocation.create({
      data: {
        projectId: project1.id,
        studentId: student2.id,
      },
    });

    const assignment3 = await prisma.projectAllocation.create({
      data: {
        projectId: project2.id,
        studentId: student3.id,
      },
    });

    // Create ProjectTechnologies
    await prisma.projectTechnology.create({
      data: {
        projectId: project1.id,
        studentId: student1.id,
        name: "React",
        rating: 4,
      },
    });

    await prisma.projectTechnology.create({
      data: {
        projectId: project1.id,
        studentId: student1.id,
        name: "Node.js",
        rating: 3,
      },
    });

    await prisma.projectTechnology.create({
      data: {
        projectId: project2.id,
        studentId: student3.id,
        name: "Design Patterns",
        rating: 5,
      },
    });

    // Create Badges
    const badge1 = await prisma.badge.create({
      data: {
        name: "Rising Star",
        description: "Awarded to students showing exceptional progress",
        iconUrl: "https://example.com/badges/rising-star.png",
      },
    });

    const badge2 = await prisma.badge.create({
      data: {
        name: "Mentor Master",
        description: "Awarded to mentors with outstanding mentoring records",
        iconUrl: "https://example.com/badges/mentor-master.png",
      },
    });

    // Create UserBadges
    const userBadge1 = await prisma.userBadge.create({
      data: {
        userId: student1.id,
        badgeId: badge1.id,
      },
    });

    const userBadge2 = await prisma.userBadge.create({
      data: {
        userId: mentor1.id,
        badgeId: badge2.id,
      },
    });

    // Create Invitations
    const invitation1 = await prisma.invitation.create({
      data: {
        email: "newmentor@gmail.com",
        role: "mentor",
        token: "token_" + Math.random().toString(36).substr(2, 9),
        invitedBy: admin.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    const invitation2 = await prisma.invitation.create({
      data: {
        email: "newstudent@gmail.com",
        role: "student",
        token: "token_" + Math.random().toString(36).substr(2, 9),
        invitedBy: mentor1.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    console.log("✅ Seed data created successfully!");
    console.log({
      admin: admin.email,
      mentors: [mentor1.email, mentor2.email],
      students: [student1.email, student2.email, student3.email],
      projects: [project1.name, project2.name],
      badges: [badge1.name, badge2.name],
    });
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
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
