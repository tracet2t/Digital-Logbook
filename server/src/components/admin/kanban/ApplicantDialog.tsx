"use client";

import { OnboardingApplication } from "@/_hooks/admin/useAdminOnboarding";
import {
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Mail,
  University,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminStatusBadge } from "@/components/admin";

import { formatDate, getInitials } from "./utils";

interface ApplicantDialogProps {
  application: OnboardingApplication | null;
  onClose: () => void;
}

export function ApplicantDialog({
  application,
  onClose,
}: ApplicantDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={!!application} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-[#d9dde5] bg-white p-0">
        <div className="h-20 bg-[#000053]" />
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-start justify-between">
            <Avatar className="h-16 w-16 border-[3px] border-white shadow">
              <AvatarFallback className="bg-[#000053] text-base font-black text-white">
                {getInitials(application.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-10">
              <AdminStatusBadge status={application.status} />
            </div>
          </div>

          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-black text-[#000053]">
              {application.fullName}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Onboarding submission details.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
              <Mail className="h-3.5 w-3.5 text-indigo-400" />
              <span className="break-all text-[11px] font-bold text-slate-600">
                {application.email}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
              <CalendarDays className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[11px] font-bold text-slate-600">
                Submitted {formatDate(application.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
              <University className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[11px] font-bold text-slate-600">
                {application.university}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[11px] font-bold text-slate-600">
                {application.degreeProgram}
              </span>
            </div>
            <div className="rounded-xl border border-[#e4e7ed] p-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CV
              </p>
              <a
                href={application.cvLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#000053] hover:underline"
              >
                Open submitted CV <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
