"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useMenteeTimeAllocation } from "@/_hooks/mentor/useMenteeTimeAllocation";
import {
  useMentorProjects,
  useProjectStudents,
} from "@/_hooks/mentor/useMentorFilter";
import { getSessionOnClient } from "@/server_actions/getSession";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { GenericCombobox } from "@/components/mentor/combobox";

import {
  AssignmentCard,
  MenteeHeader,
  MenteeIdentityCard,
  MentorTeamCard,
  RecentActivityCard,
} from "./MenteeProfileSections";
import {
  AssignmentDecision,
  FeedbackRecord,
  formatDate,
  getLatestFeedbackStatus,
  getSummaryStatus,
  MentorStudent,
  ProjectOption,
  StudentActivity,
  StudentOption,
} from "./menteeProfileView.helpers";

type MenteeProfileViewProps = {
  initialStudentId?: string;
  initialProjectId?: string;
  onAllocationChange?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

function MenteeProfileView({
  initialStudentId,
  initialProjectId,
  onAllocationChange,
  isOpen = true,
  onClose,
}: MenteeProfileViewProps = {}) {
  const searchParams = useSearchParams();
  const queryProjectId = initialProjectId ?? searchParams.get("projectId");
  const queryStudentId = initialStudentId ?? searchParams.get("studentId");

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    queryProjectId,
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    queryStudentId,
  );
  const [assignmentDecision, setAssignmentDecision] =
    useState<AssignmentDecision>("inReview");

  const { data: sessionData } = useQuery({
    queryKey: ["mentor-session-profile"],
    queryFn: async () => getSessionOnClient(),
  });

  const mentorName = sessionData
    ? `${sessionData.fname ?? ""} ${sessionData.lname ?? ""}`.trim()
    : "Mentor";

  const { data: mentorProjects = [], isLoading: projectsLoading } =
    useMentorProjects();

  useEffect(() => {
    if (!selectedProjectId && mentorProjects.length > 0) {
      setSelectedProjectId(mentorProjects[0].id);
    }
  }, [mentorProjects, selectedProjectId]);

  const { data: projectStudents = [], isLoading: studentsLoading } =
    useProjectStudents(selectedProjectId);

  useEffect(() => {
    if (projectStudents.length === 0) {
      setSelectedStudentId(null);
      return;
    }

    const hasCurrent = projectStudents.some(
      (student) => student.id === selectedStudentId,
    );

    if (!hasCurrent) {
      setSelectedStudentId(projectStudents[0].id);
      setAssignmentDecision("inReview");
    }
  }, [projectStudents, selectedStudentId]);

  const { data: mentorStudents = [] } = useQuery({
    queryKey: ["mentor-students-directory"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch students directory");
      }
      return (await response.json()) as MentorStudent[];
    },
  });

  const selectedProject = useMemo(() => {
    return (
      mentorProjects.find((project) => project.id === selectedProjectId) ?? null
    );
  }, [mentorProjects, selectedProjectId]);

  const selectedStudentObj = useMemo(() => {
    return (
      projectStudents.find((student) => student.id === selectedStudentId) ??
      null
    );
  }, [projectStudents, selectedStudentId]);

  const selectedStudent = useMemo(() => {
    const fromProject = selectedStudentObj;

    if (!fromProject) {
      return null;
    }

    const studentDetails =
      mentorStudents.find((student) => student.id === fromProject.id) ?? null;

    const firstName =
      studentDetails?.firstName ?? fromProject.name.split(" ")[0] ?? "";
    const lastName =
      studentDetails?.lastName ??
      fromProject.name.split(" ").slice(1).join(" ") ??
      "";

    return {
      id: fromProject.id,
      displayName: `${firstName} ${lastName}`.trim() || fromProject.name,
      email: studentDetails?.email ?? "-",
    };
  }, [mentorStudents, selectedStudentObj]);

  const { data: feedbackHistory = [] } = useQuery({
    queryKey: ["mentee-feedback-history", selectedStudentId],
    queryFn: async () => {
      const response = await fetch(
        `/api/feedback/history?studentId=${encodeURIComponent(selectedStudentId ?? "")}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback history");
      }

      const payload = (await response.json()) as { feedback: FeedbackRecord[] };
      return payload.feedback ?? [];
    },
    enabled: Boolean(selectedStudentId),
  });

  const { data: studentActivities = [] } = useQuery({
    queryKey: ["mentee-activities", selectedStudentId],
    queryFn: async () => {
      const response = await fetch(
        `/api/student?studentId=${encodeURIComponent(selectedStudentId ?? "")}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch mentee activities");
      }
      return (await response.json()) as StudentActivity[];
    },
    enabled: Boolean(selectedStudentId),
  });

  const totalWorkingHours = useMemo(() => {
    return studentActivities.reduce((total, activity) => {
      const status = getLatestFeedbackStatus(activity.feedback);
      if (status === "approved") {
        return total + (activity.timeSpent ?? 0);
      }
      return total;
    }, 0);
  }, [studentActivities]);

  const recentActivities = useMemo(() => {
    return studentActivities
      .slice()
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .map((activity) => ({
        id: activity.id,
        title: activity.notes || "Activity Update",
        date: formatDate(activity.date),
        status: getLatestFeedbackStatus(activity.feedback),
        hours: activity.timeSpent || 0,
      }));
  }, [studentActivities]);

  const mentorTeam = useMemo(() => {
    const names = new Set<string>();

    if (mentorName.trim()) {
      names.add(mentorName);
    }

    feedbackHistory.forEach((item) => {
      if (item.mentorName) {
        names.add(item.mentorName);
      }
    });

    return Array.from(names).slice(0, 4);
  }, [feedbackHistory, mentorName]);

  const { data: timeAllocationData, refetch: refetchTimeAllocation } = useQuery(
    {
      queryKey: ["time-allocation", selectedProjectId, selectedStudentId],
      queryFn: async () => {
        if (!selectedProjectId || !selectedStudentId) return null;
        const response = await fetch(
          `/api/mentor/mentees/time-allocation?projectId=${selectedProjectId}&studentId=${selectedStudentId}`,
        );
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error("Failed to fetch time allocation");
        }
        return response.json();
      },
      enabled: Boolean(selectedProjectId && selectedStudentId),
    },
  );

  // Replace the old inline useMutation with:
  const updateAllocationMutation = useMenteeTimeAllocation({
    projectId: selectedProjectId,
    studentId: selectedStudentId,
    onAllocationChange,
    refetchTimeAllocation,
  });

  useEffect(() => {
    if (timeAllocationData?.status) {
      setAssignmentDecision(timeAllocationData.status);
    } else {
      setAssignmentDecision("inReview");
    }
  }, [timeAllocationData]);

  //Accept
  const handleAccept = () => {
    setAssignmentDecision("accepted");
    updateAllocationMutation.mutate("accepted");
  };
  //Reject
  const handleReject = () => {
    setAssignmentDecision("rejected");
    updateAllocationMutation.mutate("rejected");
  };

  const summaryStatus = getSummaryStatus(assignmentDecision);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && onClose) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-5xl w-full p-0">
        <div className="flex-grow flex flex-col w-full bg-[#f5f7fb] p-4 md:p-6">
          <div className="w-full flex-1 rounded-2xl border border-[#dbe5f4] bg-white shadow-sm">
            <MenteeHeader mentorName={mentorName} />

            <div className="border-t border-dashed border-[#86a8df]" />

            <div className="space-y-4 p-4 md:space-y-6 md:p-6">
              <Card className="rounded-2xl border-[#e3ebf8] shadow-sm">
                <CardContent className="space-y-4 p-4 md:space-y-5 md:p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <GenericCombobox<ProjectOption>
                      items={mentorProjects}
                      value={selectedProject}
                      onValueChange={(project) =>
                        setSelectedProjectId(project.id)
                      }
                      itemToStringValue={(project) => project.name}
                      renderItem={(project) => (
                        <div className="px-2 py-1 text-sm">{project.name}</div>
                      )}
                      placeholder={
                        projectsLoading
                          ? "Loading projects..."
                          : "Select project"
                      }
                      className="w-full md:w-[320px]"
                    />

                    <GenericCombobox<StudentOption>
                      items={projectStudents}
                      value={selectedStudentObj}
                      onValueChange={(student) => {
                        setSelectedStudentId(student.id);
                        setAssignmentDecision("inReview");
                      }}
                      itemToStringValue={(student) => student.name}
                      renderItem={(student) => (
                        <div className="px-2 py-1 text-sm">{student.name}</div>
                      )}
                      placeholder={
                        studentsLoading ? "Loading mentees..." : "Select mentee"
                      }
                      className="w-full md:w-[320px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,1.6fr]">
                    <MenteeIdentityCard
                      displayName={
                        selectedStudent?.displayName ?? "No mentee selected"
                      }
                      email={selectedStudent?.email ?? "-"}
                    />

                    <AssignmentCard
                      projectName={
                        selectedProject?.name ?? "No project selected"
                      }
                      summaryStatus={summaryStatus}
                      totalWorkingHours={
                        timeAllocationData?.totalWorkingHours ??
                        totalWorkingHours
                      }
                      onAccept={handleAccept}
                      onReject={handleReject}
                      disabled={
                        !selectedStudentId || updateAllocationMutation.isPending
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr,1fr]">
                <RecentActivityCard recentActivities={recentActivities} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <MentorTeamCard mentorTeam={mentorTeam} />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-[#e3ebf8]">
                <DialogClose asChild>
                  <Button variant="outline" className="min-w-[100px]">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MenteeProfileView;
