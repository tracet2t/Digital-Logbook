
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { activityId } = req.query; 

  if (req.method === 'GET') {
    try {
      const mentorActivity = await prisma.mentorActivity.findUnique({
        where: { id: String(activityId) },  
        include: {
          mentor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!mentorActivity) {
        return res.status(404).json({ error: 'Mentor activity not found' });
      }

      res.status(200).json(mentorActivity);
    } catch (error) {
      res.status(500).json({ error: 'Error while fetching mentor activity.' });
    }
  } else if (req.method === 'POST') {
    const { review } = req.body;

    try {
      const updatedActivity = await prisma.mentorActivity.update({
        where: { id: String(activityId) }, 
        data: {
          activities: review,
        },
      });

      res.status(200).json(updatedActivity);
    } catch (error) {
      res.status(500).json({ error: 'Error while updating the review.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
