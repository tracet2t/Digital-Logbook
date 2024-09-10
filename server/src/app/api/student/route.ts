import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";  
import getSession from "@/server_actions/getSession";

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
        const date = url.searchParams.get('date');
        const studentId = url.searchParams.get('studentId');

        const mentorActivities = await prisma.activity.findMany({
            where: {
                studentId: studentId,
                ...(date && { date: new Date(date) }),
            },
            include: {
                feedback: {
                    select: {
                        status: true, // Fetch the feedback status
                        feedbackNotes: true, // Optionally fetch feedback notes if needed
                    },
                },
            },
        });

        return NextResponse.json(mentorActivities);
    } catch (error) {
        console.error("Error fetching mentor activities:", error);
        return NextResponse.json({ message: "Error fetching mentor activities" }, { status: 500 });
    }
};
