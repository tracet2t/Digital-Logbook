import { NextRequest, NextResponse } from "next/server";
import { ProjectRepository, ActivityRepository } from "@/repositories/repositories";
import getSession from "@/server_actions/getSession";

const projectRepository = new ProjectRepository();
const activityRepository = new ActivityRepository();

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorId = session.getId();

    const projects = await projectRepository.getProjectsByMentorId(mentorId);

    console.log(projects)

    const studentIDs = projects.flatMap((project: { students: any[]; }) =>
      project.students.map((student) => student.userID)
    );

    let recentActivities = [];
    if (studentIDs.length > 0) {
      recentActivities = await activityRepository.findActivitiesByStudentIds(studentIDs);
    }

    const numberOfProjects = projects.length;
    const numberOfStudents = new Set(studentIDs).size;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const totalActivitiesThisWeek = recentActivities.filter((activity: { createdAt: string | number | Date; }) => {
      const createdAt = new Date(activity.createdAt);
      return createdAt >= weekAgo;
    }).length;

    // 5. Return everything
    return NextResponse.json({
      projects,
      recentActivities,
      stats: {
        numberOfProjects,
        numberOfStudents,
        totalActivitiesThisWeek,
      },
    });

  } catch (error) {
    console.error("Error fetching mentor dashboard data:", error);
    return NextResponse.json({ message: "Error fetching mentor dashboard data" }, { status: 500 });
  }
};
