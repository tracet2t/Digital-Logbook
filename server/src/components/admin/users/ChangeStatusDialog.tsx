import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserRecord, UserStatus } from "./types";

interface ChangeStatusDialogProps {
  user: UserRecord | null;
  pendingStatus: UserStatus;
  isMutating: boolean;
  onPendingStatusChange: (status: UserStatus) => void;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function ChangeStatusDialog({
  user,
  pendingStatus,
  isMutating,
  onPendingStatusChange,
  onOpenChange,
  onSave,
}: ChangeStatusDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>
          <DialogDescription>
            Update the account status for{" "}
            <span className="font-semibold text-slate-900">{user?.name}</span>.
            Deactivating a user will prevent them from logging in.
          </DialogDescription>
        </DialogHeader>

        {/* Show current status */}
        <div className="px-1 py-2 bg-slate-50 rounded-md border border-slate-200">
          <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">
            Current Status
          </p>
          <p className="text-sm font-semibold text-slate-900">{user?.status}</p>
        </div>

        {/* Select new status */}
        <div className="px-1 py-2">
          <p className="mb-1.5 text-[11px] font-bold uppercase text-slate-500">
            New Status
          </p>
          <Select
            value={pendingStatus}
            onValueChange={(v) => onPendingStatusChange(v as UserStatus)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive (Deactivated)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row-reverse gap-2 mt-6">
          <DialogClose asChild>
            <button className="btn btn-outline" disabled={isMutating}>
              Cancel
            </button>
          </DialogClose>
          <button
            disabled={isMutating || pendingStatus === user?.status}
            onClick={onSave}
            className="bg-[#000053] text-white hover:bg-[#000053] border-none focus:ring-0 focus:outline-none shadow-none px-4 py-2 rounded"
            style={{
              backgroundColor: "#000053",
              color: "#fff",
              border: "none",
            }}
          >
            {isMutating ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
