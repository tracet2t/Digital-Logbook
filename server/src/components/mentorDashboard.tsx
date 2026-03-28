'use client';

import React, { useState, useEffect } from 'react';
import RsuiteCalendar from "@/components/rsuiteCalendar"; // Import RsuiteCalendar
import AsideSidebar from "@/components/AsideSidebar"; // Import AsideSidebar
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSessionOnClient } from "@/server_actions/getSession";
import { useRouter } from 'next/navigation'; // Import useRouter hook
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast"; // Adjust import path if necessary
import { GenericCombobox } from "@/components/mentor/combobox";
import { useMentorProjects, useProjectStudents } from "@/hooks/mentor/useMentorFilter";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Session {
  fname: string;
  lname: string;
  email: string;
  id: string;
  role: string;
}

const MentorDashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [mentorName, setMentorName] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectStudents, setProjectStudents] = useState<{ id: string; name: string }[]>([]);

  // TanStack Query hooks
  const { data: mentorProjects = [], isLoading: projectsLoading } = useMentorProjects();
  const { data: fetchedStudents = [], isLoading: studentsLoading } = useProjectStudents(selectedProject);

  const router = useRouter(); // Initialize router

  //Setting Mentor Data
  useEffect(() => {
    getSessionOnClient()
      .then((data) => {
        if (data) {
          setSession(data);
          setMentorName(`${data.fname} ${data.lname}`);
          setMentorId(data.id);
          setRole(data.role);
        }
      })
      .catch((error) => {
        console.error('Error fetching session:', error);
      });
  }, []);

  // Auto-select first project when mentor projects load
  useEffect(() => {
    if (mentorProjects.length > 0 && !selectedProject) {
      setSelectedProject(mentorProjects[0].id);
    }
  }, [mentorProjects, selectedProject]);

  // Initialize selected user with mentor ID
  useEffect(() => {
    if (mentorId && !selectedUser) {
      setSelectedUser(mentorId);
    }
  }, [mentorId, selectedUser]);

  // Update project students list when fetched students change
  useEffect(() => {
    if (selectedProject && Array.isArray(fetchedStudents) && mentorId) {
      const updatedList = [
        {
          id: mentorId,
          name: mentorName || "Mentor",
        },
        ...fetchedStudents,
      ];
      setProjectStudents(updatedList);
    }
  }, [fetchedStudents, selectedProject, mentorId, mentorName]);
  //Reset function
  const handleResetStudent = () => {
    if (mentorId) {
      setSelectedUser(mentorId); // reset to mentor
    }
  };

  //Bulk report generate
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
  //Handle Report function
  const handleReport = async () => {
    try {
      const response = await fetch(`/api/report?studentId=${selectedUser}`);
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'mentee_activity_report.csv';

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
        description: 'Mentee report has been downloaded successfully!',
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
    <SidebarProvider>
      <ToastProvider>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <AsideSidebar />
          {/* Main Content Area */}
          <div className="gap-5 flex flex-col bg-[#f1f1f9] min-h-screen flex-1 overflow-hidden">
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
                    <form action="/api/logout" method="post" className="mt-4">
                      <Button variant="blue" className="w-full border-black">Logout</Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-grow flex flex-col mt-[-7px] w-full px-4">
              <div className="bg-white p-4 rounded-xl shadow-lg w-full flex-1">
                <div className="flex flex-wrap justify-between items-center mb-4 px-4">
                  {!projectsLoading && session ? (
                    <div className="flex gap-4 mb-4">
                      {/* Project Combobox */}
                      <GenericCombobox
                        items={mentorProjects}
                        value={mentorProjects.find((p) => p.id === selectedProject) || null}
                        onValueChange={(p) => setSelectedProject(p.id)}
                        itemToStringValue={(p) => p.name}
                        renderItem={(p) => <div className="px-2 py-1">{p.name}</div>}
                        placeholder="Select Project"
                        className="combobox-styled"
                      />

                      {/* Student Combobox */}
                      <GenericCombobox
                        items={projectStudents}
                        value={projectStudents.find((u) => u.id === selectedUser) || null}
                        onValueChange={(u) => setSelectedUser(u.id)}
                        itemToStringValue={(u) => u.name}
                        renderItem={(u) => <div className="px-2 py-1">{u.name}</div>}
                        placeholder="Select Student"
                        className="combobox-styled"
                      />
                      <Button
                        variant="outline"
                        onClick={handleResetStudent}
                        className="reset-button-styled">Reset</Button>
                    </div>
                  ) : (
                    <p>Loading...</p>
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
                  </div>
                </div>
                {/* Calendar Component */}
                <div className="w-full">
                  <RsuiteCalendar selectedUser={selectedUser || ""} />
                </div>
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
    </SidebarProvider>
  );
};

export default MentorDashboard;