import { router } from "@/routers/index";
import getSession from "@/server_actions/getSession";
import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Role } from "@prisma/client";

/**
 * Official oRPC Playground with OpenAPI Reference + REST API
 * Access at: http://localhost:3000/api/doc
 *
 * ⚠️ PROTECTED: Only accessible by Super Admin users
 * Provides interactive API documentation with a modern UI
 * Also enables REST API access at the documented paths
 * Powered by oRPC's OpenAPIHandler
 */

const openAPIHandler = new OpenAPIHandler(router as any, {
  interceptors: [
    onError((error) => {
      console.error("oRPC Playground Error:", error);
    }),
  ],
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "Digital Logbook API",
          version: "1.0.0",
          description:
            "Interactive API documentation for Digital Logbook - Mentee onboarding, project management, and more",
          contact: {
            name: "API Support",
            email: "support@digitallogbook.com",
          },
        },
        servers: [
          {
            url: "http://localhost:3000/api/doc",
            description: "Development Server (REST API + Playground)",
          },
        ],
        tags: [
          {
            name: "Onboarding",
            description: "Mentee application and onboarding management",
          },
        ],
        components: {
          securitySchemes: {
            superAdminAuth: {
              type: "apiKey",
              in: "cookie",
              name: "session",
              description: "Super Admin session cookie authentication",
            },
          },
        },
      },
      docsConfig: {
        title: "Digital Logbook API - Interactive Playground",
        description:
          "Test and explore all API endpoints with live examples and schema documentation. Also supports REST API access.",
        defaultOpenAllTags: true,
        showSchemas: true,
        authentication: {
          preferredSecurityScheme: "superAdminAuth",
        },
      },
    }),
  ],
});

//authentication middleware to protect the playground - only super admin can access
async function handleRequest(request: Request) {
  // Authentication check - Only Super Admin can access
  try {
    const session = await getSession();

    if (!session || !session.isAuthenticated()) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Authentication required. Please login.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    if (session.getRole() !== Role.superAdmin) {
      return new Response(
        JSON.stringify({
          error: "Forbidden",
          message:
            "Access denied. This playground is only accessible to Super Admin users.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response(
      JSON.stringify({
        error: "Authentication Error",
        message: "Failed to verify authentication.",
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

  // User is authenticated as Super Admin, proceed with request
  //this will let you access the rest apis
  try {
    const { response } = await openAPIHandler.handle(request, {
      prefix: "/api/doc",
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

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
