import { Role } from "@prisma/client";
import { z } from "zod";

// ─── Single Invitation Schemas ────────────────────────────────────────────────

export const sendInvitationInputSchema = z
  .object({
    email: z
      .string()
      .email()
      .describe("Email address of the invitee")
      .toLowerCase()
      .trim(),
    role: z
      .enum([Role.student, Role.mentor, Role.superAdmin])
      .describe("Role to assign to the invited user"),
    firstName: z.string().min(1).describe("First name of the invitee").trim(),
    lastName: z.string().min(1).describe("Last name of the invitee").trim(),
    projectId: z
      .string()
      .min(1)
      .describe("Project ID (UUID) or project name to assign the user to"),
  })
  .describe("Input data for sending a single invitation");

export const invitationObjectSchema = z
  .object({
    id: z.string().uuid().describe("Unique invitation ID"),
    email: z.string().email().describe("Email address of the invitee"),
    role: z.string().describe("Role assigned to the invitation"),
    token: z.string().describe("Unique invitation token"),
    createdAt: z.string().describe("ISO timestamp when invitation was created"),
    expiresAt: z.string().describe("ISO timestamp when invitation expires"),
  })
  .describe("Invitation object");

export const sendInvitationOutputSchema = z
  .object({
    message: z.string().describe("Success message"),
    invitation: invitationObjectSchema.describe("Created invitation details"),
  })
  .describe("Response after sending a single invitation");

// ─── Bulk Invitation Schemas ──────────────────────────────────────────────────

export const sendBulkInvitationsInputSchema = z
  .object({
    invitations: z
      .array(sendInvitationInputSchema)
      .min(1)
      .max(100)
      .describe("Array of invitations to send (max 100 per batch)"),
  })
  .describe("Input data for sending bulk invitations");

export const bulkInvitationErrorSchema = z
  .object({
    row: z.number().describe("Row number in the input array (1-indexed)"),
    email: z.string().describe("Email address that failed"),
    error: z.string().describe("Error message describing the failure"),
  })
  .describe("Error details for a failed invitation");

export const sendBulkInvitationsOutputSchema = z
  .object({
    success: z.number().describe("Number of successfully sent invitations"),
    failed: z.number().describe("Number of failed invitations"),
    errors: z
      .array(bulkInvitationErrorSchema)
      .describe("Array of error details for failed invitations"),
  })
  .describe("Response after sending bulk invitations");

// ─── Get Invitations Schemas ──────────────────────────────────────────────────

export const mappedInvitationSchema = z
  .object({
    id: z.string().uuid().describe("Unique invitation ID"),
    email: z.string().email().describe("Email address of the invitee"),
    role: z.string().describe("Role assigned to the invitation"),
    project: z.string().describe("Project name or '—' if none"),
    status: z
      .enum(["Pending", "Accepted", "Expired"])
      .describe("Current status of the invitation"),
    createdAt: z.date().describe("Date when invitation was created"),
    expiresAt: z.date().describe("Date when invitation expires"),
  })
  .describe("Mapped invitation with project and status");

export const getInvitationsOutputSchema = z
  .array(mappedInvitationSchema)
  .describe("Array of all invitations with mapped project and status");

// ─── Validate Token Schemas ───────────────────────────────────────────────────

export const validateInvitationTokenInputSchema = z
  .object({
    token: z.string().min(1).describe("Invitation token to validate"),
  })
  .describe("Input data for validating an invitation token");

export const validateInvitationTokenOutputSchema = z
  .object({
    valid: z.boolean().describe("Whether the token is valid"),
    email: z.string().email().optional().describe("Email address if valid"),
    role: z.string().optional().describe("Role if valid"),
    message: z.string().optional().describe("Error message if invalid"),
  })
  .describe("Validation result for an invitation token");

// ─── Update Status Schemas ────────────────────────────────────────────────────

export const updateInvitationStatusInputSchema = z
  .object({
    id: z.string().uuid().describe("Invitation ID to update"),
    status: z
      .enum(["Pending", "Accepted", "Expired"])
      .describe("New status to set"),
  })
  .describe("Input data for updating invitation status");

export const updateInvitationStatusOutputSchema = z
  .object({
    message: z.string().describe("Success message"),
  })
  .describe("Response after updating invitation status");

// ─── Delete Invitation Schemas ────────────────────────────────────────────────

export const deleteInvitationInputSchema = z
  .object({
    id: z.string().uuid().describe("Invitation ID to delete"),
  })
  .describe("Input data for deleting an invitation");

export const deleteInvitationOutputSchema = z
  .object({
    message: z.string().describe("Success message"),
  })
  .describe("Response after deleting an invitation");
