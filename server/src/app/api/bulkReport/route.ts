import getSession from "@/server_actions/getSession";
import { parse } from "json2csv";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.getId();
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const mentorId = url.searchParams.get("mentorId") || userId;
    const format = url.searchParams.get("format");

    // Fetch students via project assignments for this mentor's projects
    const projects = await prisma.project.findMany({
      where: { mentors: { some: { mentorId } } },
      include: {
        assignments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                activities: {
                  select: {
                    id: true,
                    date: true,
                    timeSpent: true,
                    notes: true,
                    feedback: {
                      select: {
                        status: true,
                        feedbackNotes: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const assignments = projects.flatMap((p) => p.assignments);

    if (!assignments.length) {
      return NextResponse.json(
        { message: "No students found for this mentor" },
        { status: 404 },
      );
    }

    const rows = assignments.flatMap((assignment) => {
      const student = assignment.student;
      const activities = student?.activities || [];
      return activities.map((activity) => ({
        studentId: student?.id ?? "",
        studentFirstName: student?.firstName ?? "",
        studentLastName: student?.lastName ?? "",
        activityId: activity.id,
        activityDate: new Date(activity.date).toLocaleDateString(),
        timeSpent: activity.timeSpent,
        notes: activity.notes ?? "",
        feedbackStatus: activity.feedback.length
          ? activity.feedback[0].status
          : "No Feedback",
        feedbackNotes: activity.feedback.length
          ? (activity.feedback[0].feedbackNotes ?? "")
          : "",
      }));
    });

    if (format === "csv") {
      const fields = [
        "studentId",
        "studentFirstName",
        "studentLastName",
        "activityId",
        "activityDate",
        "timeSpent",
        "notes",
        "feedbackStatus",
        "feedbackNotes",
      ];
      const csv = parse(rows, { fields });
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="mentee_bulk_report_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Default JSON response (legacy)
    const reports = rows.map((r) => ({
      id: r.activityId,
      generatedAt: r.activityDate,
      status: r.feedbackStatus,
      link: `/downloads/${r.activityId}.csv`,
    }));

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { message: "Error fetching activities" },
      { status: 500 },
    );
  }
};
