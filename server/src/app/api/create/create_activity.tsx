import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import ActivityService from '../../modules/activity_service';

const prisma = new PrismaClient();
const activityService = new ActivityService(prisma);

export default async function createActivity(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { studentId, date, timeSpent, notes } = req.body;

    try {
      const newActivity = await activityService.createActivity({
        studentId,
        date: new Date(date),
        timeSpent,
        notes,
      });

      res.status(201).json(newActivity);
    } catch (error) {
      console.error('Error creating activity:', error);
      res.status(500).json({ error: 'Failed to create activity' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
