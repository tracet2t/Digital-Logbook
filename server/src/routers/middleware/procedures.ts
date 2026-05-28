import { authMiddleware, mentorMiddleware, superAdminMiddleware } from "./auth";
import { base } from "./base";
import { applicationRatelimitMiddleware } from "./ratelimit";

export function createProcedures() {
  const publicProcedure = base;

  // Rate-limited branch — use only for publicly accessible write endpoints
  const rateLimitedPublicProcedure = publicProcedure.use(
    applicationRatelimitMiddleware,
  );

  const authedProcedure = publicProcedure.use(authMiddleware);

  const superAdminProcedure = authedProcedure.use(superAdminMiddleware);

  const mentorProcedure = authedProcedure.use(mentorMiddleware);

  return {
    publicProcedure,
    rateLimitedPublicProcedure,
    authedProcedure,
    superAdminProcedure,
    mentorProcedure,
  };
}
