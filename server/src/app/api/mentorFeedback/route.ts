import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";  
import getSession from "@/server_actions/getSession";
import { act } from "react";

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
    console.log('---------------------------',activityId);

    if (!activityId) {
      return NextResponse.json({ message: "Activity ID is required" }, { status: 400 });
    }

    // Fetch the mentor activity by activityId
    const mentorActivity = await prisma.mentorFeedback.findFirst({
      where: { 
        activityId: String(activityId),
        // Filter by date in the related Activity model
        activity: {
          date: date ? new Date(date) : undefined,
        },
      },
    });

    if (!mentorActivity) {
      return NextResponse.json(null);
    }

    return NextResponse.json(mentorActivity);
  } catch (error) {
    console.error("Error fetching mentor activity:", error);
    return NextResponse.json({ message: "Error fetching mentor activity" }, { status: 500 });
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

    // Check if the feedback already exists
    const existingFeedback = await prisma.mentorFeedback.findFirst({
      where: {
        activityId: activityId,
        mentorId: mentor,
      },
    });

    let feedback;
    if (existingFeedback) {
      // Update the existing feedback
      feedback = await prisma.mentorFeedback.update({
        where: {
          id: existingFeedback.id,  // Find by the existing feedback ID
        },
        data: {
          feedbackNotes: review,
          status: status,
        },
      });
    } else {
      // Create new feedback
      feedback = await prisma.mentorFeedback.create({
        data: {
          activityId: activityId,
          mentorId: mentor,
          feedbackNotes: review,
          status: status,
        },
      });
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error updating the review:", error);
    return NextResponse.json({ message: "Error updating the review" }, { status: 500 });
  }
};
