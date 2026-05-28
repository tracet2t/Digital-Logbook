// src/api/reports.ts
import { ReportRepository } from "@/repositories/report_repository_impl";
import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { reportQueue } from "@/lib/queue";

const reportRepository = new ReportRepository();

export const dynamic = "force-dynamic";

export const POST = async (_req: NextRequest) => {
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

    const newReport = await reportRepository.create({
      mentorId: userId,
      reportData: {},
      status: "wip",
      generatedAt: new Date(), // Add the generatedAt field here
    });

    console.log("Creating job with data:", {
      mentorId: userId,
      reportId: newReport.id,
    });

    await reportQueue.add("reportJob", {
      mentorId: userId,
      reportId: newReport.id,
    });

    // Respond with the new report data
    return NextResponse.json({ reportId: newReport.id });
  } catch (error) {
    console.error("Error starting report generation:", error);
    return NextResponse.json(
      { message: "Error starting report generation" },
      { status: 500 },
    );
  }
};

export const GET = async (_req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.getId();
    const userRole = session.getRole();

    if (!userId || !userRole) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 401 },
      );
    }

    if (userRole !== Role.mentor && userRole !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const reports = await reportRepository.getAll({
      where:
        userRole === Role.superAdmin
          ? {}
          : {
              mentorId: userId,
            },
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        generatedAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { message: "Error fetching reports" },
      { status: 500 },
    );
  }
};
