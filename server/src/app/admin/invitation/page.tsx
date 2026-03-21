"use client";

import React, { useState } from "react";

import {
  CheckCircle2,
  ChevronDown,
  Clock,
  MoreVertical,
  Plus,
  Send,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { z } from "zod";

import {
  useChangeInvitationStatus,
  useDeleteInvitation,
  useInvitation,
  useRecentInvitations,
} from "@/hooks/admin/useInvitation";
import { useGetProjects } from "@/hooks/projects";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AsideSidebar from "@/components/AsideSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

const ITEMS_PER_PAGE = 10;

// Define our Zod schema for the invite form
const inviteSchema = z.object({
  role: z.string().min(1, { message: "Role is required" }),
  firstName: z.string().min(2, { message: "Must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  project: z.string().min(1, { message: "Project is required" }),
});

interface InvitationRow {
  id: string;
  email: string;
  role: string;
  project: string;
  status: "Pending" | "Accepted" | "Expired";
  createdAt: string;
  expiresAt: string;
}

//Invitation View
export default function InvitationsView() {
  const { mutate: sendInvitation, isPending } = useInvitation();
  const { data: projectsData } = useGetProjects();
  const {
    data: recentInvitations,
    isLoading: isInvLoading,
    isError: isInvError,
  } = useRecentInvitations();
  const { mutate: changeStatus, isPending: isChangingStatus } =
    useChangeInvitationStatus();
  const { mutate: deleteInvitation, isPending: isDeleting } =
    useDeleteInvitation();

  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    project: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pagination
  const [page, setPage] = useState(1);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [viewInv, setViewInv] = useState<InvitationRow | null>(null);
  const [changeStatusInv, setChangeStatusInv] = useState<InvitationRow | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    "Accepted" | "Pending" | "Expired"
  >("Pending");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    const result = inviteSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // Invitation Hook
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
          // reset form after success
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
          {/* Page Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="flex items-center justify-between gap-4">
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
                <Plus size={15} />
                Create Invitation
              </button>
            </div>
          </div>

          <div className="flex-1 px-8 py-6 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Total
                  </p>
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Users size={15} className="text-slate-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {isInvLoading ? "—" : totalInvitations}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                    Pending
                  </p>
                  <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Clock size={15} className="text-amber-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {isInvLoading ? "—" : pendingCount}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                    Accepted
                  </p>
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {isInvLoading ? "—" : acceptedCount}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-rose-600 uppercase tracking-wide">
                    Expired
                  </p>
                  <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <XCircle size={15} className="text-rose-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {isInvLoading ? "—" : expiredCount}
                </p>
              </div>
            </div>

            {/* Invitations Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {/* Table Toolbar */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    All Invitations
                  </h3>
                  {!isInvLoading && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {totalInvitations} total record
                      {totalInvitations !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/95">
                    <tr>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {isInvLoading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-8 text-center text-slate-400"
                        >
                          Loading...
                        </td>
                      </tr>
                    )}
                    {isInvError && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-8 text-center text-red-500"
                        >
                          Failed to load invitations
                        </td>
                      </tr>
                    )}
                    {!isInvLoading &&
                      !isInvError &&
                      pagedInvitations.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-8 text-center text-slate-400"
                          >
                            No invitations found.
                          </td>
                        </tr>
                      )}
                    {pagedInvitations.map((inv: InvitationRow) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {inv.email}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                              inv.role === "mentor" || inv.role === "superAdmin"
                                ? "bg-[#18181B] text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {inv.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-medium">
                          {inv.project || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                <MoreVertical size={15} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onSelect={() => setViewInv(inv)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => {
                                  setChangeStatusInv(inv);
                                  setSelectedStatus(inv.status);
                                }}
                              >
                                Change Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onSelect={() => setDeleteId(inv.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-900">
                    {totalInvitations === 0
                      ? 0
                      : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-900">
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalInvitations)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-900">
                    {totalInvitations}
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
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Create Invitation Dialog ─────────────────────────────────────── */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) {
            setErrors({});
          }
        }}
      >
        <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-900">
                <div className="bg-slate-900 text-white p-1.5 rounded-md">
                  <UserPlus size={15} />
                </div>
                Create Invitation
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Send an invitation email to onboard a new member to your
                organization.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Section: Access Details */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Access Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Role */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className={`w-full h-10 px-3 pr-10 border ${errors.role ? "border-red-400 focus:ring-red-400 bg-red-50/40" : "border-slate-300 focus:ring-slate-900 bg-white"} rounded-lg text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer transition-colors`}
                    >
                      <option value="" disabled>
                        Select a role…
                      </option>
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Super Admin</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-3 text-slate-400 pointer-events-none"
                    />
                  </div>
                  {errors.role ? (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.role}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Determines the user's access level
                    </p>
                  )}
                </div>

                {/* Project */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.project}
                      onChange={(e) =>
                        handleInputChange("project", e.target.value)
                      }
                      className={`w-full h-10 px-3 pr-10 border ${errors.project ? "border-red-400 focus:ring-red-400 bg-red-50/40" : "border-slate-300 focus:ring-slate-900 bg-white"} rounded-lg text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer transition-colors`}
                    >
                      <option value="" disabled>
                        Select a project…
                      </option>
                      {projectsData?.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-3 text-slate-400 pointer-events-none"
                    />
                  </div>
                  {errors.project ? (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.project}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Assign to an existing project
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Section: Recipient Details */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Recipient Details
              </p>
              <div className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`w-full h-10 px-3 border ${errors.firstName ? "border-red-400 focus:ring-red-400 bg-red-50/40 placeholder:text-red-300" : "border-slate-300 focus:ring-slate-900 bg-white placeholder:text-slate-400"} rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`w-full h-10 px-3 border ${errors.lastName ? "border-red-400 focus:ring-red-400 bg-red-50/40 placeholder:text-red-300" : "border-slate-300 focus:ring-slate-900 bg-white placeholder:text-slate-400"} rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. jane.doe@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full h-10 px-3 border ${errors.email ? "border-red-400 focus:ring-red-400 bg-red-50/40 placeholder:text-red-300" : "border-slate-300 focus:ring-slate-900 bg-white placeholder:text-slate-400"} rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  />
                  {errors.email ? (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.email}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      The invitation link will be sent to this address
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Fields marked <span className="text-red-500 font-medium">*</span>{" "}
              are required
            </p>
            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={isPending}
                  className="h-9 px-4 text-sm"
                >
                  Cancel
                </Button>
              </DialogClose>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="inline-flex items-center gap-2 h-9 px-5 bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                {isPending ? "Sending…" : "Send Invitation"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Details Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={!!viewInv}
        onOpenChange={(open) => !open && setViewInv(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invitation Details</DialogTitle>
          </DialogHeader>
          {viewInv != null && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Email
                  </p>
                  <p className="text-slate-900 font-medium break-all">
                    {viewInv!.email}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Role
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      viewInv!.role === "mentor" ||
                      viewInv!.role === "superAdmin"
                        ? "bg-[#18181B] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {viewInv!.role}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Project
                  </p>
                  <p className="text-slate-700 font-medium">
                    {viewInv!.project || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Status
                  </p>
                  <StatusBadge status={viewInv!.status} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Sent On
                  </p>
                  <p className="text-slate-700">
                    {new Date(viewInv!.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Expires At
                  </p>
                  <p className="text-slate-700">
                    {new Date(viewInv!.expiresAt) <= new Date(1000)
                      ? "Manually expired"
                      : new Date(viewInv!.expiresAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </p>
                </div>
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

      {/* ── Change Status Dialog ─────────────────────────────────────────── */}
      <Dialog
        open={!!changeStatusInv}
        onOpenChange={(open) => !open && setChangeStatusInv(null)}
      >
        <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold text-slate-900">
                Change Invitation Status
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Update the status for{" "}
                <span className="font-medium text-slate-700">
                  {changeStatusInv?.email}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Status Options */}
          <div className="px-5 py-4 space-y-2">
            {(
              [
                {
                  value: "Accepted",
                  label: "Active",
                  desc: "Invitation is accepted and account is active",
                  color: "text-emerald-600",
                  dot: "bg-emerald-500",
                  ring: "border-emerald-500 bg-emerald-50",
                },
                {
                  value: "Pending",
                  label: "Pending",
                  desc: "Awaiting the invitee to complete registration",
                  color: "text-amber-600",
                  dot: "bg-amber-500",
                  ring: "border-amber-500 bg-amber-50",
                },
                {
                  value: "Expired",
                  label: "Expired",
                  desc: "Invalidates the invitation link immediately",
                  color: "text-rose-600",
                  dot: "bg-rose-500",
                  ring: "border-rose-500 bg-rose-50",
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedStatus(opt.value)}
                className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                  selectedStatus === opt.value
                    ? `${opt.ring} border-2`
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`mt-1 h-3.5 w-3.5 rounded-full shrink-0 ${selectedStatus === opt.value ? opt.dot : "bg-slate-300"}`}
                />
                <div>
                  <p
                    className={`text-sm font-semibold ${selectedStatus === opt.value ? opt.color : "text-slate-700"}`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isChangingStatus}
                className="h-8 px-3 text-sm"
              >
                Cancel
              </Button>
            </DialogClose>
            <button
              disabled={
                isChangingStatus || selectedStatus === changeStatusInv?.status
              }
              onClick={() =>
                changeStatusInv &&
                changeStatus(
                  { id: changeStatusInv.id, status: selectedStatus },
                  { onSettled: () => setChangeStatusInv(null) },
                )
              }
              className="inline-flex items-center h-8 px-4 bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingStatus ? "Saving…" : "Save"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invitation and remove the
              associated user account along with all their data — including
              project allocations, activities, and feedback. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
              onClick={() =>
                deleteId &&
                deleteInvitation(
                  { id: deleteId },
                  { onSettled: () => setDeleteId(null) },
                )
              }
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* --- Subcomponents --- */

function StatusBadge({
  status,
}: {
  status: "Pending" | "Accepted" | "Expired";
}) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-200/60",
    Accepted: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Expired: "bg-rose-50 text-rose-600 border-rose-200/60",
  };

  const dotColors = {
    Pending: "bg-amber-500",
    Accepted: "bg-emerald-500",
    Expired: "bg-rose-500",
  };

  const labels = {
    Pending: "Pending",
    Accepted: "Active",
    Expired: "Expired",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`}></span>
      {labels[status]}
    </span>
  );
}
