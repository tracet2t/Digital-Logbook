"use client";

import { useEffect, useState } from "react";

import {
  useAssignMenteeToProject,
  useAssignMentorToProject,
  useMentorAllocations,
  useOnboardingApplications,
  useProjectApplicationAllocations,
  useUnassignedMentors,
  useUnassignMentee,
  useUnassignMentor,
} from "@/_hooks/admin/useAdminOnboarding";
import { useKanbanBoard } from "@/_hooks/admin/useKanbanBoard";
import { useCreateProject, useGetProjects } from "@/_hooks/projects";
import { CheckCircle2, UserCheck, UserRound } from "lucide-react";

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

// blank slate for the "create project" form — we always reset to this before opening the dialog
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
  // controls whether the "create project" dialog is visible
  const [showCreateProject, setShowCreateProject] = useState(false);
  // holds the current values typed into the create-project form
  const [createProjectForm, setCreateProjectForm] =
    useState<ProjectFormState>(EMPTY_FORM);
  // bench search for filtering mentee bench by name
  const [benchSearch, setBenchSearch] = useState("");
  // bench search for filtering mentor bench by name
  const [mentorBenchSearch, setMentorBenchSearch] = useState("");

  // fetch all pending/approved mentee applications for the bench
  const { data: applications = [], isLoading } = useOnboardingApplications();
  // fetch mentors who haven't been assigned to a project yet
  const { data: mentorApplications = [], isLoading: mentorLoading } =
    useUnassignedMentors();
  // all existing projects — used to populate the kanban columns
  const { data: projectsData = [], isLoading: projectsLoading } =
    useGetProjects();
  // Local state for project order (sortable)
  const [projects, setProjects] = useState<Project[]>([]);

  // Sync fetched projects to local state on load
  useEffect(() => {
    if (projectsData.length > 0 && projects.length === 0) {
      setProjects(projectsData);
    }
  }, [projectsData]);
  // current mentee-to-project assignments (so we know who's already placed)
  const { data: allocations } = useProjectApplicationAllocations();
  // same but for mentors
  const { data: mentorAllocations } = useMentorAllocations();

  // mutation hooks for dragging mentees/mentors onto or off of a project
  const assignMentee = useAssignMenteeToProject();
  const unassignMentee = useUnassignMentee();
  const assignMentor = useAssignMentorToProject();
  const unassignMentor = useUnassignMentor();
  const { mutate: createProject, isPending: isCreatingProject } =
    useCreateProject();

  // set up the kanban board state for the mentee tab —
  // maps existing allocations into the shape the hook expects, then wires
  // the assign/unassign callbacks to the actual API mutations
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

  // same board setup but for the mentor tab
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

  // quick summary numbers shown in the stat cards at the top of the mentee tab
  const menteeCounts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
  };

  // same counts for the mentor tab
  const mentorCounts = {
    total: mentorApplications.length,
    pending: mentorApplications.filter((a) => a.status === "pending").length,
    approved: mentorApplications.filter((a) => a.status === "approved").length,
  };

  // reset the form and pop open the create-project dialog
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
                    setProjects={setProjects}
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
                    benchSearch={benchSearch}
                    onBenchSearchChange={setBenchSearch}
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
                    setProjects={setProjects}
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
                    benchSearch={mentorBenchSearch}
                    onBenchSearchChange={setMentorBenchSearch}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </AdminPageLayout>

      {/* profile viewer — shared between both tabs, only one opens at a time */}
      <ApplicantDialog
        application={menteeBoard.viewingProfile}
        onClose={() => menteeBoard.setViewingProfile(null)}
      />
      <ApplicantDialog
        application={mentorBoard.viewingProfile}
        onClose={() => mentorBoard.setViewingProfile(null)}
      />

      {/* create project dialog — on success, close it and wipe the form */}
      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        form={createProjectForm}
        onFormChange={setCreateProjectForm}
        onSubmit={() =>
          createProject(
            {
              name: createProjectForm.name,
              // only send optional fields if they have a value
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
