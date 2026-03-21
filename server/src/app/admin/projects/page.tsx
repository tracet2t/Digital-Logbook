"use client";

import { useEffect, useState } from "react";

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
import {
  Beaker,
  BookOpen,
  CheckCircle,
  Cpu,
  Film,
  FolderOpen,
  Globe,
  MoreVertical,
  Trash2,
  Users,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import AsideSidebar from "@/components/AsideSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  software: <Cpu size={18} className="text-[#737373]" />,
  film: <Film size={18} className="text-[#737373]" />,
  training: <BookOpen size={18} className="text-[#737373]" />,
  research: <Beaker size={18} className="text-[#737373]" />,
  other: <Globe size={18} className="text-[#737373]" />,
};

const DOMAIN_LABELS: Record<string, string> = {
  software: "Software",
  film: "Film",
  training: "Training",
  research: "Research",
  other: "Other",
};

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM = { name: "", description: "", domain: "software" };

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [domainFilter, setDomainFilter] = useState<string>("all");
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
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  function openEdit(project: AdminProject) {
    setEditProject(project);
    setEditForm({
      name: project.name,
      description: project.description,
      domain: project.domain,
    });
  }

  async function handleEditSave() {
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
  }

  async function handleCreateSave() {
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
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProject(deleteId);
      setDeleteId(null);
      reload();
    } finally {
      setDeleting(false);
    }
  }

  const allProjects: AdminProject[] = stats?.projects ?? [];

  const filtered = allProjects.filter((p) =>
    domainFilter === "all" ? true : p.domain === domainFilter,
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const displayedProjects = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex min-h-screen bg-[#f1f1f9]">
      <AsideSidebar />

      <div className="flex-1 p-8 space-y-6 min-w-0">
        {/* Header + Stat Cards */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-page-title text-[#0A0A0A]">Projects</h1>
            <Button
              className="bg-[#0A0A0A] text-white hover:bg-[#333] flex items-center gap-2"
              onClick={() => {
                setCreateForm(EMPTY_FORM);
                setShowCreate(true);
              }}
            >
              + Create New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
              <div>
                <p className="text-sm text-[#737373]">Total Projects</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">
                  {loading ? "—" : (stats?.totalProjects ?? 0)}
                </p>
              </div>
              <FolderOpen className="text-[#737373]" size={28} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
              <div>
                <p className="text-sm text-[#737373]">Total Mentors</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">
                  {loading ? "—" : (stats?.totalMentors ?? 0)}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={28} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
              <div>
                <p className="text-sm text-[#737373]">Total Students</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">
                  {loading ? "—" : (stats?.totalStudents ?? 0)}
                </p>
              </div>
              <Users className="text-blue-500" size={28} />
            </div>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select
            value={domainFilter}
            onValueChange={(v) => {
              setDomainFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] bg-white border-[#E5E5E5]">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="film">Film</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {domainFilter !== "all" && (
            <Button
              variant="ghost"
              className="text-[#737373] hover:text-[#0A0A0A]"
              onClick={() => {
                setDomainFilter("all");
                setPage(1);
              }}
            >
              Reset
            </Button>
          )}
        </div>

        {/* Table */}
        <Card className="overflow-visible">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-[#F5F5F5]">
                  <TableHead className="text-xs font-bold uppercase text-[#737373] py-4 px-6">
                    Project Name
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-[#737373] py-4 px-4">
                    Domain
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-[#737373] py-4 px-4">
                    Mentors
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-[#737373] py-4 px-4">
                    Students
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-[#737373] py-4 px-4">
                    Created By
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-[#737373] py-4 px-4">
                    Created Date
                  </TableHead>
                  <TableHead className="py-4 px-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-[#737373]"
                    >
                      Loading projects…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && displayedProjects.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-[#737373]"
                    >
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
                {displayedProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F0F0F0] shrink-0">
                          {DOMAIN_ICONS[project.domain] ?? (
                            <Globe size={18} className="text-[#737373]" />
                          )}
                        </div>
                        <span className="font-semibold text-[#0A0A0A]">
                          {project.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EBEBEB] text-[#0A0A0A]">
                        {DOMAIN_LABELS[project.domain] ?? project.domain}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[#0A0A0A] font-medium">
                      {project.mentors}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[#0A0A0A] font-medium">
                      {project.students}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[#0A0A0A] font-semibold">
                      {project.createdBy}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[#737373]">
                      {project.createdDate}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#737373] hover:text-[#0A0A0A]"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onSelect={() => setViewProject(project)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => openEdit(project)}>
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onSelect={() => setDeleteId(project.id)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#737373]">
              Showing{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {filtered.length === 0
                  ? 0
                  : (currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {filtered.length}
              </span>{" "}
              results
            </p>
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={currentPage === p}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>

      {/* ── View Details Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={!!viewProject}
        onOpenChange={(open) => !open && setViewProject(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {viewProject && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F0F0] shrink-0">
                  {DOMAIN_ICONS[viewProject.domain] ?? (
                    <Globe size={18} className="text-[#737373]" />
                  )}
                </div>
                <p className="text-lg font-bold text-[#0A0A0A]">
                  {viewProject.name}
                </p>
              </div>
              {viewProject.description && (
                <div>
                  <p className="text-xs font-semibold uppercase text-[#737373] mb-1">
                    Description
                  </p>
                  <p className="text-[#0A0A0A]">{viewProject.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#737373] mb-1">
                    Domain
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EBEBEB] text-[#0A0A0A]">
                    {DOMAIN_LABELS[viewProject.domain] ?? viewProject.domain}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#737373] mb-1">
                    Created Date
                  </p>
                  <p className="text-[#0A0A0A]">{viewProject.createdDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#737373] mb-1">
                    Mentors
                  </p>
                  <p className="text-[#0A0A0A] font-semibold">
                    {viewProject.mentors}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#737373] mb-1">
                    Students
                  </p>
                  <p className="text-[#0A0A0A] font-semibold">
                    {viewProject.students}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-[#737373] mb-1">
                  Created By
                </p>
                <p className="text-[#0A0A0A]">{viewProject.createdBy}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Project Dialog ───────────────────────────────────────────── */}
      <Dialog
        open={!!editProject}
        onOpenChange={(open) => !open && setEditProject(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-desc">Description (optional)</Label>
              <Textarea
                id="edit-desc"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description of the project"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Domain</Label>
              <Select
                value={editForm.domain}
                onValueChange={(v) => setEditForm((f) => ({ ...f, domain: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="film">Film</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={editSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-[#0A0A0A] text-white hover:bg-[#333]"
              onClick={handleEditSave}
              disabled={editSaving || !editForm.name.trim()}
            >
              {editSaving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create New Project Dialog ─────────────────────────────────────── */}
      <Dialog
        open={showCreate}
        onOpenChange={(open) => !open && setShowCreate(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="create-name">Project Name</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-desc">Description (optional)</Label>
              <Textarea
                id="create-desc"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description of the project"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Domain</Label>
              <Select
                value={createForm.domain}
                onValueChange={(v) =>
                  setCreateForm((f) => ({ ...f, domain: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="film">Film</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={createSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-[#0A0A0A] text-white hover:bg-[#333]"
              onClick={handleCreateSave}
              disabled={createSaving || !createForm.name.trim()}
            >
              {createSaving ? "Creating…" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ───────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project and remove all mentor and
              student assignments associated with it. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
