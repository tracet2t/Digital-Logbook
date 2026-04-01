import { NextRequest, NextResponse } from "next/server";
import { MentorFeedbackRepository } from "@/repositories/mentor_feedback_repository_impl";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";
const feedbackRepo = new MentorFeedbackRepository();

/**
 * GET /api/feedback/history?studentId=...
 *
 * Returns all feedback records for a mentee across all projects.
 * Accessible by: mentors (only for their students), superAdmin, or the student themselves.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId query param required" },
        { status: 400 }
      );
    }

    // Auth check: only superAdmin, the student themselves, or their mentors can view
    const userId = session.getId();
    const role = session.getRole();

    if (
      role !== "superAdmin" &&
      userId !== studentId &&
      role !== "mentor"
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // TODO: For mentors, verify studentId is in their project(s)

    const history = await feedbackRepo.getMenteeFeedbackHistory(studentId);

    return NextResponse.json(
      { studentId, feedbackCount: history.length, feedback: history },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
