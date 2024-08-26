import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function createActivity(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { student_id, date, working_hours, notes } = req.body;

    try {
      const newActivity = await prisma.dailyActivity.create({
        data: {
          student_id,
          date: new Date(date),
          working_hours,
          notes
        },
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
