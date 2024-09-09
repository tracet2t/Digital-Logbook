'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Report {
  id: string;
  generatedAt: string;
  status: string;
  link: string | null;
}

const BulkReports: React.FC = () => {
  const router = useRouter(); 
  
  const dummyReports: Report[] = [
    {
      id: 'report-001',
      generatedAt: '2024-09-05T10:00:00Z',
      status: 'DONE',
      link: '/downloads/report-001.csv',
    },
    {
      id: 'report-002',
      generatedAt: '2024-09-06T15:30:00Z',
      status: 'IN-PROGRESS',
      link: null,
    },
    {
      id: 'report-003',
      generatedAt: '2024-09-04T09:15:00Z',
      status: 'ERROR',
      link: null,
    },
  ];

  const [reports, setReports] = useState<Report[]>(dummyReports); // Use dummy data
  const [loading, setLoading] = useState(false); // Disable loading for dummy data
  const [error, setError] = useState<string | null>(null);
  //const mentorId = 'c33596bf-b3a4-43a3-ae2f-0bf9b7c881be';
  
  /*useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`/api/bulkReport?mentorId=${mentorId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.statusText}`);
        }
        const data = await response.json();
        setReports(data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Error fetching reports");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReports();
  }, [mentorId]);*/
  

  return (
    <div className="p-8 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="mr-2 font-bold">&larr;</span> 
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-10 mt-1 text-center">Bulk Reports</h1>
      {loading && <p className="text-blue-500">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="w-full max-w-6xl overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <Table className="w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableCell className="p-4 font-semibold text-left">Date</TableCell>
                <TableCell className="p-4 font-semibold text-left">Bulk Report Generation Id</TableCell>
                <TableCell className="p-4 font-semibold text-left">Status</TableCell>
                <TableCell className="p-4 font-semibold text-left">Link</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-100">
                    <TableCell className="p-4">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="p-4">{report.id}</TableCell>
                    <TableCell className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-white ${
                          report.status === 'DONE' ? 'bg-green-500' :
                          report.status === 'IN-PROGRESS' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-4">
                      {report.status === 'DONE' && report.link ? (
                        <a href={report.link} className="text-blue-600 hover:underline">
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="p-4 text-center text-gray-500">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BulkReports;
