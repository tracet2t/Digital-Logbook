// src/api/mentorships.ts
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { MentorshipRepository } from "@/repositories/repositories";
import { Mentorship, User } from '@prisma/client';

const mentorshipRepository = new MentorshipRepository();

export const dynamic = 'force-dynamic';


export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorId = session.getId(); // Assuming getId() fetches the mentor's ID.
    if (!mentorId) {
      return NextResponse.json({ message: "Mentor ID not found" }, { status: 401 });
    }

    // Fetch mentorships using the repository
    const mentorships = await mentorshipRepository.getMentorshipsByMentorId(mentorId);

    // Ensure type for mentorships and student
    const students = mentorships.map((mentorship: Mentorship & { student: User }) => mentorship.student);

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "Error fetching students" }, { status: 500 });
  }
};
