import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";  
import { getSession } from "@/server_actions/getSession";


export const GET = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const mentorId = session.getUserId(); 
        if (!mentorId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const url = new URL(req.url);
        const date = url.searchParams.get('date');

        const activities = await prisma.mentorActivity.findMany({
            where: {
                mentorId,
                ...(date && { date: new Date(date) })
            },
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching mentor activities:", error);
        return NextResponse.json({ message: "Error fetching mentor activities" }, { status: 500 });
    }
};


export const POST = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const mentorId = session.getUserId();
        if (!mentorId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const { date, workingHours, activities } = await req.json();

        if (!date || typeof workingHours !== 'number' || !activities) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        const newMentorActivity = await prisma.mentorActivity.create({
            data: {
                mentorId,
                date: new Date(date),
                workingHours,
                activities,
            },
        });

        return NextResponse.json(newMentorActivity, { status: 201 });
    } catch (error) {
        console.error("Error creating mentor activity:", error);
        return NextResponse.json({ message: "Error creating mentor activity" }, { status: 500 });
    }
};


export const PATCH = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const mentorId = session.getUserId(); 
        if (!mentorId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const { id, workingHours, activities } = await req.json();

        if (!id || (workingHours === undefined && activities === undefined)) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        const updatedMentorActivity = await prisma.mentorActivity.update({
            where: {
                id,
            },
            data: {
                workingHours: workingHours !== undefined ? workingHours : undefined,
                activities: activities !== undefined ? activities : undefined
            }
        });

        return NextResponse.json(updatedMentorActivity, { status: 200 });
    } catch (error) {
        console.error("Error updating mentor activity:", error);
        return NextResponse.json({ message: "Error updating mentor activity" }, { status: 500 });
    }
};


export const DELETE = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const mentorId = session.getUserId(); 
        if (!mentorId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: "Missing activity ID" }, { status: 400 });
        }

        const mentorActivity = await prisma.mentorActivity.findUnique({
            where: { id },
            select: { createdAt: true, mentorId: true }
        });

        if (!mentorActivity) {
            return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

        if (mentorActivity.mentorId !== mentorId) {
            return NextResponse.json({ message: "Not authorized to delete this activity" }, { status: 403 });
        }

        const now = new Date();
        const creationDate = new Date(mentorActivity.createdAt);
        const twoDays = 2 * 24 * 60 * 60 * 1000;

        if (now.getTime() - creationDate.getTime() > twoDays) {
            return NextResponse.json({ message: "Cannot delete activity after 2 days" }, { status: 403 });
        }

        await prisma.mentorActivity.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting mentor activity:", error);
        return NextResponse.json({ message: "Error deleting mentor activity" }, { status: 500 });
    }
};
