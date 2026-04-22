import prisma from "@/lib/prisma";

type TaskTechnologyRecord = {
  taskId: string;
  date: Date;
  timeSpent: number;
  notes: string | null;
  technologies: string[];
};

type UpdateTaskTechnologyResult =
  | { kind: "updated"; task: TaskTechnologyRecord }
  | { kind: "not_found" }
  | { kind: "forbidden" };

export class MenteeTechnologyRepository {
  async addTechnologiesToTask(
    taskId: string,
    userId: string,
    technologies: string[],
  ): Promise<UpdateTaskTechnologyResult> {
    const task = await prisma.activity.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        studentId: true,
      },
    });

    if (!task) {
      return { kind: "not_found" };
    }

    if (task.studentId !== userId) {
      return { kind: "forbidden" };
    }

    const updatedTask = await prisma.activity.update({
      where: { id: taskId },
      data: { technologies },
      select: {
        id: true,
        date: true,
        timeSpent: true,
        notes: true,
        technologies: true,
      },
    });

    return {
      kind: "updated",
      task: {
        taskId: updatedTask.id,
        date: updatedTask.date,
        timeSpent: updatedTask.timeSpent,
        notes: updatedTask.notes,
        technologies: updatedTask.technologies,
      },
    };
  }

  async getTaskTechnologiesByStudent(userId: string): Promise<TaskTechnologyRecord[]> {
    const tasks = await prisma.activity.findMany({
      where: {
        studentId: userId,
        status: "accepted",
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        date: true,
        timeSpent: true,
        notes: true,
        technologies: true,
      },
    });

    return tasks.map((task) => ({
      taskId: task.id,
      date: task.date,
      timeSpent: task.timeSpent,
      notes: task.notes,
      technologies: task.technologies,
    }));
  }

  async getAllTechnologiesForStudent(userId: string): Promise<string[]> {
    const tasks = await this.getTaskTechnologiesByStudent(userId);

    return Array.from(
      new Set(tasks.flatMap((task) => task.technologies)),
    ).sort((left, right) => left.localeCompare(right));
  }
}

export type { TaskTechnologyRecord, UpdateTaskTechnologyResult };