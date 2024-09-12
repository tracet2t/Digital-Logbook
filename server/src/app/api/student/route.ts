// src/api/activities.ts
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { ActivityRepository } from "@/repositories/repositories";

const activityRepository = new ActivityRepository();

export const GET = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.getId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const url = new URL(req.url);
        const date = url.searchParams.get('date');
        const studentId = url.searchParams.get('studentId');

        if (!studentId) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }

        // Fetch mentor activities using the repository
        const mentorActivities = await activityRepository.getStudentFeedbacks(studentId, date || undefined);

        return NextResponse.json(mentorActivities);
    } catch (error) {
        console.error("Error fetching mentor activities:", error);
        return NextResponse.json({ message: "Error fetching mentor activities" }, { status: 500 });
    }
};