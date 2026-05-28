import { ProjectRepository } from "@/repositories/project_repository_impl";
import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const projectRepo = new ProjectRepository();

export const dynamic = "force-dynamic";

// GET: Retrieve projects (single or all), or get students/mentors of a project
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const view = url.searchParams.get("view"); // "students" | "mentors"

  try {
    if (id) {
      if (view === "students") {
        const students = await projectRepo.getProjectStudents(id);
        return NextResponse.json(students);
      }
      if (view === "mentors") {
        const mentors = await projectRepo.getProjectMentors(id);
        return NextResponse.json(mentors);
      }
      const project = await projectRepo.getProjectWithAssignments(id);
      if (!project)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(project);
    }

    const projects = await projectRepo.getAllProjectsWithCounts();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

// POST: Create new project (Super Admin and Mentor only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const userId = session.getId();
    const userRole = session.getRole();

    if (userRole !== "superAdmin") {
      return NextResponse.json(
        {
          message: "Forbidden - Only super admins  can create projects",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { name, description, domain, batchNo } = body;

    if (!name || !domain) {
      return NextResponse.json(
        { message: "Project name and domain are required" },
        { status: 400 },
      );
    }

    const maxOrder = await prisma.project.aggregate({
      _max: { projectOrder: true },
    });
    const nextOrder = (maxOrder._max.projectOrder ?? -1) + 1;

    const created = await projectRepo.create({
      name,
      description: description || undefined,
      domain,
      batchNo: batchNo?.trim() || null,
      createdBy: userId,
      projectOrder: nextOrder,
    } as any);

    return NextResponse.json(
      { success: true, message: "Project created successfully", data: created },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

// PATCH: Assign a student or mentor to a project
// Body: { projectId, studentId } OR { projectId, mentorId }
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.getRole();
    if (userRole !== "superAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { projectId, studentId, mentorId, order } = body;

    if (Array.isArray(order)) {
      await prisma.$transaction(
        order.map((id: string, index: number) =>
          prisma.project.update({
            where: { id },
            data: { projectOrder: index },
          }),
        ),
      );
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId is required" },
        { status: 400 },
      );
    }

    if (studentId) {
      const result = await projectRepo.assignStudentToProject(
        projectId,
        studentId,
      );
      return NextResponse.json(result, { status: result.success ? 200 : 409 });
    }

    if (mentorId) {
      const result = await projectRepo.assignMentorToProject(
        projectId,
        mentorId,
      );
      return NextResponse.json(result, { status: result.success ? 200 : 409 });
    }

    return NextResponse.json(
      { message: "Either studentId or mentorId is required" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a student or mentor from a project
// Body: { projectId, studentId } OR { projectId, mentorId }
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.getRole();
    if (userRole !== "superAdmin" && userRole !== "mentor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { projectId, studentId, mentorId } = body;

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId is required" },
        { status: 400 },
      );
    }

    if (studentId) {
      const result = await projectRepo.removeStudentFromProject(
        projectId,
        studentId,
      );
      return NextResponse.json(result);
    }

    if (mentorId) {
      const result = await projectRepo.removeMentorFromProject(
        projectId,
        mentorId,
      );
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { message: "Either studentId or mentorId is required" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
