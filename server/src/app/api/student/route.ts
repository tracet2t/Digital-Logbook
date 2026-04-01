// src/api/activities.ts
import { ActivityRepository } from "@/repositories/activity_repository_impl";
import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const activityRepository = new ActivityRepository();

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
    const date = url.searchParams.get("date");
    const studentId = url.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 },
      );
    }

    // Fetch mentor activities using the repository
    const mentorActivities = await activityRepository.getStudentFeedbacks(
      studentId,
      date || undefined,
    );

    return NextResponse.json(mentorActivities);
  } catch (error) {
    console.error("Error fetching mentor activities:", error);
    return NextResponse.json(
      { message: "Error fetching mentor activities" },
      { status: 500 },
    );
  }
};

// PATCH: Mentor updates student task status (accept/reject/pending)
export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const role = session.getRole?.() || session.role;
    if (role !== "mentor" && role !== "superAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const { id, status } = await req.json();
    if (!id || !["accepted", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    const updated = await activityRepository.updateActivityStatus(id, status);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating activity status:", error);
    return NextResponse.json(
      { message: "Error updating activity status" },
      { status: 500 },
    );
  }
};
