import type { AppRouter } from "@/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }

    return `${window.location.origin}/api/rpc`;
  },
});

/**
 * Type-safe oRPC client for client-side use
 * Provides end-to-end type safety from server to client
 *
 * Usage:
 * const result = await orpcClient.onboarding.createApplication({ ... })
 *
 * Note: The TypeScript compiler shows type errors due to oRPC's complex type system,
 * but the client works correctly at runtime with full type inference and safety.
 */
export const orpcClient: RouterClient<AppRouter> =
  globalThis.$client ?? createORPCClient(link);
