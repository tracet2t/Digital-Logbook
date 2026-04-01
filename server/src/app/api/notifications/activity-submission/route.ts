import { NextRequest, NextResponse } from "next/server";
import { ProjectRepository } from "@/repositories/project_repository_impl";
import { ActivityRepository } from "@/repositories/activity_repository_impl";
import { sendActivitySubmissionNotification } from "@/lib/emailNotifications";
import getSession from "@/server_actions/getSession";
import prisma from "@/lib/prisma";

const projectRepository = new ProjectRepository();
const activityRepository = new ActivityRepository();

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { studentId, taskDate } = await req.json();

    if (!studentId || !taskDate) {
      return NextResponse.json(
        { message: "Missing studentId or taskDate" },
        { status: 400 }
      );
    }

    // Get student's projects
    const studentProjects = await prisma.projectAllocation.findMany({
      where: { studentId },
      select: { projectId: true },
    });

    if (studentProjects.length === 0) {
      console.log(`Student ${studentId} is not assigned to any project`);
      return NextResponse.json({ message: "Success" }, { status: 200 });
    }

    // Get student info
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { firstName: true, lastName: true },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    const studentName = `${student.firstName} ${student.lastName}`;

    // For each project the student is in, get mentors and send notification
    for (const allocation of studentProjects) {
      try {
        const mentorEmails = await projectRepository.getProjectMentorsEmails(
          allocation.projectId
        );

        if (mentorEmails.length > 0) {
          await sendActivitySubmissionNotification({
            mentorEmails,
            studentName,
            taskDate,
          });
        }
      } catch (error) {
        console.error(
          `Error sending notification for project ${allocation.projectId}:`,
          error
        );
        // Continue with other projects even if one fails
      }
    }

    return NextResponse.json(
      { message: "Notifications sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in activity submission notification:", error);
    // Don't return error to client - notifications are not critical
    return NextResponse.json(
      { message: "Notification processing completed" },
      { status: 200 }
    );
  }
};