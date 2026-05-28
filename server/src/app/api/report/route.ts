import { UserRepository } from "@/repositories/user_repository_impl";
import getSession from "@/server_actions/getSession";
import { Activity, MentorFeedback } from "@prisma/client";
import { parse } from "json2csv";
import { NextRequest, NextResponse } from "next/server";

const userRepository = new UserRepository();

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    // Get the user session
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
    const menteeId =
      url.searchParams.get("menteeId") ?? url.searchParams.get("studentId");
    const format = url.searchParams.get("format");

    if (!menteeId) {
      return NextResponse.json(
        { message: "Mentee ID is required" },
        { status: 400 },
      );
    }

    // Fetch user activities using the repository
    const userWithActivities =
      await userRepository.getUserWithActivities(menteeId);

    if (!userWithActivities) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const activities = userWithActivities.activities.map(
      (activity: Activity & { feedback: MentorFeedback[] }) => ({
        studentName: `${userWithActivities.firstName} ${userWithActivities.lastName}`,
        date: activity.date.toISOString().split("T")[0],
        timeSpent: activity.timeSpent,
        activity: activity.notes || "No Activity",
        feedbackStatus: activity.feedback[0]?.status || "N/A",
        feedbackNotes: activity.feedback[0]?.feedbackNotes || "No Feedback",
      }),
    );

    const fields = [
      "studentName",
      "date",
      "timeSpent",
      "activity",
      "feedbackStatus",
      "feedbackNotes",
    ];

    if (format === "json") {
      return NextResponse.json({
        studentName: `${userWithActivities.firstName} ${userWithActivities.lastName}`,
        activities,
      });
    }

    const csv = parse(activities, { fields });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${userWithActivities.firstName}_${userWithActivities.lastName}_Report.csv"`,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { message: "Error generating report" },
      { status: 500 },
    );
  }
};
