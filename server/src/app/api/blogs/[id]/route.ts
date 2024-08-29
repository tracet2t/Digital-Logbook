import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        console.log("GET REQUEST");

        // Fetch activities from the database
        const activities = await prisma.activity.findMany();

        // Return the activities in the response
        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ message: "Error fetching activities" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        console.log("POST REQUEST");

        // Parse the request body
        const { studentId, date, timeSpent, notes } = await req.json();

        // Validate input data (simple example)
        if (!studentId || !date || typeof timeSpent !== 'number') {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        // Create a new activity in the database
        const newActivity = await prisma.activity.create({
            data: {
                studentId,
                date: new Date(date), // Ensure the date is in the correct format
                timeSpent,
                notes
            }
        });

        // Return the newly created activity
        return NextResponse.json(newActivity, { status: 201 });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json({ message: "Error creating activity" }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
    try {
        console.log("PATCH REQUEST");

        // Parse the request body
        const { id, timeSpent, notes } = await req.json();

        // Validate input data
        if (!id || (typeof timeSpent !== 'number' && notes === undefined)) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        // Retrieve the activity from the database
        const activity = await prisma.activity.findUnique({
            where: { id },
            select: { createdAt: true }
        });

        if (!activity) {
            return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

        // Check if the activity is older than 2 days
        const now = new Date();
        const creationDate = new Date(activity.createdAt);
        const twoDays = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
        if (now.getTime() - creationDate.getTime() > twoDays) {
            return NextResponse.json({ message: "Cannot edit activity after 2 days" }, { status: 403 });
        }

        // Update the activity in the database
        const updatedActivity = await prisma.activity.update({
            where: { id },
            data: {
                timeSpent: timeSpent ?? undefined,
                notes: notes ?? undefined
            }
        });

        // Return the updated activity
        return NextResponse.json(updatedActivity);
    } catch (error) {
        console.error("Error updating activity:", error);
        return NextResponse.json({ message: "Error updating activity" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        console.log("DELETE REQUEST");

        // Extract the activity ID from the URL
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        // Validate input data
        if (!id) {
            return NextResponse.json({ message: "Missing activity ID" }, { status: 400 });
        }

        // Retrieve the activity from the database
        const activity = await prisma.activity.findUnique({
            where: { id },
            select: { createdAt: true }
        });

        if (!activity) {
            return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

        // Check if the activity is older than 2 days
        const now = new Date();
        const creationDate = new Date(activity.createdAt);
        const twoDays = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
        if (now.getTime() - creationDate.getTime() > twoDays) {
            return NextResponse.json({ message: "Cannot delete activity after 2 days" }, { status: 403 });
        }

        // Delete the activity from the database
        await prisma.activity.delete({
            where: { id }
        });

        // Return a success message
        return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting activity:", error);
        return NextResponse.json({ message: "Error deleting activity" }, { status: 500 });
    }
};