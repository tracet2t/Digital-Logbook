import { InvitationRepository } from "@/repositories/invitation_repository_impl";
import { OnboardingRepository } from "@/repositories/onboarding_repository_impl";
import { ProjectRepository } from "@/repositories/project_repository_impl";
import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const onboardingRepo = new OnboardingRepository();
const projectRepo = new ProjectRepository();
const invitationRepo = new InvitationRepository();

/**
 * GET /api/onboarding/assign
 *
 * Returns a list of { applicationId, projectId } pairs by joining
 * ProjectAllocation → User → MenteeApplication via email.
 * Used to restore the Kanban board state on page load.
 *
 * Auth: superAdmin only
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== "superAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Fetch all project allocations that have a matching MenteeApplication email
    const allocations = await prisma.projectAllocation.findMany({
      include: {
        student: { select: { email: true } },
      },
    });

    if (allocations.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const emails = allocations.map((a) => a.student.email);

    const menteeApps = (await (prisma as any).menteeApplication.findMany({
      where: { email: { in: emails } },
      select: { id: true, email: true },
    })) as { id: string; email: string }[];

    const emailToAppId = new Map(menteeApps.map((a) => [a.email, a.id]));

    const result = allocations
      .map((a) => ({
        applicationId: emailToAppId.get(a.student.email),
        projectId: a.projectId,
        assignedAt: a.assignedAt.toISOString(),
      }))
      .filter(
        (
          a,
        ): a is {
          applicationId: string;
          projectId: string;
          assignedAt: string;
        } => !!a.applicationId,
      );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching onboarding allocations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/onboarding/assign
 *
 * Creates (or reuses) a User account from a MenteeApplication, assigns that user
 * to the given project via ProjectAllocation, and marks the application as "approved".
 *
 * Body: { applicationId: string; projectId: string }
 * Auth: superAdmin only
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== "superAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const applicationId = String(body?.applicationId ?? "").trim();
    const projectId = String(body?.projectId ?? "").trim();

    if (!applicationId || !projectId) {
      return NextResponse.json(
        { message: "applicationId and projectId are required" },
        { status: 400 },
      );
    }

    // 1. Fetch the MenteeApplication
    const application = await onboardingRepo.getApplicationById(applicationId);
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 },
      );
    }

    // 2. Verify the project exists
    const project = await projectRepo.getById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    // 3. Split fullName into firstName / lastName
    const nameParts = application.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? application.fullName;
    const lastName = nameParts.slice(1).join(" ") || firstName;

    // 4. Find or create the User account
    let user = await prisma.user.findUnique({
      where: { email: application.email },
    });

    if (!user) {
      // Generate a temporary password for the new user
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await prisma.user.create({
        data: {
          email: application.email,
          firstName,
          lastName,
          role: Role.student,
          passwordHash: hashedPassword,
          emailConfirmed: false,
          isFirstTimeLogin: true,
          isActive: true,
        },
      });
    } else if (!user.passwordHash) {
      // User existed (created by old code) but has no password — set one now
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword },
      });
    }

    // 5. Send invitation email if no un-accepted invitation exists for this email
    let invitationSent = false;
    const existingInvitation = await prisma.invitation.findFirst({
      where: { email: application.email, accepted: false },
    });

    if (!existingInvitation) {
      const invitedBy = session.getId();
      if (!invitedBy) {
        console.error("Cannot send invitation: session has no admin ID");
      } else {
        try {
          // Re-generate a fresh temp password to include in the email
          const emailTempPassword = Math.random().toString(36).slice(-8);
          const emailHashedPassword = await bcrypt.hash(emailTempPassword, 10);
          // Update the user's password to the one we'll send in the email
          await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: emailHashedPassword },
          });

          const invitation = await invitationRepo.createInvite({
            email: application.email,
            role: Role.student,
            invitedBy,
          });

          const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/create-account?token=${invitation.token}&email=${encodeURIComponent(application.email)}`;

          await sendEmail({
            email: application.email,
            name: application.fullName,
            tempPassword: emailTempPassword,
            message: `Your registration was successful. Your temporary password is: ${emailTempPassword}`,
            loginUrl,
            token: invitation.token,
          });

          invitationSent = true;
          console.log(`Invitation email sent to ${application.email}`);
        } catch (emailError) {
          console.error("Failed to send invitation email:", emailError);
        }
      }
    } else {
      console.log(
        `Invitation already exists for ${application.email}, skipping email send`,
      );
    }

    // 6. Assign the user to the project (idempotent)
    const allocationResult = await projectRepo.assignStudentToProject(
      projectId,
      user.id,
    );

    // 7. Sync the user's batchNo to match the project's batchNo
    if (project.batchNo !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { batchNo: project.batchNo },
      });
    }

    // 8. Mark the application as approved
    const updatedApplication = await onboardingRepo.updateStatus(
      applicationId,
      "approved",
    );

    return NextResponse.json(
      {
        message: allocationResult.success
          ? "Mentee assigned to project successfully"
          : "Mentee was already assigned to this project",
        invitationSent,
        user,
        application: updatedApplication,
        allocation: allocationResult.data ?? null,
      },
      { status: allocationResult.success ? 201 : 200 },
    );
  } catch (error) {
    console.error("Error assigning mentee to project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/onboarding/assign
 *
 * Removes a ProjectAllocation for the user linked to a MenteeApplication,
 * and resets the application status back to "pending".
 *
 * Body: { applicationId: string; projectId: string }
 * Auth: superAdmin only
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== "superAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const applicationId = String(body?.applicationId ?? "").trim();
    const projectId = String(body?.projectId ?? "").trim();

    if (!applicationId || !projectId) {
      return NextResponse.json(
        { message: "applicationId and projectId are required" },
        { status: 400 },
      );
    }

    // 1. Fetch the application to get the email
    const application = await onboardingRepo.getApplicationById(applicationId);
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 },
      );
    }

    // 2. Find the user account linked by email
    const user = await prisma.user.findUnique({
      where: { email: application.email },
    });

    if (user) {
      // 3. Remove the ProjectAllocation
      await projectRepo.removeStudentFromProject(projectId, user.id);

      // 4. Clear the user's batchNo
      await prisma.user.update({
        where: { id: user.id },
        data: { batchNo: null },
      });
    }

    // 5. Reset application status back to pending
    const updatedApplication = await onboardingRepo.updateStatus(
      applicationId,
      "pending",
    );

    return NextResponse.json(
      {
        message: "Mentee removed from project",
        application: updatedApplication,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error unassigning mentee from project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
