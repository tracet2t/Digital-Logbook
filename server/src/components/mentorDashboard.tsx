"use client";

import React, { useCallback, useMemo, useState } from "react";

import RsuiteCalendar from "@/app/mentor/calendar/RsuiteCalendar";
import { useRouter } from "next/navigation";

import { useSession } from "@/hooks/core/useSession";
import {
  useMentorProjects,
  useProjectStudents,
} from "@/hooks/mentor/useMentorFilter";
import { Button } from "@/components/ui/button";
import { GenericCombobox } from "@/components/mentor/combobox";

const MentorDashboard = () => {
  // User-selected overrides (null = use default from query data)
  const [selectedUserOverride, setSelectedUser] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const [selectedProjectOverride, setSelectedProject] = useState<string | null>(
    null,
  );

  // TanStack Query hooks
  const { data: mentorProjects = [], isLoading: projectsLoading } =
    useMentorProjects();

  // Shared session hook — cached across all components
  const { data: sessionData } = useSession();

  //to filter mentor from the session
  const session = sessionData || null;
  const mentorName = sessionData
    ? `${sessionData.fname} ${sessionData.lname}`
    : null;
  const mentorId = sessionData?.id || null;

  // Derive effective values — defaults from query data, overridden by user selection.
  // Eliminates the cascading useEffect init chain.
  const selectedUser = selectedUserOverride ?? mentorId;
  const selectedProject =
    selectedProjectOverride ?? mentorProjects[0]?.id ?? null;

  const { data: fetchedStudents = [] } = useProjectStudents(selectedProject);

  const router = useRouter();

  // Derive project students list from fetched data (replaces useEffect + useState)
  const projectStudents = useMemo(() => {
    if (!selectedProject || !mentorId) return [];
    const mentorDisplay =
      mentorName && mentorName.trim().length > 0 ? mentorName : "Mentor";
    return [
      { id: "all-mentees", name: "All Mentees" },
      { id: mentorId, name: mentorDisplay },
      ...fetchedStudents,
    ];
  }, [selectedProject, fetchedStudents, mentorId, mentorName]);

  // Reset function — clearing overrides to null falls back to derived defaults
  const handleResetStudent = () => {
    setSelectedUser(null);
    setSelectedProject(null);
  };

  // Memoized selected objects — prevents new reference on every render
  const selectedProjectObj = useMemo(
    () => mentorProjects.find((p) => p.id === selectedProject) || null,
    [mentorProjects, selectedProject],
  );

  const selectedStudentObj = useMemo(
    () => projectStudents.find((u) => u.id === selectedUser) || null,
    [projectStudents, selectedUser],
  );

  // Stable callbacks to avoid new function instances on every render
  const projectToString = useCallback(
    (p: { id: string; name: string }) => p.name,
    [],
  );
  const studentToString = useCallback(
    (u: { id: string; name: string }) => u.name,
    [],
  );

  const renderProject = useCallback(
    (p: { id: string; name: string }) => (
      <div className="px-2 py-1">{p.name}</div>
    ),
    [],
  );
  const renderStudent = useCallback(
    (u: { id: string; name: string }) => (
      <div className="px-2 py-1">{u.name}</div>
    ),
    [],
  );

  const handleProjectChange = useCallback(
    (p: { id: string; name: string }) => {
      if (p && p.id !== selectedProject) setSelectedProject(p.id);
    },
    [selectedProject],
  );

  const handleStudentChange = useCallback(
    (u: { id: string; name: string }) => {
      if (u && u.id !== selectedUser) setSelectedUser(u.id);
    },
    [selectedUser],
  );

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
    <>
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
                          value={selectedProjectObj}
                          onValueChange={handleProjectChange}
                          itemToStringValue={projectToString}
                          renderItem={renderProject}
                          placeholder="Select Project"
                          className="combobox-styled"
                        />
                        <GenericCombobox
                          items={projectStudents}
                          value={selectedStudentObj}
                          onValueChange={handleStudentChange}
                          itemToStringValue={studentToString}
                          renderItem={renderStudent}
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
              <div className="rounded-2xl border border-slate-200 bg-white p-2 md:p-3 w-full flex-1 min-h-0 overflow-hidden flex flex-col">
                <div className="flex-1 min-h-0">
                  <RsuiteCalendar
                    selectedUser={selectedUser || ""}
                    allMentees={fetchedStudents}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Toast Component */}
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md border border-slate-300 bg-white px-4 py-3 shadow-lg">
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
          <p className="mt-1 text-sm text-slate-600">{toast.description}</p>
        </div>
      )}
    </>
  );
};

export default MentorDashboard;
