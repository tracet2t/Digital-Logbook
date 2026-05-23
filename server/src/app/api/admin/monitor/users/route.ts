import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getReviewStatus } from "@/lib/monitor/review-status";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        batchNo: true,
        createdAt: true,
        projectAllocations: {
          select: {
            project: { select: { name: true } },
          },
        },
        mentorAllocations: {
          select: {
            project: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const studentIds = users
      .filter((user) => user.role === Role.student)
      .map((user) => user.id);

    const activities = studentIds.length
      ? await prisma.activity.findMany({
          where: { studentId: { in: studentIds } },
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            studentId: true,
            createdAt: true,
            status: true,
            feedback: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { status: true },
            },
          },
        })
      : [];

    const latestActivityByStudent = new Map<string, (typeof activities)[0]>();

    for (const activity of activities) {
      if (!latestActivityByStudent.has(activity.studentId)) {
        latestActivityByStudent.set(activity.studentId, activity);
      }
    }

    const now = new Date();

    const payload = users.map((user) => {
      const studentProjects = user.projectAllocations.map(
        (allocation) => allocation.project.name,
      );
      const mentorProjects = user.mentorAllocations.map(
        (allocation) => allocation.project.name,
      );
      const assignedProjects =
        user.role === Role.student
          ? studentProjects
          : user.role === Role.mentor
            ? mentorProjects
            : [];

      const latestActivity =
        user.role === Role.student
          ? latestActivityByStudent.get(user.id)
          : null;

      const taskStatus = latestActivity
        ? getReviewStatus({
            status: latestActivity.status,
            feedbackStatus: latestActivity.feedback[0]?.status ?? null,
            createdAt: latestActivity.createdAt,
            now,
          })
        : null;

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        batchNo: user.batchNo,
        createdAt: user.createdAt,
        assignedProjects,
        taskStatus,
      };
    });

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin monitor users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
