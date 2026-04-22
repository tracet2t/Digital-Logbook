import { router } from "@/routers";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";

export const dynamic = "force-dynamic";

// Create the OpenAPI handler with your router
// This enables both RPC-style (dot notation) and REST-style (path-based) endpoints
const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      // Log errors for debugging
      console.error("oRPC Error:", error);
    }),
  ],
});

async function handleRequest(request: Request) {
  try {
    const { response } = await handler.handle(request, {
      prefix: "/api/rpc",
      context: {
        request, // Pass request to context for middleware access
      },
    });

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

    // Add CORS headers to response
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
        },
      },
    );
  }
}

// Handle CORS preflight requests
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

// Export all HTTP methods that oRPC should handle
export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
