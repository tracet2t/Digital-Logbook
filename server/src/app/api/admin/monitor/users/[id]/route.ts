import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const extractTaskName = (notes?: string | null) => {
  const firstLine = notes?.split(/\r?\n/)[0]?.trim();
  return firstLine && firstLine.length > 0 ? firstLine : "Untitled Task";
};

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

    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ message: "Missing user id" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        batchNo: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === Role.student) {
      const activities = await prisma.activity.findMany({
        where: { studentId: user.id },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          date: true,
          timeSpent: true,
          notes: true,
        },
      });

      return NextResponse.json(
        {
          profile: {
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            batchNo: user.batchNo,
            createdAt: user.createdAt,
          },
          tasks: activities.map((activity) => ({
            id: activity.id,
            taskName: extractTaskName(activity.notes),
            date: activity.date,
            hours: activity.timeSpent ?? 0,
          })),
        },
        { status: 200 },
      );
    }

    if (user.role === Role.mentor) {
      const mentorProjects = await prisma.projectMentor.findMany({
        where: { mentorId: user.id },
        select: { projectId: true },
      });

      const projectIds = mentorProjects.map((project) => project.projectId);

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
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            batchNo: user.batchNo,
            createdAt: user.createdAt,
          },
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
    }

    return NextResponse.json(
      {
        profile: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          batchNo: user.batchNo,
          createdAt: user.createdAt,
        },
        tasks: [],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching admin user detail:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
