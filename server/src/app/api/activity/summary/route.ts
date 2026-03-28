import { NextRequest, NextResponse } from "next/server";
import { ActivityRepository } from "@/repositories/activity_repository_impl";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";
const activityRepo = new ActivityRepository();

/**
 * GET /api/activity/summary?studentId=...&projectId=...
 *
 * Returns activity summary (submitted, approved, rejected, pending counts).
 * Accessible by: mentors (only for their project students), superAdmin, or the student themselves.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const projectId = searchParams.get("projectId");

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
    // This requires checking ProjectAllocation + ProjectMentor tables

    const summary = await activityRepo.getMenteeActivitySummary(
      studentId,
      projectId || undefined
    );

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
