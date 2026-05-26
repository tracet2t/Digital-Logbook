import { Queue } from "bullmq";

import { getRedis } from "@/lib/redis";

// ─── Queue ────────────────────────────────────────────────────────────────────

export const invitationQueue = new Queue("invitationQueue", {
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

export type InvitationJobData = {
  type: "sendInvitationEmail";
  email: string;
  name: string;
  tempPassword: string;
  message: string;
  loginUrl: string;
  token: string;
};
