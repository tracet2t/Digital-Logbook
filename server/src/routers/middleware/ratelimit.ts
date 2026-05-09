import { RedisRatelimiter } from "@orpc/experimental-ratelimit/redis";
import { ORPCError, os } from "@orpc/server";

import { getRedis } from "@/lib/redis";

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// 5 requests per 15 minutes per IP — protects the public createApplication endpoint

export const applicationRatelimiter = new RedisRatelimiter({
  eval: async (script, numKeys, ...rest) => {
    return getRedis().eval(script, numKeys, ...rest) as any;
  },
  maxRequests: 5,
  window: 15 * 60 * 1000, // 15 minutes in ms
  prefix: "orpc:ratelimit:onboarding:",
});

// ─── Middleware ───────────────────────────────────────────────────────────────
// this has been implemented for extract the ip from user then limit it for 5 request per 15 minutes,
// this is used for create application endpoint to prevent abuse

export const applicationRatelimitMiddleware = os
  .$context<{ request?: Request }>()
  .middleware(async ({ context, next }) => {
    const req = context.request;
    const ip =
      req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req?.headers.get("x-real-ip") ||
      "unknown";

    const result = await applicationRatelimiter.limit(
      `create_application:${ip}`,
    );

    if (!result.success) {
      throw new ORPCError("TOO_MANY_REQUESTS", {
        message:
          "Too many applications submitted. Please try again in 15 minutes.",
        data: {
          limit: result.limit,
          remaining: result.remaining,
          reset: result.reset,
        },
      });
    }

    return next();
  });
