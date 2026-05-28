import prisma from "@/lib/prisma";

async function checkApplications() {
  try {
    console.log("📋 Checking MenteeApplications in database...\n");

    const applications = await prisma.menteeApplication.findMany({
      take: 5, // Get first 5
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${applications.length} applications:\n`);

    applications.forEach((app, index) => {
      console.log(`${index + 1}. ID: ${app.id}`);
      console.log(`   Email: ${app.email}`);
      console.log(`   Name: ${app.fullName}`);
      console.log(`   Status: ${app.status}`);
      console.log(`   Created: ${app.createdAt}\n`);
    });

    const totalCount = await prisma.menteeApplication.count();
    console.log(`\n📊 Total applications: ${totalCount}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkApplications();
