import { NextRequest, NextResponse } from "next/server";
import { addReportToQueue } from "@/lib/queue";
import prisma from "@/lib/prisma";
import getSession from "@/server_actions/getSession";

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

    // Create a new report entry in the database with default values
    const newReport = await prisma.report.create({
      data: {
        mentorId: userId,
        reportData: {}, // Provide default or placeholder value
      },
    });

    // Add the report generation task to the queue
    const jobId = await addReportToQueue(userId, newReport.id);

    // Respond with the new report data
    return NextResponse.json({ reportId: newReport.id, jobId });
  } catch (error) {
    console.error("Error starting report generation:", error);
    return NextResponse.json({ message: "Error starting report generation" }, { status: 500 });
  }
};
