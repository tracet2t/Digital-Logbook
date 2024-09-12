// src/api/mentorships.ts
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { MentorshipRepository } from "@/repositories/repositories";

const mentorshipRepository = new MentorshipRepository();

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

    // Extract students from the mentorship relations
    const students = mentorships.map((mentorship) => mentorship.student);

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "Error fetching students" }, { status: 500 });
  }
};