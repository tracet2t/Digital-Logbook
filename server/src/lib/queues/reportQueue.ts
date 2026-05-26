import { Queue } from "bullmq";

import { getRedis } from "@/lib/redis";

// ─── Queue ────────────────────────────────────────────────────────────────────

export const reportQueue = new Queue("reportQueue", {
  connection: getRedis(),
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

// ─── Job Types ────────────────────────────────────────────────────────────────

export type ReportJobData = {
  mentorId: string;
  reportId: string;
};
