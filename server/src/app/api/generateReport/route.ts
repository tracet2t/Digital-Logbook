// src/api/reports.ts
import { NextRequest, NextResponse } from "next/server";
import { reportQueue } from "@/lib/queue";
import { ReportRepository } from "@/repositories/repositories";
import getSession from "@/server_actions/getSession";

const reportRepository = new ReportRepository();

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.getId();
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 401 });
    }

    const newReport = await reportRepository.create({
      mentorId: userId,
      reportData: {}, 
      status: 'wip',
      generatedAt: new Date(), // Add the generatedAt field here
    });

    console.log("Creating job with data:", { mentorId: userId, reportId: newReport.id });

    await reportQueue.add('reportJob', {
      mentorId: userId,
      reportId: newReport.id,
    });

    // Respond with the new report data
    return NextResponse.json({ reportId: newReport.id });
  } catch (error) {
    console.error("Error starting report generation:", error);
    return NextResponse.json({ message: "Error starting report generation" }, { status: 500 });
  }
};

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

    // Retrieve all reports for the mentor using the repository
    const reports = await reportRepository.getAll({
      where: {
        mentorId: userId
      }
    });

    // Respond with the report data
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ message: "Error fetching reports" }, { status: 500 });
  }
};
