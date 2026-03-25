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
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Status</AlertDialogTitle>
          <AlertDialogDescription>
            Select the new status for{" "}
            <span className="font-semibold text-slate-900">{user?.name}</span>.
            Deactivating a user will prevent them from logging in.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isMutating || pendingStatus === user?.status}
            onClick={onSave}
            className="bg-[#000053] text-white hover:bg-[#000053] border-none focus:ring-0 focus:outline-none shadow-none"
            style={{
              backgroundColor: "#000053",
              color: "#fff",
              border: "none",
            }}
          >
            {isMutating ? "Saving…" : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
