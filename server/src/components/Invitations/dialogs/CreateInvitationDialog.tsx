"use client";

import { ChevronDown, Send, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Type matching useGetProjects return type
interface Project {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  studentCount?: number;
  mentorCount?: number;
}

interface CreateInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  errors: Record<string, string>;
  projects: Project[];
  isPending: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export default function CreateInvitationDialog({
  open,
  onOpenChange,
  formData,
  errors,
  projects,
  isPending,
  onChange,
  onSubmit,
}: CreateInvitationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          {/* Access Details */}
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
                    onChange={(e) => onChange("role", e.target.value)}
                    className={`w-full h-10 px-3 pr-10 border ${errors.role ? "border-red-400 focus:ring-red-400 bg-red-50/40" : "border-slate-300 focus:ring-slate-900 bg-white"} rounded-lg text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer transition-colors`}
                  >
                    <option value="" disabled>
                      Select a role…
                    </option>
                    <option value="student">Mentee</option>
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
                    Determines the user`s access level
                  </p>
                )}
              </div>

              {/* Project */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Project{" "}
                  <span className="text-slate-400 font-normal text-xs">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={formData.project}
                    onChange={(e) => onChange("project", e.target.value)}
                    className="w-full h-10 px-3 pr-10 border border-slate-300 focus:ring-slate-900 bg-white rounded-lg text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer transition-colors"
                  >
                    <option value="">No project assigned</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-3 text-slate-400 pointer-events-none"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Can be assigned later after registration
                </p>
              </div>
            </div>
          </div>

          {/* Recipient Details */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Recipient Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane"
                  value={formData.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  className={`w-full h-10 px-3 border ${errors.firstName ? "border-red-400 focus:ring-red-400 bg-red-50/40 placeholder:text-red-300" : "border-slate-300 focus:ring-slate-900 bg-white placeholder:text-slate-400"} rounded-lg text-sm text-slate-800`}
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
                  onChange={(e) => onChange("lastName", e.target.value)}
                  className={`w-full h-10 px-3 border ${errors.lastName ? "border-red-400 focus:ring-red-400 bg-red-50/40 placeholder:text-red-300" : "border-slate-300 focus:ring-slate-900 bg-white placeholder:text-slate-400"} rounded-lg text-sm text-slate-800`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5 mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. jane.doe@company.com"
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
                className={`w-full h-10 px-3 border ${errors.email ? "border-red-400 focus:ring-red-400 bg-red-50/40 placeholder:text-red-300" : "border-slate-300 focus:ring-slate-900 bg-white placeholder:text-slate-400"} rounded-lg text-sm text-slate-800`}
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
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
            onClick={onSubmit}
            disabled={isPending}
            className="inline-flex items-center gap-2 h-9 px-5 bg-[#000053] hover:bg-[#000053] text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={14} />
            {isPending ? "Sending…" : "Send Invitation"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
