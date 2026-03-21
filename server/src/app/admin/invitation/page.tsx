"use client";

import React, { useEffect, useState } from "react";

import { Project } from "@prisma/client";
import { Plus } from "lucide-react";
import { z } from "zod";

import {
  useChangeInvitationStatus,
  useDeleteInvitation,
  useInvitation,
  useRecentInvitations,
} from "@/hooks/admin/useInvitation";
import AsideSidebar from "@/components/AsideSidebar";
import ChangeStatusDialog from "@/components/Invitations/dialogs/ChangeStatusDialog";
import CreateInvitationDialog from "@/components/Invitations/dialogs/CreateInvitationDialog";
import DeleteInvitationDialog from "@/components/Invitations/dialogs/DeleteDialog";
import ViewInvitationDialog from "@/components/Invitations/dialogs/viewInvitationDialog";
import InvitationsPagination from "@/components/Invitations/InvitationsPagination";
import InvitationsTable, {
  InvitationRow,
} from "@/components/Invitations/InvitationsTable";
import InvitationsStats from "@/components/Invitations/InvitationStats";

// Constants
const ITEMS_PER_PAGE = 10;

// Zod Schema
const inviteSchema = z.object({
  role: z.string().min(1, { message: "Role is required" }),
  firstName: z.string().min(2, { message: "Must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  project: z.string().min(1, { message: "Project is required" }),
});

export default function InvitationsView() {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    project: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [viewInv, setViewInv] = useState<InvitationRow | null>(null);
  const [changeStatusInv, setChangeStatusInv] = useState<InvitationRow | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    "Accepted" | "Pending" | "Expired"
  >("Pending");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Hooks
  const { mutate: sendInvitation, isPending } = useInvitation();
  const {
    data: recentInvitations,
    isLoading: isInvLoading,
    isError: isInvError,
  } = useRecentInvitations();
  const { mutate: changeStatus, isPending: isChangingStatus } =
    useChangeInvitationStatus();
  const { mutate: deleteInvitation, isPending: isDeleting } =
    useDeleteInvitation();

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project", { cache: "no-store" });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  // Form handling
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    const result = inviteSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0])
          fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    sendInvitation(
      {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as "student" | "mentor" | "superAdmin",
        projectId: formData.project,
      },
      {
        onSuccess: () => {
          setFormData({
            role: "",
            firstName: "",
            lastName: "",
            email: "",
            project: "",
          });
          setCreateOpen(false);
        },
      },
    );
  };

  // Invitations list
  const invList: InvitationRow[] =
    (recentInvitations as InvitationRow[] | undefined) ?? [];
  const totalInvitations = invList.length;
  const pendingCount = invList.filter((i) => i.status === "Pending").length;
  const acceptedCount = invList.filter((i) => i.status === "Accepted").length;
  const expiredCount = invList.filter((i) => i.status === "Expired").length;
  const totalPages = Math.max(1, Math.ceil(totalInvitations / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedInvitations = invList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="flex min-h-screen bg-[#f5f5f7]">
        <AsideSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-page-title text-slate-900">Invitations</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage organizational access and track member onboarding.
              </p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 h-9 px-4 bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-medium rounded-lg transition-colors shadow-sm shrink-0"
            >
              <Plus size={15} /> Create Invitation
            </button>
          </div>

          <div className="flex-1 px-8 py-6 space-y-6">
            {/* Stats */}
            <InvitationsStats
              loading={isInvLoading}
              total={totalInvitations}
              pending={pendingCount}
              accepted={acceptedCount}
              expired={expiredCount}
            />

            {/* Table */}
            <InvitationsTable
              data={pagedInvitations}
              loading={isInvLoading}
              error={isInvError || false}
              onView={setViewInv}
              onChangeStatus={(inv) => {
                setChangeStatusInv(inv);
                setSelectedStatus(inv.status);
              }}
              onDelete={setDeleteId}
            />

            {/* Pagination */}
            <InvitationsPagination
              page={currentPage}
              totalPages={totalPages}
              total={totalInvitations}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateInvitationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        formData={formData}
        errors={errors}
        projects={projects}
        isPending={isPending}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      <ViewInvitationDialog
        invitation={viewInv}
        onClose={() => setViewInv(null)}
      />
      <ChangeStatusDialog
        invitation={changeStatusInv}
        selectedStatus={selectedStatus}
        onChangeStatus={setSelectedStatus}
        onSave={() =>
          changeStatusInv &&
          changeStatus(
            { id: changeStatusInv.id, status: selectedStatus },
            { onSettled: () => setChangeStatusInv(null) },
          )
        }
        isPending={isChangingStatus}
        onClose={() => setChangeStatusInv(null)}
      />
      <DeleteInvitationDialog
        open={!!deleteId}
        onOpenChange={(open: any) => !open && setDeleteId(null)}
        onDelete={() =>
          deleteId &&
          deleteInvitation(
            { id: deleteId },
            { onSettled: () => setDeleteId(null) },
          )
        }
        isDeleting={isDeleting}
      />
    </>
  );
}
