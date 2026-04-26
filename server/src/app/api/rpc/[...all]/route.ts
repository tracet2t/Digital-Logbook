import { router } from "@/routers/index";
import getSession from "@/server_actions/getSession";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import "@orpc/server/fetch";

export const dynamic = "force-dynamic";

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error("oRPC Error:", error);
    }),
  ],
});

async function handleRequest(request: Request) {
  try {
    const session = await getSession();

    //Determine if endpoint requires authentication
    const url = new URL(request.url);
    const isPublicEndpoint =
      url.pathname.includes("/onboarding/applications") &&
      request.method === "GET";

    //Check authentication for protected endpoints
    if (!isPublicEndpoint && (!session || !session.isAuthenticated())) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Authentication required",
        }),
        {
          status: 401,
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

    const { response } = await handler.handle(request, {
      prefix: "/api/rpc",
      context: {
        request,
        session,
        userId: session?.getId(),
        userRole: session?.getRole(),
      },
    });

    // 5️⃣ Handle missing response
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
