import { Queue, Worker } from "bullmq";
import nodemailer from "nodemailer";

import { getRedis } from "./redis";

const redis = getRedis();

// ─── Queue ────────────────────────────────────────────────────────────────────

export const onboardingQueue = new Queue("onboardingQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

// ─── Job Types ────────────────────────────────────────────────────────────────

export type OnboardingJobData = {
  type: "sendConfirmationEmail";
  email: string;
  fullName: string;
};

// ─── Worker ───────────────────────────────────────────────────────────────────

export const onboardingWorker = new Worker<OnboardingJobData>(
  "onboardingQueue",
  async (job) => {
    if (job.data.type === "sendConfirmationEmail") {
      const { email, fullName } = job.data;

      try {
        console.log(
          `[onboardingQueue] Processing email job for ${email} (Job ID: ${job.id})`,
        );

        // Validate environment variables
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

        // Verify transporter configuration
        await transporter.verify();
        console.log(
          `[onboardingQueue] Email transporter verified successfully`,
        );

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
          `[onboardingQueue] ✓ Confirmation email sent successfully to ${email}`,
        );
        console.log(
          `[onboardingQueue] Message ID: ${info.messageId}, Response: ${info.response}`,
        );
      } catch (error) {
        console.error(
          `[onboardingQueue] ✗ Failed to send email to ${email}:`,
          error,
        );
        console.error(
          `[onboardingQueue] Error details:`,
          error instanceof Error ? error.message : error,
        );

        // Re-throw to trigger BullMQ retry mechanism
        throw error;
      }
    }
  },
  { connection: redis },
);

// ─── Worker Event Listeners ───────────────────────────────────────────────────

onboardingWorker.on("completed", (job) => {
  console.log(`[onboardingQueue] Job ${job.id} completed successfully`);
});

onboardingWorker.on("failed", (job, err) => {
  console.error(
    `[onboardingQueue] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    err.message,
  );
});

onboardingWorker.on("error", (err) => {
  console.error(`[onboardingQueue] Worker error:`, err);
});
