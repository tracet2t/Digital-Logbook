import { NextRequest, NextResponse } from "next/server";
import { timeAllocationRepository } from "@/repositories/timeAllocationRepository";
import getSession from "@/server_actions/getSession";
import { TimeAllocationStatus } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const studentId = searchParams.get("studentId");

    if (!projectId || !studentId) {
      return NextResponse.json(
        { message: "projectId and studentId are required" },
        { status: 400 }
      );
    }

    const details = await timeAllocationRepository.getTimeAllocationDetails(
      projectId,
      studentId
    );

    return NextResponse.json(details, { status: 200 });
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, studentId, status } = body;

    if (!projectId || !studentId || !status) {
      return NextResponse.json(
        { message: "projectId, studentId, and status are required" },
        { status: 400 }
      );
    }

    const validStatuses: TimeAllocationStatus[] = ["inReview", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value provided" },
        { status: 400 }
      );
    }

    const updated = await timeAllocationRepository.updateAllocationStatus(
      projectId,
      studentId,
      status as TimeAllocationStatus
    );

    return NextResponse.json(
      { message: "Status updated successfully", status: updated.timeAllocationStatus },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
};
