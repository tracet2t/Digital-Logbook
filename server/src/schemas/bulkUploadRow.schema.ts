import { z } from "zod";

// ─── Valid Roles ───────────────────────────────────────────────────────────────

export const VALID_ROLES = ["mentor", "mentee"] as const;

// ─── Field Schemas ─────────────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .describe("User email address");

export const roleSchema = z
  .enum(VALID_ROLES, {
    errorMap: () => ({
      message: "Role must be 'mentor' or 'mentee'",
    }),
  })
  .describe("User role (mentor or mentee only)");

export const firstNameSchema = z
  .string()
  .min(1, "First name is required")
  .max(100, "First name is too long (max 100 characters)")
  .describe("User first name");

export const lastNameSchema = z
  .string()
  .min(1, "Last name is required")
  .max(100, "Last name is too long (max 100 characters)")
  .describe("User last name");

export const projectSchema = z
  .string()
  .min(1, "Project is required")
  .describe("Project ID or name (validated against database separately)");

// ─── Composite Schema ──────────────────────────────────────────────────────────

export const bulkUploadRowSchema = z
  .object({
    email: emailSchema,
    role: roleSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    project: projectSchema,
  })
  .describe("Schema for validating a single row in bulk upload");

// ─── Types ─────────────────────────────────────────────────────────────────────

export type BulkUploadRowData = z.infer<typeof bulkUploadRowSchema>;
