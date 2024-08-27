import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import ActivityService from '../../modules/activity_service';

const prisma = new PrismaClient();
const activityService = new ActivityService(prisma);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'PUT') {
    const { date, timeSpent, notes } = req.body;

    try {
      const updatedActivity = await activityService.updateActivity(id, {
        date: new Date(date),
        timeSpent,
        notes,
      });

      res.status(200).json(updatedActivity);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating activity:', error.message);
        res.status(403).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        res.status(500).json({ error: 'Failed to update activity' });
      }
    }
  } else if (req.method === 'DELETE') {
    try {
      await activityService.deleteActivity(id);
      res.status(204).end();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error deleting activity:', error.message);
        res.status(403).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
      }
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
