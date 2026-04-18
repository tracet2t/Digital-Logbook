import { z } from "zod";

/**
 * Zod schemas for onboarding/mentee application validation
 */

export const createApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  university: z.string().min(1, "University is required"),
  degreeProgram: z.string().min(1, "Degree program is required"),
  cvLink: z.string().url("Invalid CV link"),
});

export const getApplicationByIdSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const getApplicationByEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const getApplicationsByStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export const searchApplicationsSchema = z.object({
  search: z.string().min(1, "Search term is required"),
});

export const getApplicationsByDateRangeSchema = z.object({
  startDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid end date",
  }),
});

export const updateApplicationStatusSchema = z.object({
  id: z.string().min(1, "ID is required"),
  status: z.enum(["pending", "approved", "rejected"]),
});

export const applicationSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  university: z.string(),
  degreeProgram: z.string(),
  cvLink: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type inference from schemas
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type ApplicationStatus = z.infer<
  typeof getApplicationsByStatusSchema
>["status"];
