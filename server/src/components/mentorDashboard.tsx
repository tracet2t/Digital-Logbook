"use client";

import React, { useCallback, useMemo, useState } from "react";

import { useSession } from "@/_hooks/core/useSession";
import {
  useMentorProjects,
  useProjectStudents,
} from "@/_hooks/mentor/useMentorFilter";
import RsuiteCalendar from "@/app/mentor/calendar/RsuiteCalendar";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin";
import { GenericCombobox } from "@/components/mentor/combobox";
import { useGenerateMenteePDF } from "@/components/reports/useGenerateMenteePDF";

const MentorDashboard = () => {
  // User-selected overrides (null = use default from query data)
  const [selectedUserOverride, setSelectedUser] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const { isExporting, generatePDF } = useGenerateMenteePDF();

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

  //Bulk report generate — downloads CSV directly
  const handleBulkReportClick = async () => {
    try {
      const response = await fetch("/api/bulkReport?format=csv");
      if (!response.ok) {
        console.error("Failed to download bulk report.");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mentee_bulk_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading bulk report:", error);
    }
  };
  //Handle Report function — generates PDF for selected mentee
  const handleReport = async () => {
    if (!selectedUser) return;
    try {
      await generatePDF(selectedUser);
      setToast({
        title: "Report Generated",
        description: "Mentee PDF report has been downloaded successfully!",
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
      setToast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Main Content Area */}
        <div className="gap-5 flex flex-col bg-[#f1f1f9] min-h-screen flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-grow flex flex-col w-full px-4 pt-4 pb-4 sm:pb-0">
            <div className="rounded-xl border-slate-300 bg-white p-6 shadow-lg w-full flex-1">
              {/* Super parent card header */}
              {/* Controls and Calendar inside super parent card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 mb-4">
                <div className="flex flex-row items-center w-full gap-4 justify-between">
                  {/* Sub-card: Dropdowns and Reset */}
                  <div className="flex items-center mb-6">
                    <PageHeader title="Mentor Portal" />
                  </div>
                  {/* Sub-card: Report Buttons */}
                  <div className="rounded-xl border border-slate-200 bg-white p-2 flex flex-row items-center gap-4">
                    <Button
                      variant="default"
                      size="lg"
                      className="h-8 px-2 text-xs sm:h-9 sm:px-2.5 sm:text-sm"
                      onClick={handleReport}
                      disabled={mentorId === selectedUser || isExporting}
                    >
                      {isExporting ? "Generating..." : "Generate Report"}
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      className="h-8 px-2 text-xs sm:h-9 sm:px-2.5 sm:text-sm bg-[#000053] text-white hover:bg-[#23236c]"
                      onClick={handleBulkReportClick} // Handle Bulk Report click
                    >
                      Bulk Report
                    </Button>
                  </div>
                </div>
                {/* Sub-card: Report Buttons */}
                <div className="rounded-xl border border-slate-200 bg-white p-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center">
                    {!projectsLoading && session ? (
                      <>
                        <GenericCombobox
                          items={mentorProjects}
                          value={selectedProjectObj}
                          onValueChange={handleProjectChange}
                          itemToStringValue={projectToString}
                          renderItem={renderProject}
                          placeholder="Select Project"
                          className="combobox-styled w-full sm:min-w-0 sm:flex-1 sm:w-[200px]"
                        />
                        <GenericCombobox
                          items={projectStudents}
                          value={selectedStudentObj}
                          onValueChange={handleStudentChange}
                          itemToStringValue={studentToString}
                          renderItem={renderStudent}
                          placeholder="Select Student"
                          className="combobox-styled w-full sm:min-w-0 sm:flex-1 sm:w-[200px]"
                        />
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleResetStudent}
                    className="reset-button-styled w-full h-8 px-2 text-xs sm:w-auto sm:shrink-0 sm:h-9 sm:px-2.5 sm:text-sm"
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
