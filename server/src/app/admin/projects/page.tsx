"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  AdminProject,
  AdminProjectStats,
} from "@/server_actions/adminProjectActions";
import {
  createProject,
  deleteProject,
  getAdminProjectStats,
  updateProject,
} from "@/server_actions/adminProjectActions";
import { Beaker, BookOpen, Cpu, Film, Globe, Plus, Search } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDeleteDialog } from "@/components/admin";
import ProjectsStats from "@/components/admin-dashboard/ProjectsStats";
import ProjectsTable from "@/components/admin-dashboard/ProjectsTable";
import PageHeader from "@/components/admin/PageHeader";
import AsideSidebar from "@/components/AsideSidebar";

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  software: <Cpu size={18} />,
  film: <Film size={18} />,
  training: <BookOpen size={18} />,
  research: <Beaker size={18} />,
  other: <Globe size={18} />,
};
const DOMAIN_LABELS: Record<string, string> = {
  software: "Software",
  film: "Film",
  training: "Training",
  research: "Research",
  other: "Other",
};
const DOMAIN_OPTIONS = ["software", "film", "training", "research", "other"];
const EMPTY_FORM = { name: "", description: "", domain: "software" as const };

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<AdminProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewProject, setViewProject] = useState<AdminProject | null>(null);
  const [editProject, setEditProject] = useState<AdminProject | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editSaving, setEditSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createSaving, setCreateSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = () => {
    setLoading(true);
    getAdminProjectStats()
      .then(setStats)
      .finally(() => setLoading(false));
  };

  useEffect(() => reload(), []);

  const handleEditSave = async () => {
    if (!editProject) return;
    setEditSaving(true);
    try {
      await updateProject(
        editProject.id,
        editForm.name,
        editForm.description,
        editForm.domain,
      );
      setEditProject(null);
      reload();
    } finally {
      setEditSaving(false);
    }
  };

  const handleCreateSave = async () => {
    setCreateSaving(true);
    try {
      await createProject(
        createForm.name,
        createForm.description,
        createForm.domain,
      );
      setShowCreate(false);
      setCreateForm(EMPTY_FORM);
      reload();
    } finally {
      setCreateSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProject(deleteId);
      setDeleteId(null);
      reload();
    } finally {
      setDeleting(false);
    }
  };

  // Filtered projects based on search
  const filteredProjects = useMemo(() => {
    const allProjects = stats?.projects ?? [];
    const query = search.trim().toLowerCase();
    return query.length === 0
      ? allProjects
      : allProjects.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.domain.toLowerCase().includes(query) ||
            p.createdBy.toLowerCase().includes(query),
        );
  }, [stats?.projects, search]);

  const ITEMS_PER_PAGE = 10;
  const totalProjects = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const startCount =
    filteredProjects.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endCount = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredProjects.length,
  );

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    setPage(nextPage);
  };

  const renderSelectItems = () =>
    DOMAIN_OPTIONS.map((d) => (
      <SelectItem key={d} value={d}>
        {DOMAIN_LABELS[d]}
      </SelectItem>
    ));

  return (
    <>
      <div className="flex min-h-screen bg-[#f5f7fb]">
        <AsideSidebar />

        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-4 p-4 md:p-5">
              {/* Header */}
              <div>
                <PageHeader
                  title="Projects"
                  subtitle="Manage and organize all projects with mentors and students."
                />
              </div>

              {/* Stats Cards */}
              <ProjectsStats
                loading={loading}
                totalProjects={stats?.totalProjects ?? 0}
                totalMentors={stats?.totalMentors ?? 0}
                totalStudents={stats?.totalStudents ?? 0}
              />

              {/* Search and Create Button Bar */}
              <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[#e4e7ed] bg-[#f8fafc] p-3">
                <div className="w-full sm:w-auto space-y-1">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Search
                  </p>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="h-8 w-full sm:w-[280px] rounded-lg border border-[#dbe0e8] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search by name, domain, or creator..."
                    />
                  </div>
                </div>

                {/* Create Button */}
                <button
                  onClick={() => {
                    setCreateForm(EMPTY_FORM);
                    setShowCreate(true);
                  }}
                  className="ml-auto inline-flex items-center justify-center gap-2 h-9 px-4 bg-[#4F46E5] hover:bg-[#4F46E5] text-white text-sm font-medium rounded-lg transition-colors shadow-sm shrink-0 w-full sm:w-auto"
                >
                  <Plus size={15} /> Create Project
                </button>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-lg border border-[#e4e7ed]">
                <ProjectsTable
                  data={pagedProjects.map((p) => ({
                    id: p.id,
                    name: p.name,
                    domain: p.domain,
                    mentors: p.mentors,
                    students: p.students,
                    createdBy: p.createdBy,
                    createdDate: p.createdDate,
                    description: p.description,
                  }))}
                  loading={loading}
                  domainIcons={DOMAIN_ICONS}
                  domainLabels={DOMAIN_LABELS}
                  onView={(project) => setViewProject(project as any)}
                  onEdit={(project) => {
                    setEditProject(project as any);
                    setEditForm({
                      name: project.name,
                      description: project.description || "",
                      domain: (project.domain as any) || "software",
                    });
                  }}
                  onDelete={setDeleteId}
                />

                {/* Pagination Footer */}
                <div className="flex flex-col gap-3 border-t border-[#e4e7ed] px-4 py-3 sm:flex-row sm:items-center sm:justify-between bg-white">
                  <p className="text-sm text-slate-500">
                    Showing {startCount} to {endCount} of {totalProjects}{" "}
                    projects
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 px-3 rounded border border-[#dbe0e8] text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? "bg-[#18181B] text-white"
                                : "border border-[#dbe0e8] text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 px-3 rounded border border-[#dbe0e8] text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/** Reusable Dialogs */}
      {viewProject && (
        <Dialog open onOpenChange={(open) => !open && setViewProject(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F0F0] shrink-0">
                  {DOMAIN_ICONS[viewProject.domain] ?? <Globe size={18} />}
                </div>
                <p className="text-lg font-bold">{viewProject.name}</p>
              </div>
              {viewProject.description && <p>{viewProject.description}</p>}
              <div className="grid grid-cols-2 gap-4">
                {["Domain", "Created Date", "Mentors", "Students"].map(
                  (l, i) => (
                    <div key={i}>
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        {l}
                      </p>
                      <p className="font-semibold text-slate-900">
                        {l === "Domain"
                          ? DOMAIN_LABELS[viewProject.domain]
                          : l === "Created Date"
                            ? viewProject.createdDate
                            : l === "Mentors"
                              ? viewProject.mentors
                              : viewProject.students}
                      </p>
                    </div>
                  ),
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Created By
                </p>
                <p className="text-slate-900">{viewProject.createdBy}</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {[
        {
          show: !!editProject,
          form: editForm,
          setForm: setEditForm,
          onSave: handleEditSave,
          saving: editSaving,
          title: "Edit Project",
          onClose: () => setEditProject(null),
        },
        {
          show: showCreate,
          form: createForm,
          setForm: setCreateForm,
          onSave: handleCreateSave,
          saving: createSaving,
          title: "Create New Project",
          onClose: () => setShowCreate(false),
        },
      ].map(
        (d, i) =>
          d.show && (
            <Dialog key={i} open onOpenChange={(open) => !open && d.onClose()}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{d.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Project Name</Label>
                    <Input
                      value={d.form.name}
                      onChange={(e) =>
                        d.setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={d.form.description}
                      onChange={(e) =>
                        d.setForm((f) => ({
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
                      value={d.form.domain}
                      onValueChange={(v) =>
                        d.setForm((f) => ({ ...f, domain: v as any }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>{renderSelectItems()}</SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" disabled={d.saving}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    className="bg-[#18181B] text-white hover:bg-[#27272A]"
                    onClick={d.onSave}
                    disabled={d.saving || !d.form.name.trim()}
                  >
                    {d.saving
                      ? d.title.includes("Edit")
                        ? "Saving…"
                        : "Creating…"
                      : d.title.includes("Edit")
                        ? "Save Changes"
                        : "Create Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ),
      )}

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleting}
        title="Delete Project"
        description="This will permanently delete the project and all associated data. This action cannot be undone."
      />
    </>
  );
}
