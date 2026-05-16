"use client";

import { useProjectsPage } from "@/_hooks/projects/useProjectsPage";
import { Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  AdminPageLayout,
  AdminPagination,
  ConfirmDeleteDialog,
  FilterBar,
  PageHeader,
} from "@/components/admin";
import ProjectsStats from "@/components/admin-dashboard/ProjectsStats";
import ProjectsTable from "@/components/admin-dashboard/ProjectsTable";
import ProjectFormDialog from "@/components/admin/ProjectFormDialog";
import ViewProjectDialog from "@/components/admin/ViewProjectDialog";

import { ITEMS_PER_PAGE } from "./_constants";

export default function ProjectsPage() {
  const {
    stats,
    loading,
    pagedProjects,
    page,
    totalPages,
    totalProjects,
    setPage,
    search,
    setSearch,
    viewProject,
    setViewProject,
    editProject,
    editForm,
    setEditForm,
    editSaving,
    handleEditSave,
    openEdit,
    closeEdit,
    showCreate,
    createForm,
    setCreateForm,
    createSaving,
    handleCreateSave,
    openCreate,
    closeCreate,
    deleteId,
    setDeleteId,
    deleting,
    handleDelete,
  } = useProjectsPage();

  return (
    <>
      <AdminPageLayout>
        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-4 p-4 md:p-5">
              <PageHeader
                title="Projects"
                subtitle="Manage and organize all projects with mentors and mentees."
              />

              <ProjectsStats
                loading={loading}
                totalProjects={stats?.totalProjects ?? 0}
                totalMentors={stats?.totalMentors ?? 0}
                totalStudents={stats?.totalStudents ?? 0}
              />

              <FilterBar>
                <FilterBar.Search
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                  placeholder="Search by name, domain, or creator..."
                />
                <button
                  onClick={openCreate}
                  className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-[#000053] text-white text-sm font-medium rounded-lg transition-colors shadow-sm shrink-0 w-full sm:w-auto"
                >
                  <Plus size={15} /> Create Project
                </button>
              </FilterBar>

              <div className="overflow-hidden rounded-lg border border-[#e4e7ed]">
                <ProjectsTable
                  data={pagedProjects}
                  loading={loading}
                  onView={(project) => setViewProject(project as any)}
                  onEdit={(project) => openEdit(project as any)}
                  onDelete={setDeleteId}
                />
                <AdminPagination
                  page={page}
                  totalPages={totalPages}
                  total={totalProjects}
                  itemsPerPage={ITEMS_PER_PAGE}
                  itemLabel="projects"
                  onPageChange={setPage}
                />
              </div>
            </div>
          </Card>
        </div>
      </AdminPageLayout>

      <ViewProjectDialog
        project={viewProject}
        onClose={() => setViewProject(null)}
      />

      <ProjectFormDialog
        open={!!editProject}
        title="Edit Project"
        form={editForm}
        saving={editSaving}
        saveLabel="Save Changes"
        savingLabel="Saving..."
        onFormChange={setEditForm}
        onSave={handleEditSave}
        onClose={closeEdit}
      />

      <ProjectFormDialog
        open={showCreate}
        title="Create New Project"
        form={createForm}
        saving={createSaving}
        saveLabel="Create Project"
        savingLabel="Creating..."
        onFormChange={setCreateForm}
        onSave={handleCreateSave}
        onClose={closeCreate}
      />

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
