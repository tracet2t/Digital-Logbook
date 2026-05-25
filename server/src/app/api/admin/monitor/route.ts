import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { addDays, getDateLabel, startOfDay } from "@/lib/monitor/date-format";
import { getReviewStatus } from "@/lib/monitor/review-status";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CRITICAL_MISSED_THRESHOLD = 3;
const CRITICAL_MISSED_RATE = 0.5;
const BEHIND_PENDING_RATE = 0.4;

const calculateRate = (reviewed: number, total: number) =>
  total === 0 ? 0 : Math.round((reviewed / total) * 100);

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrowStart = addDays(todayStart, 1);
    const yesterdayStart = addDays(todayStart, -1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      mentorCount,
      menteeCount,
      mentorsThisMonth,
      mentorsPrevMonth,
      menteesThisMonth,
      menteesPrevMonth,
      submissionsToday,
      submissionsYesterday,
      totalSubmissions,
      mentors,
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.mentor } }),
      prisma.user.count({ where: { role: Role.student } }),
      prisma.user.count({
        where: {
          role: Role.mentor,
          createdAt: { gte: monthStart, lt: nextMonthStart },
        },
      }),
      prisma.user.count({
        where: {
          role: Role.mentor,
          createdAt: { gte: prevMonthStart, lt: monthStart },
        },
      }),
      prisma.user.count({
        where: {
          role: Role.student,
          createdAt: { gte: monthStart, lt: nextMonthStart },
        },
      }),
      prisma.user.count({
        where: {
          role: Role.student,
          createdAt: { gte: prevMonthStart, lt: monthStart },
        },
      }),
      prisma.activity.count({
        where: { date: { gte: todayStart, lt: tomorrowStart } },
      }),
      prisma.activity.count({
        where: { date: { gte: yesterdayStart, lt: todayStart } },
      }),
      prisma.activity.count(),
      prisma.user.findMany({
        where: { role: Role.mentor },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          mentorAllocations: {
            select: {
              projectId: true,
              project: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    const mentorDelta = mentorsThisMonth - mentorsPrevMonth;
    const menteeDelta = menteesThisMonth - menteesPrevMonth;

    const submissionsDelta = submissionsToday - submissionsYesterday;
    const previousSubmissionsTotal = Math.max(
      0,
      totalSubmissions - submissionsToday,
    );

    const projectIds = Array.from(
      new Set(
        mentors.flatMap((mentor) =>
          mentor.mentorAllocations.map((allocation) => allocation.projectId),
        ),
      ),
    );

    const projectAllocations = projectIds.length
      ? await prisma.projectAllocation.findMany({
          where: { projectId: { in: projectIds } },
          select: {
            projectId: true,
            studentId: true,
            student: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        })
      : [];

    const studentIds = Array.from(
      new Set(projectAllocations.map((allocation) => allocation.studentId)),
    );

    const activities = studentIds.length
      ? await prisma.activity.findMany({
          where: { studentId: { in: studentIds } },
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
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
        })
      : [];

    const latestActivityByStudent = new Map<string, (typeof activities)[0]>();

    for (const activity of activities) {
      if (!latestActivityByStudent.has(activity.studentId)) {
        latestActivityByStudent.set(activity.studentId, activity);
      }
    }

    const studentsByProject = new Map<string, { id: string; name: string }[]>();

    for (const allocation of projectAllocations) {
      const list = studentsByProject.get(allocation.projectId) ?? [];
      list.push({
        id: allocation.studentId,
        name: `${allocation.student.firstName} ${allocation.student.lastName}`,
      });
      studentsByProject.set(allocation.projectId, list);
    }

    const mentorCards = mentors.map((mentor) => {
      const projectNames = Array.from(
        new Set(
          mentor.mentorAllocations.map((allocation) => allocation.project.name),
        ),
      );

      const projectLabel =
        projectNames.length === 0
          ? "No project"
          : projectNames.length === 1
            ? projectNames[0]
            : "Multiple projects";

      const menteeMap = new Map<string, { id: string; name: string }>();

      for (const allocation of mentor.mentorAllocations) {
        const students = studentsByProject.get(allocation.projectId) ?? [];
        for (const student of students) {
          menteeMap.set(student.id, student);
        }
      }

      const mentees = Array.from(menteeMap.values()).map((student) => {
        const activity = latestActivityByStudent.get(student.id);
        if (!activity) {
          return {
            id: student.id,
            name: student.name,
            status: "pending" as const,
            dateLabel: "No submissions",
            lastActivityDate: null as Date | null,
          };
        }

        const feedbackStatus = activity.feedback[0]?.status ?? null;
        const status = getReviewStatus({
          status: activity.status,
          feedbackStatus,
          createdAt: activity.createdAt,
          now,
        });

        if (status === "reviewed") {
          return {
            id: student.id,
            name: student.name,
            status: "reviewed" as const,
            dateLabel: getDateLabel(activity.date, now),
            lastActivityDate: activity.date,
          };
        }

        return {
          id: student.id,
          name: student.name,
          status,
          dateLabel: getDateLabel(activity.date, now),
          lastActivityDate: activity.date,
        };
      });

      const reviewedCount = mentees.filter(
        (m) => m.status === "reviewed",
      ).length;
      const missedCount = mentees.filter((m) => m.status === "missed").length;
      const pendingCount = mentees.filter((m) => m.status === "pending").length;
      const total = mentees.length;

      const missedRate = total === 0 ? 0 : missedCount / total;
      const pendingRate = total === 0 ? 0 : pendingCount / total;

      const mentorStatus =
        missedCount >= CRITICAL_MISSED_THRESHOLD ||
        missedRate >= CRITICAL_MISSED_RATE
          ? "critical"
          : missedCount > 0 || pendingRate >= BEHIND_PENDING_RATE
            ? "behind"
            : "onTrack";

      const sortedMentees = [...mentees].sort((a, b) => {
        const priority = { missed: 0, pending: 1, reviewed: 2 };
        const aPriority = priority[a.status];
        const bPriority = priority[b.status];

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        const aTime = a.lastActivityDate?.getTime() ?? 0;
        const bTime = b.lastActivityDate?.getTime() ?? 0;
        return bTime - aTime;
      });

      return {
        id: mentor.id,
        name: `${mentor.firstName} ${mentor.lastName}`,
        projectLabel,
        totalMentees: total,
        status: mentorStatus,
        reviewProgress: {
          reviewed: reviewedCount,
          total,
          percentage: calculateRate(reviewedCount, total),
        },
        missedCount,
        mentees: sortedMentees,
      };
    });

    return NextResponse.json({
      stats: {
        mentors: { value: mentorCount, delta: mentorDelta },
        mentees: { value: menteeCount, delta: menteeDelta },
        submissionsToday: {
          value: submissionsToday,
          delta: submissionsDelta,
          previousTotal: previousSubmissionsTotal,
        },
      },
      mentors: mentorCards,
    });
  } catch (error) {
    console.error("Error fetching admin monitor data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
