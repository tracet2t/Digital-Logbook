import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { parse } from 'json2csv';
import { UserRepository } from "@/repositories/repositories";
import { Activity, MentorFeedback } from '@prisma/client'; 



const userRepository = new UserRepository();

export const dynamic = 'force-dynamic';


export const GET = async (req: NextRequest) => {
    try {
        // Get the user session
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.getId();

        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const url = new URL(req.url);
        const studentId = url.searchParams.get('studentId');

        if (!studentId) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }

        // Fetch user activities using the repository
        const userWithActivities = await userRepository.getUserWithActivities(studentId);

        if (!userWithActivities) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }


        
        const activities = userWithActivities.activities.map((activity: Activity & { feedback: MentorFeedback[] }) => ({
            studentName: `${userWithActivities.firstName} ${userWithActivities.lastName}`,
            date: activity.date.toISOString().split('T')[0],
            timeSpent: activity.timeSpent,
            activity: activity.notes || 'No Activity',
            feedbackStatus: activity.feedback[0]?.status || "N/A",
            feedbackNotes: activity.feedback[0]?.feedbackNotes || "No Feedback"
        }));

        const fields = ['studentName', 'date', 'timeSpent', 'activity', 'feedbackStatus', 'feedbackNotes'];

        const csv = parse(activities, { fields });

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${userWithActivities.firstName}_${userWithActivities.lastName}_Report.csv"`,
            },
        });
    } catch (error) {
        console.error("Error generating report:", error);
        return NextResponse.json({ message: "Error generating report" }, { status: 500 });
    }
};
