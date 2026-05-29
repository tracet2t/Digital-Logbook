import getSession from "@/server_actions/getSession";
import { ORPCError, os } from "@orpc/server";
import { Role } from "@prisma/client";

import type { AppContext } from "./base";

/**
 * Context interface for authenticated users
 */
export interface AuthContext {
  session: NonNullable<AppContext["session"]>;
  userId: string;
  userRole: Role | null;
}

/**
 * Authentication middleware
 * Validates user session and adds auth context to the request
 *
 * Provides:
 * - session: User session object
 * - userId: Authenticated user ID
 * - userRole: User's role (e.g., student, mentor, admin, superAdmin)
 *
 * @throws {ORPCError} "Unauthorized" if session is invalid or user is not authenticated
 */
export const authMiddleware = os
  .$context<AppContext>()
  .middleware(async ({ next }) => {
    const session = await getSession();

    if (!session || !session.isAuthenticated()) {
      throw new ORPCError("Unauthorized");
    }

    const userId = session.getId();
    if (!userId) {
      throw new ORPCError("Unauthorized");
    }

    return next({
      context: {
        session,
        userId,
        userRole: session.getRole(),
      },
    });
  });

/**
 * Super Admin authorization middleware
 * Requires authMiddleware to be used first
 *
 * @throws {ORPCError} "Forbidden: Super Admin access required" if user is not a super admin
 */
export const superAdminMiddleware = os
  .$context<AuthContext>()
  .middleware(async ({ context, next }) => {
    if (context.userRole !== Role.superAdmin) {
      throw new ORPCError("Forbidden: Super Admin access required");
    }

    return next();
  });

/**
 * Mentor authorization middleware
 * Requires authMiddleware to be used first
 *
 * @throws {ORPCError} "Forbidden: Mentor access required" if user is not a mentor or super admin
 */
export const mentorMiddleware = os
  .$context<AuthContext>()
  .middleware(async ({ context, next }) => {
    if (
      context.userRole !== Role.mentor &&
      context.userRole !== Role.superAdmin
    ) {
      throw new ORPCError("Forbidden: Mentor access required");
    }

    return next();
  });
