import { NextRequest, NextResponse } from "next/server";

import { ActivityRepository } from "@/repositories/activity_repository_impl";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";

const activityRepository = new ActivityRepository();

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = session.getRole();
    if (role !== "student") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const menteeId = session.getId();
    if (!menteeId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const parsedPage = pageParam ? Number(pageParam) : 1;
    const parsedPageSize = pageSizeParam ? Number(pageSizeParam) : 4;

    if (
      Number.isNaN(parsedPage) ||
      Number.isNaN(parsedPageSize) ||
      parsedPage < 1 ||
      parsedPageSize < 1
    ) {
      return NextResponse.json(
        { message: "Invalid pagination params" },
        { status: 400 },
      );
    }

    const page = Math.floor(parsedPage);
    const pageSize = Math.min(50, Math.floor(parsedPageSize));

    const dashboardData = await activityRepository.getMenteeDashboardData(
      menteeId,
      page,
      pageSize,
    );

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Error fetching mentee dashboard data:", error);

    return NextResponse.json(
      { message: "Error fetching mentee dashboard data" },
      { status: 500 },
    );
  }
}
