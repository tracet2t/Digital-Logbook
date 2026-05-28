import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { MenteeTechnologyRepository } from "@/repositories/mentee_technology_repository_impl";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";

const menteeTechnologyRepository = new MenteeTechnologyRepository();

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

const patchSchema = z.object({
  taskId: z.string().min(1, "taskId is required"),
  technologies: technologiesSchema,
});

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

export const GET = async () => {
  try {
    const auth = await requireStudentSession();
    if (auth.error) {
      return auth.error;
    }

    const [tasks, allTechnologies] = await Promise.all([
      menteeTechnologyRepository.getTaskTechnologiesByStudent(auth.userId!),
      menteeTechnologyRepository.getAllTechnologiesForStudent(auth.userId!),
    ]);

    return NextResponse.json({ tasks, allTechnologies }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task technologies:", error);
    return NextResponse.json(
      { message: "Error fetching task technologies" },
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

    const payload = patchSchema.safeParse(await req.json());
    if (!payload.success) {
      return NextResponse.json(
        { message: buildValidationError(payload.error) },
        { status: 400 },
      );
    }

    const result = await menteeTechnologyRepository.addTechnologiesToTask(
      payload.data.taskId,
      auth.userId!,
      payload.data.technologies,
    );

    if (result.kind === "not_found") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    if (result.kind === "forbidden") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json(result.task, { status: 200 });
  } catch (error) {
    console.error("Error updating task technologies:", error);
    return NextResponse.json(
      { message: "Error updating task technologies" },
      { status: 500 },
    );
  }
};