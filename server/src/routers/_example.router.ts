/**
 * Example Router Template
 *
 * Copy this file as a starting point for creating new routers
 * Replace "example" with your domain name (e.g., projects, users, reports)
 */

import { createProcedures } from "@/routers/middleware";
import { z } from "zod";

// Import your repository
// import { ExampleRepository } from "@/repositories/example_repository";

// Initialize repository
// const exampleRepository = new ExampleRepository();

// Create procedures with authentication middleware
const {
  publicProcedure,
  authedProcedure,
  superAdminProcedure,
  mentorProcedure,
} = createProcedures();

/**
 * Public endpoint - no authentication required
 * Available to all users including unauthenticated
 */
export const getPublicExample = publicProcedure
  .route({
    method: "GET",
    path: "/examples/public",
    summary: "Get public data",
    description: "Retrieve public example data",
    tags: ["Example"],
  })
  .output(z.object({ message: z.string() }))
  .handler(async () => {
    return { message: "This is public data" };
  });

/**
 * Authenticated endpoint
 * Requires valid user session
 * Context available: session, userId, userRole
 */
export const getPrivateExample = authedProcedure
  .route({
    method: "GET",
    path: "/examples/private",
    summary: "Get private data",
    description: "Retrieve private example data (requires authentication)",
    tags: ["Example"],
  })
  .output(z.object({ message: z.string(), userId: z.string() }))
  .handler(async ({ context }) => {
    // Access authenticated user context
    const userId = context.userId ?? "unknown";
    const { userRole } = context;

    return {
      message: `Hello user ${userId} with role ${userRole}`,
      userId,
    };
  });

/**
 * Mentor-only endpoint
 * Requires mentor or superAdmin role
 */
export const mentorOnlyExample = mentorProcedure
  .route({
    method: "POST",
    path: "/examples/mentor",
    summary: "Mentor action",
    description: "Perform mentor-specific action",
    tags: ["Example"],
  })
  .input(z.object({ data: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    // Only mentors and super admins can access this
    console.log(`Mentor ${context.userId} performed action with ${input.data}`);
    return { success: true };
  });

/**
 * Super Admin only endpoint
 * Requires superAdmin role
 */
export const adminOnlyExample = superAdminProcedure
  .route({
    method: "DELETE",
    path: "/examples/:id",
    summary: "Admin delete",
    description: "Delete example (super admin only)",
    tags: ["Example"],
  })
  .errors({
    NOT_FOUND: {
      message: "Example not found",
      status: 404,
    },
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input: _input, errors: _errors }) => {
    // Only super admins can access this
    // Use common errors from base

    // Example validation
    // const example = await exampleRepository.findById(_input.id);
    // if (!example) {
    //   throw _errors.NOT_FOUND();
    // }

    return { success: true };
  });

/**
 * Error handling example
 * Shows how to use common errors and custom errors
 */
export const errorExample = publicProcedure
  .route({
    method: "POST",
    path: "/examples/error",
    summary: "Error handling example",
    description: "Demonstrates error handling patterns",
    tags: ["Example"],
  })
  .errors({
    CONFLICT: {
      message: "Example already exists",
      status: 409,
    },
    INVALID_INPUT: {
      message: "Invalid example data",
      status: 400,
    },
  })
  .input(z.object({ name: z.string() }))
  .output(z.object({ id: z.string() }))
  .handler(async ({ input: _input, errors: _errors }) => {
    // Use common errors (automatically available from base)
    // throw _errors.NOT_FOUND();
    // throw _errors.CONFLICT();
    // throw _errors.UNAUTHORIZED();
    // throw _errors.FORBIDDEN();
    // throw _errors.INVALID_INPUT();
    // throw _errors.INTERNAL_ERROR();
    // throw _errors.RATE_LIMITED();

    return { id: "example-id" };
  });
