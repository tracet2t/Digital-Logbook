import { PrismaClient } from '@prisma/client';

class ActivityService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createActivity(data: { studentId: string; date: Date; timeSpent: number; notes?: string }) {
    return this.db.activity.create({
      data,
    });
  }

  async getActivityById(id: string) {
    return this.db.activity.findUnique({
      where: { id },
    });
  }

  async updateActivity(id: string, data: { date?: Date; timeSpent?: number; notes?: string }) {
    try {
      if (!(await this.isEligibleForEditOrDelete(id))) {
        throw new Error('Activity cannot be edited or deleted as it is past the allowed timeframe.');
      }
  
      return this.db.activity.update({
        where: { id },
        data,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }
  

  async deleteActivity(id: string) {
    try {
      if (!(await this.isEligibleForEditOrDelete(id))) {
        throw new Error('Activity cannot be edited or deleted as it is past the allowed timeframe.');
      }
  
      return this.db.activity.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }
  

  public async isEligibleForEditOrDelete(id: string): Promise<boolean> {
    const activity = await this.db.activity.findUnique({ where: { id } });
    if (!activity) throw new Error('Activity not found');

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return activity.createdAt > twoDaysAgo;
  }
}

export default ActivityService;
