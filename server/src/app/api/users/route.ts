// src/api/mentorships.ts
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { MentorRepository } from "@/repositories/repositories";

const mentorRepository = new MentorRepository();

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

    // Fetch students associated with the mentor
    const mentor = await mentorRepository.getMentorWithStudents(mentorId);
    if (!mentor) {
      return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
    }

    return NextResponse.json(mentor.students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "Error fetching students" }, { status: 500 });
  }
};
