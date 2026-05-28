import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ActivityRepository } from "@/repositories/activity_repository_impl";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";

const activityRepository = new ActivityRepository();

const technologyItemSchema = z
  .string({ invalid_type_error: "Each technology must be a string" })
  .trim()
  .min(1, "Technology names cannot be empty")
  .max(64, "Technology names cannot exceed 64 characters");

const technologiesSchema = z
  .array(technologyItemSchema, {
    invalid_type_error: "technologies must be an array of strings",
  })
  .max(50, "technologies cannot contain more than 50 items")
  .transform((items) => Array.from(new Set(items.map((item) => item.trim()))));

const createTaskSchema = z.object({
  date: z.string().min(1, "date is required"),
  timeSpent: z
    .number({ invalid_type_error: "timeSpent must be a number" })
    .min(0, "timeSpent must be zero or greater"),
  notes: z.string().optional().default(""),
  technologies: technologiesSchema.optional().default([]),
});

const updateTaskSchema = z
  .object({
    id: z.string().min(1, "id is required"),
    timeSpent: z
      .number({ invalid_type_error: "timeSpent must be a number" })
      .min(0, "timeSpent must be zero or greater")
      .optional(),
    notes: z.string().optional(),
    technologies: technologiesSchema.optional(),
  })
  .refine(
    (value) =>
      value.timeSpent !== undefined ||
      value.notes !== undefined ||
      value.technologies !== undefined,
    { message: "At least one field must be provided for update" },
  );

const buildValidationError = (error: z.ZodError) =>
  error.issues[0]?.message ?? "Invalid input data";

async function requireStudentSession() {
  const session = await getSession();

  if (!session?.isAuthenticated()) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.getRole() !== "student") {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { userId: session.getId() };
}

export const GET = async (req: NextRequest) => {
  try {
    const auth = await requireStudentSession();
    if (auth.error) {
      return auth.error;
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const activities = await activityRepository.findByStudentId(
      auth.userId!,
      date ? new Date(date) : undefined,
    );

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching student tasks:", error);
    return NextResponse.json(
      { message: "Error fetching student tasks" },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const auth = await requireStudentSession();
    if (auth.error) {
      return auth.error;
    }

    const payload = createTaskSchema.safeParse(await req.json());
    if (!payload.success) {
      return NextResponse.json(
        { message: buildValidationError(payload.error) },
        { status: 400 },
      );
    }

    const newActivity = await activityRepository.createActivity(
      auth.userId!,
      new Date(payload.data.date),
      payload.data.timeSpent,
      payload.data.notes,
      payload.data.technologies,
    );

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating student task:", error);
    return NextResponse.json(
      { message: "Error creating student task" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const auth = await requireStudentSession();
    if (auth.error) {
      return auth.error;
    }

    const payload = updateTaskSchema.safeParse(await req.json());
    if (!payload.success) {
      return NextResponse.json(
        { message: buildValidationError(payload.error) },
        { status: 400 },
      );
    }

    const updatedActivity = await activityRepository.updateActivity(
      payload.data.id,
      auth.userId!,
      {
        timeSpent: payload.data.timeSpent,
        notes: payload.data.notes,
        technologies: payload.data.technologies,
      },
    );

    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    console.error("Error updating student task:", error);
    return NextResponse.json(
      { message: "Error updating student task" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const auth = await requireStudentSession();
    if (auth.error) {
      return auth.error;
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing activity ID" },
        { status: 400 },
      );
    }

    const activity = await activityRepository.findActivityById(id);
    if (!activity) {
      return NextResponse.json({ message: "Activity not found" }, { status: 404 });
    }

    if (activity.studentId !== auth.userId) {
      return NextResponse.json(
        { message: "Not authorized to delete this activity" },
        { status: 403 },
      );
    }

    const now = new Date();
    const creationDate = new Date(activity.createdAt);
    const twoDays = 2 * 24 * 60 * 60 * 1000;

    if (now.getTime() - creationDate.getTime() > twoDays) {
      return NextResponse.json(
        { message: "Cannot delete activity after 2 days" },
        { status: 403 },
      );
    }

    await activityRepository.deleteActivity(id);
    return NextResponse.json(
      { message: "Activity deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting student task:", error);
    return NextResponse.json(
      { message: "Error deleting student task" },
      { status: 500 },
    );
  }
};