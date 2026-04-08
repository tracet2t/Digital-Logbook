"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  CheckCircle2,
  Plus,
  UserCheck,
  UserRound,
} from "lucide-react";

import {
  OnboardingApplication,
  useAssignMenteeToProject,
  useAssignMentorToProject,
  useMentorAllocations,
  useOnboardingApplications,
  useProjectApplicationAllocations,
  useUnassignedMentors,
  useUnassignMentee,
  useUnassignMentor,
} from "@/hooks/admin/useAdminOnboarding";
import {
  useCreateProject,
  useGetProjects,
} from "@/hooks/projects";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageLayout, PageHeader } from "@/components/admin";
import {
  ApplicantDialog,
  BenchCard,
  formatDate,
  getInitials,
  ProjectCard,
  StatCard,
} from "@/components/admin/kanban";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminOnboardingPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [projectAssignments, setProjectAssignments] = useState<
    Record<string, Set<string>>
  >({});
  const [viewingProfile, setViewingProfile] =
    useState<OnboardingApplication | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [createProjectForm, setCreateProjectForm] = useState({
    name: "",
    description: "",
    domain: "software",
  });

  // ── Mentor tab state ──
  const [mentorSelectedIds, setMentorSelectedIds] = useState<Set<string>>(
    new Set(),
  );
  const [mentorAssignments, setMentorAssignments] = useState<
    Record<string, Set<string>>
  >({});
  const [mentorViewingProfile, setMentorViewingProfile] =
    useState<OnboardingApplication | null>(null);
  const [mentorActiveId, setMentorActiveId] = useState<string | null>(null);

  const initialized = useRef(false);
  const mentorInitialized = useRef(false);

  const { data: applications = [], isLoading } = useOnboardingApplications();
  const { data: projects = [], isLoading: projectsLoading } = useGetProjects();
  const { data: allocations } = useProjectApplicationAllocations();
  const { data: mentorAllocations } = useMentorAllocations();
  const assignMentee = useAssignMenteeToProject();
  const unassignMentee = useUnassignMentee();
  const assignMentor = useAssignMentorToProject();
  const unassignMentor = useUnassignMentor();
  const { mutate: createProject, isPending: isCreatingProject } =
    useCreateProject();

  const activeProjects = useMemo(() => projects, [projects]);

  // Require 8px movement before drag activates so clicks still work normally
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // Rehydrate mentee Kanban board from DB allocations (runs once after data loads)
  useEffect(() => {
    if (initialized.current) return;
    if (!allocations || allocations.length === 0) return;

    initialized.current = true;
    const map: Record<string, Set<string>> = {};
    for (const { applicationId, projectId } of allocations) {
      if (!map[projectId]) map[projectId] = new Set();
      map[projectId].add(applicationId);
    }
    setProjectAssignments(map);
  }, [allocations]);

  // Rehydrate mentor Kanban board from DB allocations (runs once after data loads)
  useEffect(() => {
    if (mentorInitialized.current) return;
    if (!mentorAllocations || mentorAllocations.length === 0) return;

    mentorInitialized.current = true;
    const map: Record<string, Set<string>> = {};
    for (const { mentorId, projectId } of mentorAllocations) {
      if (!map[projectId]) map[projectId] = new Set();
      map[projectId].add(mentorId);
    }
    setMentorAssignments(map);
  }, [mentorAllocations]);

  // Derived counts
  const counts = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
  }, [applications]);

  // IDs that are already assigned to a project
  const allAssignedIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(projectAssignments).forEach((set) =>
      set.forEach((id) => ids.add(id)),
    );
    return ids;
  }, [projectAssignments]);

  // Bench = all applicants not yet placed on a project (pending + approved)
  const benchApplications = useMemo(
    () =>
      applications.filter(
        (a) => a.status !== "rejected" && !allAssignedIds.has(a.id),
      ),
    [applications, allAssignedIds],
  );

  // Application for the item currently being dragged (used by DragOverlay)
  const activeApplication = useMemo(
    () =>
      activeId ? (applications.find((a) => a.id === activeId) ?? null) : null,
    [activeId, applications],
  );

  // When activeId is part of a multi-selection, show count in the overlay
  const dragCount =
    activeId && selectedIds.has(activeId) ? selectedIds.size : 1;

  // ── Mentor derived values ──
  const { data: mentorApplications = [], isLoading: mentorLoading } =
    useUnassignedMentors();

  const mentorCounts = useMemo(
    () => ({
      total: mentorApplications.length,
      pending: mentorApplications.filter((a) => a.status === "pending").length,
      approved: mentorApplications.filter((a) => a.status === "approved")
        .length,
    }),
    [mentorApplications],
  );

  const mentorAssignedIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(mentorAssignments).forEach((set) =>
      set.forEach((id) => ids.add(id)),
    );
    return ids;
  }, [mentorAssignments]);

  const mentorBench = useMemo(
    () =>
      mentorApplications.filter(
        (a) => a.status !== "rejected" && !mentorAssignedIds.has(a.id),
      ),
    [mentorApplications, mentorAssignedIds],
  );

  const mentorActiveApplication = useMemo(
    () =>
      mentorActiveId
        ? (mentorApplications.find((a) => a.id === mentorActiveId) ?? null)
        : null,
    [mentorActiveId, mentorApplications],
  );

  const mentorDragCount =
    mentorActiveId && mentorSelectedIds.has(mentorActiveId)
      ? mentorSelectedIds.size
      : 1;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const projectId = over.id as string;
    // If the dragged item is part of a multi-selection, move all selected IDs
    const draggedIds = selectedIds.has(active.id as string)
      ? Array.from(selectedIds)
      : [active.id as string];

    // Snapshot for rollback on error
    const snapshot = { ...projectAssignments };

    // Optimistic: move dragged IDs to the target project
    setProjectAssignments((prev) => {
      const next: Record<string, Set<string>> = {};
      for (const pid of Object.keys(prev)) {
        const s = new Set(prev[pid]);
        if (pid !== projectId) draggedIds.forEach((id) => s.delete(id));
        next[pid] = s;
      }
      const target = new Set(next[projectId] ?? []);
      draggedIds.forEach((id) => target.add(id));
      next[projectId] = target;
      return next;
    });

    setSelectedIds(new Set());

    // Persist each assignment to the DB
    draggedIds.forEach((applicationId) => {
      assignMentee.mutate(
        { applicationId, projectId },
        {
          onError: () => {
            setProjectAssignments(snapshot);
          },
        },
      );
    });
  };

  // ── Mentor DnD handlers ──
  const handleMentorDragStart = (event: DragStartEvent) => {
    setMentorActiveId(event.active.id as string);
  };

  const handleMentorDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setMentorActiveId(null);
    if (!over) return;
    const projectId = over.id as string;
    const draggedIds = mentorSelectedIds.has(active.id as string)
      ? Array.from(mentorSelectedIds)
      : [active.id as string];

    // Snapshot for rollback on error
    const snapshot = { ...mentorAssignments };

    // Optimistic update
    setMentorAssignments((prev) => {
      const next: Record<string, Set<string>> = {};
      for (const pid of Object.keys(prev)) {
        const s = new Set(prev[pid]);
        if (pid !== projectId) draggedIds.forEach((id) => s.delete(id));
        next[pid] = s;
      }
      const target = new Set(next[projectId] ?? []);
      draggedIds.forEach((id) => target.add(id));
      next[projectId] = target;
      return next;
    });
    setMentorSelectedIds(new Set());

    // Persist each assignment to the DB
    draggedIds.forEach((mentorId) => {
      assignMentor.mutate(
        { mentorId, projectId },
        {
          onError: () => {
            setMentorAssignments(snapshot);
          },
        },
      );
    });
  };

  const handleMentorUnassign = (projectId: string, appId: string) => {
    const snapshot = { ...mentorAssignments };

    setMentorAssignments((prev) => {
      const s = new Set(prev[projectId] ?? []);
      s.delete(appId);
      return { ...prev, [projectId]: s };
    });

    unassignMentor.mutate(
      { mentorId: appId, projectId },
      {
        onError: () => {
          setMentorAssignments(snapshot);
        },
      },
    );
  };

  // Remove a member from a project back to the bench
  const handleUnassign = (projectId: string, appId: string) => {
    const snapshot = { ...projectAssignments };

    setProjectAssignments((prev) => {
      const s = new Set(prev[projectId] ?? []);
      s.delete(appId);
      return { ...prev, [projectId]: s };
    });

    unassignMentee.mutate(
      { applicationId: appId, projectId },
      {
        onError: () => {
          setProjectAssignments(snapshot);
        },
      },
    );
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

                {/* ════ MENTEE TAB ════ */}
                <TabsContent value="mentee" className="space-y-6">
                  {/* Stats row */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                      label="Total"
                      value={counts.total}
                      icon={UserRound}
                      tone="slate"
                    />
                    <StatCard
                      label="Pending"
                      value={counts.pending}
                      icon={UserCheck}
                      tone="amber"
                    />
                    <StatCard
                      label="Approved"
                      value={counts.approved}
                      icon={CheckCircle2}
                      tone="emerald"
                    />
                  </div>

                  {/* Kanban board */}
                  <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex gap-6 overflow-hidden rounded-[2.5rem] border border-[#e4e7ed] bg-white p-6">
                      {/* ── LEFT: bench ── */}
                      <div className="flex w-64 shrink-0 flex-col border-r border-slate-100 pr-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#000053]">
                            Mentee Bench
                          </h3>
                          <Badge className="rounded-full border-0 bg-indigo-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-50">
                            {benchApplications.length} Profiles
                          </Badge>
                        </div>
                        <ScrollArea className="flex-1">
                          <div className="space-y-2 pr-1">
                            {isLoading && (
                              <div className="space-y-2">
                                <Skeleton className="h-14 rounded-2xl" />
                                <Skeleton className="h-14 rounded-2xl" />
                                <Skeleton className="h-14 rounded-2xl" />
                              </div>
                            )}
                            {!isLoading && benchApplications.length === 0 && (
                              <div className="rounded-2xl border border-dashed border-slate-100 px-3 py-8 text-center">
                                <p className="text-[10px] text-slate-400">
                                  No applicants on the bench.
                                </p>
                              </div>
                            )}
                            {benchApplications.map((app) => (
                              <BenchCard
                                key={app.id}
                                application={app}
                                selected={selectedIds.has(app.id)}
                                onSelect={(e) => {
                                  e.stopPropagation();
                                  setSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    next.has(app.id)
                                      ? next.delete(app.id)
                                      : next.add(app.id);
                                    return next;
                                  });
                                }}
                                onClick={() => setViewingProfile(app)}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* ── RIGHT: assignment board ── */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-5 flex items-center justify-between">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#000053]">
                            Mentee Assignment
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="bg-slate-50 text-slate-400 hover:bg-slate-100"
                            onClick={() => {
                              setCreateProjectForm({
                                name: "",
                                description: "",
                                domain: "software",
                              });
                              setShowCreateProject(true);
                            }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {projectsLoading ? (
                          <p className="py-10 text-center text-sm text-slate-400">
                            Loading projects...
                          </p>
                        ) : projects.length === 0 ? (
                          <p className="py-10 text-center text-sm text-slate-400">
                            No projects found. Create a project first.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                            {activeProjects.map((project) => {
                              const assignedIds =
                                projectAssignments[project.id] ??
                                new Set<string>();
                              const assignedApps = applications.filter((a) =>
                                assignedIds.has(a.id),
                              );
                              return (
                                <ProjectCard
                                  key={project.id}
                                  project={project}
                                  assignedApplications={assignedApps}
                                  onUnassign={(appId) =>
                                    handleUnassign(project.id, appId)
                                  }
                                  onViewProfile={setViewingProfile}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Floating drag overlay */}
                    <DragOverlay>
                      {activeApplication ? (
                        <div className="flex w-56 cursor-grabbing items-center gap-3 rounded-2xl border border-[#000053] bg-[#000053] p-3 shadow-2xl">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-white/20 text-[10px] font-bold text-white">
                              {getInitials(activeApplication.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">
                              {dragCount > 1
                                ? `Moving ${dragCount} profiles`
                                : activeApplication.fullName}
                            </p>
                            <p className="truncate text-[10px] italic text-indigo-200">
                              {dragCount > 1
                                ? "Drop on a project"
                                : formatDate(activeApplication.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </TabsContent>

                {/* ════ MENTOR TAB ════ */}
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

                  <DndContext
                    sensors={sensors}
                    onDragStart={handleMentorDragStart}
                    onDragEnd={handleMentorDragEnd}
                  >
                    <div className="flex gap-6 overflow-hidden rounded-[2.5rem] border border-[#e4e7ed] bg-white p-6">
                      {/* ── LEFT: mentor bench ── */}
                      <div className="flex w-64 shrink-0 flex-col border-r border-slate-100 pr-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#000053]">
                            Mentor Bench
                          </h3>
                          <Badge className="rounded-full border-0 bg-indigo-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-50">
                            {mentorBench.length} Experts
                          </Badge>
                        </div>
                        <ScrollArea className="flex-1">
                          <div className="space-y-2 pr-1">
                            {mentorLoading && (
                              <>
                                <Skeleton className="h-14 rounded-2xl" />
                                <Skeleton className="h-14 rounded-2xl" />
                                <Skeleton className="h-14 rounded-2xl" />
                              </>
                            )}
                            {!mentorLoading && mentorBench.length === 0 && (
                              <div className="rounded-2xl border border-dashed border-slate-100 px-3 py-8 text-center">
                                <p className="text-[10px] text-slate-400">
                                  No mentors on the bench.
                                </p>
                              </div>
                            )}
                            {!mentorLoading &&
                              mentorBench.map((app) => (
                                <BenchCard
                                  key={app.id}
                                  application={app}
                                  selected={mentorSelectedIds.has(app.id)}
                                  onSelect={(e) => {
                                    e.stopPropagation();
                                    setMentorSelectedIds((prev) => {
                                      const next = new Set(prev);
                                      next.has(app.id)
                                        ? next.delete(app.id)
                                        : next.add(app.id);
                                      return next;
                                    });
                                  }}
                                  onClick={() => setMentorViewingProfile(app)}
                                />
                              ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* ── RIGHT: mentor assignment board ── */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-5 flex items-center justify-between">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#000053]">
                            Mentor Assignment
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="bg-slate-50 text-slate-400 hover:bg-slate-100"
                            onClick={() => {
                              setCreateProjectForm({
                                name: "",
                                description: "",
                                domain: "software",
                              });
                              setShowCreateProject(true);
                            }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {projectsLoading ? (
                          <p className="py-10 text-center text-sm text-slate-400">
                            Loading projects...
                          </p>
                        ) : projects.length === 0 ? (
                          <p className="py-10 text-center text-sm text-slate-400">
                            No projects found. Create a project first.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                            {activeProjects.map((project) => {
                              const assignedIds =
                                mentorAssignments[project.id] ??
                                new Set<string>();
                              const assignedApps = mentorApplications.filter(
                                (a) => assignedIds.has(a.id),
                              );
                              return (
                                <ProjectCard
                                  key={project.id}
                                  project={project}
                                  assignedApplications={assignedApps}
                                  onUnassign={(appId) =>
                                    handleMentorUnassign(project.id, appId)
                                  }
                                  onViewProfile={setMentorViewingProfile}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <DragOverlay>
                      {mentorActiveApplication ? (
                        <div className="flex w-56 cursor-grabbing items-center gap-3 rounded-2xl border border-[#000053] bg-[#000053] p-3 shadow-2xl">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-white/20 text-[10px] font-bold text-white">
                              {getInitials(mentorActiveApplication.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">
                              {mentorDragCount > 1
                                ? `Moving ${mentorDragCount} profiles`
                                : mentorActiveApplication.fullName}
                            </p>
                            <p className="truncate text-[10px] italic text-indigo-200">
                              {mentorDragCount > 1
                                ? "Drop on a project"
                                : formatDate(mentorActiveApplication.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </TabsContent>


              </Tabs>
            </div>
          </Card>
        </div>
      </AdminPageLayout>

      <ApplicantDialog
        application={viewingProfile}
        onClose={() => setViewingProfile(null)}
      />
      <ApplicantDialog
        application={mentorViewingProfile}
        onClose={() => setMentorViewingProfile(null)}
      />

      {/* Create Project Dialog */}
      <Dialog
        open={showCreateProject}
        onOpenChange={(open) => !open && setShowCreateProject(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Project Name</Label>
              <Input
                value={createProjectForm.name}
                onChange={(e) =>
                  setCreateProjectForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Textarea
                value={createProjectForm.description}
                onChange={(e) =>
                  setCreateProjectForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Domain</Label>
              <Select
                value={createProjectForm.domain}
                onValueChange={(v) =>
                  setCreateProjectForm((f) => ({ ...f, domain: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "software", label: "Software" },
                    { value: "film", label: "Film" },
                    { value: "training", label: "Training" },
                    { value: "research", label: "Research" },
                    { value: "other", label: "Other" },
                  ].map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isCreatingProject}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-[#000053] text-white hover:bg-[#000053]"
              disabled={isCreatingProject || !createProjectForm.name.trim()}
              onClick={() => {
                createProject(
                  {
                    name: createProjectForm.name,
                    description: createProjectForm.description || undefined,
                    domain: createProjectForm.domain,
                  },
                  {
                    onSuccess: () => {
                      setShowCreateProject(false);
                      setCreateProjectForm({
                        name: "",
                        description: "",
                        domain: "software",
                      });
                    },
                  },
                );
              }}
            >
              {isCreatingProject ? "Creating…" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
