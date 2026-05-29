import { InvitationRepository } from "@/repositories/invitation_repository_impl";
import { UserRepository } from "@/repositories/user_repository_impl";
import { createProcedures } from "@/routers/middleware";
import {
  deleteInvitationInputSchema,
  deleteInvitationOutputSchema,
  getInvitationsOutputSchema,
  sendBulkInvitationsInputSchema,
  sendBulkInvitationsOutputSchema,
  sendInvitationInputSchema,
  sendInvitationOutputSchema,
  updateInvitationStatusInputSchema,
  updateInvitationStatusOutputSchema,
  validateInvitationTokenInputSchema,
  validateInvitationTokenOutputSchema,
} from "@/schemas/invitation.schema";
import { registerStudent } from "@/services/registerstudent";
import { Invitation, Role } from "@prisma/client";

import prisma from "@/lib/prisma";
import { invitationQueue } from "@/lib/queues/invitationQueue";

// Initialize repositories
const invitationRepository = new InvitationRepository();
const userRepository = new UserRepository();

// Create procedures with authentication middleware
const { publicProcedure, superAdminProcedure } = createProcedures();

/**
 * Domain-specific error definitions for invitations
 */
const invitationErrors = {
  USER_EXISTS: {
    message: "User with this email already exists",
    status: 409,
  },
  INVITATION_NOT_FOUND: {
    message: "Invitation not found",
    status: 404,
  },
  INVALID_TOKEN: {
    message: "Invalid token",
    status: 404,
  },
  TOKEN_ALREADY_USED: {
    message: "Token has already been used",
    status: 400,
  },
  TOKEN_EXPIRED: {
    message: "Token has expired",
    status: 400,
  },
  DUPLICATE_INVITATION: {
    message: "An invitation for this email or token already exists",
    status: 409,
  },
} as const;

// ─── Send Single Invitation ───────────────────────────────────────────────────

