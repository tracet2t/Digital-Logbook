import { Queue, Worker } from "bullmq";
import nodemailer from "nodemailer";

import { EmailTemplate } from "@/components/EmailTemplate/EmailTemplate";

import { getRedis } from "./redis";

const redis = getRedis();

// ─── Queue ────────────────────────────────────────────────────────────────────

export const invitationQueue = new Queue("invitationQueue", {
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

export type InvitationJobData = {
  type: "sendInvitationEmail";
  email: string;
  name: string;
  tempPassword: string;
  message: string;
  loginUrl: string;
  token: string;
};

// ─── Worker ───────────────────────────────────────────────────────────────────

export const invitationWorker = new Worker<InvitationJobData>(
  "invitationQueue",
  async (job) => {
    if (job.data.type === "sendInvitationEmail") {
      const { email, name, tempPassword, message, loginUrl } = job.data;

      try {
        console.log(
          `[invitationQueue] Processing email job for ${email} (Job ID: ${job.id})`,
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
          `[invitationQueue] Email transporter verified successfully`,
        );

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Hello!! Here is your link to Registration`,
          text: message,
          html: EmailTemplate({ name, tempPassword, loginUrl }),
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(
          `[invitationQueue] ✓ Invitation email sent successfully to ${email}`,
        );
        console.log(
          `[invitationQueue] Message ID: ${info.messageId}, Response: ${info.response}`,
        );
      } catch (error) {
        console.error(
          `[invitationQueue] ✗ Failed to send email to ${email}:`,
          error,
        );
        console.error(
          `[invitationQueue] Error details:`,
          error instanceof Error ? error.message : error,
        );

        // Check if it's a configuration error (don't retry these)
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("EMAIL_USER") ||
          errorMessage.includes("EMAIL_PASS") ||
          errorMessage.includes("environment variables are not set")
        ) {
          console.error(
            `[invitationQueue] ✗ Configuration error - will not retry. Job ${job.id} moving to failed state.`,
          );
          // Move job to failed without retrying
          await job.moveToFailed(error as Error, job.token || "", false);
          return;
        }

        // Re-throw other errors to trigger BullMQ retry mechanism
        throw error;
      }
    }
  },
  { connection: redis },
);

// ─── Worker Event Listeners ───────────────────────────────────────────────────

invitationWorker.on("completed", (job) => {
  console.log(`[invitationQueue] Job ${job.id} completed successfully`);
});

invitationWorker.on("failed", (job, err) => {
  console.error(
    `[invitationQueue] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    err.message,
  );
});

invitationWorker.on("error", (err) => {
  console.error(`[invitationQueue] Worker error:`, err);
});
