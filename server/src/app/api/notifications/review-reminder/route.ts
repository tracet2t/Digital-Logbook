import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendReviewReminderNotification } from "@/lib/emailNotifications";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const reminderSchema = z.object({
  mentorId: z.string().min(1, "mentorId is required"),
});

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const MISSED_REVIEW_DAYS = 2;

const getDateLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const hasReview = (status?: string | null, feedbackStatus?: string | null) => {
  const normalizedStatus = status?.toLowerCase() ?? "";
  const normalizedFeedback = feedbackStatus?.toLowerCase() ?? "";

  if (normalizedFeedback === "approved" || normalizedFeedback === "rejected") {
    return true;
  }

  return normalizedStatus === "accepted" || normalizedStatus === "rejected";
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const payload = reminderSchema.safeParse(await req.json());
    if (!payload.success) {
      return NextResponse.json(
        { message: payload.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const mentor = await prisma.user.findUnique({
      where: { id: payload.data.mentorId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!mentor) {
      return NextResponse.json(
        { message: "Mentor not found" },
        { status: 404 },
      );
    }

    const mentorProjects = await prisma.projectMentor.findMany({
      where: { mentorId: mentor.id },
      select: { projectId: true },
    });

    const projectIds = mentorProjects.map((project) => project.projectId);

    if (projectIds.length === 0) {
      return NextResponse.json(
        { message: "No projects assigned" },
        { status: 200 },
      );
    }

    const allocations = await prisma.projectAllocation.findMany({
      where: { projectId: { in: projectIds } },
      select: {
        studentId: true,
        student: { select: { firstName: true, lastName: true } },
      },
    });

    const studentIds = Array.from(
      new Set(allocations.map((allocation) => allocation.studentId)),
    );

    if (studentIds.length === 0) {
      return NextResponse.json(
        { message: "No mentees assigned" },
        { status: 200 },
      );
    }

    const activities = await prisma.activity.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      select: {
        studentId: true,
        date: true,
        createdAt: true,
        status: true,
        feedback: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    const latestActivityByStudent = new Map<string, (typeof activities)[0]>();

    for (const activity of activities) {
      if (!latestActivityByStudent.has(activity.studentId)) {
        latestActivityByStudent.set(activity.studentId, activity);
      }
    }

    const todayStart = startOfDay(new Date());
    const missedCutoff = addDays(todayStart, -MISSED_REVIEW_DAYS);

    const pendingItems = allocations
      .map((allocation) => {
        const studentName = `${allocation.student.firstName} ${allocation.student.lastName}`;
        const activity = latestActivityByStudent.get(allocation.studentId);

        if (!activity) {
          return null;
        }

        const feedbackStatus = activity.feedback[0]?.status ?? null;
        const reviewed = hasReview(activity.status, feedbackStatus);

        if (reviewed) {
          return null;
        }

        const isMissed = activity.createdAt < missedCutoff;

        return {
          studentName,
          status: isMissed ? "Missed" : "Pending",
          dateLabel: getDateLabel(activity.date),
        };
      })
      .filter(Boolean) as Array<{
      studentName: string;
      status: "Missed" | "Pending";
      dateLabel: string;
    }>;

    if (pendingItems.length === 0) {
      return NextResponse.json(
        { message: "No pending reviews" },
        { status: 200 },
      );
    }

    await sendReviewReminderNotification({
      mentorEmail: mentor.email,
      mentorName: `${mentor.firstName} ${mentor.lastName}`,
      items: pendingItems,
    });

    return NextResponse.json({ message: "Reminder sent" }, { status: 200 });
  } catch (error) {
    console.error("Error sending review reminder:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
