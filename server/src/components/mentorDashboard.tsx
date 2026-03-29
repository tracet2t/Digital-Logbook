"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getSessionOnClient } from "@/server_actions/getSession";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; // Import useRouter hook

import {
  useMentorProjects,
  useProjectStudents,
} from "@/hooks/mentor/useMentorFilter";
import { Button } from "@/components/ui/button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
// Adjust import path if necessary
import { GenericCombobox } from "@/components/mentor/combobox";

const RsuiteCalendar = dynamic(
  () => import("@/app/mentor/calendar/RsuiteCalendar"),
  {
    ssr: false,
  },
);

const MentorDashboard = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectStudents, setProjectStudents] = useState<
    { id: string; name: string }[]
  >([]);
  const prevStudentsRef = useRef<{ id: string; name: string }[]>([]);

  // TanStack Query hooks
  const { data: mentorProjects = [], isLoading: projectsLoading } =
    useMentorProjects();
  const { data: fetchedStudents = [], isLoading: studentsLoading } =
    useProjectStudents(selectedProject);

  const router = useRouter(); // Initialize router

  // Fetch Mentor Session Data with useQuery
  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const data = await getSessionOnClient();
      return data;
    },
  });

  const session = sessionData || null;
  const mentorName = sessionData
    ? `${sessionData.fname} ${sessionData.lname}`
    : null;
  const mentorId = sessionData?.id || null;

  // Initialize selected user with mentor ID
  useEffect(() => {
    if (mentorId && !selectedUser) setSelectedUser(mentorId);
  }, [mentorId, selectedUser]);

  // Auto-select first project when mentor projects load
  useEffect(() => {
    if (mentorProjects.length > 0 && !selectedProject) {
      setSelectedProject(mentorProjects[0].id);
    }
  }, [mentorProjects, selectedProject]);

  // Update project students list when fetched students change
  useEffect(() => {
    if (selectedProject && mentorId) {
      const mentorDisplay =
        mentorName && mentorName.trim().length > 0 ? mentorName : "Mentor";
      const newStudents = [
        { id: mentorId, name: mentorDisplay },
        ...fetchedStudents,
      ];

      // Only update if data actually changed
      if (
        JSON.stringify(prevStudentsRef.current) !== JSON.stringify(newStudents)
      ) {
        setProjectStudents(newStudents);
        prevStudentsRef.current = newStudents;
      }
    }
  }, [selectedProject, fetchedStudents, mentorId, mentorName]);

  // Reset function to clear filters
  const handleResetStudent = () => {
    if (mentorId) {
      setSelectedUser(mentorId);
    }
    if (mentorProjects.length > 0) {
      setSelectedProject(mentorProjects[0].id);
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
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : "mentee_activity_report.csv";

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Show toast on successful report download
      setToast({
        title: "Report Generated",
        description: "Mentee report has been downloaded successfully!",
      });
      setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
    } catch (error) {
      console.error("Failed to download report:", error);
      setToast({
        title: "Error",
        description: "Failed to download the report. Please try again.",
      });
      setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        {/* Main Content Area */}
        <div className="gap-5 flex flex-col bg-[#f1f1f9] min-h-screen flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-grow flex flex-col w-full px-4 pt-4">
            <div className="rounded-xl border-slate-300 bg-white p-6 shadow-lg w-full flex-1">
              {/* Super parent card header */}
              {/* Controls and Calendar inside super parent card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 mb-4">
                <div className="flex flex-row items-center w-full gap-4 justify-between">
                  {/* Sub-card: Dropdowns and Reset */}
                  <div className="flex items-center mb-6">
                    <span className="text-3xl font-extrabold text-black tracking-tight">
                      MENTOR PORTAL
                    </span>
                  </div>
                  {/* Sub-card: Report Buttons */}
                  <div className="rounded-xl border border-slate-200 bg-white p-2 flex flex-row items-center gap-4">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleReport}
                      disabled={mentorId === selectedUser}
                    >
                      Generate Report
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      className="bg-[#000053] text-white hover:bg-[#23236c]"
                      onClick={handleBulkReportClick} // Handle Bulk Report click
                    >
                      Bulk Report
                    </Button>
                  </div>
                </div>
                {/* Sub-card: Report Buttons */}
                <div className="rounded-xl border border-slate-200 bg-white p-2 flex flex-row items-center justify-between gap-4">
                  <div className="flex flex-row items-center gap-4">
                    {!projectsLoading && session ? (
                      <>
                        <GenericCombobox
                          items={mentorProjects}
                          value={
                            mentorProjects.find(
                              (p) => p.id === selectedProject,
                            ) || null
                          }
                          onValueChange={(p) => setSelectedProject(p.id)}
                          itemToStringValue={(p) => p.name}
                          renderItem={(p) => (
                            <div className="px-2 py-1">{p.name}</div>
                          )}
                          placeholder="Select Project"
                          className="combobox-styled"
                        />
                        <GenericCombobox
                          items={projectStudents}
                          value={
                            projectStudents.find(
                              (u) => u.id === selectedUser,
                            ) || null
                          }
                          onValueChange={(u) => setSelectedUser(u.id)}
                          itemToStringValue={(u) => u.name}
                          renderItem={(u) => (
                            <div className="px-2 py-1">{u.name}</div>
                          )}
                          placeholder="Select Student"
                          className="combobox-styled"
                        />
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleResetStudent}
                    className="reset-button-styled"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
              {/* Calendar Card Component */}
              <div className="rounded-2xl border border-slate-200 bg-white p-2 md:p-3 w-full h-[60vh] md:h-[70vh] overflow-y-auto flex flex-col">
                <div className="flex-1 min-h-0">
                  {/* <RsuiteCalendar selectedUser={selectedUser || ""} /> */}
                </div>
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
  );
};

export default MentorDashboard;
