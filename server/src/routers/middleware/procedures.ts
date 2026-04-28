import { authMiddleware, mentorMiddleware, superAdminMiddleware } from "./auth";
import { base } from "./base";

export function createProcedures() {
  const publicProcedure = base;

  const authedProcedure = publicProcedure.use(authMiddleware);

  const superAdminProcedure = authedProcedure.use(superAdminMiddleware);

  const mentorProcedure = authedProcedure.use(mentorMiddleware);

  return {
    publicProcedure,
    authedProcedure,
    superAdminProcedure,
    mentorProcedure,
  };
}
