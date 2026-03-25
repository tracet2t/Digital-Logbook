"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InvitationRow } from "../InvitationsTable";

interface ChangeStatusDialogProps {
  invitation: InvitationRow | null;
  selectedStatus: "Pending" | "Accepted" | "Expired";
  onChangeStatus: (status: "Pending" | "Accepted" | "Expired") => void;
  onSave: () => void;
  isPending: boolean;
  onClose: () => void;
}

export default function ChangeStatusDialog({
  invitation,
  selectedStatus,
  onChangeStatus,
  onSave,
  isPending,
  onClose,
}: ChangeStatusDialogProps) {
  if (!invitation) return null;

  const options = [
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
  ] as const;

  return (
    <Dialog open={!!invitation} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-slate-900">
              Change Invitation Status
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-0.5">
              Update the status for{" "}
              <span className="font-medium text-slate-700">
                {invitation.email}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-5 py-4 space-y-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeStatus(opt.value)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg border text-left transition-all ${selectedStatus === opt.value ? `${opt.ring} border-2` : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
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

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isPending}
              className="h-8 px-3 text-sm"
            >
              Cancel
            </Button>
          </DialogClose>
          <button
            disabled={isPending || selectedStatus === invitation.status}
            onClick={onSave}
            className="inline-flex items-center h-8 px-4 bg-[#000053] hover:bg-[#000053] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
