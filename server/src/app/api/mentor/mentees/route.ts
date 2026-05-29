import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorId = session.getId();
    if (!mentorId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";

    // ── Step 1: mentor's project links ─────────────────────────────────────
    const mentorProjectLinks = await prisma.projectMentor.findMany({
      where: { mentorId },
      select: { projectId: true },
    });
    const projectIds = mentorProjectLinks.map((p) => p.projectId);

    if (projectIds.length === 0) {
      return NextResponse.json({
        summary: {
          archiveTotal: 0,
          activeProjects: 0,
          avgCompletionHours: 0,
          pendingReviews: 0,
        },
        rows: [],
        total: 0,
      });
    }

    // ── Step 2: project name lookup ─────────────────────────────────────────
    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      select: { id: true, name: true },
    });
    const projectNameById = new Map(projects.map((p) => [p.id, p.name]));

    // ── Step 3: allocations (flat — no nested includes) ─────────────────────
    const allocations = await prisma.projectAllocation.findMany({
      where: { projectId: { in: projectIds } },
      select: { studentId: true, projectId: true, timeAllocationStatus: true },
      orderBy: { assignedAt: "desc" },
    });

    const studentIds = Array.from(new Set(allocations.map((a) => a.studentId)));

    if (studentIds.length === 0) {
      return NextResponse.json({
        summary: {
          archiveTotal: 0,
          activeProjects: 0,
          avgCompletionHours: 0,
          pendingReviews: 0,
        },
        rows: [],
        total: 0,
      });
    }

    // ── Step 4: student basic info + badge count ────────────────────────────
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isActive: true,
        _count: { select: { badges: true } },
      },
    });
    const studentById = new Map(students.map((s) => [s.id, s]));

    // ── Step 5 & 6: activity time totals per student & pending reviews ──────
    const activityRows = await prisma.activity.findMany({
      where: { studentId: { in: studentIds } },
      select: {
        studentId: true,
        timeSpent: true,
        status: true,
        feedback: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    const minutesById = new Map<string, number>();
    let pendingReviews = 0;

    for (const a of activityRows) {
      let activityStatus = a.status ?? "pending";
      if (a.feedback && a.feedback.length > 0) {
        activityStatus = a.feedback[0].status as any;
      }

      const normalizedStatus =
        activityStatus === "accepted" ? "approved" : activityStatus;

      // Determine if the student's project allocation has been accepted overall
      const acceptedStudentIds = new Set(
        allocations
          .filter((a) => a.timeAllocationStatus === "accepted")
          .map((a) => a.studentId),
      );

      if (
        normalizedStatus === "approved" &&
        acceptedStudentIds.has(a.studentId)
      ) {
        minutesById.set(
          a.studentId,
          (minutesById.get(a.studentId) ?? 0) + a.timeSpent,
        );
      } else if (normalizedStatus === "pending") {
        pendingReviews++;
      }
    }

    // ── Step 7: build response rows ─────────────────────────────────────────
    const rows = allocations.map((alloc) => {
      const student = studentById.get(alloc.studentId);
      const totalMinutes = minutesById.get(alloc.studentId) ?? 0;
      return {
        id: alloc.studentId,
        name: student
          ? `${student.firstName} ${student.lastName}`
          : alloc.studentId,
        projectId: alloc.projectId,
        projectName: projectNameById.get(alloc.projectId) ?? alloc.projectId,
        workingHours: totalMinutes,
        badgeCount: student?._count.badges ?? 0,
        isActive: student?.isActive ?? false,
      };
    });

    const filtered = search
      ? rows.filter(
          (r) =>
            r.name.toLowerCase().includes(search) ||
            r.projectName.toLowerCase().includes(search),
        )
      : rows;

    // ── Summary stats ────────────────────────────────────────────────────────
    const activeMenteeCount = students.filter((s) => s.isActive).length;
    const totalHours = Array.from(minutesById.values()).reduce(
      (sum: number, m: number) => sum + m,
      0,
    );
    const avgCompletionHours =
      studentIds.length === 0 ? 0 : Math.round(totalHours / studentIds.length);

    return NextResponse.json({
      summary: {
        archiveTotal: studentIds.length,
        activeProjects: activeMenteeCount,
        avgCompletionHours,
        pendingReviews,
      },
      rows: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Error fetching mentor mentees:", error);
    return NextResponse.json(
      { message: "Error fetching mentor mentees" },
      { status: 500 },
    );
  }
};
