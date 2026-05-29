import { Queue } from "bullmq";

import { getRedis } from "@/lib/redis";

// ─── Queue ────────────────────────────────────────────────────────────────────

export const onboardingQueue = new Queue("onboardingQueue", {
  connection: getRedis(),
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
