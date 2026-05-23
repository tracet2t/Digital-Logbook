import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { formatShortDate } from "@/lib/monitor/date-format";
import { getReviewStatus } from "@/lib/monitor/review-status";
import { extractTaskName } from "@/lib/monitor/task-format";
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

    const mentees = await prisma.user.findMany({
      where: { role: Role.student },
      orderBy: { createdAt: "desc" },
      select: { id: true, firstName: true, lastName: true },
    });

    if (mentees.length === 0) {
      return NextResponse.json({ mentees: [] }, { status: 200 });
    }

    const studentIds = mentees.map((mentee) => mentee.id);

    const activities = await prisma.activity.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        studentId: true,
        date: true,
        createdAt: true,
        timeSpent: true,
        notes: true,
        status: true,
        feedback: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    const activitiesByStudent = new Map<string, typeof activities>();

    for (const activity of activities) {
      const list = activitiesByStudent.get(activity.studentId) ?? [];
      list.push(activity);
      activitiesByStudent.set(activity.studentId, list);
    }

    const now = new Date();

    const response = mentees.map((mentee) => {
      const menteeActivities = activitiesByStudent.get(mentee.id) ?? [];
      const totalHours = menteeActivities.reduce(
        (sum, activity) => sum + (activity.timeSpent ?? 0),
        0,
      );

      const latestActivity = menteeActivities[0];
      const taskStatus = latestActivity
        ? getReviewStatus({
            status: latestActivity.status,
            feedbackStatus: latestActivity.feedback[0]?.status ?? null,
            createdAt: latestActivity.createdAt,
            now,
          })
        : null;

      const tasks = menteeActivities.slice(0, 5).map((activity) => ({
        id: activity.id,
        name: extractTaskName(activity.notes),
        dateLabel: formatShortDate(activity.date),
        hours: activity.timeSpent ?? 0,
      }));

      return {
        id: mentee.id,
        name: `${mentee.firstName} ${mentee.lastName}`,
        totalHours: Math.round(totalHours * 10) / 10,
        tasks,
        taskStatus,
      };
    });

    return NextResponse.json({ mentees: response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin monitor mentees:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
