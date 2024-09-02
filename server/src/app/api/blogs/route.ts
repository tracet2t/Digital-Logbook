import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";  
import { getSession } from "@/server_actions/getSession";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.getUserId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const url = new URL(req.url);
        const date = url.searchParams.get('date');

        const activities = await prisma.activity.findMany({
            where: {
                studentId: userId,
                ...(date && { date: new Date(date) })
            },
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ message: "Error fetching activities" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.getUserId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const { date, timeSpent, notes } = await req.json();

        if (!date || typeof timeSpent !== 'number' || !notes) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        const newActivity = await prisma.activity.create({
            data: {
                studentId: userId,
                date: new Date(date),
                timeSpent,
                notes,
            },
        });

        return NextResponse.json(newActivity, { status: 201 });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json({ message: "Error creating activity" }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.getUserId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const { id, timeSpent, notes } = await req.json();

        if (!id || (timeSpent === undefined && notes === undefined)) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        const updatedActivity = await prisma.activity.update({
            where: {
                id,
                studentId: userId,
            },
            data: {
                timeSpent: timeSpent !== undefined ? timeSpent : undefined,
                notes: notes !== undefined ? notes : undefined
            }
        });

        return NextResponse.json(updatedActivity, { status: 200 });
    } catch (error) {
        console.error("Error updating activity:", error);
        return NextResponse.json({ message: "Error updating activity" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.getUserId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: "Missing activity ID" }, { status: 400 });
        }

        const activity = await prisma.activity.findUnique({
            where: { id },
            select: { createdAt: true, studentId: true }
        });

        if (!activity) {
            return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

        if (activity.studentId !== userId) {
            return NextResponse.json({ message: "Not authorized to delete this activity" }, { status: 403 });
        }

        const now = new Date();
        const creationDate = new Date(activity.createdAt);
        const twoDays = 2 * 24 * 60 * 60 * 1000;

        if (now.getTime() - creationDate.getTime() > twoDays) {
            return NextResponse.json({ message: "Cannot delete activity after 2 days" }, { status: 403 });
        }

        await prisma.activity.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting activity:", error);
        return NextResponse.json({ message: "Error deleting activity" }, { status: 500 });
    }
};
