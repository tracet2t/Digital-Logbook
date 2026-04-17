import { WarningStatusRepository } from "@/repositories/warningStatus_repository_impl";
import getSession from "@/server_actions/getSession";
import { WarningCategory } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const VALID_WARNING_CATEGORIES = Object.values(WarningCategory);

const warningStatusRepository = new WarningStatusRepository();

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { message: "studentId query param is required" },
        { status: 400 },
      );
    }

    const warnings =
      await warningStatusRepository.getWarningsByStudentId(studentId);

    return NextResponse.json(warnings, { status: 200 });
  } catch (error) {
    console.error("Error fetching warning statuses:", error);
    return NextResponse.json(
      { message: "Error fetching warning statuses" },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== "mentor") {
      return NextResponse.json(
        { message: "Forbidden: Only mentors can create warnings" },
        { status: 403 },
      );
    }

    const { studentId, comment, warningType } = await req.json();

    if (!studentId || !comment) {
      return NextResponse.json(
        { message: "studentId and comment are required" },
        { status: 400 },
      );
    }

    // Validate warningType against the enum if provided
    const resolvedWarningType =
      warningType && VALID_WARNING_CATEGORIES.includes(warningType)
        ? (warningType as WarningCategory)
        : null;

    const warning = await warningStatusRepository.createWarningStatus({
      studentId,
      comment,
      warningType: resolvedWarningType,
    });

    return NextResponse.json(warning, { status: 201 });
  } catch (error) {
    console.error("Error creating warning status:", error);
    return NextResponse.json(
      { message: "Error creating warning status" },
      { status: 500 },
    );
  }
};
