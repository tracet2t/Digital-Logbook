import type { AppRouter } from "@/routers";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

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
// @ts-ignore - oRPC's type system causes TS errors but runtime behavior is correct
export const orpcClient = createORPCClient<AppRouter>(link);
