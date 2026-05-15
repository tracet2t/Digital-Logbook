"use client";

import { useEffect, useMemo, useState } from "react";

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
import {
  useCreateProject,
  useGetProjects,
  useUpdateProjectOrder,
} from "@/_hooks/projects";
import { CheckCircle2, UserCheck, UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPageLayout, FilterBar, PageHeader } from "@/components/admin";
import {
  ApplicantDialog,
  CreateProjectDialog,
  KanbanBoard,
  StatCard,
  type ProjectFormState,
} from "@/components/admin/kanban";

// blank slate for the "create project" form — wen always reset to this before opening the dialog
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
  // email search for filtering mentee/mentor by email
  const [emailSearch, setEmailSearch] = useState("");
  // bench search for filtering mentee bench by name
  const [benchSearch, setBenchSearch] = useState("");
  // bench search for filtering mentor bench by name
  const [mentorBenchSearch, setMentorBenchSearch] = useState("");

  // fetch all pending/approved mentee applications for the bench
  const { data: applications = [], isLoading } = useOnboardingApplications();
  // fetch mentors who haven't been assigned to a project yet
  const { data: mentorApplications = [], isLoading: mentorLoading } =
    useUnassignedMentors();

  const filteredMenteeApplications = useMemo(() => {
    const q = emailSearch.trim().toLowerCase();
    if (q.length === 0) return applications;
    return applications.filter((app) =>
      app.email.toLowerCase().includes(q),
    );
  }, [applications, emailSearch]);

  const filteredMentorApplications = useMemo(() => {
    const q = emailSearch.trim().toLowerCase();
    if (q.length === 0) return mentorApplications;
    return mentorApplications.filter((app) =>
      app.email.toLowerCase().includes(q),
    );
  }, [mentorApplications, emailSearch]);
  // all existing projects — used to populate the kanban columns
  const { data: projectsData = [], isLoading: projectsLoading } =
    useGetProjects();
  // Local state for project order (sortable)
  const [projects, setProjects] = useState<Project[]>([]);

  // Sync fetched projects to local state while preserving manual order
  useEffect(() => {
    setProjects((prev) => {
      if (projectsData.length === 0) {
        return prev.length === 0 ? prev : [];
      }

      const incomingIds = new Set(projectsData.map((p) => p.id));
      const existingIds = new Set(prev.map((p) => p.id));

      const kept = prev.filter((p) => incomingIds.has(p.id));
      const added = projectsData.filter((p) => !existingIds.has(p.id));

      const next = [...kept, ...added];
      if (
        prev.length === next.length &&
        prev.every((project, index) => project.id === next[index]?.id)
      ) {
        return prev;
      }
      return next;
    });
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
  const updateProjectOrder = useUpdateProjectOrder();

  // set up the kanban board state for the mentee tab —
  // maps existing allocations into the shape the hook expects, then wires
  // the assign/unassign callbacks to the actual API mutations
  const menteeBoard = useKanbanBoard({
    allocations: allocations?.map(({ applicationId, projectId }) => ({
      id: applicationId,
      projectId,
    })),
    applications: filteredMenteeApplications,
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
    applications: filteredMentorApplications,
    onAssign: (id, projectId, onError) =>
      assignMentor.mutate({ mentorId: id, projectId }, { onError }),
    onUnassign: (id, projectId, onError) =>
      unassignMentor.mutate({ mentorId: id, projectId }, { onError }),
  });

  const menteeAssignedCount = useMemo(() => {
    const visibleIds = new Set(filteredMenteeApplications.map((a) => a.id));
    const ids = new Set<string>();
    Object.values(menteeBoard.assignments).forEach((set) =>
      set.forEach((id) => {
        if (visibleIds.has(id)) ids.add(id);
      }),
    );
    return ids.size;
  }, [menteeBoard.assignments, filteredMenteeApplications]);

  const mentorAssignedCount = useMemo(() => {
    const visibleIds = new Set(filteredMentorApplications.map((a) => a.id));
    const ids = new Set<string>();
    Object.values(mentorBoard.assignments).forEach((set) =>
      set.forEach((id) => {
        if (visibleIds.has(id)) ids.add(id);
      }),
    );
    return ids.size;
  }, [mentorBoard.assignments, filteredMentorApplications]);

  // quick summary numbers shown in the stat cards at the top of the mentee tab
  const menteeCounts = {
    total: filteredMenteeApplications.length,
    pending: menteeBoard.bench.length,
    approved: menteeAssignedCount,
  };

  // same counts for the mentor tab
  const mentorCounts = {
    total: filteredMentorApplications.length,
    pending: mentorBoard.bench.length,
    approved: mentorAssignedCount,
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

              <FilterBar>
                <FilterBar.Search
                  value={emailSearch}
                  onChange={setEmailSearch}
                  placeholder="Search by email…"
                />
              </FilterBar>

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

                  {emailSearch.trim().length > 0 &&
                    filteredMenteeApplications.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        No users found.
                      </div>
                    )}
                  <KanbanBoard
                    benchLabel="Mentee Bench"
                    benchBadgeText="Profiles"
                    benchEmptyText="No applicants on the bench."
                    assignmentLabel="Mentee Assignment"
                    bench={menteeBoard.bench}
                    isLoading={isLoading}
                    applications={filteredMenteeApplications}
                    assignments={menteeBoard.assignments}
                    projects={projects}
                    setProjects={setProjects}
                    onProjectsReorder={(nextProjects) =>
                      updateProjectOrder.mutate({
                        order: nextProjects.map((project) => project.id),
                      })
                    }
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
                    pendingAction={menteeBoard.pendingAction}
                    onConfirmAction={menteeBoard.confirmPendingAction}
                    onCancelAction={menteeBoard.cancelPendingAction}
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

                  {emailSearch.trim().length > 0 &&
                    filteredMentorApplications.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        No users found.
                      </div>
                    )}
                  <KanbanBoard
                    benchLabel="Mentor Bench"
                    benchBadgeText="Experts"
                    benchEmptyText="No mentors on the bench."
                    assignmentLabel="Mentor Assignment"
                    bench={mentorBoard.bench}
                    isLoading={mentorLoading}
                    applications={filteredMentorApplications}
                    assignments={mentorBoard.assignments}
                    projects={projects}
                    setProjects={setProjects}
                    onProjectsReorder={(nextProjects) =>
                      updateProjectOrder.mutate({
                        order: nextProjects.map((project) => project.id),
                      })
                    }
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
                    pendingAction={mentorBoard.pendingAction}
                    onConfirmAction={mentorBoard.confirmPendingAction}
                    onCancelAction={mentorBoard.cancelPendingAction}
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
              onSuccess: (data) => {
                setProjects((prev) =>
                  prev.some((project) => project.id === data.data.id)
                    ? prev
                    : [...prev, data.data],
                );
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
