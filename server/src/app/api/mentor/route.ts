// src/api/mentorActivities.ts
import { NextRequest, NextResponse } from "next/server";
import { MentorRepository } from "@/repositories/repositories";
import getSession from "@/server_actions/getSession";

const mentorRepository = new MentorRepository();

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
        const dateObj = date ? new Date(date) : undefined;

        const mentorActivities = await mentorRepository.getMentorActivities(userId, dateObj);

        return NextResponse.json(mentorActivities);
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

        const userId = session.getId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const { date, workingHours, activities } = await req.json();

        if (!date || typeof workingHours !== 'number' || !activities) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        const newMentorActivity = await mentorRepository.createMentorActivity({
            mentorId: userId,
            date: new Date(date),
            workingHours,
            activities,
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

        const userId = session.getId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const { id, workingHours, activities } = await req.json();

        if (!id || (workingHours === undefined && activities === undefined)) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        const updatedMentorActivity = await mentorRepository.updateMentorActivity(id, userId, {
            workingHours,
            activities
        });

        return NextResponse.json(updatedMentorActivity, { status: 200 });
    } catch (error) {
        console.error("Error updating mentor activity:", error);
        return NextResponse.json({ message: "Error updating mentor activity" }, { status: 500 });
    }
};