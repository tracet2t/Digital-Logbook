"use client";

import React, { useEffect, useState } from 'react';
import AsideSidebar from "@/components/AsideSidebar";
import { useInvitation, useRecentInvitations, useExpireInvitation, useDeleteInvitation } from "@/hooks/admin/useInvitation";
import { z } from 'zod';
import {
  UserPlus,
  Send,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { Project } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  status: 'Pending' | 'Accepted' | 'Expired';
  createdAt: string;
  expiresAt: string;
}

//Invitation View
export default function InvitationsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { mutate: sendInvitation, isPending } = useInvitation();
  const { data: recentInvitations, isLoading: isInvLoading, isError: isInvError } = useRecentInvitations();
  const { mutate: expireInvitation, isPending: isExpiring } = useExpireInvitation();
  const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation();

  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    project: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pagination
  const [page, setPage] = useState(1);

  // Modals
  const [viewInv, setViewInv] = useState<InvitationRow | null>(null);
  const [expireId, setExpireId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
  const result = inviteSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message;
      }
    });
    setErrors(fieldErrors);
    return;
  }

  setErrors({});

  // Invitation Hook
  sendInvitation({
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    role: formData.role as "student" | "mentor" | "superAdmin",
    projectId: formData.project,
  }, {
    onSuccess: () => {
      // reset form after success
      setFormData({
        role: "",
        firstName: "",
        lastName: "",
        email: "",
        project: "",
      });
    }
  });
};

