// src/lib/bullmq.js

import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import prisma from './prisma';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null, // Explicitly set to null
});

// Define the queue
export const reportQueue = new Queue('reportQueue', { connection: redis,     defaultJobOptions: {
  attempts: 2,
  backoff: {
    type: 'exponential',
    delay: 5000,
  },
}, });

// Define the worker to process jobs in the queue
export const reportWorker = new Worker(
  'reportQueue',
  async (job) => {
    // Generate report data
    console.log(job.data.mentorId)
    const reportData = await prisma.mentorship.findMany({
      where: { mentorId: job.data.mentorId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            activities: {
              select: {
                id: true,
                date: true,
                timeSpent: true,
                notes: true,
                feedback: {
                  select: {
                    status: true,
                    feedbackNotes: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(reportData)

    // Save generated report data
    await prisma.report.update({
      where: { id: job.data.reportId },
      data: {
        reportData,
        generatedAt: new Date(),
        status: 'completed'
      },
    });

    console.log(`Report ${job.data.reportId} generated successfully.`);
  },
  { connection: redis }
);
