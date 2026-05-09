"use client";

import { AlertTriangle, ArrowRight, MoveDown } from "lucide-react";

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

export type AssignmentActionType =
  | "assign"       // bench → project
  | "reassign"     // project → project
  | "unassign";    // project → bench

export interface ConfirmAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  actionType: AssignmentActionType;
  userName: string;
  targetName: string; // project name OR "Bench"
  sourceName?: string; // only for reassign
  /** Number of users being moved (multi-select) */
  count?: number;
}

const ACTION_META: Record<
  AssignmentActionType,
  { title: string; confirmLabel: string; isBench: boolean }
> = {
  assign: {
    title: "Confirm Assignment",
    confirmLabel: "Assign",
    isBench: false,
  },
  reassign: {
    title: "Confirm Reassignment",
    confirmLabel: "Reassign",
    isBench: false,
  },
  unassign: {
    title: "Move to Bench",
    confirmLabel: "Move to Bench",
    isBench: true,
  },
};

/**
 * ConfirmAssignmentDialog
 *
 * Shown whenever a user is dragged between columns (bench→project,
 * project→project, or project→bench) on the Kanban board.
 *
 * Usage:
 *   <ConfirmAssignmentDialog
 *     open={!!pendingAction}
 *     onOpenChange={(open) => !open && cancelPendingAction()}
 *     onConfirm={confirmPendingAction}
 *     onCancel={cancelPendingAction}
 *     actionType="assign"
 *     userName="Alice Smith"
 *     targetName="Project Alpha"
 *   />
 */
export function ConfirmAssignmentDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  actionType,
  userName,
  targetName,
  sourceName,
  count = 1,
}: ConfirmAssignmentDialogProps) {
  const meta = ACTION_META[actionType];
  const displayName = count > 1 ? `${count} users` : userName;

  const description =
    actionType === "reassign" && sourceName
      ? `"${displayName}" will be moved from ${sourceName} to ${targetName}.`
      : actionType === "unassign"
        ? `"${displayName}" will be removed from ${sourceName ?? "their current project"} and placed back on the Bench.`
        : `"${displayName}" will be assigned to ${targetName}.`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mb-3 flex items-center gap-3">
            {/* Icon badge */}
            <span
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                meta.isBench
                  ? "bg-amber-50 text-amber-500"
                  : "bg-[#000053]/10 text-[#000053]",
              ].join(" ")}
            >
              {meta.isBench ? (
                <MoveDown className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </span>
            <AlertDialogTitle className="text-base font-bold text-[#000053]">
              {meta.title}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">{description}</p>

              {/* Extra warning for bench moves */}
              {meta.isBench && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-xs font-medium text-amber-700">
                    {count > 1
                      ? "These users will be marked as unassigned and may appear inactive."
                      : "This user will be marked as unassigned and may appear inactive."}
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-400">
                This action can be undone by reassigning from the Bench.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className="rounded-xl border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={[
              "rounded-xl border-none text-sm font-semibold text-white shadow-none focus:outline-none focus:ring-0",
              meta.isBench
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-[#000053] hover:bg-[#000053]/90",
            ].join(" ")}
            style={{
              backgroundColor: meta.isBench ? undefined : "#000053",
            }}
          >
            {meta.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
