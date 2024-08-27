// pages/api/activities/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import ActivityService from '../../modules/activity_service';

const prisma = new PrismaClient();
const activityService = new ActivityService(prisma);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const activity = await activityService.getActivityById(id as string);
      if (activity) {
        res.status(200).json(activity);
      } else {
        res.status(404).json({ error: 'Activity not found' });
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
