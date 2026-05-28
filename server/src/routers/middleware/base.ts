import type getSession from "@/server_actions/getSession";
import type { Role } from "@/types";
import { os } from "@orpc/server";

export type AppContext = {
  request?: Request;
  session?: Awaited<ReturnType<typeof getSession>>;
  userId?: string | null;
  userRole?: Role | null;
};

export const commonErrors = {
  NOT_FOUND: {
    message: "Resource not found",
    status: 404,
  },
  CONFLICT: {
    message: "Resource already exists",
    status: 409,
  },
  UNAUTHORIZED: {
    message: "Unauthorized access",
    status: 401,
  },
  FORBIDDEN: {
    message: "Forbidden: Access denied",
    status: 403,
  },
  INVALID_INPUT: {
    message: "Invalid input provided",
    status: 400,
  },
  INTERNAL_ERROR: {
    message: "Internal server error",
    status: 500,
  },
  RATE_LIMITED: {
    message: "Too many requests, please try again later",
    status: 429,
  },
} as const;

export const base = os.$context<AppContext>().errors(commonErrors);
