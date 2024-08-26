import { PrismaClient } from "@prisma/client";

class TaskService {
  private db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  async createTask(data: { student_id: number; date: Date; working_hours: number; notes?: string }) {
    return this.db.dailyActivity.create({
      data: {
        student_id: data.student_id,
        date: data.date,
        working_hours: data.working_hours,
        notes: data.notes,
      },
    });
  }
}

export default TaskService;
