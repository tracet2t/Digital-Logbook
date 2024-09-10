// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";  
// import getSession from "@/server_actions/getSession";

// export const GET = async (req: NextRequest) => {
//     try {
//         const session = await getSession();
//         const mentorId =session.getId()
//         if (!session) {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
        
//         const userId = session.getId();
//         if (!userId) {
//             return NextResponse.json({ message: "User ID not found" }, { status: 401 });
//         }

//         const url = new URL(req.url);
       
//         const activities = await prisma.user.findMany({ });

//         return NextResponse.json(activities);
//     } catch (error) {
//         console.error("Error fetching activities:", error);
//         return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
//     }
// };


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getSession from "@/server_actions/getSession";

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

    // Retrieve mentorship relations where the logged-in user is the mentor
    const mentorships = await prisma.mentorship.findMany({
      where: { mentorId: mentorId },
      include: {
        student: true, // This will fetch the student details associated with each mentorship
      },
    });

    // Extract students from the mentorship relations
    const students = mentorships.map((mentorship) => mentorship.student);

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "Error fetching students" }, { status: 500 });
  }
};
