'use client';

import React, { useState, useEffect } from 'react';
import TaskCalendar from "@/components/calendar"; // Import TaskCalendar
import { Button } from "@/components/ui/button";
import MentorRegStudentForm from '@/components/mentorregstudentform';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSessionOnClient } from "@/server_actions/getSession";
import { useRouter } from 'next/navigation'; // Import useRouter hook
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast"; // Adjust import path if necessary

interface Session {
  fname: string;
  lname: string;
  email: string;
  id: string;
  role: string;
}

const MentorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<{ id: string; firstName: string; lastName: string; }[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [mentorName, setMentorName] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [role,setRole] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null); // State for toast notifications

  const router = useRouter(); // Initialize router

  useEffect(() => {
    getSessionOnClient()
      .then((data) => {
        if (data) {
          setSession(data);
          setMentorName(`${data.fname} ${data.lname}`);
          setMentorId(data.id);
          setRole(data.role);
          setSelectedUser(data.id); // Setting the selected user based on session
        }
      })
      .catch((error) => {
        console.error('Error fetching session:', error);
      });
  }, []);

  const handleOpenForm = () => {
    setShowForm(true); 
  };

  const handleCloseForm = () => {
    setShowForm(false); 
  };

  const handleMentorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value); 
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      setUsers(data);
      setIsLoading(false); // Stop loading once users are fetched
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setIsLoading(false); // Stop loading even if there's an error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBulkReportClick = async () => {
    try {
      const response = await fetch("/api/generateReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Report Generation Job ID:", data.jobId);
        router.push("/mentor/bulkreport"); // Redirect to bulk report page
      } else {
        console.error("Failed to generate report.");
      }
    } catch (error) {
      console.error("Error generating bulk report:", error);
    }
  };

  const handleReport = async () => {
    try {
      const response = await fetch(`/api/report?studentId=${selectedUser}`);
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'student_activity_report.csv';

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; 
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Show toast on successful report download
      setToast({
        title: 'Report Generated',
        description: 'Student report has been downloaded successfully!',
      });
      setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
    } catch (error) {
      console.error('Failed to download report:', error);
      setToast({
        title: 'Error',
        description: 'Failed to download the report. Please try again.',
      });
      setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  
  return (
    <ToastProvider>
      <div className="gap-5 flex flex-col bg-[#f1f1f9] min-h-screen">
        {/* Top Bar with Logo, Avatar, and Logout */}
        <div className="flex gap-1 justify-between items-center p-4 bg-gradient-to-t from-blue-50 via-blue-75 to-blue-100 shadow-md h-[8vh] w-full max-w-[95vw] mx-auto mt-[10px] rounded-lg">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={40}
            className="mt-[0px]"
          />
          
       <div className="flex items-center gap-4 mt-[0px] relative mr-[15px]">
        {/* Avatar */}
      <div onClick={togglePopup} className="cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
      </div>

      {/* Popup Screen */}
      {isPopupOpen && (
            <div className="absolute top-[100%] right-0 mt-2 bg-gradient-to-t from-blue-100 via-blue-200 to-blue-300 shadow-md shadow-lg p-6 rounded-lg z-50 w-[250px]">
              {/* Large Avatar */}
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              {/* Student Name and Email */}
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {session ? `${session.fname} ${session.lname}` : 'Loading...'}
                </h3>
                <p className="text-xs text-gray-500">
                  {session ? session.email : 'Loading...'}
                </p>
              </div>

              {/* Logout Button */}
              <form action="/auth/logout" method="post" className="mt-4">
                <Button variant="blue" className="w-full border-black">Logout</Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center mt-[-7px] w-full max-w-[95vw] mx-auto">
        <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-[95vw] min-h-[60vh]">
          <div className="flex flex-wrap justify-between items-center mb-4 px-4">
            {!isLoading && session ? (
              <select
              className="border-2 border-blue-500 text-black-500 px-4 py-2 bg-white rounded-md hover:border-blue-600 hover:bg-blue-100 w-full max-w-xs" 
                value={selectedUser || mentorId || ''} // Set selectedUser or mentorId if it's not yet available
                onChange={handleMentorChange}
              >
                <option value={mentorId || ""}>{mentorName}</option> 
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            ) : (
              <p>Loading...</p> // Show loading while fetching
            )}

            <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
            <Button className="border-2 border-orange-500 text-black-500 px-4 py-2 bg-white rounded-md hover:border-orange-600 hover:bg-orange-100" 
                onClick={handleReport} disabled={mentorId === selectedUser}>
              Generate Report
            </Button>

              <Button className="border-2 border-orange-500 text-black-500 px-4 py-2 bg-white rounded-md hover:border-orange-600 hover:bg-orange-100"
                onClick={handleBulkReportClick} // Handle Bulk Report click
              >
                Bulk Report
              </Button>
              <Button
              className="border-2 border-blue-500 text-black-500 px-4 py-2 bg-white rounded-md hover:border-blue-600 hover:bg-blue-100 "
                onClick={handleOpenForm}
              >
                Register Student
              </Button>
              {showForm && <MentorRegStudentForm onClose={handleCloseForm} />}
            </div>
          </div>

          {/* Pass the selectedUser as a prop to TaskCalendar */}
          <div className="flex justify-center items-center w-full">
            <TaskCalendar selectedUser={selectedUser || ""} />
          </div>
        </div>
      </div>
    </div>
      {/* Toast Component */}
      {toast && (
        <Toast>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
          <ToastClose />
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export default MentorDashboard;