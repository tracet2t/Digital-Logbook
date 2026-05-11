"use client";

import React, { useMemo, useState } from "react";

import {
  useChangeInvitationStatus,
  useDeleteInvitation,
  useInvitation,
  useRecentInvitations,
} from "@/_hooks/admin/useInvitation";
import { useGetProjects } from "@/_hooks/projects";
import { BulkUploadTableProvider } from "@/_stores/bulkUploadTableStore";
import {
  ADMIN_LOGO_CONFIG,
  ADMIN_MENU_ITEMS,
} from "@/utils/config/adminSidebarConfig";
import { PanelLeft, Plus, Search } from "lucide-react";
import Image from "next/image";
import { z } from "zod";

import { Card } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkUploadTabs } from "@/components/admin/Invitations/BulkUploadTabs";
import PageHeader from "@/components/admin/PageHeader";
import AsideSidebar from "@/components/AsideSidebar";
import ChangeStatusDialog from "@/components/Invitations/dialogs/ChangeStatusDialog";
import CreateInvitationDialog from "@/components/Invitations/dialogs/CreateInvitationDialog";
import DeleteInvitationDialog from "@/components/Invitations/dialogs/DeleteDialog";
import ViewInvitationDialog from "@/components/Invitations/dialogs/viewInvitationDialog";
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

function InvitationMobileHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e3e6ef] bg-white px-4 py-3 md:hidden">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
        className="flex h-7 w-7 items-center justify-center rounded-sm text-[#111827] transition-colors hover:bg-slate-100"
      >
        <PanelLeft size={13} strokeWidth={2.1} />
      </button>
      <Image
        src={ADMIN_LOGO_CONFIG.expanded.src}
        alt="Digital Logbook"
        width={120}
        height={32}
        className="h-8 w-auto object-contain"
      />
    </header>
  );
}

export default function InvitationsView() {
  // State
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    project: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

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

  const { data: projectsData } = useGetProjects();

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

  // Invitations list with filtering
  const invList: InvitationRow[] = useMemo(
    () => (recentInvitations as InvitationRow[] | undefined) ?? [],
    [recentInvitations],
  );

  const filteredInvitations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query.length === 0
      ? invList
      : invList.filter(
          (inv) =>
            inv.email.toLowerCase().includes(query) ||
            inv.role.toLowerCase().includes(query) ||
            inv.project.toLowerCase().includes(query),
        );
  }, [invList, search]);

  const totalInvitations = filteredInvitations.length;
  const pendingCount = invList.filter((i) => i.status === "Pending").length;
  const acceptedCount = invList.filter((i) => i.status === "Accepted").length;
  const expiredCount = invList.filter((i) => i.status === "Expired").length;
  const totalPages = Math.max(1, Math.ceil(totalInvitations / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedInvitations = filteredInvitations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const startCount =
    filteredInvitations.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endCount = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredInvitations.length,
  );

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    setPage(nextPage);
  };

  return (
    <SidebarProvider>
      <AsideSidebar menu={ADMIN_MENU_ITEMS} logo={ADMIN_LOGO_CONFIG} />
      <SidebarInset className="bg-[#f5f7fb]">
        <InvitationMobileHeader />
        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-6 p-4 md:p-5">
              {/* Header */}
              <PageHeader
                title="Invitations"
                subtitle="Manage organizational access and track member onboarding."
              />

              {/* Tabs */}
              <Tabs defaultValue="invitations" className="flex-col gap-0">
                <TabsList className="mb-6 w-fit rounded-xl bg-slate-100 p-1">
                  <TabsTrigger
                    value="invitations"
                    className="rounded-lg px-5 py-1.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#000053] data-[state=active]:shadow-sm"
                  >
                    Invitations
                  </TabsTrigger>
                  <TabsTrigger
                    value="bulk-upload"
                    className="rounded-lg px-5 py-1.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#000053] data-[state=active]:shadow-sm"
                  >
                    Bulk Upload
                  </TabsTrigger>
                </TabsList>

                {/* Invitations Tab Content */}
                <TabsContent value="invitations" className="space-y-4">
                  {/* Stats Cards */}
                  <InvitationsStats
                    loading={isInvLoading}
                    total={totalInvitations}
                    pending={pendingCount}
                    accepted={acceptedCount}
                    expired={expiredCount}
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
                          placeholder="Search by email, role, or project..."
                        />
                      </div>
                    </div>

                    {/* Create Button */}
                    <div className="ml-auto flex flex-wrap gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setCreateOpen(true)}
                        className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-[#000053] hover:bg-[#000053] text-white text-sm font-medium rounded-lg transition-colors shadow-m shrink-0 w-full sm:w-auto"
                      >
                        <Plus size={15} /> Create Invitation
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-hidden rounded-lg border border-[#e4e7ed]">
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

                    {/* Pagination Footer */}
                    <div className="flex flex-col gap-3 border-t border-[#e4e7ed] px-4 py-3 sm:flex-row sm:items-center sm:justify-between bg-white">
                      <p className="text-sm text-slate-500">
                        Showing {startCount} to {endCount} of {totalInvitations}{" "}
                        invitations
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
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? "bg-[#000053] text-white hover:bg-[#000053]"
                                  : "border border-[#dbe0e8] text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
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
                </TabsContent>

                {/* Bulk Upload Tab Content */}
                <TabsContent value="bulk-upload" className="space-y-4">
                  <BulkUploadTableProvider>
                    <BulkUploadTabs />
                  </BulkUploadTableProvider>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </SidebarInset>

      {/* Dialogs */}
      <CreateInvitationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        formData={formData}
        errors={errors}
        projects={projectsData ?? []}
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
    </SidebarProvider>
  );
}
