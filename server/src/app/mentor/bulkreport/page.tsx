'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from '@/components/ui/button';
import { list } from 'postcss';

interface Report {
  id: string;
  generatedAt: string;
  status: string;
  reportData: [] | null;
}


const BulkReports: React.FC = () => {
  const router = useRouter(); 

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to convert JSON to CSV
const jsonToCsv = (jsonData) => {
  // Get the headers from the object keys
  const headers = Object.keys(jsonData[0]);
  const csvRows = [];

  // Add headers as the first row
  csvRows.push(headers.join(','));

  // Add each row of data
  jsonData.forEach(row => {
      const values = headers.map(header => row[header]);
      csvRows.push(values.join(','));
  });

  // Join rows with new line character
  return csvRows.join('\n');
};

// Function to trigger CSV download
const handleReport = async (reportData) => {
  try {
      if (reportData.length === 0) {
          console.error("No data available");
          return;
      }

      // Convert the JSON data to CSV format
      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(jsonToCsv(reportData));

      // Create a download link and trigger the download
      const a = document.createElement('a');
      a.href = csvContent;
      a.download = 'student_bulk_activity_report.csv'; // Customize the filename
      document.body.appendChild(a);
      a.click();
      a.remove();
  } catch (error) {
      console.error('Error generating report:', error);
  }
};



  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`/api/generateReport`);
        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        setReports(data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Error fetching reports");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);

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
                          report.status === 'pending' ? 'bg-yellow-500' :
                          report.status === 'completed' ? 'bg-green-500' :
                          report.status === 'wip' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-4">
                      {report.reportData ? (
                        <Button onClick={()=> {handleReport(report.reportData)}} > Download </Button>
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
