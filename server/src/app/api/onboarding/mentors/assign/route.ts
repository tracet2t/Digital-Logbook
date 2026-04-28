import { ProjectRepository } from "@/repositories/project_repository_impl";
import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const projectRepo = new ProjectRepository();

/**
 * GET /api/onboarding/mentors/assign
 *
 * Returns all current ProjectMentor rows as { mentorId, projectId } pairs.
 * Used to rehydrate the mentor Kanban board on page load.
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

    const rows = await prisma.projectMentor.findMany({
      select: { mentorId: true, projectId: true, assignedAt: true },
    });

    return NextResponse.json(
      rows.map((r) => ({ ...r, assignedAt: r.assignedAt.toISOString() })),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching mentor allocations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/onboarding/mentors/assign
 *
 * Assigns a mentor (User with role=mentor) to a project via ProjectMentor table.
 *
 * Body: { mentorId: string; projectId: string }
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
    const mentorId = String(body?.mentorId ?? "").trim();
    const projectId = String(body?.projectId ?? "").trim();

    if (!mentorId || !projectId) {
      return NextResponse.json(
        { message: "mentorId and projectId are required" },
        { status: 400 },
      );
    }

    const result = await projectRepo.assignMentorToProject(projectId, mentorId);

    // Sync the mentor's batchNo to match the project's batchNo
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { batchNo: true },
    });
    if (project) {
      await prisma.user.update({
        where: { id: mentorId },
        data: { batchNo: project.batchNo },
      });
    }

    return NextResponse.json(
      { message: result.message, data: result.data ?? null },
      { status: result.success ? 201 : 200 },
    );
  } catch (error) {
    console.error("Error assigning mentor to project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/onboarding/mentors/assign
 *
 * Removes a mentor from a project (deletes the ProjectMentor row).
 *
 * Body: { mentorId: string; projectId: string }
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
    const mentorId = String(body?.mentorId ?? "").trim();
    const projectId = String(body?.projectId ?? "").trim();

    if (!mentorId || !projectId) {
      return NextResponse.json(
        { message: "mentorId and projectId are required" },
        { status: 400 },
      );
    }

    const result = await projectRepo.removeMentorFromProject(
      projectId,
      mentorId,
    );

    // Clear the mentor's batchNo
    await prisma.user.update({
      where: { id: mentorId },
      data: { batchNo: null },
    });

    return NextResponse.json(
      { message: result.message },
      { status: result.success ? 200 : 404 },
    );
  } catch (error) {
    console.error("Error removing mentor from project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
