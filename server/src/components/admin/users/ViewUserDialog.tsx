import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminStatusBadge, RoleBadge } from "@/components/admin";

import { UserRecord } from "./types";
import { getInitials } from "./utils";

interface ViewUserDialogProps {
  user: UserRecord | null;
  onOpenChange: (open: boolean) => void;
}

export default function ViewUserDialog({
  user,
  onOpenChange,
}: ViewUserDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {user != null && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-slate-200">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-slate-100 text-base font-semibold text-slate-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base font-bold text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">
                  Role
                </p>
                <RoleBadge role={user.role} />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">
                  Status
                </p>
                <AdminStatusBadge status={user.status} />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">
                  Created Date
                </p>
                <p className="text-slate-700">{user.createdAt}</p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">
                  User ID
                </p>
                <p className="truncate text-xs text-slate-500">{user.id}</p>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-[#000053] text-white hover:bg-[#000053] border-none"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
