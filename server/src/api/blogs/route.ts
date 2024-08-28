import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create a new activity
export const POST = async (req: NextRequest) => {
    try {
        const { date, timeSpent, notes, studentId } = await req.json();

        if (!date || typeof timeSpent !== 'number' || !studentId) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        const newActivity = await prisma.activity.create({
            data: {
                date: new Date(date),
                timeSpent,
                notes: notes || null, 
                studentId,
            },
        });

        return NextResponse.json(newActivity, { status: 201 });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
};

// View the activity
export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
        }

        const activity = await prisma.activity.findUnique({
            where: { id },
        });

        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        return NextResponse.json(activity, { status: 200 });
    } catch (error) {
        console.error('Error retrieving activity:', error);
        return NextResponse.json({ error: 'Failed to retrieve activity' }, { status: 500 });
    }
};

// Edit activity
export const PUT = async (req: NextRequest) => {
    try {
        const { id, date, timeSpent, notes, studentId } = await req.json();

        if (!id || !date || typeof timeSpent !== 'number' || !studentId) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        const activity = await prisma.activity.findUnique({
            where: { id },
        });

        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        const createdAt = new Date(activity.createdAt);
        const now = new Date();
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

        if (now.getTime() - createdAt.getTime() > twoDaysInMs) {
            return NextResponse.json({ error: 'You cannot edit this task after 2 days' }, { status: 403 });
        }

        const updatedActivity = await prisma.activity.update({
            where: { id },
            data: {
                date: new Date(date),
                timeSpent,
                notes: notes || null,
            },
        });

        return NextResponse.json(updatedActivity, { status: 200 });
    } catch (error) {
        console.error('Error updating activity:', error);
        return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
    }
};

// Delete Activity
export const DELETE = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
        }

        const activity = await prisma.activity.findUnique({
            where: { id },
        });

        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        const createdAt = new Date(activity.createdAt);
        const now = new Date();
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

        if (now.getTime() - createdAt.getTime() > twoDaysInMs) {
            return NextResponse.json({ error: 'You cannot delete this task after 2 days' }, { status: 403 });
        }

        await prisma.activity.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Activity deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting activity:', error);
        return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
    }
};
