"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InvitationRow } from "../InvitationsTable";
import StatusBadge from "../StatusBadge";

interface ViewInvitationDialogProps {
  invitation: InvitationRow | null;
  onClose: () => void;
}

export default function ViewInvitationDialog({
  invitation,
  onClose,
}: ViewInvitationDialogProps) {
  if (!invitation) return null;

  return (
    <Dialog open={!!invitation} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invitation Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                Email
              </p>
              <p className="text-slate-900 font-medium break-all">
                {invitation.email}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                Role
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${invitation.role === "mentor" || invitation.role === "superAdmin" ? "bg-[#18181B] text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {invitation.role}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                Project
              </p>
              <p className="text-slate-700">{invitation.project}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                Status
              </p>
              <StatusBadge status={invitation.status} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                Sent On
              </p>
              <p className="text-slate-700">
                {new Date(invitation.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                Expires At
              </p>
              <p className="text-slate-700">
                {new Date(invitation.expiresAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-[#4F46E5] text-white hover:bg-[#4338CA] border-none"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
