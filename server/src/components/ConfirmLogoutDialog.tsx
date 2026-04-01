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

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  /** Dialog title. Default: "Confirm Delete" */
  title?: string;
  /** Description / warning text shown under the title */
  description?: string;
  /** Label for the destructive button. Default: "Delete" */
  confirmLabel?: string;
}

/**
 * Generic delete-confirmation dialog (AlertDialog) reusable across all
 * admin pages (users, projects, invitations, etc.).
 *
 * Usage:
 *   <ConfirmDeleteDialog
 *     open={!!deleteId}
 *     onOpenChange={(open) => !open && setDeleteId(null)}
 *     onConfirm={handleDelete}
 *     isPending={isDeleting}
 *     title="Delete User"
 *     description="This will permanently delete the user account and all associated data. This action cannot be undone."
 *   />
 */
export default function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  title = "Confirm Delete",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-600 border-none focus:ring-0 focus:outline-none shadow-none"
            style={{
              backgroundColor: "#red-600",
              color: "#fff",
              border: "none",
            }}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Deleting…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
