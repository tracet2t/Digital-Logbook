import { router } from "@/routers/index";
import getSession from "@/server_actions/getSession";
import { RatelimitHandlerPlugin } from "@orpc/experimental-ratelimit";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import "@orpc/server/fetch";

export const dynamic = "force-dynamic";

const handler = new RPCHandler(router, {
  plugins: [new RatelimitHandlerPlugin() as any],
  interceptors: [
    onError((error) => {
      // Only log unexpected errors with full stack trace
      // Expected business logic errors (validation, conflicts) are logged minimally
      const expectedErrors = [
        "CONFLICT",
        "BAD_REQUEST",
        "NOT_FOUND",
        "UNAUTHORIZED",
        "FORBIDDEN",
      ];

      // Type guard to check if error has code property
      const errorCode = (error as any)?.code;
      const errorMessage = (error as any)?.message;

      if (errorCode && !expectedErrors.includes(errorCode)) {
        // Unexpected server errors - log with full details
        console.error("🔴 Unexpected oRPC Error:", error);
      } else if (errorCode) {
        // Expected errors - minimal logging
        console.log(`ℹ️  [${errorCode}] ${errorMessage}`);
      }
    }),
  ],
});

async function handleRequest(request: Request) {
  try {
    const session = await getSession();

    // Pass session to oRPC context
    // Authentication is handled by procedure-level middleware:
    // - publicProcedure: no auth required
    // - authedProcedure: requires valid session
    // - superAdminProcedure: requires super admin role
    const { response } = await handler.handle(request, {
      prefix: "/api/rpc",
      context: {
        request,
        session,
        userId: session?.getId(),
        userRole: session?.getRole(),
      },
    });

    //Handle missing response
    if (!response) {
      console.warn("oRPC: No handler found for:", request.url);
      return new Response(
        JSON.stringify({
          error: "Procedure not found",
          message: "The requested endpoint does not exist",
          url: request.url,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        },
      );
    }

    // 6️⃣ Add CORS headers to successful response
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
    );
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error("oRPC handler error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    );
  }
}

//Handle CORS preflight requests
export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
};

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
