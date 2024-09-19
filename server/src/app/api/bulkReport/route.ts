import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/server_actions/getSession'; 
import { MentorShipRepository } from '@/repositories/repositories';

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

    const url = new URL(req.url);
    const mentorId = url.searchParams.get('mentorId') || userId;

    const mentorshipRepository = new MentorShipRepository()

    const mentorWithStudents = await mentorshipRepository.getMentorWithStudents(mentorId);

    if (!mentorWithStudents.length) {
      return NextResponse.json({ message: "No students found for this mentor" }, { status: 404 });
    }

    const reports = mentorWithStudents.flatMap(mentorship => 
      mentorship.student.activities.map(activity => ({
        id: activity.id,
        generatedAt: activity.date.toISOString(),
        status: activity.feedback.length ? activity.feedback[0].status : "No Feedback",
        link: `/downloads/${activity.id}.csv`,
      }))
    );

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ message: "Error fetching activities" }, { status: 500 });
  }
};