export const sendInvitation = superAdminProcedure
  .route({
    method: "POST",
    path: "/invitations",
    summary: "Send single invitation",
    description:
      "Send an invitation to a single user. Creates user account, invitation record, and queues welcome email.",
    tags: ["Invitations"],
  })
  .errors({
    CONFLICT: invitationErrors.USER_EXISTS,
  })
  .input(sendInvitationInputSchema)
  .output(sendInvitationOutputSchema)
  .handler(async ({ input, context, errors }) => {
    const { email, role, firstName, lastName, projectId } = input;
    const invitedBy = context.userId;

    if (!invitedBy) {
      throw errors.UNAUTHORIZED();
    }

    // ✓ Validate email configuration BEFORE processing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      const errorMessage =
        "Email service is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.";
      console.error(
        "[sendInvitation] ✗ Email configuration error:",
        errorMessage,
      );
      throw new Error(errorMessage);
    }

    // Check if user already exists
    const existingUser = await userRepository.getByEmail(email);
    if (existingUser) {
      throw errors.CONFLICT();
    }

    // Register the user
    const registerResult = await registerStudent({
      email,
      firstName,
      lastName,
      role,
      invitedBy,
      projectId,
    });

    const { tempPassword } = registerResult;

    // Create the invitation
    const invitation = await invitationRepository.createInvite({
      email,
      role,
      invitedBy,
      projectId,
    });

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/create-account?token=${invitation.token}&email=${encodeURIComponent(email)}`;

    // Queue email (async - doesn't block response)
    await invitationQueue.add("sendInvitationEmail", {
      type: "sendInvitationEmail",
      email,
      name: `${firstName} ${lastName}`,
      tempPassword,
      message: `Your registration was successful. Your temporary password is: ${tempPassword}`,
      loginUrl,
      token: invitation.token,
    });

    return {
      message: "Invitation sent successfully",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        token: invitation.token,
        createdAt: invitation.createdAt.toISOString(),
        expiresAt: invitation.expiresAt.toISOString(),
      },
    };
  });

// ─── Send Bulk Invitations ────────────────────────────────────────────────────

export const sendBulkInvitations = superAdminProcedure
  .route({
    method: "POST",
    path: "/invitations/bulk",
    summary: "Send bulk invitations",
    description:
      "Send invitations to multiple users in a single request. Creates user accounts, invitation records, and queues welcome emails. Returns success/failure breakdown.",
    tags: ["Invitations"],
  })
  .input(sendBulkInvitationsInputSchema)
  .output(sendBulkInvitationsOutputSchema)
  .handler(async ({ input, context, errors }) => {
    const invitedBy = context.userId;
    const { invitations } = input;

    if (!invitedBy) {
      throw errors.UNAUTHORIZED();
    }

    // ✓ Validate email configuration BEFORE processing any invitations
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      const errorMessage =
        "Email service is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.";
      console.error(
        "[sendBulkInvitations] ✗ Email configuration error:",
        errorMessage,
      );
      throw new Error(errorMessage);
    }

    const result = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ row: number; email: string; error: string }>,
    };

    // Helper function to resolve project ID (UUID or name)
    const projectCache = new Map<string, string>();

    const resolveProjectId = async (
      projectIdOrName: string,
    ): Promise<string | null> => {
      // Check if it's already a UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(projectIdOrName)) {
        return projectIdOrName;
      }

      // Check cache first
      if (projectCache.has(projectIdOrName)) {
        return projectCache.get(projectIdOrName)!;
      }

      // Look up by name using Prisma directly
      const projects = await prisma.project.findMany({
        where: { name: projectIdOrName },
        select: { id: true },
      });

      if (projects.length === 0) {
        return null;
      }

      const projectId = projects[0].id;
      projectCache.set(projectIdOrName, projectId);
      return projectId;
    };

    // Process each invitation sequentially
    for (let i = 0; i < invitations.length; i++) {
      const invitation = invitations[i];
      const {
        email,
        role,
        firstName,
        lastName,
        projectId: projectIdOrName,
      } = invitation;

      try {
        // Resolve project ID from name or UUID
        const projectId = await resolveProjectId(projectIdOrName);
        if (!projectId) {
          result.failed++;
          result.errors.push({
            row: i + 1,
            email,
            error: `Project not found: ${projectIdOrName}`,
          });
          continue;
        }
        // Check if user already exists
        const existingUser = await userRepository.getByEmail(email);
        if (existingUser) {
          result.failed++;
          result.errors.push({
            row: i + 1,
            email,
            error: "User with this email already exists",
          });
          continue;
        }

        // Validate role
        if (!Object.values(Role).includes(role)) {
          result.failed++;
          result.errors.push({
            row: i + 1,
            email,
            error: "Invalid role",
          });
          continue;
        }

        // Register the user
        const registerResult = await registerStudent({
          email,
          firstName,
          lastName,
          role,
          invitedBy,
          projectId,
        });

        const { tempPassword } = registerResult;

        // Create the invitation
        const invitationRecord = await invitationRepository.createInvite({
          email,
          role,
          invitedBy,
          projectId,
        });

        const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/create-account?token=${invitationRecord.token}&email=${encodeURIComponent(email)}`;

        // Queue email (async - doesn't block response)
        await invitationQueue.add("sendInvitationEmail", {
          type: "sendInvitationEmail",
          email,
          name: `${firstName} ${lastName}`,
          tempPassword,
          message: `Your registration was successful. Your temporary password is: ${tempPassword}`,
          loginUrl,
          token: invitationRecord.token,
        });

        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: i + 1,
          email,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return result;
  });

// ─── Get All Invitations ──────────────────────────────────────────────────────

export const getInvitations = superAdminProcedure
  .route({
    method: "GET",
    path: "/invitations",
    summary: "Get all invitations",
    description:
      "Retrieve all invitations with inviter details, project names, and computed status (Pending/Accepted/Expired).",
    tags: ["Invitations"],
  })
  .output(getInvitationsOutputSchema)
  .handler(async () => {
    type InvitationWithInviter = Invitation & {
      projectId?: string | null;
      inviter: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      } | null;
    };

    const invitations = (await invitationRepository.getAll({
      orderBy: { createdAt: "desc" },
      include: {
        inviter: true,
      },
    })) as InvitationWithInviter[];

    // Fetch all projects referenced in invitations
    const projectIdSet = new Set(
      invitations
        .map((inv) => inv.projectId)
        .filter((id): id is string => Boolean(id)),
    );

    const projects = await prisma.project.findMany({
      where: { id: { in: Array.from(projectIdSet) } },
    });

    const projectById = new Map(projects.map((p) => [p.id, p.name]));
    const now = new Date();

    return invitations.map((inv) => {
      const status: "Pending" | "Accepted" | "Expired" = inv.accepted
        ? "Accepted"
        : now > new Date(inv.expiresAt)
          ? "Expired"
          : "Pending";

      return {
        id: inv.id,
        email: inv.email,
        role: inv.role,
        project: inv.projectId ? (projectById.get(inv.projectId) ?? "—") : "—",
        status,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
      };
    });
  });

