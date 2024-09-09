import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';
import prisma from '@/lib/prisma';

interface CSVData {
  studentId: string;
  studentName: string;
  activityDate: string; // Or Date if you prefer
  timeSpent: number;
  notes?: string | null; // Allow notes to be string or null
}

export const generateCSVReport = async (mentorId: string): Promise<string> => {
    // Fetch students linked to the mentor
    const mentorships = await prisma.mentorship.findMany({
      where: { mentorId },
      include: {
        student: {
          include: {
            activities: true, // Include activities
          },
        },
      },
    });
    
  
    if (mentorships.length === 0) {
      throw new Error("No students found for this mentor");
    }
  
    // Collect data for CSV
    const csvData: CSVData[] = [];
    mentorships.forEach((mentorship) => {
      const student = mentorship.student;
      student.activities.forEach((activity) => {
        csvData.push({
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          activityDate: activity.date.toISOString(),
          timeSpent: activity.timeSpent,
          notes: activity.notes || '',
        });
      });
    });
  
    if (csvData.length === 0) {
      throw new Error("No activities found for this mentor");
    }
  
    // Generate CSV
    const fields = ['studentId', 'studentName', 'activityDate', 'timeSpent', 'notes'];
    const csv = parse(csvData, { fields });
    const filePath = path.join(process.cwd(), 'public', 'downloads', `report-${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv);
  
    return filePath;
  };

/*export const generateDummyCSVReport = async (): Promise<string> => {
    // Dummy data to simulate actual mentor/student activities
    const dummyData = [
      {
        studentId: 'student-001',
        studentName: 'John Doe',
        activityDate: new Date().toISOString(),
        timeSpent: 120,
        notes: 'Completed task A',
      },
      {
        studentId: 'student-002',
        studentName: 'Jane Smith',
        activityDate: new Date().toISOString(),
        timeSpent: 90,
        notes: 'Worked on task B',
      },
      {
        studentId: 'student-003',
        studentName: 'Bob Johnson',
        activityDate: new Date().toISOString(),
        timeSpent: 60,
        notes: 'Reviewed task C',
      },
    ];
  
    // Define the fields and convert data to CSV format
    const fields = ['studentId', 'studentName', 'activityDate', 'timeSpent', 'notes'];
    const csv = parse(dummyData, { fields });
  
    // Write the CSV data to a file
    const filePath = path.join(process.cwd(), 'public', 'downloads', `dummy-report-${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv);
  
    console.log(`CSV file created at: ${filePath}`);
    return filePath;
  };*/
  
  
