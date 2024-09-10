import { NextRequest, NextResponse } from "next/server";
import { reportQueue } from "@/lib/queue";
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
        reportData: {}, 
        status: 'wip'
      },
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

    // Create a new report entry in the database with default values
    const newReport = await prisma.report.findMany({
      where: {
        mentorId: session.getId(), // Assuming getUserId() returns the mentor's ID
      },
    });


    // Respond with the new report data
    return NextResponse.json(newReport);
  } catch (error) {
    console.error("Error starting report generation:", error);
    return NextResponse.json({ message: "Error starting report generation" }, { status: 500 });
  }
};