// ─── Validate Invitation Token ────────────────────────────────────────────────

export const validateInvitationToken = publicProcedure
  .route({
    method: "GET",
    path: "/invitations/validate",
    summary: "Validate invitation token",
    description:
      "Check if an invitation token is valid (not expired, not already accepted).",
    tags: ["Invitations"],
  })
  .errors({
    NOT_FOUND: invitationErrors.INVALID_TOKEN,
    GONE: invitationErrors.TOKEN_ALREADY_USED,
    BAD_REQUEST: invitationErrors.TOKEN_EXPIRED,
  })
  .input(validateInvitationTokenInputSchema)
  .output(validateInvitationTokenOutputSchema)
  .handler(async ({ input }) => {
    const { token } = input;

    const invitations = await invitationRepository.getAll({
      where: { token },
    });

    if (invitations.length === 0) {
      return {
        valid: false,
        message: "Invalid token",
      };
    }

    const invitation = invitations[0];

    if (invitation.accepted) {
      return {
        valid: false,
        message: "Token has already been used",
      };
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return {
        valid: false,
        message: "Token has expired",
      };
    }

    return {
      valid: true,
      email: invitation.email,
      role: invitation.role,
    };
  });

// ─── Update Invitation Status ─────────────────────────────────────────────────

export const updateInvitationStatus = superAdminProcedure
  .route({
    method: "PATCH",
    path: "/invitations/:id/status",
    summary: "Update invitation status",
    description:
      "Update the status of an invitation (Pending/Accepted/Expired). Modifies accepted flag and expiresAt timestamp.",
    tags: ["Invitations"],
  })
  .input(updateInvitationStatusInputSchema)
  .output(updateInvitationStatusOutputSchema)
  .handler(async ({ input }) => {
    const { id, status } = input;

    let updateData: { expiresAt?: Date; accepted?: boolean } = {};

    switch (status) {
      case "Accepted":
        updateData = { accepted: true };
        break;
      case "Pending":
        updateData = {
          accepted: false,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };
        break;
      case "Expired":
        updateData = { accepted: false, expiresAt: new Date(0) }; // epoch
        break;
    }

    await prisma.invitation.update({
      where: { id },
      data: updateData,
    });

    return { message: "Invitation status updated" };
  });

// ─── Delete Invitation ────────────────────────────────────────────────────────

export const deleteInvitation = superAdminProcedure
  .route({
    method: "DELETE",
    path: "/invitations/:id",
    summary: "Delete invitation",
    description:
      "Delete an invitation and cascade delete the associated user and all their data (activities, feedback, project allocations, etc.).",
    tags: ["Invitations"],
  })
  .errors({
    NOT_FOUND: invitationErrors.INVITATION_NOT_FOUND,
  })
  .input(deleteInvitationInputSchema)
  .output(deleteInvitationOutputSchema)
  .handler(async ({ input, errors }) => {
    const { id } = input;

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) {
      throw errors.NOT_FOUND();
    }

    const user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (user) {
      await prisma.$transaction(async (tx) => {
        // Delete mentor feedback on user's activities
        const activityIds = (
          await tx.activity.findMany({
            where: { studentId: user.id },
            select: { id: true },
          })
        ).map((a) => a.id);

        if (activityIds.length) {
          await tx.mentorFeedback.deleteMany({
            where: { activityId: { in: activityIds } },
          });
        }

        // Delete all user-related data
        await tx.activity.deleteMany({ where: { studentId: user.id } });
        await tx.mentorFeedback.deleteMany({ where: { mentorId: user.id } });
        await tx.mentorActivity.deleteMany({ where: { mentorId: user.id } });
        await tx.report.deleteMany({ where: { mentorId: user.id } });
        await tx.userBadge.deleteMany({ where: { userId: user.id } });
        await tx.projectAllocation.deleteMany({
          where: { studentId: user.id },
        });
        await tx.projectMentor.deleteMany({ where: { mentorId: user.id } });

        // Null-out invitations sent BY this user
        await tx.invitation.updateMany({
          where: { invitedBy: user.id },
          data: { invitedBy: null },
        });

        // Delete the invitation record
        await tx.invitation.delete({ where: { id } });

        // Delete the user
        await tx.user.delete({ where: { id: user.id } });
      });
    } else {
      // No user found – just remove the invitation record
      await prisma.invitation.delete({ where: { id } });
    }

    return { message: "Deleted successfully" };
  });
