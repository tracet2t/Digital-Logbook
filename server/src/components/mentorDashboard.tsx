import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navBar';
import DashboardOverview from '@/components/dashboardOverview';
import ActiveProjects from '@/components/activeProjects';
import PersonalJournal from '@/components/personalJournal';
import Calendar from '@/components/newCalendar';
import Footer from '@/components/footer';
import Button from '@/components/button'; // Make sure Button component exists
import MentorRegStudentForm from '@/components/mentorRegStudentForm'; // Make sure this exists
import { getSessionOnClient } from '@/utils/session'; // Your session util
import { Session } from '@/types'; // Adjust import based on your types

const MentorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<{ userID: string; firstName: string; lastName: string }[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [mentorName, setMentorName] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    getSessionOnClient()
      .then((data) => {
        if (data) {
          setSession(data);
          setMentorName(`${data.fname} ${data.lname}`);
          setMentorId(data.id);
          setRole(data.role);
          setSelectedUser(data.id);
        }
      })
      .catch((error) => console.error('Error fetching session:', error));
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      const formattedUsers = data.map((user: any) => ({
        userID: user.userID,
        firstName: user.user?.firstName || '',
        lastName: user.user?.lastName || '',
      }));
      setUsers(formattedUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleMentorChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedUser(e.target.value);

  const handleReport = async () => {
    try {
      const response = await fetch(`/api/report?studentId=${selectedUser}`);
      if (!response.ok) throw new Error('Failed to generate report');

      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'student_activity_report.csv';

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setToast({ title: 'Report Generated', description: 'Student report downloaded successfully!' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Failed to download report:', error);
      setToast({ title: 'Error', description: 'Failed to download the report. Please try again.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleBulkReportClick = async () => {
    try {
      const response = await fetch('/api/generateReport', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        console.log('Report Generation Job ID:', data.jobId);
        router.push('/mentor/bulkreport');
      } else {
        console.error('Failed to generate bulk report.');
      }
    } catch (error) {
      console.error('Error generating bulk report:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />

      {/* Top controls */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        {!isLoading && session ? (
          <select
            className="border-2 border-blue-500 px-4 py-2 bg-white rounded-md hover:border-blue-600 hover:bg-blue-100 w-full max-w-xs"
            value={selectedUser || mentorId || ''}
            onChange={handleMentorChange}
          >
            <option value="">---Select Student---</option>
            {users.map((user) => (
              <option key={user.userID} value={user.userID}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        ) : (
          <p>Loading...</p>
        )}

        <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
          <Button className="border-2 border-purple-500 px-4 py-2 rounded-md hover:border-purple-600 hover:bg-purple-100" onClick={() => window.location.href = ''}>
            <b>{session ? `${session.fname} ` : '...'} Dashboard</b>
          </Button>

          <Button className="border-2 border-orange-500 px-4 py-2 rounded-md hover:border-orange-600 hover:bg-orange-100" onClick={handleReport} disabled={mentorId === selectedUser}>
            Generate Report
          </Button>

          <Button className="border-2 border-orange-500 px-4 py-2 rounded-md hover:border-orange-600 hover:bg-orange-100" onClick={handleBulkReportClick}>
            Bulk Report
          </Button>

          <Button className="border-2 border-blue-500 px-4 py-2 rounded-md hover:border-blue-600 hover:bg-blue-100" onClick={handleOpenForm}>
            Register Student
          </Button>
          {showForm && <MentorRegStudentForm onClose={handleCloseForm} />}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Left Panel */}
        <div className="col-span-2">
          <DashboardOverview />
          <div className="mt-4">
            <ActiveProjects />
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          <Calendar />
          <PersonalJournal />
        </div>
      </div>

      <Footer />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md shadow-lg">
          <p className="font-bold">{toast.title}</p>
          <p>{toast.description}</p>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
