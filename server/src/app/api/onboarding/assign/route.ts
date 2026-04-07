import { OnboardingRepository } from "@/repositories/onboarding_repository_impl";
import { ProjectRepository } from "@/repositories/project_repository_impl";
import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const onboardingRepo = new OnboardingRepository();
const projectRepo = new ProjectRepository();

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
      }))
      .filter(
        (a): a is { applicationId: string; projectId: string } =>
          !!a.applicationId,
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
      user = await prisma.user.create({
        data: {
          email: application.email,
          firstName,
          lastName,
          role: Role.student,
          emailConfirmed: false,
          isFirstTimeLogin: true,
          isActive: true,
        },
      });
    }

    // 5. Assign the user to the project (idempotent)
    const allocationResult = await projectRepo.assignStudentToProject(
      projectId,
      user.id,
    );

    // 6. Mark the application as approved
    const updatedApplication = await onboardingRepo.updateStatus(
      applicationId,
      "approved",
    );

    return NextResponse.json(
      {
        message: allocationResult.success
          ? "Mentee assigned to project successfully"
          : "Mentee was already assigned to this project",
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
    }

    // 4. Reset application status back to pending
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
