import "server-only";

import { router } from "@/routers/index";
import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";

declare global {
  // eslint-disable-next-line no-var
  var $client: any;
}

globalThis.$client = createRouterClient(router, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => ({
    headers: await headers(), // provide headers if initial context required
  }),
});
