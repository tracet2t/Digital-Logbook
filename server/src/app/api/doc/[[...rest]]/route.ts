import { router } from "@/routers";
import getSession from "@/server_actions/getSession";
import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Role } from "@prisma/client";

/**
 * Official oRPC Playground with OpenAPI Reference
 * Access at: http://localhost:3000/api/doc
 *
 * ⚠️ PROTECTED: Only accessible by Super Admin users
 * Provides interactive API documentation with a modern UI
 * Powered by oRPC's OpenAPIReferencePlugin
 */

const openAPIHandler = new OpenAPIHandler(router, {
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
            url: "http://localhost:3000/api/rpc",
            description: "Development Server",
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
          "Test and explore all API endpoints with live examples and schema documentation",
        defaultOpenAllTags: true,
        showSchemas: true,
        authentication: {
          preferredSecurityScheme: "superAdminAuth",
        },
      },
    }),
  ],
});

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
          headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // User is authenticated as Super Admin, proceed with request
  const { response } = await openAPIHandler.handle(request, {
    prefix: "/api/doc",
    context: {},
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
