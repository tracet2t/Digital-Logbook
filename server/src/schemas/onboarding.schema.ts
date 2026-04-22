import { z } from "zod";

/**
 * Zod schemas for onboarding/mentee application validation
 */

export const createApplicationSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .describe("Full name of the mentee applicant"),
    email: z
      .string()
      .email("Invalid email address")
      .describe("Email address for communication"),
    university: z
      .string()
      .min(1, "University is required")
      .describe("Name of the university"),
    degreeProgram: z
      .string()
      .min(1, "Degree program is required")
      .describe("Degree program or major"),
    cvLink: z
      .string()
      .url("Invalid CV link")
      .describe("URL link to the applicant's CV/Resume"),
  })
  .describe("Create a new mentee application");

export const getApplicationByIdSchema = z
  .object({
    id: z
      .string()
      .min(1, "ID is required")
      .describe("Unique identifier of the application"),
  })
  .describe("Get application by ID");

export const getApplicationByEmailSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .describe("Email address to search for"),
  })
  .describe("Get application by email address");

export const getApplicationsByStatusSchema = z
  .object({
    status: z
      .enum(["pending", "approved", "rejected"])
      .describe("Application status filter (pending, approved, or rejected)"),
  })
  .describe("Filter applications by status");

export const searchApplicationsSchema = z
  .object({
    search: z
      .string()
      .min(1, "Search term is required")
      .describe("Search term for name, email, or university"),
  })
  .describe("Search applications");

export const getApplicationsByDateRangeSchema = z
  .object({
    startDate: z
      .string()
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid start date",
      })
      .describe("Start date in ISO format"),
    endDate: z
      .string()
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid end date",
      })
      .describe("End date in ISO format"),
  })
  .describe("Get applications within date range");

export const updateApplicationStatusSchema = z
  .object({
    id: z
      .string()
      .min(1, "ID is required")
      .describe("Unique identifier of the application"),
    status: z
      .enum(["pending", "approved", "rejected"])
      .describe("New status to set (pending, approved, or rejected)"),
  })
  .describe("Update application status");

export const applicationSchema = z
  .object({
    id: z.string().describe("Unique identifier"),
    fullName: z.string().describe("Full name of the applicant"),
    email: z.string().describe("Email address"),
    university: z.string().describe("University name"),
    degreeProgram: z.string().describe("Degree program"),
    cvLink: z.string().describe("Link to CV/Resume"),
    status: z
      .enum(["pending", "approved", "rejected"])
      .describe("Current application status"),
    createdAt: z.string().describe("Creation timestamp in ISO format"),
    updatedAt: z.string().describe("Last update timestamp in ISO format"),
  })
  .describe("Mentee application object");

// Response schemas
export const createApplicationResponseSchema = z
  .object({
    message: z.string().describe("Success message"),
    application: applicationSchema,
  })
  .describe("Application creation response");

export const updateApplicationStatusResponseSchema = z
  .object({
    message: z.string().describe("Status update confirmation message"),
    application: applicationSchema,
  })
  .describe("Application status update response");

// Type inference from schemas
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type ApplicationStatus = z.infer<
  typeof getApplicationsByStatusSchema
>["status"];
