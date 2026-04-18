import { router } from "@/routers";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

export const dynamic = "force-dynamic";

// Create the RPC handler with your router
const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      // Log errors for debugging
      console.error("oRPC Error:", error);
    }),
  ],
});

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {}, // Initial context can be added here if needed
  });

  return response ?? new Response("Not found", { status: 404 });
}

// Export all HTTP methods that oRPC should handle
export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
