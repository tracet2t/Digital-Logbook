import { Worker } from "bullmq";

// Import queue workers to ensure they start processing jobs
// Workers are imported for their side effects (initialization), not direct usage
// @ts-expect-error - imported for side effects only
import { invitationWorker } from "@/lib/invitationQueue";
// @ts-expect-error - imported for side effects only
import { onboardingWorker } from "@/lib/onboardingQueue";
//import { generateDummyCSVReport } from '@/lib/reportGenerator';
import prisma from "@/lib/prisma";
import { generateCSVReport } from "@/lib/reportGenerator"; // Function to generate the CSV report

// @ts-expect-error - variable declared for side effects only
const reportWorker = new Worker("bulk-report-queue", async (job) => {
  try {
    const { mentorId } = job.data;
    const reportId = job.id;

    // Generate the CSV report
    const csvPath = await generateCSVReport(mentorId);

    // Update the report with the generated CSV link and reportData
    await prisma.report.update({
      where: { id: reportId },
      data: {
        reportData: {},
        generatedAt: new Date(),
      },
    });

    // Update the report to "DONE" with the link to the file
    await prisma.report.update({
      where: { id: reportId },
      data: {
        reportData: { link: `/downloads/${csvPath}` },
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
  }
});

/*const reportWorker = new Worker('bulk-report-queue', async job => {
  try {
    const reportId = job.id;

    // Generate the CSV report using dummy data
    const csvPath = await generateDummyCSVReport();

    // Update the report to "DONE" with the link to the file
    await prisma.report.update({
      where: { id: reportId },
      data: {
        reportData: { link: `/downloads/${csvPath}` },
        generatedAt: new Date(),
      },
    });

    console.log("Dummy report generation completed successfully");
  } catch (error) {
    console.error("Report generation error:", error);
  }
});*/
