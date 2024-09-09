import { Queue } from 'bullmq';

const reportQueue = new Queue('bulk-report-queue');

export const addReportToQueue = async (mentorId: string, reportId: string) => {
  const job = await reportQueue.add('generate-bulk-report', { mentorId, reportId });
  return job.id;
};
