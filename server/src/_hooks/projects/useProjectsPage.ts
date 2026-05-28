/**
 * useProjectsPage.ts
 * Custom hook that owns all state and business logic for the Projects admin page.
 * Encapsulates data fetching, search filtering, pagination, and CRUD dialog
 */

import { useEffect, useMemo, useState } from "react";

import {
  DOMAIN_LABELS,
  DOMAIN_OPTIONS,
  EMPTY_FORM,
  ITEMS_PER_PAGE,
  type ProjectFormValues,
} from "@/app/admin/projects/_constants";
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

export function useProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<AdminProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewProject, setViewProject] = useState<AdminProject | null>(null);

  const [editProject, setEditProject] = useState<AdminProject | null>(null);
  const [editForm, setEditForm] = useState<ProjectFormValues>(EMPTY_FORM);
  const [editSaving, setEditSaving] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<ProjectFormValues>(EMPTY_FORM);
  const [createSaving, setCreateSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  /** Fetches the latest project stats from the server and updates state. */
  const reload = () => {
    setLoading(true);
    getAdminProjectStats()
      .then(setStats)
      .finally(() => setLoading(false));
  };

  useEffect(() => reload(), []);

  const normalizeDomainForSave = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const lowered = trimmed.toLowerCase();
    const labelMatch = DOMAIN_OPTIONS.find(
      (d) => DOMAIN_LABELS[d].toLowerCase() === lowered,
    );
    if (labelMatch) return labelMatch;
    const keyMatch = DOMAIN_OPTIONS.find((d) => d.toLowerCase() === lowered);
    if (keyMatch) return keyMatch;
    return trimmed;
  };

  const toDisplayDomain = (value: string | null | undefined) => {
    if (!value) return "";
    return DOMAIN_LABELS[value] ?? value;
  };

  /** Submits the edit form, updates the project, then refreshes the list. */
  const handleEditSave = async () => {
    if (!editProject) return;
    setEditSaving(true);
    try {
      await updateProject(
        editProject.id,
        editForm.name,
        editForm.description,
        normalizeDomainForSave(editForm.domain),
        editForm.batchNo,
      );
      setEditProject(null);
      reload();
    } finally {
      setEditSaving(false);
    }
  };

  /** Submits the create form, creates a new project, then refreshes the list. */
  const handleCreateSave = async () => {
    setCreateSaving(true);
    try {
      await createProject(
        createForm.name,
        createForm.description,
        normalizeDomainForSave(createForm.domain),
        createForm.batchNo,
      );
      setShowCreate(false);
      setCreateForm(EMPTY_FORM);
      reload();
    } finally {
      setCreateSaving(false);
    }
  };

  /** Deletes the project identified by deleteId, then refreshes the list. */
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

  /** Opens the Edit dialog pre-populated with the given project's current values. */
  const openEdit = (project: AdminProject) => {
    setEditProject(project);
    setEditForm({
      name: project.name,
      description: project.description ?? "",
      domain: toDisplayDomain(project.domain),
      batchNo: project.batchNo ?? "",
    });
  };

  /** Resets the create form to empty values and opens the Create dialog. */
  const openCreate = () => {
    setCreateForm(EMPTY_FORM);
    setShowCreate(true);
  };

  /** Filters the full project list by the current search query (name, domain, or creator). */
  const filteredProjects = useMemo(() => {
    const allProjects = stats?.projects ?? [];
    const query = search.trim().toLowerCase();
    if (query.length === 0) return allProjects;
    return allProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.domain.toLowerCase().includes(query) ||
        p.createdBy.toLowerCase().includes(query),
    );
  }, [stats?.projects, search]);

  const totalProjects = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return {
    // Data
    stats,
    loading,
    pagedProjects,
    // Pagination
    page: currentPage,
    totalPages,
    totalProjects,
    setPage,
    // Search
    search,
    setSearch,
    // View dialog
    viewProject,
    setViewProject,
    // Edit dialog
    editProject,
    editForm,
    setEditForm,
    editSaving,
    handleEditSave,
    openEdit,
    closeEdit: () => setEditProject(null),
    // Create dialog
    showCreate,
    createForm,
    setCreateForm,
    createSaving,
    handleCreateSave,
    openCreate,
    closeCreate: () => setShowCreate(false),
    // Delete dialog
    deleteId,
    setDeleteId,
    deleting,
    handleDelete,
  };
}
