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

      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (!emailUser || !emailPass) {
        console.warn(
          `[onboardingQueue] Skipping confirmation email to ${email}: EMAIL_USER or EMAIL_PASS is not configured.`,
        );
        return;
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      await transporter.sendMail({
        from: emailUser,
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

      console.log(`[onboardingQueue] Confirmation email sent to ${email}`);
    }
  },
  { connection: redis },
);
