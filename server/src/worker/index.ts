import { Worker } from "bullmq";
import nodemailer from "nodemailer";

import prisma from "@/lib/prisma";
import type { InvitationJobData } from "@/lib/queues/invitationQueue";
import type { OnboardingJobData } from "@/lib/queues/onboardingQueue";
import type { ReportJobData } from "@/lib/queues/reportQueue";
import { getRedis } from "@/lib/redis";
import { generateCSVReport } from "@/lib/reportGenerator";
import { EmailTemplate } from "@/components/EmailTemplate/EmailTemplate";

const redis = getRedis();

// ─── Onboarding Worker ────────────────────────────────────────────────────────

const onboardingWorker = new Worker<OnboardingJobData>(
  "onboardingQueue",
  async (job) => {
    if (job.data.type === "sendConfirmationEmail") {
      const { email, fullName } = job.data;

      console.log(
        `[onboarding] Processing email job for ${email} (Job ID: ${job.id})`,
      );

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error(
          "EMAIL_USER or EMAIL_PASS environment variables are not set",
        );
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Application Received – Digital Logbook",
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000053;">Application Received</h2>
            <p>Hi <strong>${fullName}</strong>,</p>
            <p>
              Thank you for submitting your mentee application to the Digital Logbook programme.
              Your application is currently <strong>under review</strong> and you will be notified
              once a decision has been made.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              This is an automated notification from Digital Logbook. Please do not reply to this email.
            </p>
          </div>
        `,
        });

        console.log(
          `[onboarding] ✓ Confirmation email sent to ${email}. Message ID: ${info.messageId}`,
        );
      } catch (error) {
        console.error(
          `[onboarding] ✗ Failed to send confirmation email to ${email}:`,
          error instanceof Error ? error.message : error,
        );
        throw error;
      }
    }
  },
  { connection: redis },
);

onboardingWorker.on("completed", (job) =>
  console.log(`[onboarding] Job ${job.id} completed`),
);
onboardingWorker.on("failed", (job, err) =>
  console.error(
    `[onboarding] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    err.message,
  ),
);
onboardingWorker.on("error", (err) =>
  console.error(`[onboarding] Worker error:`, err),
);

// ─── Invitation Worker ────────────────────────────────────────────────────────

const invitationWorker = new Worker<InvitationJobData>(
  "invitationQueue",
  async (job) => {
    if (job.data.type === "sendInvitationEmail") {
      const { email, name, tempPassword, message, loginUrl } = job.data;

      console.log(
        `[invitation] Processing email job for ${email} (Job ID: ${job.id})`,
      );

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error(
          "EMAIL_USER or EMAIL_PASS environment variables are not set",
        );
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.verify();

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Hello!! Here is your link to Registration`,
        text: message,
        html: EmailTemplate({ name, tempPassword, loginUrl }),
      });

      console.log(
        `[invitation] ✓ Invitation email sent to ${email}. Message ID: ${info.messageId}`,
      );
    }
  },
  { connection: redis },
);

invitationWorker.on("completed", (job) =>
  console.log(`[invitation] Job ${job.id} completed`),
);
invitationWorker.on("failed", (job, err) =>
  console.error(
    `[invitation] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    err.message,
  ),
);
invitationWorker.on("error", (err) =>
  console.error(`[invitation] Worker error:`, err),
);

// ─── Report Worker ────────────────────────────────────────────────────────────

const reportWorker = new Worker<ReportJobData>(
  "reportQueue",
  async (job) => {
    const { mentorId, reportId } = job.data;

    console.log(
      `[report] Processing report job for mentorId=${mentorId} reportId=${reportId} (Job ID: ${job.id})`,
    );

    const csvPath = await generateCSVReport(mentorId);

    await prisma.report.update({
      where: { id: reportId },
      data: {
        reportData: { link: `/downloads/${csvPath}` },
        generatedAt: new Date(),
      },
    });

    console.log(
      `[report] ✓ Report ${reportId} generated at /downloads/${csvPath}`,
    );
  },
  { connection: redis },
);

reportWorker.on("completed", (job) =>
  console.log(`[report] Job ${job.id} completed`),
);
reportWorker.on("failed", (job, err) =>
  console.error(
    `[report] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    err.message,
  ),
);
reportWorker.on("error", (err) => console.error(`[report] Worker error:`, err));

// ─── Startup ──────────────────────────────────────────────────────────────────

console.log("BullMQ workers started:");
console.log("  - onboardingWorker  → onboardingQueue");
console.log("  - invitationWorker  → invitationQueue");
console.log("  - reportWorker      → reportQueue");

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

const shutdown = async () => {
  console.log("Shutdown signal received — closing workers...");
  await Promise.all([
    onboardingWorker.close(),
    invitationWorker.close(),
    reportWorker.close(),
  ]);
  console.log("All workers closed.");
  process.exit(0);
};

process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());
