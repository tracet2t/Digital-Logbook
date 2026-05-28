import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { extractTaskName } from "@/lib/monitor/task-format";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const mentorId = params.id;
    if (!mentorId) {
      return NextResponse.json(
        { message: "Missing mentor id" },
        { status: 400 },
      );
    }

    const mentor = await prisma.user.findUnique({
      where: { id: mentorId, role: Role.mentor },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { message: "Mentor not found" },
        { status: 404 },
      );
    }

    const projectLinks = await prisma.projectMentor.findMany({
      where: { mentorId },
      select: { projectId: true, project: { select: { name: true } } },
    });

    const projectIds = projectLinks.map((project) => project.projectId);

    const allocations = projectIds.length
      ? await prisma.projectAllocation.findMany({
          where: { projectId: { in: projectIds } },
          select: {
            studentId: true,
            student: { select: { firstName: true, lastName: true } },
          },
        })
      : [];

    const studentIds = Array.from(
      new Set(allocations.map((allocation) => allocation.studentId)),
    );

    const activities = studentIds.length
      ? await prisma.activity.findMany({
          where: { studentId: { in: studentIds } },
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            studentId: true,
            date: true,
            timeSpent: true,
            notes: true,
          },
        })
      : [];

    const menteeNameById = new Map(
      allocations.map((allocation) => [
        allocation.studentId,
        `${allocation.student.firstName} ${allocation.student.lastName}`,
      ]),
    );

    return NextResponse.json(
      {
        profile: {
          id: mentor.id,
          fullName: `${mentor.firstName} ${mentor.lastName}`,
          email: mentor.email,
          createdAt: mentor.createdAt,
        },
        projects: projectLinks.map((link) => link.project.name),
        menteeCount: studentIds.length,
        tasks: activities.map((activity) => ({
          id: activity.id,
          taskName: extractTaskName(activity.notes),
          date: activity.date,
          hours: activity.timeSpent ?? 0,
          menteeName: menteeNameById.get(activity.studentId) ?? "-",
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching mentor detail:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