//Fetch projects
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

  const invList: InvitationRow[] = (recentInvitations as InvitationRow[] | undefined) ?? [];
  const totalInvitations = invList.length;
  const totalPages = Math.max(1, Math.ceil(totalInvitations / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedInvitations = invList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
    <div className="flex min-h-screen bg-[#f1f1f9]">
      <AsideSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E5E5E5] px-8 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-[#0A0A0A]">Invitations</h1>
        </div>

        <div className="flex-1 p-8 space-y-8">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">Invitations Management</h2>
          <p className="text-sm text-slate-500">Manage organizational access and track member onboarding status.</p>
        </div>

        {/* Invite User Card */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
              <div className="bg-slate-200/50 p-1.5 rounded-md">
                <UserPlus size={16} />
              </div>
              Invite User
            </div>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
              {/* Row 1 / Col 1 */}
              <div className="w-full">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2.5">Role</label>
                <div className="relative">
                  <select 
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full h-10 px-3 pr-10 border ${errors.role ? 'border-red-500 focus:ring-red-500 text-red-900' : 'border-slate-200 focus:ring-slate-900 text-slate-700'} rounded-md bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer`}
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">superAdmin</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
                </div>
                {errors.role && <p className="text-[10px] text-red-500 mt-1.5 font-medium">{errors.role}</p>}
              </div>

              {/* Row 1 / Col 2 */}
              <div className="w-full">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2.5">First Name</label>
                <input 
                  type="text" 
                  placeholder="Jane" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full h-10 px-3 border ${errors.firstName ? 'border-red-500 focus:ring-red-500 placeholder:text-red-300' : 'border-slate-200 focus:ring-slate-900 placeholder:text-slate-400'} rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.firstName && <p className="text-[10px] text-red-500 mt-1.5 font-medium">{errors.firstName}</p>}
              </div>

              {/* Row 1 / Col 3 */}
              <div className="w-full">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2.5">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full h-10 px-3 border ${errors.lastName ? 'border-red-500 focus:ring-red-500 placeholder:text-red-300' : 'border-slate-200 focus:ring-slate-900 placeholder:text-slate-400'} rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.lastName && <p className="text-[10px] text-red-500 mt-1.5 font-medium">{errors.lastName}</p>}
              </div>
              
              {/* Row 2 / Col 1 */}
              <div className="w-full">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2.5">Email Address</label>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full h-10 px-3 border ${errors.email ? 'border-red-500 focus:ring-red-500 placeholder:text-red-300' : 'border-slate-200 focus:ring-slate-900 placeholder:text-slate-400'} rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1.5 font-medium">{errors.email}</p>}
              </div>

              {/* Row 2 / Col 2 */}
              <div className="w-full">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2.5">Project</label>
                <div className="relative">
                  <select 
                    value={formData.project}
                    onChange={(e) => handleInputChange('project', e.target.value)}
                    className={`w-full h-10 px-3 pr-10 border ${errors.project ? 'border-red-500 focus:ring-red-500 text-red-900' : 'border-slate-200 focus:ring-slate-900 text-slate-700'} rounded-md bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer`}
                  >
                    <option value="" disabled>Select Project</option>
                    {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
                </div>
                {errors.project && <p className="text-[10px] text-red-500 mt-1.5 font-medium">{errors.project}</p>}
              </div>

              {/* Row 2 / Col 3 - Button */}
              <div className="w-full flex flex-col justify-start">
                <button 
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="h-10 w-full bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm mt-[24px]"
                >
                  <Send size={16} />
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invitations Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Invitations</h3>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/95">
                  <tr>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {isInvLoading && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Loading...</td></tr>
                  )}
                  {isInvError && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-red-500">Failed to load invitations</td></tr>
                  )}
                  {!isInvLoading && !isInvError && pagedInvitations.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No invitations found.</td></tr>
                  )}
                  {pagedInvitations.map((inv: InvitationRow) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-900">{inv.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          inv.role === 'mentor' || inv.role === 'superAdmin' ? "bg-[#18181B] text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {inv.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{inv.project}</td>
                      <td className="px-5 py-4"><StatusBadge status={inv.status} /></td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                              <MoreVertical size={15} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onSelect={() => setViewInv(inv)}>
                              View Details
                            </DropdownMenuItem>
                            {inv.status !== 'Expired' && (
                              <DropdownMenuItem onSelect={() => setExpireId(inv.id)}>
                                Mark as Expired
                              </DropdownMenuItem>
                            )}
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
                  {totalInvitations === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}to{" "}
                <span className="font-medium text-slate-900">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalInvitations)}
                </span>{" "}of{" "}
                <span className="font-medium text-slate-900">{totalInvitations}</span> results
              </p>
              <Pagination className="w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={currentPage === p} onClick={() => setPage(p)}>{p}</PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>

    {/* ── View Details Dialog ──────────────────────────────────────────── */}
    <Dialog open={!!viewInv} onOpenChange={open => !open && setViewInv(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invitation Details</DialogTitle>
        </DialogHeader>
        {viewInv != null && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">Email</p>
                <p className="text-slate-900 font-medium break-all">{viewInv!.email}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">Role</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                  viewInv!.role === 'mentor' || viewInv!.role === 'superAdmin' ? "bg-[#18181B] text-white" : "bg-slate-100 text-slate-600"
                }`}>{viewInv!.role}</span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">Project</p>
                <p className="text-slate-700">{viewInv!.project}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">Status</p>
                <StatusBadge status={viewInv!.status} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">Sent On</p>
                <p className="text-slate-700">{new Date(viewInv!.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">Expires At</p>
                <p className="text-slate-700">{new Date(viewInv!.expiresAt) <= new Date(1000) ? 'Manually expired' : new Date(viewInv!.expiresAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* ── Expire Confirmation Dialog ───────────────────────────────────── */}
    <AlertDialog open={!!expireId} onOpenChange={open => !open && setExpireId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark Invitation as Expired</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately invalidate the invitation link. The invited user will no longer be able to use it to complete registration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExpiring}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isExpiring}
            onClick={() => expireId && expireInvitation({ id: expireId }, { onSettled: () => setExpireId(null) })}
          >
            {isExpiring ? 'Expiring…' : 'Mark as Expired'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
    <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the invitation and remove the associated user account along with all their data — including project allocations, activities, and feedback. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
            onClick={() => deleteId && deleteInvitation({ id: deleteId }, { onSettled: () => setDeleteId(null) })}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

/* --- Subcomponents --- */

function StatusBadge({ status }: { status: 'Pending' | 'Accepted' | 'Expired' }) {
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

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`}></span>
      {status}
    </span>
  );
}