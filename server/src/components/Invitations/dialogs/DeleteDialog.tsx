"use client";

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

interface DeleteInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function DeleteInvitationDialog({
  open,
  onOpenChange,
  onDelete,
  isDeleting,
}: DeleteInvitationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the invitation and remove the
            associated user account along with all their data — including
            project allocations, activities, and feedback. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#000053] text-white hover:bg-[#000053] border-none focus:ring-0 focus:outline-none shadow-none"
            style={{
              backgroundColor: "#000053",
              color: "#fff",
              border: "none",
            }}
            disabled={isDeleting}
            onClick={onDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
