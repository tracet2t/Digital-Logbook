// src/api/mentorFeedback.ts
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { MentorFeedbackRepository } from "@/repositories/repositories";

const mentorFeedbackRepository = new MentorFeedbackRepository();

// GET request handler
export const GET = async (req: NextRequest) => {
  try {
    // Get the user session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.getId();
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 401 });
    }

    const url = new URL(req.url);
    const activityId = url.searchParams.get('activityId');
    const date = url.searchParams.get('date');

    if (!activityId) {
      return NextResponse.json({ message: "Activity ID is required" }, { status: 400 });
    }

    // Fetch the mentor feedback by activityId
    const mentorFeedback = await mentorFeedbackRepository.getFeedbackByActivityId(activityId, date);

    if (!mentorFeedback) {
      return NextResponse.json(null);
    }

    return NextResponse.json(mentorFeedback);
  } catch (error) {
    console.error("Error fetching mentor feedback:", error);
    return NextResponse.json({ message: "Error fetching mentor feedback" }, { status: 500 });
  }
};

// POST request handler
export const POST = async (req: NextRequest) => {
  try {
    // Get the user session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.getId();
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 401 });
    }

    const url = new URL(req.url);
    const activityId = url.searchParams.get('activityId');

    if (!activityId) {
      return NextResponse.json({ message: "Activity ID is required" }, { status: 400 });
    }

    const { review, status, mentor } = await req.json();

    // Upsert feedback using the repository
    const feedback = await mentorFeedbackRepository.upsertFeedback(activityId, mentor, review, status);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error updating the review:", error);
    return NextResponse.json({ message: "Error updating the review" }, { status: 500 });
  }
};