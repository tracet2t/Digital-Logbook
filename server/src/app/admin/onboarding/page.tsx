"use client";

import { useState } from "react";

import { CheckCircle2, UserCheck, UserRound } from "lucide-react";

import {
  useAssignMenteeToProject,
  useAssignMentorToProject,
  useMentorAllocations,
  useOnboardingApplications,
  useProjectApplicationAllocations,
  useUnassignedMentors,
  useUnassignMentee,
  useUnassignMentor,
} from "@/hooks/admin/useAdminOnboarding";
import { useKanbanBoard } from "@/hooks/admin/useKanbanBoard";
import { useCreateProject, useGetProjects } from "@/hooks/projects";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPageLayout, PageHeader } from "@/components/admin";
import {
  ApplicantDialog,
  CreateProjectDialog,
  KanbanBoard,
  StatCard,
  type ProjectFormState,
} from "@/components/admin/kanban";

const EMPTY_FORM: ProjectFormState = {
  name: "",
  description: "",
  domain: "software",
  batchNo: "",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminOnboardingPage() {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [createProjectForm, setCreateProjectForm] =
    useState<ProjectFormState>(EMPTY_FORM);

  const { data: applications = [], isLoading } = useOnboardingApplications();
  const { data: mentorApplications = [], isLoading: mentorLoading } =
    useUnassignedMentors();
  const { data: projects = [], isLoading: projectsLoading } = useGetProjects();
  const { data: allocations } = useProjectApplicationAllocations();
  const { data: mentorAllocations } = useMentorAllocations();

  const assignMentee = useAssignMenteeToProject();
  const unassignMentee = useUnassignMentee();
  const assignMentor = useAssignMentorToProject();
  const unassignMentor = useUnassignMentor();
  const { mutate: createProject, isPending: isCreatingProject } =
    useCreateProject();

  const menteeBoard = useKanbanBoard({
    allocations: allocations?.map(({ applicationId, projectId }) => ({
      id: applicationId,
      projectId,
    })),
    applications,
    onAssign: (id, projectId, onError) =>
      assignMentee.mutate({ applicationId: id, projectId }, { onError }),
    onUnassign: (id, projectId, onError) =>
      unassignMentee.mutate({ applicationId: id, projectId }, { onError }),
  });

  const mentorBoard = useKanbanBoard({
    allocations: mentorAllocations?.map(({ mentorId, projectId }) => ({
      id: mentorId,
      projectId,
    })),
    applications: mentorApplications,
    onAssign: (id, projectId, onError) =>
      assignMentor.mutate({ mentorId: id, projectId }, { onError }),
    onUnassign: (id, projectId, onError) =>
      unassignMentor.mutate({ mentorId: id, projectId }, { onError }),
  });

  const menteeCounts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
  };

  const mentorCounts = {
    total: mentorApplications.length,
    pending: mentorApplications.filter((a) => a.status === "pending").length,
    approved: mentorApplications.filter((a) => a.status === "approved").length,
  };

  const openCreateProject = () => {
    setCreateProjectForm(EMPTY_FORM);
    setShowCreateProject(true);
  };

  return (
    <>
      <AdminPageLayout>
        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-6 p-4 md:p-5">
              <PageHeader
                title="Onboarding Approval"
                subtitle="Review incoming applications, approve candidates, then drag them onto a project."
              />

              <Tabs defaultValue="mentee" className="flex-col gap-0">
                <TabsList className="mb-6 w-fit rounded-xl bg-slate-100 p-1">
                  <TabsTrigger
                    value="mentee"
                    className="rounded-lg px-5 py-1.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#000053] data-[state=active]:shadow-sm"
                  >
                    Mentee
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentor"
                    className="rounded-lg px-5 py-1.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#000053] data-[state=active]:shadow-sm"
                  >
                    Mentor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mentee" className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                      label="Total"
                      value={menteeCounts.total}
                      icon={UserRound}
                      tone="slate"
                    />
                    <StatCard
                      label="Pending"
                      value={menteeCounts.pending}
                      icon={UserCheck}
                      tone="amber"
                    />
                    <StatCard
                      label="Approved"
                      value={menteeCounts.approved}
                      icon={CheckCircle2}
                      tone="emerald"
                    />
                  </div>
                  <KanbanBoard
                    benchLabel="Mentee Bench"
                    benchBadgeText="Profiles"
                    benchEmptyText="No applicants on the bench."
                    assignmentLabel="Mentee Assignment"
                    bench={menteeBoard.bench}
                    isLoading={isLoading}
                    applications={applications}
                    assignments={menteeBoard.assignments}
                    projects={projects}
                    projectsLoading={projectsLoading}
                    selectedIds={menteeBoard.selectedIds}
                    setSelectedIds={menteeBoard.setSelectedIds}
                    handleDragStart={menteeBoard.handleDragStart}
                    handleDragEnd={menteeBoard.handleDragEnd}
                    handleUnassign={menteeBoard.handleUnassign}
                    activeApplication={menteeBoard.activeApplication}
                    dragCount={menteeBoard.dragCount}
                    onViewProfile={menteeBoard.setViewingProfile}
                    onAddProject={openCreateProject}
                  />
                </TabsContent>

                <TabsContent value="mentor" className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                      label="Total"
                      value={mentorCounts.total}
                      icon={UserRound}
                      tone="slate"
                    />
                    <StatCard
                      label="Pending"
                      value={mentorCounts.pending}
                      icon={UserCheck}
                      tone="amber"
                    />
                    <StatCard
                      label="Approved"
                      value={mentorCounts.approved}
                      icon={CheckCircle2}
                      tone="emerald"
                    />
                  </div>
                  <KanbanBoard
                    benchLabel="Mentor Bench"
                    benchBadgeText="Experts"
                    benchEmptyText="No mentors on the bench."
                    assignmentLabel="Mentor Assignment"
                    bench={mentorBoard.bench}
                    isLoading={mentorLoading}
                    applications={mentorApplications}
                    assignments={mentorBoard.assignments}
                    projects={projects}
                    projectsLoading={projectsLoading}
                    selectedIds={mentorBoard.selectedIds}
                    setSelectedIds={mentorBoard.setSelectedIds}
                    handleDragStart={mentorBoard.handleDragStart}
                    handleDragEnd={mentorBoard.handleDragEnd}
                    handleUnassign={mentorBoard.handleUnassign}
                    activeApplication={mentorBoard.activeApplication}
                    dragCount={mentorBoard.dragCount}
                    onViewProfile={mentorBoard.setViewingProfile}
                    onAddProject={openCreateProject}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </AdminPageLayout>

      <ApplicantDialog
        application={menteeBoard.viewingProfile}
        onClose={() => menteeBoard.setViewingProfile(null)}
      />
      <ApplicantDialog
        application={mentorBoard.viewingProfile}
        onClose={() => mentorBoard.setViewingProfile(null)}
      />

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        form={createProjectForm}
        onFormChange={setCreateProjectForm}
        onSubmit={() =>
          createProject(
            {
              name: createProjectForm.name,
              description: createProjectForm.description || undefined,
              domain: createProjectForm.domain,
              batchNo: createProjectForm.batchNo || undefined,
            },
            {
              onSuccess: () => {
                setShowCreateProject(false);
                setCreateProjectForm(EMPTY_FORM);
              },
            },
          )
        }
        isPending={isCreatingProject}
      />
    </>
  );
}
