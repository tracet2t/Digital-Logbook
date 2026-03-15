import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import prisma from "@/lib/prisma";
import { Activity, MentorFeedback } from "@prisma/client";

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

    const reports = assignments.flatMap((assignment) => {
      const activities = assignment.student?.activities || [];

      return activities.map((activity) => ({
        id: activity.id,
        generatedAt: activity.date.toISOString(),
        status: activity.feedback.length
          ? activity.feedback[0].status
          : "No Feedback",
        link: `/downloads/${activity.id}.csv`,
      }));
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { message: "Error fetching activities" },
      { status: 500 },
    );
  }
};
